import { NextRequest } from "next/server";
import crypto from "crypto";
import { Logger } from "@/lib/logger";
import { Response } from "@/lib/api-response";
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "@/security/rateLimiter";

const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;
const EVENT_EXPIRY = 86400; // 24 hours

export async function POST(request: NextRequest) {
  try {
    // 🚦 Basic Rate Limiting for webhooks (prevent DoS)
    await checkRateLimit(request, { config: "PUBLIC", action: "webhook" });

    const body = await request.text(); // Raw body for signature validation
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      Logger.warn("Webhook rejected: Missing signature");
      return Response.error("Unauthorized", 401);
    }

    // 1. 🛡️ Signature Validation
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      Logger.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return Response.internalError();
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      Logger.warn("Webhook rejected: Invalid signature");
      return Response.error("Invalid signature", 400);
    }

    const event = JSON.parse(body);
    const eventId = event.id;

    // 2. 🔄 Replay Protection (Idempotency)
    if (redis && eventId) {
      const isProcessed = await redis.set(`webhook:processed:${eventId}`, "1", { 
        nx: true, 
        ex: EVENT_EXPIRY 
      });

      if (!isProcessed) {
        Logger.info(`Webhook event ${eventId} ignored (already processed)`);
        return Response.success({ status: "already_processed" });
      }
    }

    // 3. 🎯 Event Handling logic
    Logger.info(`Processing Razorpay webhook: ${event.event}`, { eventId });

    switch (event.event) {
      case "order.paid":
        // Handle successful payment
        break;
      case "payment.failed":
        // Handle failed payment
        break;
      default:
        Logger.debug(`Unhandled webhook event: ${event.event}`);
    }

    return Response.success({ status: "ok" });
  } catch (err: any) {
    Logger.error("Webhook processing failed", err);
    return Response.handle(err, "/api/webhooks/razorpay");
  }
}
