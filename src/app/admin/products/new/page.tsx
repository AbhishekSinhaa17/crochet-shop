import { createServerSupabaseClient } from "@/lib/supabase/server";
import NewProductClient from "./NewProductClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Product | Admin",
  description: "Create a new product in the store.",
};

export default async function NewProductPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return <NewProductClient categories={categories || []} />;
}
