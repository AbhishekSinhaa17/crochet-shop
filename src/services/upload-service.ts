import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class UploadService {
  private bucket: string;

  constructor(bucket: string = "product-images") {
    this.bucket = bucket;
  }

  async uploadFile(file: File, folder: string = "general") {
    // 1. Validation
    if (!file || file.size === 0) {
      throw new Error("Invalid file content.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed.`);
    }

    // 2. Prepare path
    const ext = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7);
    const path = `${folder}/${timestamp}-${random}.${ext}`;

    // 3. Upload (use admin client for storage usually, but we could use user client if RLS allows)
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from(this.bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error(`Upload error for bucket ${this.bucket}:`, uploadError);
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // 4. Get public URL
    const { data } = supabaseAdmin.storage.from(this.bucket).getPublicUrl(path);
    
    return {
      path,
      url: data.publicUrl
    };
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
    const { error } = await supabaseAdmin.storage
      .from(this.bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  }
}
