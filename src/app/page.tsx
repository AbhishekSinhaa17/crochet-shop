// app/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import TrustMarquee from "@/components/home/TrustMarquee";
import CategoryBento from "@/components/home/CategoryBento";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";

import AboutSection from "@/components/home/AboutSection";
import CustomOrderCTA from "@/components/home/CustomOrderCTA";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

import HomeStyles from "@/components/home/HomeStyles";
import GoToTop from "@/components/common/GoToTop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CrochetCraft – Handmade with Love",
  description:
    "Shop unique handmade crochet products. Amigurumi, home decor, accessories, baby items and custom orders.",
};

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(8);

  const { data: latestProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .limit(6);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Global Home Styles */}
      <HomeStyles />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Marquee */}
      <TrustMarquee />

      {/* Category Bento Grid */}
      <CategoryBento categories={categories || []} />

      {/* Featured Products */}
      <FeaturedProductsSection products={featuredProducts || []} />



      {/* About Section (Already modular) */}
      <AboutSection />

      {/* Custom Order CTA */}
      <CustomOrderCTA />

      {/* New Arrivals */}
      <NewArrivalsSection products={latestProducts || []} />

      {/* Testimonials */}
      <TestimonialsSection />



      {/* Floating Go To Top Button */}
      <GoToTop />
    </div>
  );
}