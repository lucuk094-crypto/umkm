# 🔧 Setup Product Gallery - Langkah demi Langkah

## ❗ PENTING: Jalankan SQL Dulu!

Anda lihat screenshot hanya ada dropdown "Pilih Produk" tanpa tabel di bawah? Itu karena **table `product_gallery` belum dibuat** di database Supabase.

---

## 📋 Langkah-Langkah Setup

### Step 1: Buka Supabase Dashboard

```
1. Buka browser
2. Go to: https://supabase.com
3. Login dengan akun Anda
4. Pilih project: umkm-desa-mlancu (atau nama project Anda)
```

---

### Step 2: Buka SQL Editor

```
1. Di sidebar kiri, klik icon "SQL Editor" (icon <>)
2. Atau: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
3. Klik tombol "+ New query" (hijau, kanan atas)
```

---

### Step 3: Copy & Paste SQL

```
1. Buka file: ADD-PRODUCT-GALLERY.sql (di folder project)
2. Select ALL text (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste di SQL Editor Supabase
```

**Atau copy dari sini:**

```sql
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
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions TEXT;

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

-- 9. Add updated_at trigger
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
```

---

### Step 4: Run SQL

```
1. Setelah paste SQL di editor
2. Klik tombol "RUN" (atau Ctrl+Enter)
3. Tunggu beberapa detik
4. Jika sukses, akan muncul: "Success. No rows returned"
```

**Expected Output:**
```
✅ Success. No rows returned
```

**Jika ada error:**
- Baca pesan error
- Kemungkinan: table sudah ada (OK, abaikan)
- Kemungkinan: function `update_updated_at_column` conflict (OK, abaikan)

---

### Step 5: Verify Table Created

```
1. Di sidebar kiri Supabase, klik "Table Editor"
2. Scroll down, cari table: "product_gallery"
3. Jika ada → SUCCESS! ✅
4. Jika tidak ada → ulangi Step 3-4
```

**Screenshot expected:**
```
Tables:
  ├── products ✅
  ├── producers ✅
  ├── gallery ✅
  ├── testimonials ✅
  ├── orders ✅
  ├── settings ✅
  ├── product_gallery ✅ ← NEW!
  └── product_reviews ✅ ← NEW!
```

---

### Step 6: Test Dashboard

```
1. Buka dashboard admin: https://umkm-desa-mlancu02.vercel.app/admin-dashboard.html
2. Login
3. Klik menu "Galeri Produk"
4. Pilih produk dari dropdown
5. Sekarang harus muncul:
   ┌─────────────────────────────────────────┐
   │ Galeri: [Nama Produk]                   │
   │                      [+ Tambah Media]   │
   │─────────────────────────────────────────│
   │ Preview │ Tipe │ Caption │ Urutan │ ... │
   │─────────────────────────────────────────│
   │ Belum ada media di galeri ini           │
   └─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Issue 1: "Success. No rows returned" tapi table tidak muncul

**Solusi:**
```
1. Refresh page Supabase (F5)
2. Logout dan login lagi Supabase
3. Coba query manual:
   
   SELECT * FROM product_gallery LIMIT 1;
   
4. Jika error "relation does not exist" → table gagal dibuat
5. Ulangi Step 3-4 dengan teliti
```

---

### Issue 2: Error "relation product_gallery already exists"

**Artinya:** Table sudah ada! ✅

**Next:**
- Abaikan error ini
- Lanjut ke Step 5 untuk verify
- Test dashboard (Step 6)

---

### Issue 3: Dashboard masih tidak muncul tabel setelah pilih produk

**Penyebab:** JavaScript error atau RLS policy

**Solusi:**

**3.1. Check Console Log**
```
1. Di dashboard, tekan F12
2. Tab "Console"
3. Pilih produk dari dropdown
4. Lihat error di console
5. Screenshot dan kirim ke saya
```

**3.2. Check RLS Policy**
```
1. Buka Supabase → Authentication → Policies
2. Cari table "product_gallery"
3. Harus ada policy:
   - "Public can view active product gallery" (SELECT)
   - "Authenticated users can manage product gallery" (ALL)
4. Jika tidak ada → run SQL Step 3 lagi
```

**3.3. Manual Test Query**
```
Di Supabase SQL Editor, run:

SELECT * FROM product_gallery LIMIT 10;

Jika error "permission denied" → RLS policy issue
Jika hasil kosong (no rows) → table OK, data memang kosong
```

---

### Issue 4: "Cannot read property 'map' of undefined"

**Penyebab:** JavaScript trying to render null data

**Solusi:** Code sudah di-handle (loading state), tapi jika masih error:
```
1. Hard refresh dashboard: Ctrl+Shift+R
2. Clear cache dan cookies
3. Incognito mode
```

---

## ✅ Expected Result Setelah Setup

### 1. Dashboard - Setelah Pilih Produk:

```
╔════════════════════════════════════════════════╗
║ Manajemen Galeri Produk                        ║
║ Kelola foto/video detail untuk setiap produk   ║
╠════════════════════════════════════════════════╣
║                                                ║
║ Pilih Produk: [Kopi Arabica ▼]                ║
║                                                ║
╠════════════════════════════════════════════════╣
║ Galeri: Kopi Arabica      [+ Tambah Media]    ║
╠════════════════════════════════════════════════╣
║ Preview │ Tipe  │ Caption │ Urutan │ Status   ║
╠─────────┼───────┼─────────┼────────┼──────────╣
║         │       │         │        │          ║
║  (empty table - belum ada data)               ║
║                                                ║
╚════════════════════════════════════════════════╝
```

### 2. Klik "Tambah Media":

```
╔════════════════════════════════════════════════╗
║ Tambah Media Galeri                       [X]  ║
╠════════════════════════════════════════════════╣
║                                                ║
║ Tipe Media: [🖼️ Gambar ▼]                     ║
║                                                ║
║ URL Media:                                     ║
║ [https://i.ibb.co/xxxxx/image.jpg        ]    ║
║                                                ║
║ Tips:                                          ║
║ • Gambar: Upload ke ImgBB, copy Direct Link   ║
║ • Video: YouTube embed URL                     ║
║                                                ║
║ Caption:                                       ║
║ [Deskripsi foto...                       ]    ║
║                                                ║
║ Urutan: [0]                                    ║
║                                                ║
║ ☑ Tampilkan di website                         ║
║                                                ║
║              [Batal]  [Simpan]                 ║
╚════════════════════════════════════════════════╝
```

### 3. Setelah Tambah Data:

```
╔════════════════════════════════════════════════╗
║ Galeri: Kopi Arabica      [+ Tambah Media]    ║
╠════════════════════════════════════════════════╣
║ Preview │ Tipe     │ Caption      │ Urutan    ║
╠─────────┼──────────┼──────────────┼───────────╣
║ [img]   │ 🖼️ Gambar│ Close-up kopi│    0      ║
║ [img]   │ 🖼️ Gambar│ Proses roast │   10      ║
║ [🎥]    │ 🎥 Video │ Behind scenes│   20      ║
╚════════════════════════════════════════════════╝
```

---

## 📝 Next Actions

**Setelah SQL dijalankan:**

1. ✅ Verify table `product_gallery` exist
2. ✅ Test dashboard: pilih produk → tabel muncul
3. ✅ Klik "Tambah Media" → modal form muncul
4. ✅ Upload gambar ke ImgBB
5. ✅ Paste URL → Simpan
6. ✅ Data muncul di tabel

**Jika masih ada masalah:**
- Screenshot console error (F12)
- Screenshot Supabase table list
- Kirim ke saya untuk di-debug

---

## 🎯 Summary

**Problem:** Dropdown muncul, tapi tabel galeri tidak muncul  
**Cause:** Table `product_gallery` belum dibuat di database  
**Solution:** Run SQL di Supabase SQL Editor  
**File SQL:** `ADD-PRODUCT-GALLERY.sql`  
**Expected:** Tabel muncul setelah pilih produk

**Status:**
- ✅ Dashboard UI: DONE
- ✅ JavaScript code: DONE
- ⏳ Database setup: **NEED TO RUN SQL** ← Anda di sini!

---

**Setelah run SQL, test lagi dan kabari saya hasilnya!** 🚀

