import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Response } from "@/lib/api-response";
import { Logger } from "@/lib/logger";
import { requireUser } from "@/security/authGuard";
import { checkRateLimit } from "@/security/rateLimiter";
import { z } from "zod";

const cartOperationSchema = z.object({
  type: z.enum(["upsert", "delete"]),
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(100).optional(),
});

const batchSchema = z.object({
  operations: z.array(cartOperationSchema).max(50, "Maximum 50 operations per batch"),
});

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request);
    const user = await requireUser();
    
    const body = await request.json();
    const result = batchSchema.safeParse(body);
    if (!result.success) throw result.error;

    const { operations } = result.data;
    const supabase = await createServerSupabaseClient();

    // Sort operations into upserts and deletes
    const upserts = operations
      .filter((op) => op.type === "upsert")
      .map((op) => ({
        user_id: user.id,
        product_id: op.product_id,
        quantity: op.quantity || 1,
      }));

    const deleteIds = operations
      .filter((op) => op.type === "delete")
      .map((op) => op.product_id);

    // Execute deletions first
    if (deleteIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .in("product_id", deleteIds);
      
      if (deleteError) throw deleteError;
    }

    // Execute upserts
    if (upserts.length > 0) {
      const { error: upsertError } = await supabase
        .from("cart_items")
        .upsert(upserts, { onConflict: "user_id,product_id" });
      
      if (upsertError) throw upsertError;
    }

    return Response.success({ success: true, processed: operations.length });
  } catch (error: any) {
    Logger.apiError("/api/cart/batch", error);
    return Response.handle(error, "/api/cart/batch");
  }
}
