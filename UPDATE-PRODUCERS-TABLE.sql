-- UPDATE TABLE PRODUCERS - Tambah Field Baru untuk Profil Detail
-- Jalankan SQL ini di Supabase SQL Editor

-- Tambah kolom baru ke table producers
ALTER TABLE producers 
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),        -- Nama usaha/brand
ADD COLUMN IF NOT EXISTS business_status VARCHAR(100),      -- Status usaha (rumahan, kelompok, koperasi)
ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255),           -- Nama pemilik usaha
ADD COLUMN IF NOT EXISTS maker_name VARCHAR(255),           -- Nama pembuat produk
ADD COLUMN IF NOT EXISTS village VARCHAR(100),              -- Dusun
ADD COLUMN IF NOT EXISTS full_address TEXT,                 -- Alamat lengkap
ADD COLUMN IF NOT EXISTS email VARCHAR(255),                -- Email
ADD COLUMN IF NOT EXISTS instagram VARCHAR(100),            -- Username Instagram
ADD COLUMN IF NOT EXISTS facebook VARCHAR(100),             -- Facebook
ADD COLUMN IF NOT EXISTS description TEXT,                  -- Deskripsi singkat
ADD COLUMN IF NOT EXISTS achievements TEXT,                 -- Prestasi/pencapaian
ADD COLUMN IF NOT EXISTS products_offered TEXT,             -- Produk yang ditawarkan
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;          -- URL slug untuk detail page

-- Update existing data dengan slug
UPDATE producers 
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_producers_slug ON producers(slug);

-- Comment untuk dokumentasi
COMMENT ON COLUMN producers.business_name IS 'Nama usaha atau brand';
COMMENT ON COLUMN producers.business_status IS 'Status usaha: rumahan, kelompok, koperasi, dll';
COMMENT ON COLUMN producers.owner_name IS 'Nama pemilik usaha';
COMMENT ON COLUMN producers.maker_name IS 'Nama pembuat produk (bisa sama dengan owner_name)';
COMMENT ON COLUMN producers.village IS 'Nama dusun';
COMMENT ON COLUMN producers.full_address IS 'Alamat lengkap usaha';
COMMENT ON COLUMN producers.slug IS 'URL slug untuk halaman detail (auto-generated dari name)';

-- Success message
SELECT 'Table producers berhasil diupdate dengan field baru!' as status;
