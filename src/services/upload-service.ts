import { Logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

export class UploadService {
  private bucket: string;

  constructor(bucket: string = "product-images") {
    this.bucket = bucket;
  }

  async uploadFile(file: File, folder: string = "general") {
    try {
      // 1. Validation
      if (!file || file.size === 0) {
        throw new Error("Invalid file content.");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds limit of 2MB.`);
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed. Only JPEG and PNG are permitted.`);
      }

      // 2. Prepare path
      const ext = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 7);
      
      // Slugify filename to be safe
      const safeName = (file.name || 'image')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);

      const path = `${folder}/${timestamp}-${random}-${safeName}.${ext}`;

      // 3. Upload
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from(this.bucket)
        .upload(path, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // 4. Get public URL
      const { data } = supabaseAdmin.storage.from(this.bucket).getPublicUrl(path);
      
      return {
        path,
        url: data.publicUrl
      };
    } catch (error: any) {
      Logger.error("Upload error", error);
      throw error;
    }
  }

  async uploadMultiple(files: File[], folder: string = "general") {
    const results = await Promise.allSettled(
      files.map(file => this.uploadFile(file, folder))
    );

    const urls: string[] = [];
    const errors: string[] = [];

    results.forEach(res => {
      if (res.status === 'fulfilled') {
        urls.push(res.value.url);
      } else {
        errors.push(res.reason.message);
      }
    });

    return { urls, errors };
  }

  async deleteFile(path: string) {
    try {
      const { error } = await supabaseAdmin.storage
        .from(this.bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      Logger.error("Delete file error", error);
      throw error;
    }
  }
}

