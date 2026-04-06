import { ProductService } from "@/services/product-service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Forbidden: Admin access required");
  return user;
}

export async function createProductAction(productData: any): Promise<{ success?: boolean; error?: string }> {
  try {
    await verifyAdmin();
    const productService = new ProductService(true); // true for admin access
    await productService.createProduct(productData);

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    return { success: true };
  } catch (e: any) {
    console.error("createProductAction Error:", e);
    return { error: e.message || "Failed to create product" };
  }
}

export async function updateProductAction(id: string, productData: any): Promise<{ success?: boolean; error?: string }> {
  try {
    await verifyAdmin();
    const productService = new ProductService(true);
    await productService.updateProduct(id, productData);

    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/");
    revalidatePath("/products");
    
    return { success: true };
  } catch (e: any) {
    console.error("updateProductAction Error:", e);
    return { error: e.message || "Failed to update product" };
  }
}

export async function deleteProductAction(id: string): Promise<{ success?: boolean; error?: string }> {
  try {
    await verifyAdmin();
    const productService = new ProductService(true);
    await productService.deleteProduct(id);

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    
    return { success: true };
  } catch (e: any) {
    console.error("deleteProductAction Error:", e);
    return { error: e.message || "Failed to delete product" };
  }
}

