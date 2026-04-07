"use server";

import { revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductService } from "@/services/product-service";
import { productSchema, productUpdateSchema } from "@/validators/product";

/**
 * 🛡️ Helper: Verify Admin Role on Server
 * This is the ultimate security layer for sensitive operations.
 */
async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}

/**
 * 🚀 Server Action: Create Product
 */
export async function createProductAction(formData: any) {
  try {
    await verifyAdmin();
    
    const productService = new ProductService(true);
    const result = await productService.createProduct(formData);
    
    revalidateTag("products");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[Action] Create Product Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 🚀 Server Action: Update Product
 */
export async function updateProductAction(id: string, formData: any) {
  try {
    await verifyAdmin();
    
    const productService = new ProductService(true);
    const result = await productService.updateProduct(id, formData);
    
    revalidateTag("products");
    revalidateTag(`product-${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[Action] Update Product Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 🚀 Server Action: Delete Product (Soft Delete)
 */
export async function deleteProductAction(id: string) {
  try {
    await verifyAdmin();
    
    const productService = new ProductService(true);
    await productService.deleteProduct(id);
    
    revalidateTag("products");
    return { success: true };
  } catch (error: any) {
    console.error("[Action] Delete Product Error:", error.message);
    return { success: false, error: error.message };
  }
}
