import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { Logger } from "@/lib/logger";
import { Response } from "@/lib/api-response";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { OrderService } from "@/services/order-service";

const createOrderSchema = z.object({
  amount: z.number().positive().max(1000000).optional(),
  currency: z.string().default("INR"),
  customOrderId: z.string().uuid().optional(),
});

const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);
    if (!result.success) throw result.error;

    let { amount, currency, customOrderId } = result.data;
    const orderService = new OrderService(true);

    // If customOrderId is provided, validate status and get amount
    if (customOrderId) {
      const customOrder = await orderService.getCustomOrder(customOrderId);
      if (!customOrder) return Response.notFound("Custom order not found");
      if (customOrder.user_id !== user.id) return Response.forbidden("Unauthorized");
      if (customOrder.status !== "quoted") return Response.badRequest("Order is not in QUOTED status");
      if (!customOrder.quoted_price) return Response.badRequest("Order has no quoted price");
      
      amount = Number(customOrder.quoted_price);
    }

    if (!amount) return Response.badRequest("Amount is required");

    // 🛡️ Idempotency check
    const idempotencyKey = request.headers.get("Idempotency-Key") || (customOrderId ? `custom_${customOrderId}` : null);
    if (idempotencyKey && redis) {
      const cached = await redis.get(`idempotency:order:${user.id}:${idempotencyKey}`);
      if (cached) return Response.success(cached);
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "your_razorpay_key_id") {
      return Response.internalError("Payment system is in Test Mode.");
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${customOrderId || user.id.substring(0, 8)}_${Date.now()}`,
    });

    // If custom order, link the razorpay_order_id immediately
    if (customOrderId) {
      await orderService.updateCustomOrder(customOrderId, { 
        razorpay_order_id: order.id 
      });
    }

    const responseData = { orderId: order.id, amount: order.amount };

    if (idempotencyKey && redis) {
      await redis.set(`idempotency:order:${user.id}:${idempotencyKey}`, responseData, { ex: 86400 });
    }

  } catch (error: any) {
    Logger.apiError("/api/payment/create-order", error);
    return Response.handle(error, "/api/payment/create-order");
  }
}