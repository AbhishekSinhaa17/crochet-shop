"use server";

import { OrderService } from "@/services/order-service";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * 🛒 Place Order Action
 * Centralized server action for standard order placement.
 * Ensures DB atomicity and triggers background email queue.
 */
export async function placeOrderAction(data: {
  items: any[];
  shipping_address: any;
  payment_id: string;
  order_id: string;
  signature: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Authentication required to place an order");
    }

    const orderService = new OrderService(true);
    
    // Preparation for OrderService.placeOrder
    const orderInput = {
      items: data.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      shipping_address: data.shipping_address,
      payment_method: 'razorpay'
    };

    // 1. Create Order via Service
    const order = await orderService.placeOrder(user.id, orderInput);

    // 2. Update with Razorpay details (Post-Creation)
    // Note: In real prod, we'd do this inside a transaction. 
    // Since placeOrder handles atomicity via RPC, we update the metadata here.
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        razorpay_order_id: data.order_id,
        razorpay_payment_id: data.payment_id,
        razorpay_signature: data.signature,
        payment_status: 'paid',
        status: 'confirmed'
      })
      .eq("id", order.id);

    if (updateError) {
      Logger.error("Failed to update payment details for order", updateError, { orderId: order.id });
      // We don't throw here to avoid failing a successful payment, but we log the critical error
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${order.id}`);
    
    return { success: true, orderId: order.id };
  } catch (error: any) {
    Logger.error("placeOrderAction Error", error);
    return { success: false, error: error.message || "Failed to place order" };
  }
}
