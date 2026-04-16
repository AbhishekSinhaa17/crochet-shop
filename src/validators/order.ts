import { z } from "zod";

export const orderItemSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const shippingAddressSchema = z.object({
  name: z.string().min(3, "Full name is required").optional().or(z.literal("")),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  pincode: z.string().min(4, "Postal code is required"),
  country: z.string().optional().default("India"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const orderCreateSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  shipping_address: shippingAddressSchema,
  payment_method: z.enum(["razorpay", "stripe"]).default("razorpay"),
  notes: z.string().optional(),
});

export const customOrderSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Please provide a more detailed description"),
  preferred_colors: z.string().optional(),
  size_details: z.string().optional(),
  budget_min: z.number().positive().optional().nullable(),
  budget_max: z.number().positive().optional().nullable(),
  deadline: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), "Invalid date"),
  reference_images: z.array(z.string().url()).optional().default([]),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type CustomOrderInput = z.infer<typeof customOrderSchema>;
