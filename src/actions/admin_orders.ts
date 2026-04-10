"use server";

import { OrderService } from "@/services/order-service";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";
import { verifyAdmin } from "@/lib/auth-utils";

export async function getAdminOrdersAction(options?: any) {
  try {
    await verifyAdmin();
    const orderService = new OrderService(true);
    const result = await orderService.getAllOrders(options);
    return { success: true, data: result.data, count: result.count, totalPages: result.totalPages };
  } catch (err: any) {
    Logger.error("getAdminOrdersAction Error", err, { module: "admin_orders", action: "getAll" });
    return { success: false, error: err.message || "Failed to fetch orders" };
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

export async function updateOrderTrackingAction(orderId: string, trackingNumber: string, courier: string = 'INDIA_POST', status?: string) {
  try {
    const admin = await verifyAdmin();
    const orderService = new OrderService(true);
    const result = await orderService.updateTracking(orderId, trackingNumber, courier, status);
    
    Logger.adminAction(admin.id, "update_order_tracking", { orderId, trackingNumber, courier, status });
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);
    
    return { success: true, data: result };
  } catch (err: any) {
    Logger.error("updateOrderTrackingAction Error", err, { module: "admin_orders", action: "updateTracking" });
    return { success: false, error: err.message };
  }
}
