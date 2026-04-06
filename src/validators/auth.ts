import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  avatar_url: z.string().url("Invalid image URL").optional().nullable(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20).optional().nullable(),
  address: z.record(z.string(), z.any()).optional().default({}),
  role: z.enum(["customer", "admin", "seller"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
