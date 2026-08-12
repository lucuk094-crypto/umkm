# 📋 FITUR BARU: Profil Detail Pengrajin

## ✅ Yang Sudah Ditambahkan

### 1. **Update Database Schema**
File: `UPDATE-PRODUCERS-TABLE.sql`

**Field Baru di Table `producers`:**
- `business_name` - Nama usaha/brand
- `business_status` - Status usaha (rumahan, kelompok, koperasi, dll)
- `owner_name` - Nama pemilik usaha
- `maker_name` - Nama pembuat produk
- `village` - Nama dusun
- `full_address` - Alamat lengkap
- `email` - Email kontak
- `instagram` - Username Instagram
- `facebook` - Facebook
- `description` - Deskripsi singkat (untuk card preview)
- `achievements` - Prestasi/pencapaian
- `products_offered` - Produk yang ditawarkan
- `slug` - URL slug untuk halaman detail (auto-generated dari name)

**Cara Menggunakan:**
1. Login ke Supabase
2. Buka SQL Editor
3. Copy-paste isi file `UPDATE-PRODUCERS-TABLE.sql`
4. Klik Run
5. ✅ Done! Table berhasil diupdate

---

### 2. **Halaman Detail Pengrajin**
File: `producer-detail.html`

**Fitur:**
- ✅ Hero section dengan foto profil besar
- ✅ Nama, role, dan badges (tahun mulai, jumlah tim, status usaha)
- ✅ Tombol WhatsApp langsung ke pengrajin
- ✅ Info card dengan 3 kategori:
  - **Identitas Usaha** (nama pemilik, nama usaha, pembuat, status)
  - **Kontak & Lokasi** (WhatsApp, email, alamat, dusun)
  - **Informasi Usaha** (tahun mulai, jumlah anggota, produk)
- ✅ Cerita usaha (storytelling)
- ✅ Prestasi & pencapaian
- ✅ Grid produk dari pengrajin tersebut
- ✅ Responsive design (mobile-friendly)
- ✅ Loading state & error handling

**URL Format:**
```
producer-detail.html?slug=ibu-siti-aminah
```

Slug auto-generated dari nama pengrajin (spasi jadi dash, lowercase).

---

### 3. **Update Homepage (`script.js`)**

**Perubahan pada `renderProducers()`:**
- ✅ Card pengrajin sekarang bisa **diklik** (kursor pointer)
- ✅ Hover effect (card naik sedikit saat di-hover)
- ✅ Tombol **"Lihat Profil Lengkap"** → ke halaman detail
- ✅ Tombol **"WhatsApp"** → langsung buka WA
- ✅ Deskripsi dipotong 120 karakter (dengan "...")
- ✅ Smooth transition saat hover

**User Experience:**
- Klik card → Buka profil lengkap
- Klik "Lihat Profil" → Buka profil lengkap
- Klik "WhatsApp" → Langsung chat WA (stop propagation, tidak ke profil)

---

### 4. **Update Dashboard Admin (`admin-script.js`)**

**Form Pengrajin Baru dengan Sections:**

**A. Informasi Dasar**
- Nama Lengkap *
- Peran/Profesi *
- Deskripsi Singkat (untuk preview card)

**B. Identitas Usaha**
- Nama Pemilik Usaha
- Nama Usaha/Brand
- Nama Pembuat Produk
- Status Usaha (dropdown: Rumahan, Kelompok, Koperasi, CV, PT)

**C. Kontak & Lokasi**
- Nomor WhatsApp
- Email
- Dusun
- Alamat Lengkap

**D. Informasi Usaha**
- Tahun Mulai Usaha
- Jumlah Anggota/Pengrajin
- Produk yang Ditawarkan
- Cerita Usaha (textarea)
- Prestasi & Pencapaian (textarea)

**E. Media**
- URL Foto Profil
- Instagram
- Facebook

**Fitur Form:**
- ✅ Scrollable modal (max-height 70vh)
- ✅ Section headers dengan styling gold
- ✅ Auto-generate slug dari nama
- ✅ Backward compatibility (tetap simpan ke field `address` lama)
- ✅ Validation & error handling
- ✅ Toast notification sukses/error

---

## 🚀 CARA MENGGUNAKAN

### Setup (Pertama Kali)

#### 1. Update Database
```sql
-- Jalankan di Supabase SQL Editor
-- Copy dari file: UPDATE-PRODUCERS-TABLE.sql
```

#### 2. Test Halaman Detail
1. Buka `index.html`
2. Scroll ke section "Profil Pengusaha"
3. Klik card pengrajin atau tombol "Lihat Profil Lengkap"
4. Akan redirect ke `producer-detail.html?slug=nama-pengrajin`

---

### Input Data Pengrajin Lengkap

#### Via Dashboard Admin:

1. **Login** ke `admin-login.html`

2. **Klik menu "Pengrajin"** di sidebar

3. **Klik "Tambah Pengrajin"** atau **Edit pengrajin existing**

4. **Isi form lengkap:**

**Section 1: Informasi Dasar**
```
Nama Lengkap: Ibu Siti Aminah
Peran/Profesi: Pengrajin Anyaman Bambu
Deskripsi Singkat: Memulai usaha anyaman sejak 2015. 
Mempekerjakan 8 warga desa dengan teknik tradisional.
```

**Section 2: Identitas Usaha**
```
Nama Pemilik: Siti Aminah
Nama Usaha: Anyaman Siti Berkah
Nama Pembuat: Ibu Siti dan Tim
Status Usaha: Kelompok Usaha
```

**Section 3: Kontak & Lokasi**
```
WhatsApp: 628123456789
Email: sitianinah@email.com
Dusun: Krajan
Alamat Lengkap: Dusun Krajan RT 02 RW 01, Desa Mlancu, Kec. Wonosalam
```

**Section 4: Informasi Usaha**
```
Tahun Mulai: 2015
Jumlah Anggota: 8
Produk Ditawarkan: Tas anyaman bambu, keranjang, tempat tisu
Cerita Usaha: 
Usaha anyaman bambu ini dimulai dari hobi membuat kerajinan...
[cerita panjang tentang perjalanan usaha]

Prestasi:
- Juara 1 Lomba UMKM Tingkat Kabupaten 2020
- Produk terpilih untuk dipamerkan di Jakarta Fair 2021
```

**Section 5: Media**
```
URL Foto: https://i.ibb.co/xxxx/siti-aminah.jpg
Instagram: @anyaman_siti
Facebook: anyaman.siti.berkah
```

5. **Klik "Simpan"**

6. **Test halaman detail:**
   - Buka `index.html`
   - Klik card "Ibu Siti Aminah"
   - Lihat profil lengkap muncul

---

## 📱 User Flow

### Flow 1: Dari Homepage ke Detail
```
Homepage 
  → Scroll ke "Profil Pengusaha"
  → Klik card pengrajin
  → Halaman detail terbuka
  → Lihat semua info lengkap
  → Klik "Hubungi via WhatsApp"
  → Buka WA pengrajin
```

### Flow 2: Lihat Produk Pengrajin
```
Halaman detail pengrajin
  → Scroll ke bawah
  → Section "Produk dari [Nama]"
  → Grid produk muncul
  → Klik "Pesan via WhatsApp"
  → Buka WA pengrajin untuk pesan produk
```

### Flow 3: Edit Data via Admin
```
Dashboard Admin
  → Menu "Pengrajin"
  → Klik icon Edit
  → Modal form terbuka
  → Edit field yang diperlukan
  → Klik "Update"
  → Refresh homepage
  → Data ter-update otomatis
```

---

## 🎨 Design Features

### Homepage Card (Preview)
- **Size:** 64x64px foto/inisial
- **Content:** Nama, role, deskripsi singkat (120 char)
- **Badges:** Tahun mulai, jumlah tim
- **Buttons:** "Lihat Profil Lengkap" (primary) + "WhatsApp" (ghost)
- **Hover:** Card naik 4px dengan transition
- **Clickable:** Seluruh card bisa diklik

### Detail Page (Full Profile)
- **Hero Section:**
  - 200x200px foto/inisial besar
  - Nama (3rem, gold)
  - Role (1.3rem, muted)
  - Badges (tahun, tim, status)
  - Deskripsi
  - Action buttons (WhatsApp + Back)

- **Info Cards (3 Grid):**
  - Border + glass effect
  - Icon + title (gold)
  - Key-value pairs
  - Responsive grid (auto-fit, 280px min)

- **Story Section:**
  - Full-width card
  - White-space pre-line (preserve line breaks)
  - Large text (line-height 1.8)

- **Products Grid:**
  - 3 columns responsive
  - Product cards sama dengan homepage
  - Order button langsung ke WA pengrajin

---

## ✅ Testing Checklist

### Database:
- [ ] SQL UPDATE berhasil dijalankan
- [ ] Field baru muncul di table `producers`
- [ ] Index `idx_producers_slug` dibuat

### Dashboard Admin:
- [ ] Form pengrajin menampilkan semua field baru
- [ ] Form scrollable (tidak overflow)
- [ ] Dropdown status usaha berfungsi
- [ ] Auto-generate slug dari nama
- [ ] Save berhasil (cek di Table Editor Supabase)
- [ ] Edit pengrajin existing tidak error
- [ ] Toast notification muncul

### Homepage:
- [ ] Card pengrajin bisa diklik
- [ ] Hover effect berfungsi
- [ ] Tombol "Lihat Profil" ke detail page
- [ ] Tombol "WhatsApp" buka WA (tidak ke detail)
- [ ] Deskripsi terpotong 120 char + "..."

### Detail Page:
- [ ] URL dengan slug berfungsi
- [ ] Data pengrajin load dengan benar
- [ ] Foto/inisial tampil
- [ ] Badges tampil
- [ ] WhatsApp button berfungsi
- [ ] Info cards tampil semua (3 grid)
- [ ] Cerita usaha tampil dengan line breaks
- [ ] Prestasi tampil (atau hidden jika kosong)
- [ ] Produk pengrajin load dan tampil
- [ ] Button "Pesan" di produk berfungsi
- [ ] Back button ke homepage
- [ ] Responsive di mobile

### Edge Cases:
- [ ] Slug tidak ada → redirect ke homepage
- [ ] Pengrajin tidak ditemukan → alert + redirect
- [ ] Foto kosong → tampilkan inisial
- [ ] Tidak ada produk → tampilkan pesan kosong
- [ ] Supabase belum setup → alert

---

## 🐛 Troubleshooting

### ❌ Error: Column "slug" does not exist
**Solusi:** Jalankan `UPDATE-PRODUCERS-TABLE.sql` di Supabase SQL Editor

### ❌ Halaman detail tidak load
**Solusi:** 
1. Cek console browser (F12)
2. Pastikan `config.js` sudah diisi
3. Cek apakah slug valid di URL
4. Cek data di Supabase → Table Editor → producers

### ❌ Card pengrajin tidak bisa diklik
**Solusi:**
1. Refresh browser (Ctrl+Shift+R)
2. Clear cache
3. Cek `script.js` sudah ter-update

### ❌ Form admin terlalu panjang
**Solusi:** Modal sudah dibuat scrollable (`max-height: 70vh; overflow-y: auto`)

### ❌ Slug tidak unique error
**Solusi:** 
- Slug auto-generated dari nama
- Jika ada 2 pengrajin nama sama, edit manual atau tambah angka
- Contoh: `ibu-siti-aminah-2`

---

## 📝 Notes Penting

1. **Slug Format:**
   - Auto-generated dari `name`
   - Lowercase, spasi jadi dash
   - Contoh: "Ibu Siti Aminah" → "ibu-siti-aminah"

2. **Backward Compatibility:**
   - Field lama (`address`, `story`) tetap disimpan
   - Website lama tetap berfungsi

3. **Optional Fields:**
   - Semua field kecuali `name` dan `role` optional
   - Form tetap bisa disimpan walau banyak kosong

4. **Performance:**
   - Index pada `slug` untuk query cepat
   - Lazy loading images
   - Intersection Observer untuk reveal animation

---

## 🎉 Summary

**Fitur Baru:**
✅ Halaman detail profil pengrajin lengkap
✅ 13 field data baru untuk identitas usaha
✅ Clickable cards di homepage
✅ Form admin yang lengkap & organized
✅ Auto-generate slug dari nama
✅ Grid produk per pengrajin
✅ Integrasi WhatsApp langsung
✅ Responsive & mobile-friendly
✅ Error handling & loading states

**Files Modified:**
- `UPDATE-PRODUCERS-TABLE.sql` (NEW)
- `producer-detail.html` (NEW)
- `script.js` (UPDATED)
- `admin-script.js` (UPDATED)
- `FITUR-PROFIL-PENGRAJIN.md` (NEW - ini file)

**Next Steps untuk User:**
1. Jalankan SQL update
2. Input data pengrajin lengkap via dashboard
3. Test klik card di homepage
4. Lihat profil detail
5. Share link profil ke pengrajin

**Happy coding! 🚀**
