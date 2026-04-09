import { NextRequest } from "next/server";
import crypto from "crypto";
import { Logger } from "@/lib/logger";
import { Response } from "@/lib/api-response";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { z } from "zod";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request);
    await requireUser();

    const body = await request.json();
    const result = verifySchema.safeParse(body);
    if (!result.success) throw result.error;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      Logger.error("RAZORPAY_KEY_SECRET not configured", undefined, { module: "payment", action: "verify" });
      return Response.internalError("Payment verification is currently unavailable");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign)
      .digest("hex");

    const verified = expectedSign === razorpay_signature;

    if (!verified) {
      Logger.warn("Payment verification failed: invalid signature", { 
        module: "payment", 
        action: "verify",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
    }

    return Response.success({ verified });
  } catch (error: any) {
    Logger.apiError("/api/payment/verify", error);
    return Response.handle(error, "/api/payment/verify");
  }
}