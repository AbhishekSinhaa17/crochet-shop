-- ============================================
-- SQL Script: Remove 'Clothing' Category
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Check if there are any products in this category before deleting.
-- (This is just for your information)
-- SELECT count(*) FROM public.products 
-- WHERE category_id = (SELECT id FROM public.categories WHERE name = 'Clothing' OR slug = 'clothing' LIMIT 1);

-- 2. Delete the category safely.
-- Because of 'ON DELETE SET NULL', any products in this category 
-- will have their category_id set to NULL automatically.
DELETE FROM public.categories 
WHERE name = 'Clothing' OR slug = 'clothing';

-- ============================================
-- SUCCESS: 'Clothing' category removed.
-- ============================================
