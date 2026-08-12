-- FIX RLS POLICIES - UMKM Desa Mlancu
-- Jalankan SQL ini di Supabase SQL Editor

-- =====================================================
-- STEP 1: DROP EXISTING POLICIES (jika ada)
-- =====================================================

-- Drop policies untuk products
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON products;

-- Drop policies untuk producers
DROP POLICY IF EXISTS "Enable read access for all users" ON producers;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON producers;

-- Drop policies untuk gallery
DROP POLICY IF EXISTS "Enable read access for all users" ON gallery;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON gallery;

-- Drop policies untuk testimonials
DROP POLICY IF EXISTS "Enable read access for all users" ON testimonials;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON testimonials;

-- Drop policies untuk orders
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON orders;

-- Drop policies untuk settings
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON settings;

-- =====================================================
-- STEP 2: ENABLE RLS (jika belum enabled)
-- =====================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 3: CREATE NEW POLICIES (public read + auth full access)
-- =====================================================

-- PRODUCTS POLICIES
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Enable full access for authenticated users" 
ON products FOR ALL 
USING (auth.role() = 'authenticated');

-- PRODUCERS POLICIES
CREATE POLICY "Enable read access for all users" 
ON producers FOR SELECT 
USING (true);

CREATE POLICY "Enable full access for authenticated users" 
ON producers FOR ALL 
USING (auth.role() = 'authenticated');

-- GALLERY POLICIES
CREATE POLICY "Enable read access for all users" 
ON gallery FOR SELECT 
USING (true);

CREATE POLICY "Enable full access for authenticated users" 
ON gallery FOR ALL 
USING (auth.role() = 'authenticated');

-- TESTIMONIALS POLICIES
CREATE POLICY "Enable read access for all users" 
ON testimonials FOR SELECT 
USING (true);

CREATE POLICY "Enable full access for authenticated users" 
ON testimonials FOR ALL 
USING (auth.role() = 'authenticated');

-- ORDERS POLICIES
CREATE POLICY "Enable insert for anonymous" 
ON orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated" 
ON orders FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable full access for authenticated users" 
ON orders FOR ALL 
USING (auth.role() = 'authenticated');

-- SETTINGS POLICIES
CREATE POLICY "Enable read access for all users" 
ON settings FOR SELECT 
USING (true);

CREATE POLICY "Enable full access for authenticated users" 
ON settings FOR ALL 
USING (auth.role() = 'authenticated');

-- =====================================================
-- STEP 4: VERIFY POLICIES
-- =====================================================

-- Check policies untuk semua tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- Jika query di atas menampilkan policies, berarti berhasil!
-- Sekarang refresh test-supabase.html dan coba lagi
