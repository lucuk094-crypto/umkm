-- ============================================
-- SETUP DATABASE UMKM DESA MLANCU
-- Copy semua kode ini dan paste ke Supabase SQL Editor
-- ============================================

-- 1. Table: producers (Pengrajin/Produsen)
CREATE TABLE producers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  owner_name VARCHAR(255),
  business_name VARCHAR(255),
  maker_name VARCHAR(255),
  business_status VARCHAR(100),
  photo_url TEXT,
  since_year INTEGER,
  team_size INTEGER,
  story TEXT,
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  village VARCHAR(100),
  address TEXT,
  full_address TEXT,
  instagram VARCHAR(100),
  facebook VARCHAR(100),
  achievements TEXT,
  products_offered TEXT,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_producers_slug ON producers(slug);

-- 2. Table: products (Produk)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  producer_id UUID REFERENCES producers(id) ON DELETE SET NULL,
  producer_name VARCHAR(255),
  process TEXT,
  material TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_producer ON products(producer_id);

-- 3. Table: gallery (Galeri Produksi)
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT NOT NULL,
  video_url TEXT,
  type VARCHAR(20) DEFAULT 'image',
  category VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gallery_order ON gallery(order_index);

-- 4. Table: testimonials (Testimoni)
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_role VARCHAR(255),
  message TEXT NOT NULL,
  customer_photo TEXT,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Table: orders (Pesanan)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_whatsapp VARCHAR(20) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_price INTEGER,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);

-- 6. Table: settings (Pengaturan Website)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number VARCHAR(20),
  email VARCHAR(255),
  location_address TEXT,
  operating_hours VARCHAR(100),
  hero_title TEXT,
  hero_subtitle TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (whatsapp_number, email, location_address, operating_hours, hero_title, hero_subtitle) VALUES
  ('6285854321098', 'umkm@desamlancu.id', 'Balai Desa Mlancu, Jawa Timur', '08.00 - 20.00 WIB', 'Produk Berkualitas dari Desa Mlancu', 'Setiap produk memiliki cerita dan tangan-tangan terampil di baliknya');

-- Enable Row Level Security (RLS) untuk semua table
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, authenticated full access

-- Producers policies
CREATE POLICY "Public can view producers" ON producers FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert producers" ON producers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update producers" ON producers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete producers" ON producers FOR DELETE USING (auth.role() = 'authenticated');

-- Products policies
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Gallery policies
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert gallery" ON gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update gallery" ON gallery FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete gallery" ON gallery FOR DELETE USING (auth.role() = 'authenticated');

-- Testimonials policies
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can view orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete orders" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- Settings policies
CREATE POLICY "Public can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Authenticated can update settings" ON settings FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS (untuk upload gambar)
-- ============================================
-- Run SQL ini untuk create storage buckets

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('producers', 'producers', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies untuk products bucket
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

-- Storage policies untuk producers bucket
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

-- Storage policies untuk gallery bucket
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
SELECT 'Database & Storage berhasil dibuat! 6 tabel + 3 buckets siap digunakan.' as status;
