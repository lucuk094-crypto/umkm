-- Add Site Assets Management
-- Untuk manage hero banner, logo, dan gambar-gambar website lainnya dari dashboard

-- 1. Add new settings for site assets
INSERT INTO settings (key, value, description) VALUES
  ('hero_banner_url', 'https://i.ibb.co/84zR6qfT/hero-img.png', 'URL gambar hero banner utama'),
  ('site_logo_url', '', 'URL logo website (optional)'),
  ('about_image_url', 'https://i.ibb.co/7Tpv4J9/about-coffee-bag.jpg', 'URL gambar section About'),
  ('site_title', 'UMKM Desa Mlancu', 'Judul website'),
  ('site_description', 'Platform digital untuk mempromosikan dan memudahkan jual beli produk UMKM Desa Mlancu', 'Deskripsi website')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- 2. Create storage bucket for site assets (if not exists)
-- Jalankan ini manual di Supabase Storage Dashboard:
-- - Buat bucket: "site-assets" (PUBLIC)
-- - Upload gambar hero banner, logo, dll ke bucket ini

-- Success! 
-- Next: Update dashboard admin untuk manage site assets
