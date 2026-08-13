-- Fix Product Gallery RLS Policies
-- Jalankan ini jika ada error "policy already exists"

-- 1. Drop existing policies (if exist)
DROP POLICY IF EXISTS "Public can view active product gallery" ON product_gallery;
DROP POLICY IF EXISTS "Authenticated users can manage product gallery" ON product_gallery;

-- 2. Create policies fresh
CREATE POLICY "Public can view active product gallery"
  ON product_gallery FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage product gallery"
  ON product_gallery FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3. Verify policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'product_gallery';

-- Expected output:
-- Should show 2 policies:
-- - Public can view active product gallery
-- - Authenticated users can manage product gallery
