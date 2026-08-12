-- ============================================
-- FIX DATABASE COMPLETE - UMKM DESA MLANCU
-- Run this in Supabase SQL Editor to fix all issues
-- ============================================

-- STEP 1: Drop existing policies if any exist
DROP POLICY IF EXISTS "Public can view producers" ON producers;
DROP POLICY IF EXISTS "Authenticated can insert producers" ON producers;
DROP POLICY IF EXISTS "Authenticated can update producers" ON producers;
DROP POLICY IF EXISTS "Authenticated can delete producers" ON producers;

DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Authenticated can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated can update products" ON products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON products;

DROP POLICY IF EXISTS "Public can view gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated can insert gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated can update gallery" ON gallery;
DROP POLICY IF EXISTS "Authenticated can delete gallery" ON gallery;

DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated can delete testimonials" ON testimonials;

DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Authenticated can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated can delete orders" ON orders;

DROP POLICY IF EXISTS "Public can view settings" ON settings;
DROP POLICY IF EXISTS "Authenticated can update settings" ON settings;

-- STEP 2: Create RLS Policies (correct syntax)
-- Producers policies
CREATE POLICY "Public can view producers" ON producers 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert producers" ON producers 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update producers" ON producers 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete producers" ON producers 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Products policies
CREATE POLICY "Public can view products" ON products 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert products" ON products 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update products" ON products 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete products" ON products 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery policies
CREATE POLICY "Public can view gallery" ON gallery 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert gallery" ON gallery 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update gallery" ON gallery 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete gallery" ON gallery 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Testimonials policies
CREATE POLICY "Public can view testimonials" ON testimonials 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert testimonials" ON testimonials 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update testimonials" ON testimonials 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete testimonials" ON testimonials 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Public can insert orders" ON orders 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can view orders" ON orders 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update orders" ON orders 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete orders" ON orders 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Settings policies
CREATE POLICY "Public can view settings" ON settings 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can update settings" ON settings 
  FOR UPDATE USING (auth.role() = 'authenticated');

-- STEP 3: Drop and recreate storage policies
-- Drop existing storage policies
DROP POLICY IF EXISTS "Public can view products images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload products images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update products images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete products images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view producers images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload producers images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update producers images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete producers images" ON storage.objects;

DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete gallery images" ON storage.objects;

-- Create storage policies for products bucket
CREATE POLICY "Public can view products images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated can upload products images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update products images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete products images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Create storage policies for producers bucket
CREATE POLICY "Public can view producers images"
ON storage.objects FOR SELECT
USING (bucket_id = 'producers');

CREATE POLICY "Authenticated can upload producers images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'producers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update producers images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'producers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete producers images"
ON storage.objects FOR DELETE
USING (bucket_id = 'producers' AND auth.role() = 'authenticated');

-- Create storage policies for gallery bucket
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Success message
SELECT '✅ Database policies fixed! Now create storage buckets manually.' as status;
