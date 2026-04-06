"use server";

import { UploadService } from "@/services/upload-service";


export async function uploadProductImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const uploadService = new UploadService("product-images");
    const result = await uploadService.uploadFile(file, "products");

    return { url: result.url };
  } catch (e: any) {
    console.error("uploadProductImage Error:", e);
    return { error: e.message || "Failed to upload image" };
  }
}

