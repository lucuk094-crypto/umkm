# Setup Database Supabase untuk UMKM Desa Mlancu

## 📋 Database Schema

### 1. **Table: producers** (Pengrajin/Produsen)

```sql
CREATE TABLE producers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  photo_url TEXT,
  since_year INTEGER,
  team_size INTEGER,
  story TEXT,
  whatsapp VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Kolom:**
- `id` — ID unik
- `name` — Nama pengrajin (contoh: "Ibu Siti Aminah")
- `role` — Peran (contoh: "Pengrajin Anyaman Bambu")
- `photo_url` — URL foto profil
- `since_year` — Tahun mulai usaha
- `team_size` — Jumlah anggota tim
- `story` — Cerita usaha (storytelling)
- `whatsapp` — Nomor WhatsApp
- `address` — Alamat (dusun/desa)

---

### 2. **Table: products** (Produk)

```sql
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
```

**Kolom:**
- `id` — ID unik
- `name` — Nama produk
- `category` — Kategori (Food/Craft/Fashion)
- `price` — Harga (dalam Rupiah)
- `description` — Deskripsi produk
- `producer_id` — Foreign key ke table producers
- `producer_name` — Nama pembuat (denormalized untuk performa)
- `process` — Proses pembuatan
- `material` — Bahan baku
- `image_url` — URL foto produk
- `stock` — Jumlah stok
- `is_featured` — Produk unggulan (true/false)
- `is_active` — Status aktif (true/false)

---

### 3. **Table: gallery** (Galeri Produksi)

```sql
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
```

**Kolom:**
- `id` — ID unik
- `title` — Judul foto/video
- `description` — Deskripsi proses
- `image_url` — URL foto
- `video_url` — URL video (opsional)
- `type` — Tipe (image/video)
- `category` — Kategori (proses_anyaman, proses_kopi, dll)
- `order_index` — Urutan tampilan
- `is_active` — Status aktif

---

### 4. **Table: testimonials** (Testimoni)

```sql
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_role VARCHAR(255),
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Kolom:**
- `id` — ID unik
- `customer_name` — Nama pemberi testimoni
- `customer_role` — Peran/asal (contoh: "Pembeli Setia")
- `quote` — Isi testimoni
- `rating` — Rating (1-5)
- `is_active` — Status aktif

---

### 5. **Table: orders** (Pesanan) - Opsional

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_whatsapp VARCHAR(20) NOT NULL,
  product_name VARCHAR(255),
  quantity INTEGER,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Kolom:**
- `id` — ID unik
- `customer_name` — Nama pembeli
- `customer_whatsapp` — WA pembeli
- `product_name` — Nama produk
- `quantity` — Jumlah
- `notes` — Catatan
- `status` — Status (pending/confirmed/completed)

---

### 6. **Table: settings** (Pengaturan Website)

```sql
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Kolom:**
- `key` — Nama setting (contoh: "whatsapp_number")
- `value` — Nilai setting
- `description` — Deskripsi

**Data awal:**
```sql
INSERT INTO settings (key, value, description) VALUES
('whatsapp_number', '6285854321098', 'Nomor WhatsApp pusat'),
('location_address', 'Balai Desa Mlancu', 'Alamat lokasi'),
('operating_hours', '08.00 - 20.00 WIB', 'Jam operasional'),
('email', 'umkm@desamlancu.id', 'Email kontak'),
('hero_title', 'Produk Berkualitas dari Tangan Masyarakat Desa Mlancu', 'Judul hero'),
('hero_subtitle', 'Setiap produk memiliki cerita', 'Subtitle hero');
```

---

## 🔐 Row Level Security (RLS)

### Enable RLS untuk semua table:

```sql
-- Enable RLS
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
```

### Policy untuk Public Read (website bisa baca):

```sql
-- Producers: Public read
CREATE POLICY "Allow public read access on producers"
ON producers FOR SELECT
TO public
USING (true);

-- Products: Public read active products
CREATE POLICY "Allow public read active products"
ON products FOR SELECT
TO public
USING (is_active = true);

-- Gallery: Public read active
CREATE POLICY "Allow public read active gallery"
ON gallery FOR SELECT
TO public
USING (is_active = true);

-- Testimonials: Public read active
CREATE POLICY "Allow public read active testimonials"
ON testimonials FOR SELECT
TO public
USING (is_active = true);

-- Settings: Public read
CREATE POLICY "Allow public read settings"
ON settings FOR SELECT
TO public
USING (true);
```

### Policy untuk Admin (authenticated user bisa CRUD):

```sql
-- Producers: Admin full access
CREATE POLICY "Allow admin full access on producers"
ON producers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Products: Admin full access
CREATE POLICY "Allow admin full access on products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Gallery: Admin full access
CREATE POLICY "Allow admin full access on gallery"
ON gallery FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Testimonials: Admin full access
CREATE POLICY "Allow admin full access on testimonials"
ON testimonials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Orders: Admin full access
CREATE POLICY "Allow admin full access on orders"
ON orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Settings: Admin full access
CREATE POLICY "Allow admin full access on settings"
ON settings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

## 📁 Supabase Storage

### Buat 3 Buckets:

1. **products** — Untuk foto produk
2. **gallery** — Untuk foto galeri produksi
3. **producers** — Untuk foto profil pengrajin

### SQL untuk setup storage policies:

```sql
-- Bucket policies: Public read
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('products', 'products', true),
  ('gallery', 'gallery', true),
  ('producers', 'producers', true);

-- Storage policy: Public can read
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('products', 'gallery', 'producers'));

-- Storage policy: Authenticated can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('products', 'gallery', 'producers'));

-- Storage policy: Authenticated can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('products', 'gallery', 'producers'));

-- Storage policy: Authenticated can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('products', 'gallery', 'producers'));
```

---

## 📝 Sample Data untuk Testing

### Insert sample producers:

```sql
INSERT INTO producers (name, role, since_year, team_size, story, whatsapp, address) VALUES
('Ibu Siti Aminah', 'Pengrajin Anyaman Bambu', 2015, 8, 
'Memulai usaha anyaman sejak 2015. Mempekerjakan 8 warga desa. Menggunakan bambu lokal dari kebun sendiri. Setiap tas dibuat dengan teknik tradisional yang diwariskan turun-temurun.', 
'6285854321098', 'Dusun Krajan, Desa Mlancu'),

('Ibu Dewi Kusuma', 'Produsen Keripik Singkong', 2018, 3,
'Usaha rumahan dimulai tahun 2018. Memproduksi 200 bungkus per minggu. Singkong dari kebun warga Desa Mlancu. Diproses dengan resep rahasia keluarga yang sudah 3 generasi.',
'6285854321098', 'Dusun Krajan, Desa Mlancu'),

('Pak Ahmad Riyadi', 'Petani Kopi Robusta', 2012, 15,
'Kelompok tani kopi berdiri sejak 2012. Mengelola 5 hektar kebun kopi bersama 15 petani. Proses sangrai manual menggunakan tungku tradisional untuk menghasilkan cita rasa khas.',
'6285854321098', 'Lereng Gunung, Desa Mlancu');
```

### Insert sample products:

```sql
-- Get producer IDs first
WITH producer_ids AS (
  SELECT id, name FROM producers
)
INSERT INTO products (name, category, price, description, producer_id, producer_name, process, material, stock, is_featured, is_active)
SELECT 
  'Keripik Singkong Pedas',
  'Food',
  15000,
  'Keripik singkong renyah dengan bumbu pedas khas. Dibuat dari singkong pilihan kebun warga desa.',
  p.id,
  p.name,
  'Singkong diiris tipis, digoreng dengan minyak bersih, dibumbui resep rahasia keluarga 3 generasi',
  'Singkong lokal Desa Mlancu',
  50,
  true,
  true
FROM producer_ids p
WHERE p.name = 'Ibu Dewi Kusuma';

-- Repeat for other products...
```

### Insert sample testimonials:

```sql
INSERT INTO testimonials (customer_name, customer_role, quote, rating, is_active) VALUES
('Ibu Siti Aminah', 'Pengrajin Anyaman Desa Mlancu', 
'Platform ini sangat membantu saya memasarkan produk kerajinan tangan ke luar desa. Penjualan meningkat pesat!', 
5, true),

('Bapak Budi Santoso', 'Warga Kota Terdekat',
'Mudah digunakan dan produk-produknya berkualitas. Saya senang bisa mendukung UMKM Desa Mlancu sambil dapat barang bagus.',
5, true),

('Ibu Dewi Kusuma', 'Pemilik Usaha Keripik',
'Sebagai pelaku UMKM kuliner, platform ini membuka pasar baru untuk produk saya. Terimakasih UMKM Desa Mlancu!',
5, true);
```

---

## 🔑 Setup Admin User

### 1. Buat user admin di Supabase Dashboard:
- Go to Authentication → Users
- Click "Add user"
- Email: `admin@desamlancu.id`
- Password: (buat password strong)
- Auto confirm user: ✅

### 2. Atau via SQL:

```sql
-- Note: Ini hanya contoh, lebih baik buat via Dashboard
-- untuk mendapat konfirmasi email
```

---

## 📊 Useful Views (Opsional)

### View untuk produk dengan info lengkap:

```sql
CREATE VIEW products_with_producer AS
SELECT 
  p.id,
  p.name,
  p.category,
  p.price,
  p.description,
  p.process,
  p.material,
  p.image_url,
  p.stock,
  p.is_featured,
  p.is_active,
  prod.name as producer_name,
  prod.role as producer_role,
  prod.whatsapp as producer_whatsapp,
  p.created_at
FROM products p
LEFT JOIN producers prod ON p.producer_id = prod.id
WHERE p.is_active = true
ORDER BY p.is_featured DESC, p.created_at DESC;
```

---

## 🚀 Langkah Setup di Supabase

1. **Login ke Supabase** (https://supabase.com)
2. **Pilih/Buat Project** yang sudah Anda punya
3. **SQL Editor** → Copy paste semua SQL di atas
4. **Storage** → Buat 3 buckets (products, gallery, producers)
5. **Authentication** → Buat user admin
6. **Copy API Keys**:
   - Project URL
   - Anon/Public Key
   - Service Role Key (untuk admin)

---

## 📝 Catatan Penting

### Environment Variables yang dibutuhkan:

```env
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Untuk Dashboard Admin (akan kita buat):

```env
SUPABASE_URL=your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## ✅ Checklist Setup

- [ ] Buat semua tables (producers, products, gallery, testimonials, orders, settings)
- [ ] Enable RLS untuk semua tables
- [ ] Buat policies (public read, admin full access)
- [ ] Buat 3 storage buckets
- [ ] Setup storage policies
- [ ] Insert sample data
- [ ] Buat admin user
- [ ] Copy API keys
- [ ] Test koneksi dari website

---

Setelah database setup selesai, saya akan buatkan:
1. **Dashboard Admin** (HTML/CSS/JS sederhana)
2. **Frontend Integration** (update website untuk fetch dari Supabase)
3. **Image Upload Component**

Ready untuk lanjut? 🚀
