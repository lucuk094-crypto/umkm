# 🏘️ UMKM Desa Mlancu
## Platform Digital Jual Beli Produk Lokal

Website modern untuk mempromosikan dan memudahkan jual beli produk UMKM dari masyarakat Desa Mlancu. Dilengkapi dengan dashboard admin untuk mengelola konten secara mandiri.

![Version](https://img.shields.io/badge/version-2.0-blue)
![Status](https://img.shields.io/badge/status-production_ready-green)
![Database](https://img.shields.io/badge/database-Supabase-success)

---

## ✨ Fitur Utama

### 🌐 Website Publik (Frontend)
- **Katalog Produk Dinamis** - Produk ditampilkan dari database, bisa difilter dan search
- **Profil Pengrajin** - Kenali pembuat produk dengan cerita mereka
- **Galeri Produksi** - Foto proses pembuatan produk
- **Testimoni Pelanggan** - Carousel testimoni otomatis
- **Integrasi WhatsApp** - Pemesanan langsung via WhatsApp dengan template pesan
- **Responsive Design** - Tampilan optimal di desktop, tablet, dan mobile
- **Dark Theme** - Desain elegan dengan accent gold

### 🔐 Dashboard Admin
- **CRUD Lengkap** untuk:
  - ✅ Produk (nama, harga, kategori, stok, gambar, pembuat, proses, bahan)
  - ✅ Pengrajin (profil, cerita usaha, kontak, foto)
  - ✅ Galeri (foto proses produksi, urutan tampilan)
  - ✅ Testimoni (nama, pesan, rating)
  - ✅ Pesanan (tracking status pesanan)
  - ✅ Pengaturan (WhatsApp, alamat, email)
- **Authentication** - Login secure dengan Supabase Auth
- **Dashboard Statistics** - Ringkasan data produk, pengrajin, galeri, pesanan
- **User-Friendly Interface** - Desain matching dengan website utama

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3 (Custom), Vanilla JavaScript
- **Backend/Database**: [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (untuk upload gambar)
- **Font**: Google Fonts (Playfair Display, Inter, Dancing Script)
- **Icons**: Custom SVG icons

---

## 📁 Struktur File

```
web-cofee/
│
├── 🌐 FRONTEND (Website Publik)
│   ├── index.html          # Halaman utama
│   ├── script.js           # Logic + fetch data dari Supabase
│   └── styles.css          # Styling website
│
├── 🔐 ADMIN DASHBOARD
│   ├── admin-login.html    # Halaman login admin
│   ├── admin-dashboard.html # Dashboard untuk CRUD
│   ├── admin-script.js     # Logic dashboard + CRUD operations
│   └── admin-styles.css    # Styling dashboard (matching dengan website)
│
├── ⚙️ KONFIGURASI
│   └── config.js           # Kredensial Supabase (URL & API Key)
│
├── 📖 DOKUMENTASI
│   ├── README.md           # File ini
│   ├── PANDUAN-SETUP.md    # Tutorial setup lengkap step-by-step
│   └── SETUP-DATABASE.md   # SQL untuk setup database Supabase
│
└── 🖼️ ASSETS
    └── assets/
        └── assets/         # Gambar produk, galeri, hero

```

---

## 🚀 Quick Start

### Prasyarat
- Akun [Supabase](https://supabase.com) (gratis)
- Browser modern (Chrome, Firefox, Edge)
- Text editor (VS Code, Notepad++, dll)

### Setup dalam 5 Langkah

#### 1️⃣ Clone/Download Project
```bash
git clone <repo-url>
cd web-cofee
```

#### 2️⃣ Setup Database Supabase
1. Login ke [supabase.com](https://supabase.com)
2. Buat project baru
3. Buka **SQL Editor**
4. Copy-paste semua SQL dari file `SETUP-DATABASE.md`
5. Klik **Run**

#### 3️⃣ Konfigurasi API Key
1. Di Supabase, buka **Project Settings** → **API**
2. Copy **Project URL** dan **anon public key**
3. Edit file `config.js`:
```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',     // ← Paste URL Anda
  anonKey: 'eyJhbGc...your-anon-key',          // ← Paste anon key
};
```

#### 4️⃣ Buat Admin User
1. Di Supabase, buka **Authentication** → **Users**
2. Klik **Add user** → **Create new user**
3. Isi email & password
4. ✅ Centang **Auto Confirm User**

#### 5️⃣ Buka Website
- **Website Publik**: Buka `index.html` di browser
- **Admin Dashboard**: Buka `admin-login.html` → Login dengan email/password admin

✅ **Done!** Website sudah bisa digunakan.

> 📚 **Panduan Lengkap**: Lihat file `PANDUAN-SETUP.md` untuk tutorial detail step-by-step dengan screenshot.

---

## 📊 Database Schema

### Tabel-tabel:
1. **products** - Data produk (nama, harga, kategori, gambar, pembuat, proses, bahan, stok)
2. **producers** - Profil pengrajin (nama, role, cerita, WhatsApp, foto, tim)
3. **gallery** - Galeri foto produksi (gambar, judul, deskripsi, kategori, urutan)
4. **testimonials** - Testimoni pelanggan (nama, pesan, rating, role)
5. **orders** - Data pesanan (customer, produk, jumlah, total, status)
6. **settings** - Pengaturan website (WhatsApp, alamat, email, nama site)

### Storage Buckets:
- `products` - Gambar produk
- `gallery` - Foto galeri
- `producers` - Foto pengrajin

> Detail lengkap schema ada di `SETUP-DATABASE.md`

---

## 🎨 Cara Menggunakan Dashboard Admin

### Login Admin
1. Buka `admin-login.html`
2. Login dengan email & password yang dibuat di Supabase

### Tambah Produk Baru
1. Login ke dashboard
2. Klik menu **"Produk"** di sidebar
3. Klik **"+ Tambah Produk"**
4. Isi form (nama, harga, kategori, deskripsi, gambar, dll)
5. Klik **"Simpan"**
6. Refresh website utama → Produk langsung muncul

### Edit Produk
1. Di halaman Produk, klik icon **✏️ Edit**
2. Ubah data yang diinginkan
3. Klik **"Update"**

### Hapus Produk
1. Klik icon **🗑️ Hapus**
2. Konfirmasi hapus

> Sama untuk Pengrajin, Galeri, Testimoni, dan Pesanan.

---

## 📱 Integrasi WhatsApp

### Cara Kerja:
1. User klik tombol **"Pesan via WhatsApp"** di produk
2. Otomatis buka WhatsApp dengan template pesan:
```
Halo, saya tertarik untuk memesan:

*Nama Produk*
Harga: Rp XX.XXX
Pembuat: Nama Pengrajin

Mohon informasi lebih lanjut mengenai ketersediaan dan pengiriman. Terima kasih!
```
3. User tinggal kirim pesan

### Ubah Nomor WhatsApp:
1. Login dashboard admin
2. Klik menu **"Pengaturan"**
3. Edit **whatsapp_number** (format: 6281234567890)
4. Klik **"Simpan"**
5. Refresh website → Nomor WA ter-update otomatis

---

## 🖼️ Upload Gambar

### Opsi 1: Upload ke Supabase Storage
1. Di dashboard Supabase, buka **Storage**
2. Pilih bucket (products/gallery/producers)
3. Klik **Upload file**
4. Copy **Public URL** gambar
5. Paste URL di form admin dashboard

### Opsi 2: Upload ke ImgBB (Gratis Unlimited)
1. Buka [imgbb.com](https://imgbb.com)
2. Upload gambar
3. Copy **Direct link**
4. Paste URL di form admin dashboard

---

## 🌍 Deploy ke Hosting

### Netlify (Recommended)
1. Buka [netlify.com/drop](https://app.netlify.com/drop)
2. Drag & drop folder project
3. Tunggu deploy selesai
4. Website langsung online!

### Vercel
1. Push project ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Deploy otomatis

### GitHub Pages
1. Push ke GitHub repository
2. Settings → Pages → Enable
3. Website online di `username.github.io/repo-name`

> ⚠️ **Penting**: Jangan lupa isi `config.js` sebelum deploy!

---

## 🐛 Troubleshooting

### Website tidak menampilkan data
**Cek:**
- ✅ Apakah `config.js` sudah diisi dengan benar?
- ✅ Apakah SQL sudah dijalankan di Supabase?
- ✅ Buka Console browser (F12) → Lihat error message

### Login admin gagal
**Cek:**
- ✅ Apakah user sudah dibuat di Supabase Authentication?
- ✅ Apakah **Auto Confirm User** sudah dicentang?
- ✅ Clear browser cache

### Gambar tidak muncul
**Cek:**
- ✅ URL gambar valid? (buka di tab baru)
- ✅ Bucket di Supabase Storage sudah public?
- ✅ URL lengkap (dimulai dengan https://)?

> 📖 **Troubleshooting Lengkap**: Lihat section Troubleshooting di `PANDUAN-SETUP.md`

---

## 📈 Roadmap & Future Features

- [ ] Upload gambar langsung dari dashboard (tanpa URL)
- [ ] Export data ke Excel/CSV
- [ ] Laporan penjualan & statistik
- [ ] Multi-user admin dengan role (super admin, editor, viewer)
- [ ] Notifikasi email untuk pesanan baru
- [ ] Payment gateway integration (Midtrans, Xendit)
- [ ] Rating & review dari customer
- [ ] Wishlist & cart functionality yang tersimpan

---

## 📄 Lisensi

Project ini dibuat untuk UMKM Desa Mlancu. Free to use dan modify sesuai kebutuhan.

---

## 🤝 Kontributor

Dibuat dengan ❤️ untuk mendukung ekonomi masyarakat Desa Mlancu.

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Baca `PANDUAN-SETUP.md` untuk tutorial lengkap
2. Cek `SETUP-DATABASE.md` untuk referensi database
3. Lihat Console browser untuk error messages

---

**🎊 Selamat menggunakan website UMKM Desa Mlancu!**

*Dukung produk lokal, dukung ekonomi desa* 🏘️✨
