# 🚨 INSTRUKSI PENTING - BACA INI DULU!

## ❌ MASALAH SAAT INI
Dashboard admin **tidak bisa diklik** karena **Storage Buckets belum dibuat di Supabase**.

## ✅ SOLUSI (Ikuti urutan ini!)

### 1️⃣ Buka file: `CARA-FIX-DASHBOARD.md`
File ini berisi **step-by-step lengkap** cara fix dashboard.

### 2️⃣ Ringkasan Cepat:

**A. Fix Database Policies** (5 menit)
- Buka Supabase SQL Editor
- Run file `FIX-DATABASE-COMPLETE.sql`
- Tunggu sampai selesai

**B. Buat 3 Storage Buckets** (10 menit) - **INI YANG PALING PENTING!**
- Bucket 1: `products` (public)
- Bucket 2: `producers` (public)  
- Bucket 3: `gallery` (public)

**C. Verifikasi User Admin**
- Email: admin@desamlancu.id
- Password: AdminUMKM@02!

**D. Test Dashboard**
- Login: https://umkm-gules.vercel.app/admin-login.html
- Coba klik menu dan upload gambar

---

## 📁 FILE YANG SUDAH SAYA BUAT

1. **FIX-DATABASE-COMPLETE.sql** → SQL untuk fix policies
2. **CARA-FIX-DASHBOARD.md** → Panduan lengkap step-by-step
3. **script.js** → Sudah difix (testimonials field)

Semua file sudah di-push ke GitHub dan auto-deploy ke Vercel!

---

## ⏱️ Total Waktu: ~15 menit

Setelah selesai, dashboard akan **100% berfungsi**:
- ✅ Semua menu bisa diklik
- ✅ Drag & drop upload gambar work
- ✅ CRUD produk, pengrajin, galeri, testimoni work
- ✅ Manajemen pesanan work

---

## 🐛 Jika Masih Error?

1. Screenshot error di browser console (F12)
2. Screenshot bucket list di Supabase Storage
3. Kirim ke saya untuk diagnose lebih lanjut

---

**PENTING**: Jangan skip langkah membuat storage buckets! Tanpa buckets, upload gambar tidak akan berfungsi dan dashboard akan error.
