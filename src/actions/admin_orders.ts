"use server";

import { OrderService } from "@/services/order-service";
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

export async function getAdminOrdersAction(options?: any) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    return await orderService.getAllOrders(options);
  } catch (err: any) {
    Logger.error("getAdminOrdersAction Error", err, { module: "admin_orders", action: "getAll" });
    throw err;
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const admin = await verifyAdmin();
    const orderService = new OrderService(true);
    const result = await orderService.updateStatus(orderId, status);
    Logger.adminAction(admin.id, "update_order_status", { orderId, status });
    revalidatePath("/admin/orders");
    return { success: true, data: result };
  } catch (err: any) {
    Logger.error("updateOrderStatusAction Error", err, { module: "admin_orders", action: "updateStatus" });
    return { success: false, error: err.message };
  }
}
