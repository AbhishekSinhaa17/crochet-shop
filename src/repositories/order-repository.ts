import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { OrderCreateInput, CustomOrderInput } from "@/validators/order";

export class OrderRepository {
  private client;

  constructor(useAdmin = false) {
    this.client = useAdmin ? supabaseAdmin : null;
  }

  private async getClient() {
    if (this.client) return this.client;
    return await createServerSupabaseClient();
  }

  async createOrder(order: OrderCreateInput & { user_id: string; order_number: string; total: number; subtotal: number }) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOrderById(id: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_status_history(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getOrdersByUser(userId: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getAllOrders(options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = await this.getClient();
    const { status, page = 1, limit = 20 } = options || {};
    
    let query = supabase
      .from("orders")
      .select("*, profiles!user_id(full_name, avatar_url)", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async updateOrderStatus(id: string, status: string, note?: string) {
    const supabase = await this.getClient();
    
    // Update order status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (orderError) throw orderError;

    // Log history
    const { error: historyError } = await supabase
      .from("order_status_history")
      .insert([{ order_id: id, status, note }]);

    if (historyError) throw historyError;

    return order;
  }

  // Custom Orders
  async createCustomOrder(order: CustomOrderInput & { user_id: string }) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("custom_orders")
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCustomOrdersByUser(userId: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("custom_orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getAllCustomOrders(options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = await this.getClient();
    const { status, page = 1, limit = 20 } = options || {};
    
    let query = supabase
      .from("custom_orders")
      .select("*, profiles!user_id(full_name, avatar_url)", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async updateCustomOrderStatus(id: string, status: string, admin_notes?: string, quoted_price?: number) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("custom_orders")
      .update({ status, admin_notes, quoted_price, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
