# 🔧 FIX DASHBOARD ADMIN - STEP BY STEP

## 📊 Status Saat Ini

✅ **Website**: https://umkm-gules.vercel.app/ (sudah deploy & berjalan)  
✅ **Dashboard**: https://umkm-gules.vercel.app/admin-login.html  
✅ **Database**: Tables sudah dibuat di Supabase  
✅ **Code**: Semua file sudah di-push ke GitHub  
❌ **Storage Buckets**: **BELUM DIBUAT** ← ini penyebab dashboard error!

---

## 🎯 Yang Harus Dilakukan

Dashboard tidak bisa diklik karena **Storage Buckets belum dibuat**. Tanpa buckets, dashboard akan error saat mencoba load data atau upload gambar.

**Solusi**: Ikuti 3 langkah di bawah (15 menit total)

---

## 📝 LANGKAH 1: Fix Database Policies (5 menit)

1. Login ke Supabase: https://supabase.com/dashboard/project/jrbvxdstpobmfavurvsh
2. Klik **SQL Editor** di sidebar
3. Klik **New query**
4. Buka file lokal: `FIX-DATABASE-COMPLETE.sql`
5. Copy semua isinya, paste ke SQL Editor
6. Klik **RUN** atau tekan `Ctrl+Enter`
7. Tunggu sampai muncul: `✅ Database policies fixed!`

**Apa yang dilakukan**: Mengfix RLS policies agar admin bisa CRUD data dengan benar.

---

## 🗂️ LANGKAH 2: Buat Storage Buckets (10 menit) ⚠️ PENTING!

Ini langkah **PALING PENTING**. Tanpa buckets, upload gambar tidak akan berfungsi.

### A. Buat Bucket: `products`

1. Di Supabase Dashboard, klik **Storage** di sidebar
2. Klik tombol **Create a new bucket** (tombol biru)
3. Isi form:
   ```
   Name: products
   Public bucket: ✅ CENTANG (sangat penting!)
   File size limit: 5242880 (5MB)
   Allowed MIME types: image/jpeg,image/jpg,image/png,image/gif,image/webp
   ```
4. Klik **Create bucket**
5. **Verifikasi**: Bucket `products` harus muncul di list dengan label "Public"

### B. Buat Bucket: `producers`

1. Klik tombol **Create a new bucket** lagi
2. Isi form:
   ```
   Name: producers
   Public bucket: ✅ CENTANG (sangat penting!)
   File size limit: 5242880 (5MB)
   Allowed MIME types: image/jpeg,image/jpg,image/png,image/gif,image/webp
   ```
3. Klik **Create bucket**

### C. Buat Bucket: `gallery`

1. Klik tombol **Create a new bucket** lagi
2. Isi form:
   ```
   Name: gallery
   Public bucket: ✅ CENTANG (sangat penting!)
   File size limit: 5242880 (5MB)
   Allowed MIME types: image/jpeg,image/jpg,image/png,image/gif,image/webp
   ```
3. Klik **Create bucket**

**Hasil akhir**: Harus ada 3 buckets (products, producers, gallery) semua dengan label "Public"

---

## 👤 LANGKAH 3: Verifikasi User Admin Exists

1. Di Supabase Dashboard, klik **Authentication** → **Users**
2. Cek apakah ada user: **admin@desamlancu.id**
3. **Jika ada**: ✅ Skip ke langkah 4
4. **Jika tidak ada**: Klik **Add user** → **Create new user**
   ```
   Email: admin@desamlancu.id
   Password: AdminUMKM@02!
   Auto Confirm User: ✅ CENTANG
   ```
5. Klik **Create user**

---

## ✅ LANGKAH 4: Test Dashboard

1. Buka: https://umkm-gules.vercel.app/admin-login.html
2. Login dengan:
   - **Email**: `admin@desamlancu.id`
   - **Password**: `AdminUMKM@02!`
3. Setelah login, test fitur:
   - ✅ Klik menu **Dashboard** → harus muncul stats (Total Produk, Pengrajin, dll)
   - ✅ Klik menu **Produk** → klik **Tambah Produk** → form harus muncul
   - ✅ Klik menu **Pengrajin** → klik **Tambah Pengrajin** → form harus muncul
   - ✅ Klik menu **Galeri** → klik **Tambah Foto** → form harus muncul
   - ✅ Test drag & drop gambar di form → harus bisa upload

**Jika semua di atas berfungsi = SELESAI! 🎉**

---

## 🐛 Jika Masih Error

### Error: "Dashboard menu tidak bisa diklik"
- **Penyebab**: Buckets belum dibuat atau nama salah
- **Solusi**: Verifikasi 3 buckets sudah dibuat dengan nama persis: `products`, `producers`, `gallery` (huruf kecil semua, no typo!)

### Error: "Upload gambar gagal"
- **Penyebab**: Bucket tidak public
- **Solusi**: 
  1. Klik bucket di Storage
  2. Klik **Settings**
  3. Pastikan **Public** = ON
  4. Save

### Error di Console Browser
1. Tekan `F12` untuk buka Console
2. Screenshot semua error (teks merah)
3. Kirim screenshot ke saya

---

## 📋 Checklist Final

Sebelum selesai, pastikan semua ini sudah ✅:

- [ ] SQL `FIX-DATABASE-COMPLETE.sql` sudah di-run (cek di SQL Editor history)
- [ ] Bucket `products` sudah dibuat dan **Public**
- [ ] Bucket `producers` sudah dibuat dan **Public**
- [ ] Bucket `gallery` sudah dibuat dan **Public**
- [ ] User `admin@desamlancu.id` exists di Authentication
- [ ] Login dashboard berhasil
- [ ] Klik menu Dashboard → stats muncul
- [ ] Klik menu Produk → table muncul, tombol Tambah berfungsi
- [ ] Klik menu Pengrajin → table muncul, tombol Tambah berfungsi
- [ ] Klik menu Galeri → grid muncul, tombol Tambah berfungsi
- [ ] Upload gambar via drag & drop berfungsi

---

## 🚀 Deployment

Code sudah otomatis deploy ke Vercel setiap kali push ke GitHub. 

**URL Production**: https://umkm-gules.vercel.app/

Tidak perlu deploy manual lagi!

---

## 💡 Tips

- **Nama bucket harus EXACT**: `products`, `producers`, `gallery` (lowercase, no spaces)
- **Bucket harus PUBLIC**: Jika tidak public, gambar tidak bisa diakses dari website
- **File size limit**: Default 5MB sudah cukup untuk foto produk
- **MIME types**: Hanya gambar yang diizinkan (jpg, png, gif, webp)

---

## 📚 Files Penting

1. **FIX-DATABASE-COMPLETE.sql** → SQL untuk fix policies
2. **CARA-FIX-DASHBOARD.md** → Panduan detail step-by-step
3. **INSTRUKSI-PENTING.md** → Ringkasan singkat
4. **README-FIX-DASHBOARD.md** → File ini (panduan lengkap)

---

**Total waktu**: ~15 menit  
**Setelah selesai**: Dashboard 100% fungsional untuk manage website!
