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
      payment_method: 'razorpay',
      status: 'confirmed',
      payment_status: 'paid'
    };

    // 1. Create Order via Service (Now with atomic Paid/Confirmed status)
    const order = await orderService.placeOrder(user.id, orderInput);

    revalidatePath("/orders");
    revalidatePath(`/orders/${order.id}`);
    revalidatePath("/admin/orders");
    
    return { success: true, orderId: order.id };
  } catch (error: any) {
    Logger.error("placeOrderAction Error", error);
    return { success: false, error: error.message || "Failed to place order" };
  }
}
