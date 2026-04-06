"use server";

import { OrderService } from "@/services/order-service";
import { ChatService } from "@/services/chat-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin access required");
  return user;
}

export async function getAdminCustomOrdersAction(options?: any) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    return await orderService.getAllCustomOrders(options);
  } catch (err: any) {
    console.error("getAdminCustomOrdersAction Error:", err);
    throw err;
  }
}

export async function updateCustomOrderStatusAction(id: string, status: string, adminNotes?: string, quotedPrice?: number) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    const result = await orderService.updateCustomStatus(id, status, adminNotes, quotedPrice);
    revalidatePath("/admin/custom-orders");
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateCustomOrderStatusAction Error:", err);
    return { success: false, error: err.message };
  }
}

export async function sendAdminOrderReplyAction(customerId: string, content: string) {
  try {
    const admin = await verifyAdmin();
    const chatService = new ChatService(true);
    await chatService.sendAdminReply(customerId, admin.id, content, "Custom Order Inquiry");
    return { success: true };
  } catch (err: any) {
    console.error("sendAdminOrderReplyAction Error:", err);
    return { success: false, error: err.message };
  }
}
