"use server";

import { revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductService } from "@/services/product-service";
import { Logger } from "@/lib/logger";

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
    Logger.authFailure("Unauthorized admin access attempt", { userId: user.id, email: user.email });
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}

/**
 * 🚀 Server Action: Create Product
 */
export async function createProductAction(formData: any) {
  try {
    const admin = await verifyAdmin();
    
    const productService = new ProductService(true);
    const result = await productService.createProduct(formData);
    
    Logger.adminAction(admin.id, "create_product", { productName: formData?.name });
    revalidateTag("products");
    return { success: true, data: result };
  } catch (error: any) {
    Logger.error("[Action] Create Product Error", error, { module: "product-actions", action: "createProduct" });
    return { success: false, error: error.message || "Failed to create product" };
  }
}

/**
 * 🚀 Server Action: Update Product
 */
export async function updateProductAction(id: string, formData: any) {
  try {
    const admin = await verifyAdmin();
    
    const productService = new ProductService(true);
    const result = await productService.updateProduct(id, formData);
    
    Logger.adminAction(admin.id, "update_product", { productId: id });
    revalidateTag("products");
    revalidateTag(`product-${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    Logger.error("[Action] Update Product Error", error, { module: "product-actions", action: "updateProduct" });
    return { success: false, error: error.message || "Failed to update product" };
  }
}

/**
 * 🚀 Server Action: Delete Product (Soft Delete)
 */
export async function deleteProductAction(id: string) {
  try {
    const admin = await verifyAdmin();
    
    const productService = new ProductService(true);
    await productService.deleteProduct(id);
    
    Logger.adminAction(admin.id, "delete_product", { productId: id });
    revalidateTag("products");
    return { success: true };
  } catch (error: any) {
    Logger.error("[Action] Delete Product Error", error, { module: "product-actions", action: "deleteProduct" });
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
