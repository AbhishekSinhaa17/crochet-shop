import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ProfileUpdateInput } from "@/validators/auth";

export class UserRepository {
  private client;

  constructor(useAdmin = false) {
    this.client = useAdmin ? supabaseAdmin : null;
  }

  private async getClient() {
    if (this.client) return this.client;
    return await createServerSupabaseClient();
  }

  async getProfile(userId: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId: string, profile: ProfileUpdateInput) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAllProfiles(options?: {
    role?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = await this.getClient();
    const { role, page = 1, limit = 20 } = options || {};
    
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" });

    if (role) {
      query = query.eq("role", role);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data,
      count: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    };
  }


  async deleteProfile(userId: string) {
    // Note: auth side delete needs admin client
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return true;
  }

  async getCustomerCount() {
    const supabase = await this.getClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .neq("role", "admin");

    if (error) throw error;
    return count || 0;
  }
}
