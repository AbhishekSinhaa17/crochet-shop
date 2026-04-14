-- Migration: Update custom_orders status and fields
-- Run this in Supabase SQL Editor

-- 1. Update status check constraint
-- First drop existing constraint if it has a name, but usually it's unnamed in simple schema. 
-- We can drop and re-add if we know the name, or just use another approach.
-- Since we want to update the CHECK constraint on 'status' column in 'custom_orders' table:

ALTER TABLE public.custom_orders DROP CONSTRAINT IF EXISTS custom_orders_status_check;
ALTER TABLE public.custom_orders ADD CONSTRAINT custom_orders_status_check 
  CHECK (status IN ('pending', 'quoted', 'paid', 'in_progress', 'shipped', 'delivered', 'cancelled'));

-- 2. Add new columns
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS tracking_id TEXT;
ALTER TABLE public.custom_orders ADD COLUMN IF NOT EXISTS courier_name TEXT DEFAULT 'India Post';
