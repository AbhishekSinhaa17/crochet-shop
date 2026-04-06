"use server";

import { OrderService } from "@/services/order-service";
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

export async function getAdminOrdersAction(options?: any) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    return await orderService.getAllOrders(options);
  } catch (err: any) {
    console.error("getAdminOrdersAction Error:", err);
    throw err;
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    const result = await orderService.updateStatus(orderId, status);
    revalidatePath("/admin/orders");
    return { success: true, data: result };
  } catch (err: any) {
    console.error("updateOrderStatusAction Error:", err);
    return { success: false, error: err.message };
  }
}
