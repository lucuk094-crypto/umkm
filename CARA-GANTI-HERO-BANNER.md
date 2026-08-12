# Cara Ganti Hero Banner (Gambar Besar di Homepage)

## 🖼️ Lokasi Gambar Hero Banner

Gambar hero banner (gambar kopi besar di halaman utama) ada di file:
- **File**: `index.html`
- **Baris**: 72
- **URL saat ini**: `https://i.ibb.co/84zR6qfT/hero-img.png`

---

## ✅ Cara 1: Ganti Langsung di Database (RECOMMENDED)

### Step 1: Upload Gambar Baru
1. Upload gambar ke hosting (ImgBB, Cloudinary, atau Supabase Storage)
2. Copy URL gambar yang sudah diupload

### Step 2: Update di Supabase
1. Buka **Supabase Dashboard** → Table Editor
2. Pilih table **`settings`**
3. Cari row dengan key = `hero_banner_url`
4. Ubah value dengan URL gambar baru
5. **Save**
6. Refresh website → Gambar hero otomatis berubah!

### Step 3: (Optional) Setup di Dashboard Admin
Nanti akan ada menu **Site Settings** di dashboard admin untuk upload hero banner tanpa perlu ke Supabase manual.

---

## 🔧 Cara 2: Ganti Manual di Code

### Jika Anda ingin ganti langsung di code:

1. **Buka file**: `index.html`

2. **Cari baris ini** (sekitar baris 72):
```html
<img src="https://i.ibb.co/84zR6qfT/hero-img.png" alt="Hero Banner" class="hero-bg" fetchpriority="high" id="heroBanner" />
```

3. **Ganti URL** dengan URL gambar baru Anda:
```html
<img src="URL_GAMBAR_BARU_ANDA" alt="Hero Banner" class="hero-bg" fetchpriority="high" id="heroBanner" />
```

4. **Save**, lalu commit & push ke Git:
```bash
git add index.html
git commit -m "Update hero banner image"
git push
```

5. Tunggu Vercel deploy selesai (1-2 menit)

---

## 📐 Rekomendasi Ukuran Gambar

Untuk hasil terbaik, gunakan gambar dengan:
- **Ukuran**: 1920x1080px (landscape)
- **Format**: JPG atau PNG
- **File size**: Max 500KB (untuk loading cepat)
- **Orientasi**: Landscape (horizontal)
- **Fokus subjek**: Di sebelah kanan gambar (karena text di kiri)

---

## 🎨 Tips Memilih Gambar Hero

1. **Gunakan gambar berkualitas tinggi** - tidak blur atau pecah
2. **Subjek di sisi kanan** - karena text hero di sebelah kiri
3. **Kontras yang baik** - agar text tetap terbaca
4. **Relevan dengan produk** - gambar produk UMKM atau proses pembuatan
5. **Hindari terlalu ramai** - agar tidak mengganggu focus ke text

---

## 🗂️ Gambar Website Lain yang Bisa Diganti

Selain hero banner, gambar-gambar ini juga bisa diganti via settings:

| Gambar | Lokasi di Code | Setting Key |
|--------|---------------|-------------|
| Hero Banner | `index.html` baris 72 | `hero_banner_url` |
| About Image | `index.html` baris 120 | `about_image_url` |
| Gallery 1-4 | `index.html` baris 271-274 | Manual di code |
| Product Images | Database `products` table | `image_url` column |

---

## 🚀 Upload Gambar ke Supabase Storage

### Cara Upload ke Supabase:

1. Buka **Supabase Dashboard** → Storage
2. Pilih bucket **`site-assets`** (kalau belum ada, buat dulu sebagai PUBLIC bucket)
3. Klik **Upload file**
4. Pilih gambar hero banner baru
5. Setelah upload, klik gambar → **Copy URL**
6. Paste URL ke table `settings` dengan key `hero_banner_url`

### Buat Bucket Baru (jika belum ada):
1. Storage → **New bucket**
2. Name: `site-assets`
3. Public: **YES** ✅
4. **Create bucket**

---

## ✨ Next: Dashboard Admin untuk Ganti Gambar

Akan saya buatkan fitur di **Dashboard Admin** dengan:
- [ ] Menu "Site Settings"
- [ ] Upload hero banner langsung dari dashboard
- [ ] Preview gambar sebelum save
- [ ] Crop/resize image
- [ ] Upload multiple images untuk slideshow hero (future)

**Mau saya buatkan sekarang?** 🚀
