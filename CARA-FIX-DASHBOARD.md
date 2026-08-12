# 🔧 CARA FIX DASHBOARD ADMIN

Dashboard admin tidak bisa diklik karena **Storage Buckets belum dibuat**. Ikuti langkah ini:

---

## ✅ LANGKAH 1: Fix Database Policies

1. Buka **Supabase Dashboard**: https://supabase.com/dashboard/project/jrbvxdstpobmfavurvsh
2. Klik menu **SQL Editor** di sidebar kiri
3. Klik **New Query**
4. Copy semua isi file `FIX-DATABASE-COMPLETE.sql`
5. Paste ke SQL Editor
6. Klik tombol **RUN** (atau tekan Ctrl+Enter)
7. Pastikan ada pesan sukses: `✅ Database policies fixed!`

---

## ✅ LANGKAH 2: Buat Storage Buckets (PALING PENTING!)

### **A. Buat Bucket: products**
1. Buka menu **Storage** di Supabase Dashboard
2. Klik tombol **Create a new bucket**
3. Isi form:
   - **Name**: `products` (persis seperti ini, huruf kecil semua)
   - **Public bucket**: ✅ **CENTANG** (harus public!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
4. Klik **Create bucket**

### **B. Buat Bucket: producers**
1. Klik tombol **Create a new bucket** lagi
2. Isi form:
   - **Name**: `producers` (persis seperti ini, huruf kecil semua)
   - **Public bucket**: ✅ **CENTANG** (harus public!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
3. Klik **Create bucket**

### **C. Buat Bucket: gallery**
1. Klik tombol **Create a new bucket** lagi
2. Isi form:
   - **Name**: `gallery` (persis seperti ini, huruf kecil semua)
   - **Public bucket**: ✅ **CENTANG** (harus public!)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/gif, image/webp`
3. Klik **Create bucket**

---

## ✅ LANGKAH 3: Verifikasi User Exists

1. Buka menu **Authentication** → **Users**
2. Pastikan ada user dengan email: **admin@desamlancu.id**
3. Jika tidak ada, klik **Add user** → **Create new user**:
   - Email: `admin@desamlancu.id`
   - Password: `AdminUMKM@02!`
   - Auto Confirm User: ✅ CENTANG
4. Klik **Create user**

---

## ✅ LANGKAH 4: Verifikasi Environment Variables di Vercel

**PENTING**: `config.js` sudah dihapus dari GitHub untuk keamanan. Pastikan environment variables sudah di-set di Vercel:

1. Buka **Vercel Dashboard**: https://vercel.com/
2. Pilih project **umkm**
3. Klik **Settings** → **Environment Variables**
4. Pastikan ada 2 variables:
   - `VITE_SUPABASE_URL` = `https://jrbvxdstpobmfavurvsh.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGci...` (anon key lengkap)
5. Jika belum ada, tambahkan sekarang
6. **Redeploy** project (Settings → Deployments → klik titik 3 → Redeploy)

Vercel akan auto-deploy dalam 1-2 menit.

---

## ✅ LANGKAH 5: Test Dashboard

1. Buka: **https://umkm-gules.vercel.app/admin-login.html**
2. Login dengan:
   - Email: `admin@desamlancu.id`
   - Password: `AdminUMKM@02!`
3. Klik menu **Produk**, **Pengrajin**, **Galeri**, dll
4. Coba klik tombol **Tambah Produk** → Drag & drop gambar
5. Pastikan semua berfungsi!

---

## 🐛 Jika Masih Error

1. **Buka Browser Console** (tekan F12)
2. **Screenshot semua error** yang muncul (warna merah)
3. Kirim screenshot ke saya

---

## 📌 Checklist

- [ ] Run SQL `FIX-DATABASE-COMPLETE.sql`
- [ ] Buat bucket `products` (public)
- [ ] Buat bucket `producers` (public)
- [ ] Buat bucket `gallery` (public)
- [ ] Verifikasi user `admin@desamlancu.id` exists
- [ ] Login ke dashboard berhasil
- [ ] Klik menu dashboard (Products, Producers, Gallery) berfungsi
- [ ] Drag & drop upload gambar berfungsi

---

**PENTING**: Bucket **HARUS PUBLIC** dan nama **HARUS PERSIS** (products, producers, gallery - huruf kecil semua, no typo!)
