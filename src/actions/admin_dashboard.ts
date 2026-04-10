"use server";

import { OrderService } from "@/services/order-service";
import { verifyAdmin } from "@/lib/auth-utils";

export async function getAdminDashboardAction() {
  await verifyAdmin();
  const orderService = new OrderService(true);
  return await orderService.getAdminDashboardData();
}
