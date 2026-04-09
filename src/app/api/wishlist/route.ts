import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Response } from "@/lib/api-response";
import { Logger } from "@/lib/logger";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { z } from "zod";

const wishlistSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
});

const deleteWishlistSchema = z.object({
  product_id: z.string().uuid().optional(),
  clear_all: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("wishlist")
      .select(`
        product:products (
          id, name, price,
          compare_price, images, stock
        )
      `)
      .eq("user_id", user.id);

    if (error) throw error;
    return Response.success(data);
  } catch (error: any) {
    Logger.apiError("/api/wishlist (GET)", error);
    return Response.handle(error, "/api/wishlist");
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();
    
    const body = await request.json();
    const result = wishlistSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { product_id } = result.data;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("wishlist")
      .upsert(
        { user_id: user.id, product_id },
        { onConflict: "user_id,product_id" }
      );

    if (error) throw error;
    return Response.success({ success: true });
  } catch (error: any) {
    Logger.apiError("/api/wishlist (POST)", error);
    return Response.handle(error, "/api/wishlist");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();

    const body = await request.json();
    const result = deleteWishlistSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { product_id, clear_all } = result.data;
    const supabase = await createServerSupabaseClient();

    if (clear_all) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    } else {
      if (!product_id) throw new Error("Product ID required for deletion");
      
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product_id);
      if (error) throw error;
    }

    return Response.success({ success: true });
  } catch (error: any) {
    Logger.apiError("/api/wishlist (DELETE)", error);
    return Response.handle(error, "/api/wishlist");
  }
}