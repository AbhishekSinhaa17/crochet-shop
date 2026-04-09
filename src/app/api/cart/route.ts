import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Response } from "@/lib/api-response";
import { Logger } from "@/lib/logger";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { z } from "zod";

const cartItemSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too high"),
});

const deleteCartSchema = z.object({
  product_id: z.string().uuid().optional(),
  clear_all: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        quantity,
        product:products (
          id, name, price,
          compare_price, images, stock
        )
      `)
      .eq("user_id", user.id);

    if (error) throw error;
    return Response.success(data);
  } catch (error: any) {
    Logger.apiError("/api/cart (GET)", error);
    return Response.handle(error, "/api/cart");
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();
    
    const body = await request.json();
    const result = cartItemSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { product_id, quantity } = result.data;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .upsert(
        { user_id: user.id, product_id, quantity },
        { onConflict: "user_id,product_id" }
      );

    if (error) throw error;
    return Response.success({ success: true });
  } catch (error: any) {
    Logger.apiError("/api/cart (POST)", error);
    return Response.handle(error, "/api/cart");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();

    const body = await request.json();
    const result = cartItemSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { product_id, quantity } = result.data;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("user_id", user.id)
      .eq("product_id", product_id);

    if (error) throw error;
    return Response.success({ success: true });
  } catch (error: any) {
    Logger.apiError("/api/cart (PUT)", error);
    return Response.handle(error, "/api/cart");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();

    const body = await request.json();
    const result = deleteCartSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { product_id, clear_all } = result.data;
    const supabase = await createServerSupabaseClient();

    if (clear_all) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    } else {
      if (!product_id) throw new Error("Product ID required for deletion");
      
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product_id);
      if (error) throw error;
    }

    return Response.success({ success: true });
  } catch (error: any) {
    Logger.apiError("/api/cart (DELETE)", error);
    return Response.handle(error, "/api/cart");
  }
}