import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { Logger } from "@/lib/logger";
import { Response } from "@/lib/api-response";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount too high"),
  currency: z.string().default("INR"),
});

const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();

    // 🛡️ Idempotency check
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (idempotencyKey && redis) {
      const cached = await redis.get(`idempotency:order:${user.id}:${idempotencyKey}`);
      if (cached) {
        Logger.info("Returning cached order for idempotency key", { userId: user.id, idempotencyKey });
        return Response.success(cached);
      }
    }

    const body = await request.json();
    const result = createOrderSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { amount, currency } = result.data;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      Logger.error("Razorpay credentials not configured", undefined, { module: "payment", action: "create-order" });
      return Response.internalError("Payment system is currently unavailable");
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${user.id.substring(0, 8)}_${Date.now()}`,
    });

    const responseData = { orderId: order.id, amount: order.amount };

    // Cache for 24 hours if idempotency key was provided
    if (idempotencyKey && redis) {
      await redis.set(`idempotency:order:${user.id}:${idempotencyKey}`, responseData, { ex: 86400 });
    }

    return Response.success(responseData);
  } catch (error: any) {
    Logger.apiError("/api/payment/create-order", error);
    return Response.handle(error, "/api/payment/create-order");
  }
}