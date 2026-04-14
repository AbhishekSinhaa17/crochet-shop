"use server";

import { OrderService } from "@/services/order-service";
import { ChatService } from "@/services/chat-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    Logger.authFailure("Forbidden admin access attempt", { userId: user.id });
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}

export async function getAdminCustomOrdersAction(options?: any) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    return await orderService.getAllCustomOrders(options);
  } catch (err: any) {
    Logger.error("getAdminCustomOrdersAction Error", err, { module: "admin_custom_orders", action: "getAll" });
    throw err;
  }
}

export async function updateCustomOrderStatusAction(id: string, status: string, adminNotes?: string, quotedPrice?: number, additionalData?: any) {
  try {
    const admin = await verifyAdmin();
    const orderService = new OrderService(true);
    const result = await orderService.updateCustomStatus(id, status, adminNotes, quotedPrice, additionalData);
    Logger.adminAction(admin.id, "update_custom_order_status", { orderId: id, status });
    revalidatePath("/admin/custom-orders");
    return { success: true, data: result };
  } catch (err: any) {
    Logger.error("updateCustomOrderStatusAction Error", err, { module: "admin_custom_orders", action: "updateStatus" });
    return { success: false, error: err.message };
  }
}

export async function sendAdminOrderReplyAction(customerId: string, content: string) {
  try {
    const admin = await verifyAdmin();
    const chatService = new ChatService(true);
    await chatService.sendAdminReply(customerId, admin.id, content, "Custom Order Inquiry");
    Logger.adminAction(admin.id, "send_order_reply", { customerId });
    return { success: true };
  } catch (err: any) {
    Logger.error("sendAdminOrderReplyAction Error", err, { module: "admin_custom_orders", action: "sendReply" });
    return { success: false, error: err.message };
  }
}
