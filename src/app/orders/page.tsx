import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import OrdersPageClient from "./OrdersPageClient";

export const metadata: Metadata = {
  title: "My Orders | YourStore",
  description: "Track and manage your orders. View order history and status updates.",
};

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/auth/login?redirect=/orders");

  const { data: regularOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: customOrders } = await supabase
    .from("custom_orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get order statistics (regular only for now)
  const stats = {
    total: regularOrders?.length || 0,
    pending: regularOrders?.filter(o => o.status === 'pending').length || 0,
    processing: regularOrders?.filter(o => o.status === 'processing').length || 0,
    shipped: regularOrders?.filter(o => o.status === 'shipped').length || 0,
    delivered: regularOrders?.filter(o => o.status === 'delivered').length || 0,
    totalSpent: regularOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
  };

  return <OrdersPageClient orders={regularOrders || []} customOrders={customOrders || []} stats={stats} />;
}