import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";
import ProductsPageClient from "./[id]/ProductsPageClient";

export const metadata: Metadata = {
  title: "Shop All Products | YourStore",
  description: "Browse our exclusive collection of handmade crochet products. Find unique, artisan-crafted items for every occasion.",
  openGraph: {
    title: "Shop All Products | YourStore",
    description: "Browse our exclusive collection of handmade crochet products.",
    type: "website",
  },
};

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; view?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  // Fetch categories and total products concurrently
  const [
    { data: categories },
    { data: totalProducts }
  ] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("products").select("id, category_id").eq("is_active", true)
  ]);

  // Derive current category data locally without extra DB calls
  const currentCategoryData = params.category && categories 
    ? categories.find(c => c.slug === params.category) || null 
    : null;

  // Build products query
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true);

  // Filter by category
  if (currentCategoryData) {
    query = query.eq("category_id", currentCategoryData.id);
  }

  // Search filter
  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  // Sort options
  switch (params.sort) {
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
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;
  
  const categoryCounts: Record<string, number> = {
    all: totalProducts?.length || 0
  };
  
  totalProducts?.forEach(p => {
    if (p.category_id) {
      categoryCounts[p.category_id] = (categoryCounts[p.category_id] || 0) + 1;
    }
  });

  return (
    <ProductsPageClient
      products={products || []}
      categories={categories || []}
      categoryCounts={categoryCounts}
      currentCategory={params.category || null}
      currentCategoryData={currentCategoryData}
      currentSort={params.sort || "newest"}
      searchQuery={params.search || null}
    />
  );
}