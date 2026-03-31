import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import WishlistPageClient from "./WishlistPageClient";

export const metadata: Metadata = {
  title: "My Wishlist | YourStore",
  description: "View and manage your saved items. Your curated collection of favorites.",
};

export default async function WishlistPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) redirect("/auth/login?redirect=/wishlist");

  const { data: wishlistItems } = await supabase
    .from("wishlist")
    .select("*, product:products(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = wishlistItems?.map((w) => w.product).filter(Boolean) || [];
  const wishlistData = wishlistItems || [];

  return <WishlistPageClient products={products} wishlistData={wishlistData} />;
}