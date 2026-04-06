import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  slug: z.string().min(3).max(110).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  compare_price: z.number().positive().optional().nullable(),
  category_id: z.string().uuid("Invalid category ID"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const productUpdateSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
