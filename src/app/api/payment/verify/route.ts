import { NextRequest } from "next/server";
import crypto from "crypto";
import { Logger } from "@/lib/logger";
import { Response } from "@/lib/api-response";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { z } from "zod";

import { OrderService } from "@/services/order-service";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  customOrderId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const result = verifySchema.safeParse(body);
    if (!result.success) throw result.error;

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customOrderId } = result.data;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    let verified = false;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret || secret === "your_razorpay_key_secret") {
      // Allow mock verification in test mode
      verified = razorpay_order_id.startsWith("test_order_") && razorpay_signature === "mock_signature";
    } else {
      const expectedSign = crypto.createHmac("sha256", secret).update(sign).digest("hex");
      verified = expectedSign === razorpay_signature;
    }

    if (verified && customOrderId) {
      const orderService = new OrderService(true);
      await orderService.updateCustomStatus(customOrderId, "paid", undefined, undefined, {
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString()
      });
      Logger.info("Custom order payment verified and updated", { customOrderId, userId: user.id });
    }

    return Response.success({ verified });
  } catch (error: any) {
    Logger.apiError("/api/payment/verify", error);
    return Response.handle(error, "/api/payment/verify");
  }
}