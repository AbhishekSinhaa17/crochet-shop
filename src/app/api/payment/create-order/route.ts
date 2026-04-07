import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      Logger.error("Razorpay credentials not configured", undefined, { module: "payment", action: "create-order" });
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { amount } = await request.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount });
  } catch (error: any) {
    Logger.apiError("/api/payment/create-order", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}