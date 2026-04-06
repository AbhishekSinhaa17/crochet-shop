import { createClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ProductInput, ProductUpdateInput } from "@/validators/product";

export class ProductRepository {
  private client;

  constructor(useAdmin = false) {
    this.client = useAdmin ? supabaseAdmin : null;
  }

  private async getClient() {
    if (this.client) return this.client;
    return await createServerSupabaseClient();
  }

  async getAll(options?: {
    category_slug?: string;
    is_active?: boolean;
    is_featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const supabase = await this.getClient();
    const { category_slug, is_active, is_featured, search, page = 1, limit = 12 } = options || {};
    
    let query = supabase
      .from("products")
      .select(`
        *,
        categories!category_id (
          name,
          slug
        )
      `, { count: "exact" });

    if (category_slug) {
      // Need to handle nested filtering or join
      query = query.filter("categories.slug", "eq", category_slug);
    }

    if (is_active !== undefined) {
      query = query.eq("is_active", is_active);
    }

    if (is_featured !== undefined) {
      query = query.eq("is_featured", is_featured);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data, count };
  }

  async getById(id: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories!category_id(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getBySlug(slug: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories!category_id(*)")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async create(product: ProductInput) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, product: ProductUpdateInput) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  async getAllCategories() {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  }
}
