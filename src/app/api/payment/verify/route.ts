import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields", verified: false }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      Logger.error("RAZORPAY_KEY_SECRET not configured", undefined, { module: "payment", action: "verify" });
      return NextResponse.json({ error: "Payment configuration error", verified: false }, { status: 500 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign)
      .digest("hex");

    const verified = expectedSign === razorpay_signature;

    return NextResponse.json({ verified });
  } catch (error: any) {
    Logger.apiError("/api/payment/verify", error);
    return NextResponse.json(
      { error: "Verification failed", verified: false },
      { status: 500 }
    );
  }
}