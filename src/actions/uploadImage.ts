"use server";

import { createClient } from "@supabase/supabase-js";

export async function uploadProductImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Use service role to bypass RLS policies that might be hanging the client
    const supabase = createClient(url, serviceRoleKey);

    const ext = file.name.split(".").pop() || "png";
    const path = `product-images/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // IMPORTANT: Convert Next.js File object to ArrayBuffer to avoid node-fetch
    // chunked streaming bugs that cause Kong to return 502 Bad Gateway
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false
      });

    if (uploadError) {
      console.error("Server upload error:", uploadError);
      return { error: uploadError.message };
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);

    if (data?.publicUrl) {
      return { url: data.publicUrl };
    }

    return { error: "Failed to get public URL" };
  } catch (e: any) {
    console.error("Server Action Exception:", e);
    return { error: e.message || "Unknown server error" };
  }
}
