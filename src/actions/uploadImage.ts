"use server";

import { UploadService } from "@/services/upload-service";
import { Logger } from "@/lib/logger";

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
    Logger.error("uploadProductImage Error", e, { module: "upload", action: "uploadProductImage" });
    return { error: e.message || "Failed to upload image" };
  }
}
