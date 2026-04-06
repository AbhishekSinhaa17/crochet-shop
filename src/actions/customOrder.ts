"use server";

import { OrderService } from "@/services/order-service";
import { UploadService } from "@/services/upload-service";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitCustomOrderAction(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "You must be signed in to submit a custom order." };
    }

    const uploadService = new UploadService("custom-order-images");
    const orderService = new OrderService(true); // Admin client used for db insert usually bypasses user-only RLS if needed

    // 1. Handle File Uploads
    const files = formData.getAll("images") as unknown as File[];
    const validFiles = files.filter(f => f && f.size > 0);
    
    let imageUrls: string[] = [];
    if (validFiles.length > 0) {
      const { urls, errors } = await uploadService.uploadMultiple(validFiles, user.id);
      if (errors.length > 0 && urls.length === 0) {
        return { error: `Failed to upload images: ${errors[0]}` };
      }
      imageUrls = urls;
    }

    // 2. Prepare Data
    const orderData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      preferred_colors: formData.get("preferredColors") as string || null,
      size_details: formData.get("sizeDetails") as string || null,
      budget_min: formData.get("budgetMin") ? Number(formData.get("budgetMin")) : null,
      budget_max: formData.get("budgetMax") ? Number(formData.get("budgetMax")) : null,
      deadline: formData.get("deadline") as string || null,
      reference_images: imageUrls
    };

    // 3. Submit Order
    await orderService.submitCustomOrder(user.id, orderData);

    revalidatePath("/orders");
    return { success: true };
  } catch (err: any) {
    console.error("submitCustomOrderAction Error:", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}


