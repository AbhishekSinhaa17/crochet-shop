import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (filters: any) => [...PRODUCT_KEYS.lists(), { filters }] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
};

export function useProducts(filters: {
  category?: string | null;
  search?: string | null;
  sort?: string | null;
}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true);

      if (filters.category) {
        // We first need the category ID for the slug
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", filters.category)
          .single();
        
        if (catData) {
          query = query.eq("category_id", catData.id);
        }
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      switch (filters.sort) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("avg_rating", { ascending: false });
          break;
        case "popular":
          query = query.order("review_count", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
