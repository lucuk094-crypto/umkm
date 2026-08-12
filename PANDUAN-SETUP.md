# 🚀 PANDUAN SETUP LENGKAP
## Website UMKM Desa Mlancu dengan Dashboard Admin

---

## 📋 DAFTAR ISI
1. [Persiapan](#1-persiapan)
2. [Setup Database Supabase](#2-setup-database-supabase)
3. [Konfigurasi Website](#3-konfigurasi-website)
4. [Setup Admin Dashboard](#4-setup-admin-dashboard)
5. [Testing Website](#5-testing-website)
6. [Input Data Awal](#6-input-data-awal)
7. [Troubleshooting](#7-troubleshooting)

---

## 1️⃣ PERSIAPAN

### Yang Anda Butuhkan:
- ✅ Akun Supabase (gratis) - [Daftar di supabase.com](https://supabase.com)
- ✅ Browser modern (Chrome, Firefox, Edge)
- ✅ Text editor (VS Code, Notepad++, atau sejenisnya)
- ✅ Koneksi internet

### File-file Project:
```
web-cofee/
├── index.html              # Website utama (frontend)
├── script.js               # Logic website (fetch data dari Supabase)
├── styles.css              # Styling website
├── admin-login.html        # Halaman login admin
├── admin-dashboard.html    # Dashboard admin
├── admin-script.js         # Logic dashboard admin
├── admin-styles.css        # Styling dashboard admin
├── config.js               # ⚠️ PENTING: Konfigurasi Supabase
├── SETUP-DATABASE.md       # SQL untuk setup database
└── PANDUAN-SETUP.md        # File ini
```

---

## 2️⃣ SETUP DATABASE SUPABASE

### Langkah 1: Buat Project Baru
1. Login ke [supabase.com](https://supabase.com)
2. Klik **"New Project"**
3. Isi:
   - **Name**: `umkm-desa-mlancu` (atau nama bebas)
   - **Database Password**: Buat password kuat dan SIMPAN!
   - **Region**: Pilih yang terdekat (Southeast Asia)
4. Klik **"Create new project"**
5. Tunggu 2-3 menit sampai project selesai dibuat

### Langkah 2: Jalankan SQL Setup
1. Di dashboard Supabase, buka menu **"SQL Editor"** (ikon database di sidebar kiri)
2. Klik **"New Query"**
3. Buka file `SETUP-DATABASE.md` di project ini
4. **Copy SEMUA kode SQL** dari file tersebut
5. **Paste** ke SQL Editor di Supabase
6. Klik **"Run"** (atau tekan Ctrl+Enter)
7. Tunggu sampai muncul notifikasi **"Success"**

✅ **Selesai!** Database Anda sudah siap dengan 6 tabel:
- `producers` - Data pengrajin
- `products` - Data produk
- `gallery` - Foto galeri produksi
- `testimonials` - Testimoni pelanggan
- `orders` - Data pesanan
- `settings` - Pengaturan website

### Langkah 3: Setup Storage untuk Upload Gambar
1. Di dashboard Supabase, buka menu **"Storage"**
2. Klik **"Create a new bucket"**
3. Buat 3 buckets dengan pengaturan berikut:

**Bucket 1: products**
- Name: `products`
- Public bucket: ✅ **CENTANG** (biar gambar bisa diakses publik)
- Klik "Create bucket"

**Bucket 2: gallery**
- Name: `gallery`
- Public bucket: ✅ **CENTANG**
- Klik "Create bucket"

**Bucket 3: producers**
- Name: `producers`
- Public bucket: ✅ **CENTANG**
- Klik "Create bucket"

---

## 3️⃣ KONFIGURASI WEBSITE

### Langkah 1: Ambil Kredensial Supabase
1. Di dashboard Supabase, buka **"Project Settings"** (ikon gear di sidebar)
2. Pilih menu **"API"**
3. Copy dua nilai ini:
   - **Project URL** (contoh: `https://abc123xyz.supabase.co`)
   - **anon public** key (kunci panjang yang dimulai dengan `eyJ...`)

### Langkah 2: Edit File config.js
1. Buka file `config.js` dengan text editor
2. Ganti baris berikut:

**SEBELUM:**
```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
};
```

**SESUDAH:**
```javascript
const SUPABASE_CONFIG = {
  url: 'https://abc123xyz.supabase.co',  // ← Paste URL Anda
  anonKey: 'eyJhbGc...panjang_banget',   // ← Paste anon key Anda
};
```

3. **SAVE** file config.js

✅ **Konfigurasi selesai!** Website sudah terkoneksi ke database.

---

## 4️⃣ SETUP ADMIN DASHBOARD

### Langkah 1: Buat User Admin
1. Di dashboard Supabase, buka **"Authentication"** → **"Users"**
2. Klik **"Add user"** → Pilih **"Create new user"**
3. Isi:
   - **Email**: admin@desamlancu.id (atau email Anda)
   - **Password**: Buat password kuat (minimal 8 karakter)
   - **Auto Confirm User**: ✅ **CENTANG** (penting!)
4. Klik **"Create user"**

✅ User admin sudah dibuat!

### Langkah 2: Test Login Admin
1. Buka file `admin-login.html` di browser (double-click)
2. Login dengan:
   - Email: admin@desamlancu.id
   - Password: (password yang Anda buat)
3. Jika berhasil, akan redirect ke `admin-dashboard.html`

---

## 5️⃣ TESTING WEBSITE

### Test 1: Buka Website Utama
1. Buka file `index.html` di browser
2. Buka **Console** browser (tekan F12 → tab Console)
3. Perhatikan pesan di console:

**Jika Konfigurasi Benar:**
```
🚀 Initializing UMKM Desa Mlancu website...
✅ Products loaded: 0
✅ Producers loaded: 0
✅ Gallery loaded: 0
✅ Testimonials loaded: 0
✅ Settings loaded: 0
✅ All data loaded successfully!
```

**Jika Konfigurasi Belum Benar:**
```
⚠️ Supabase not configured. Using default data.
📝 Please configure config.js with your Supabase credentials.
⚠️ Using default products (Supabase not configured)
```

### Test 2: Cek Koneksi Database
Jika muncul error di console:
- ❌ `fetch to "https://YOUR_SUPABASE_URL" failed` → URL salah di config.js
- ❌ `Invalid API key` → Anon key salah di config.js
- ❌ `relation "products" does not exist` → SQL belum dijalankan

---

## 6️⃣ INPUT DATA AWAL

Sekarang database masih kosong. Isi data melalui dashboard admin:

### 1. Tambah Pengrajin (Producers)
1. Login ke admin dashboard
2. Klik menu **"Pengrajin"** di sidebar
3. Klik tombol **"+ Tambah Pengrajin"**
4. Isi form:
   - Nama Lengkap: Ibu Siti Aminah
   - Peran: Pengrajin Anyaman Bambu
   - Tahun Mulai: 2015
   - Jumlah Tim: 8
   - Cerita: Memulai usaha anyaman sejak 2015...
   - WhatsApp: 6281234567890
   - Alamat: Desa Mlancu
   - URL Foto: (opsional, bisa dari imgbb.com)
5. Klik **"Simpan"**

Ulangi untuk pengrajin lainnya (minimal 3).

### 2. Tambah Produk (Products)
1. Klik menu **"Produk"** di sidebar
2. Klik **"+ Tambah Produk"**
3. Isi form:
   - Nama: Keripik Singkong Pedas
   - Kategori: Makanan
   - Harga: 15000
   - Pembuat: Pilih "Ibu Siti Aminah"
   - Deskripsi: Keripik singkong renyah...
   - Proses: Singkong diiris tipis...
   - Bahan: Singkong lokal Desa Mlancu
   - Stok: 100
   - URL Gambar: https://... (upload ke imgbb.com atau Supabase Storage)
   - ✅ Produk Aktif: CENTANG
4. Klik **"Simpan"**

Ulangi untuk produk lainnya (minimal 5-6 produk).

### 3. Tambah Galeri (Gallery)
1. Klik menu **"Galeri"**
2. Klik **"+ Tambah Foto"**
3. Isi form:
   - Judul: Proses Pembuatan Anyaman
   - Deskripsi: Pengrajin sedang menganyam...
   - URL Foto: https://...
   - Kategori: proses_anyaman
   - Urutan: 1
   - ✅ Tampilkan: CENTANG
4. Klik **"Simpan"**

Tambahkan minimal 4 foto untuk tampilan gallery yang bagus.

### 4. Tambah Testimoni (Testimonials)
1. Klik menu **"Testimoni"**
2. Klik **"+ Tambah Testimoni"**
3. Isi form:
   - Nama: Ibu Siti Aminah
   - Peran: Pengrajin Anyaman Desa Mlancu
   - Testimoni: Platform ini sangat membantu...
   - Rating: 5
   - ✅ Tampilkan: CENTANG
4. Klik **"Simpan"**

Tambahkan 3-5 testimoni untuk carousel.

### 5. Edit Pengaturan (Settings)
1. Klik menu **"Pengaturan"**
2. Edit pengaturan berikut:
   - **whatsapp_number**: 6281234567890
   - **site_name**: UMKM Desa Mlancu
   - **address**: Balai Desa Mlancu, Jawa Timur
   - **email**: umkm@desamlancu.id
3. Klik **"Simpan Semua Pengaturan"**

---

## 7️⃣ TESTING AKHIR

### ✅ Checklist Testing:
1. **Refresh website utama** (index.html)
2. Cek di console: `✅ Products loaded: 6` (atau jumlah produk Anda)
3. **Produk muncul** di section "Katalog Produk"
4. **Profil Pengusaha** muncul dengan foto dan data yang benar
5. **Galeri Produksi** menampilkan 4 foto
6. **Testimoni carousel** berjalan otomatis
7. Klik tombol **"Pesan via WhatsApp"** → Buka WhatsApp dengan template pesan
8. **Filter produk** (Semua/Makanan/Kerajinan/Fashion) berfungsi
9. **Search produk** berfungsi
10. **Nomor WhatsApp** di footer sesuai dengan settings

### Upload ke Hosting (Opsional)
Jika ingin website online:
1. **Netlify**: Drag & drop folder project ke netlify.com/drop
2. **Vercel**: Push ke GitHub → import project di vercel.com
3. **GitHub Pages**: Push ke GitHub → aktifkan Pages di settings

---

## 8️⃣ TROUBLESHOOTING

### ❌ Problem: Website tidak menampilkan data dari database
**Solusi:**
1. Buka Console browser (F12)
2. Cek error message
3. Pastikan `config.js` sudah diisi dengan benar
4. Cek apakah SQL sudah dijalankan di Supabase

### ❌ Problem: Login admin gagal
**Solusi:**
1. Pastikan user sudah dibuat di Supabase Authentication
2. Centang "Auto Confirm User" saat buat user
3. Cek email dan password yang digunakan
4. Clear browser cache dan coba lagi

### ❌ Problem: Gambar tidak muncul
**Solusi:**
1. Pastikan URL gambar valid (coba buka di tab baru)
2. Upload gambar ke:
   - **ImgBB**: imgbb.com (gratis, unlimited)
   - **Supabase Storage**: bucket harus public
3. Gunakan URL lengkap (dimulai dengan https://)

### ❌ Problem: Data tidak muncul setelah input di dashboard
**Solusi:**
1. Refresh halaman admin dashboard
2. Cek apakah data tersimpan (buka tabel di Supabase → Table Editor)
3. Pastikan checkbox "Aktif/Tampilkan" dicentang
4. Refresh website utama (index.html)

### ❌ Problem: Console error "products is not defined"
**Solusi:**
- Pastikan Supabase script sudah dimuat
- Urutan script di index.html harus:
  1. `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`
  2. `<script src="config.js"></script>`
  3. `<script src="script.js" defer></script>`

---

## 🎉 SELESAI!

Website UMKM Desa Mlancu Anda sudah siap digunakan dengan fitur:
- ✅ Katalog produk dinamis dari database
- ✅ Profil pengrajin dengan cerita mereka
- ✅ Galeri produksi
- ✅ Testimoni pelanggan
- ✅ Dashboard admin untuk CRUD semua konten
- ✅ Integrasi WhatsApp untuk pemesanan
- ✅ Upload gambar via URL atau Supabase Storage
- ✅ Filter dan search produk
- ✅ Responsive design (mobile-friendly)

### 📞 Butuh Bantuan?
Jika ada masalah atau pertanyaan:
1. Cek file `SETUP-DATABASE.md` untuk referensi struktur database
2. Lihat console browser untuk error messages
3. Pastikan semua langkah setup sudah diikuti dengan benar

**Selamat menggunakan! 🎊**
