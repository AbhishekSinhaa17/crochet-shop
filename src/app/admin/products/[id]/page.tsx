import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditProductClient from "./EditProductClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <EditProductClient 
      product={product} 
      categories={categories || []} 
    />
  );
}
