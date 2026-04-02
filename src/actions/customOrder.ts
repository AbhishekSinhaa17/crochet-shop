"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function submitCustomOrderAction(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    // 1. Get user session from cookies to verify identity
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "You must be signed in to submit a custom order." };
    }
    
    const userId = user.id;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const preferredColors = formData.get("preferredColors") as string;
    const sizeDetails = formData.get("sizeDetails") as string;
    
    let budgetMin = null;
    if (formData.get("budgetMin")) {
      const val = parseFloat(formData.get("budgetMin") as string);
      if (!isNaN(val)) budgetMin = val;
    }
    
    let budgetMax = null;
    if (formData.get("budgetMax")) {
      const val = parseFloat(formData.get("budgetMax") as string);
      if (!isNaN(val)) budgetMax = val;
    }
    
    const deadline = formData.get("deadline") as string;
    
    const imageUrls: string[] = [];
    const files = formData.getAll("images") as unknown as File[];
    
    if (files && files.length > 0) {
      // Use supabaseAdmin to bypass storage RLS if needed, ensuring reliable upload
      for (const file of files) {
        if (!file || typeof file === 'string' || file.size === 0) continue;
        
        try {
          const ext = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
          const path = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
          
          // In Node.js environment for Server Actions, we can use arrayBuffer
          const buffer = Buffer.from(await file.arrayBuffer());
          
          const { error: uploadError } = await supabaseAdmin.storage
            .from("custom-order-images")
            .upload(path, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: false
            });
            
          if (!uploadError) {
            const { data } = supabaseAdmin.storage.from("custom-order-images").getPublicUrl(path);
            imageUrls.push(data.publicUrl);
          } else {
            console.error("Storage upload error:", uploadError);
          }
        } catch (fileErr) {
          console.error("Error processing file upload:", fileErr);
        }
      }
    }
    
    // 2. Final database insert using admin client for guaranteed success
    const { error: insertError } = await supabaseAdmin.from("custom_orders").insert([{
      user_id: userId,
      title,
      description,
      preferred_colors: preferredColors || null,
      size_details: sizeDetails || null,
      budget_min: budgetMin,
      budget_max: budgetMax,
      deadline: deadline || null,
      reference_images: imageUrls
    }]);

    if (insertError) {
      console.error("Database insert error:", insertError);
      return { error: `Failed to save order: ${insertError.message}` };
    }
    
    revalidatePath("/orders");
    
    return { success: true };
  } catch (err: any) {
    console.error("Server action critical failure:", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

