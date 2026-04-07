"use server";

import { ProductService } from "@/services/product-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    Logger.authFailure("Forbidden admin access attempt", { userId: user.id });
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}

export async function createProductAction(productData: any): Promise<{ success?: boolean; error?: string }> {
  try {
    const admin = await verifyAdmin();
    const productService = new ProductService(true);
    await productService.createProduct(productData);

    Logger.adminAction(admin.id, "create_product", { productName: productData?.name });
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true };
  } catch (e: any) {
    Logger.error("createProductAction Error", e, { module: "product", action: "create" });
    return { error: e.message || "Failed to create product" };
  }
}

export async function updateProductAction(id: string, productData: any): Promise<{ success?: boolean; error?: string }> {
  try {
    const admin = await verifyAdmin();
    const productService = new ProductService(true);
    await productService.updateProduct(id, productData);

    Logger.adminAction(admin.id, "update_product", { productId: id });
    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/");
    revalidatePath("/products");
    
    return { success: true };
  } catch (e: any) {
    Logger.error("updateProductAction Error", e, { module: "product", action: "update" });
    return { error: e.message || "Failed to update product" };
  }
}

export async function deleteProductAction(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const admin = await verifyAdmin();
    const productService = new ProductService(true);
    await productService.deleteProduct(id);

    Logger.adminAction(admin.id, "delete_product", { productId: id });
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    
    return { success: true };
  } catch (e: any) {
    Logger.error("deleteProductAction Error", e, { module: "product", action: "delete" });
    return { error: e.message || "Failed to delete product" };
  }
}
