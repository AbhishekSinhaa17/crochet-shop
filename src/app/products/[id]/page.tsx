import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice, formatDate, getDiscountPercent, getStatusColor, getProductImage } from "@/lib/utils";
import ProductDetailClient from "./ProductDetailClient";
import { Star } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .or(`slug.eq.${id},id.eq.${id}`)
    .single();

  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: getProductImage(product.images) ? [getProductImage(product.images)] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Check if the id is a valid UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  let query = supabase
    .from("products")
    .select("*, category:categories(*)");

  if (isUUID) {
    query = query.or(`id.eq.${id},slug.eq.${id}`);
  } else {
    query = query.eq("slug", id);
  }

  const { data: product } = await query.single();

  if (!product) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profile:profiles!user_id(full_name, avatar_url)")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4);

  return (
    <ProductDetailClient
      product={product}
      reviews={reviews || []}
      relatedProducts={relatedProducts || []}
    />
  );
}