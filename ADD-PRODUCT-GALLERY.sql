-- Add Product Gallery & Reviews Tables
-- Jalankan SQL ini di Supabase SQL Editor

-- 1. Product Gallery (untuk foto/video proses pembuatan)
CREATE TABLE IF NOT EXISTS product_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Product Reviews (testimoni pembeli untuk produk)
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_photo TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add additional columns to products table if needed
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight INTEGER; -- dalam gram
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions TEXT; -- format: "PxLxT cm"

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_gallery_product_id ON product_gallery(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_gallery_active ON product_gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_product_reviews_active ON product_reviews(is_active);

-- 5. Enable RLS (Row Level Security)
ALTER TABLE product_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Allow public READ
CREATE POLICY "Public can view active product gallery"
  ON product_gallery FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active product reviews"
  ON product_reviews FOR SELECT
  USING (is_active = true);

-- 7. RLS Policies - Allow authenticated users FULL access (for admin dashboard)
CREATE POLICY "Authenticated users can manage product gallery"
  ON product_gallery FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage product reviews"
  ON product_reviews FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 8. Grant privileges
GRANT ALL ON product_gallery TO authenticated;
GRANT ALL ON product_reviews TO authenticated;
GRANT SELECT ON product_gallery TO anon;
GRANT SELECT ON product_reviews TO anon;

-- 9. Create storage buckets for product media (jika belum ada)
-- Jalankan ini di Supabase Storage Dashboard:
-- - Buat bucket: "product-gallery" (PUBLIC)
-- - Buat bucket: "product-reviews" (PUBLIC)

-- 10. Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_gallery_updated_at
  BEFORE UPDATE ON product_gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success! Tables created.
-- Next: Create storage buckets "product-gallery" and "product-reviews" in Supabase Storage
