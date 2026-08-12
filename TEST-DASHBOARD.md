# 🧪 TEST DASHBOARD - Cek Cepat

## ✅ LANGKAH TEST

### 1. Clear Cache Browser (PENTING!)
Tekan `Ctrl + Shift + R` atau `Ctrl + F5` untuk hard refresh

### 2. Login Dashboard
- Buka: https://umkm-gules.vercel.app/admin-login.html
- Email: `admin@desamlancu.id`
- Password: `AdminUMKM@02!`
- Klik **Login**

### 3. Buka Console Browser
Tekan `F12` → tab **Console**

### 4. Test Navigasi
Klik menu satu per satu:
- ✅ Dashboard
- ✅ Produk
- ✅ Pengrajin
- ✅ Galeri
- ✅ Testimoni
- ✅ Pesanan
- ✅ Pengaturan

**Seharusnya**:
- Menu bisa diklik (tidak freeze)
- Halaman berubah ketika diklik
- Tidak ada error di Console

### 5. Test Tombol "Tambah"
Klik menu **Produk** → Klik tombol **Tambah Produk**

**Seharusnya**:
- Modal popup muncul
- Form bisa diisi
- Ada area drag & drop gambar

---

## 🐛 Jika Masih Error

### Error 1: Menu tidak bisa diklik
**Solusi**: Clear cache (Ctrl + Shift + R)

### Error 2: Console error "supabase is not defined"
**Penyebab**: Supabase client belum initialize
**Check**:
1. Buka Console
2. Ketik: `window.supabase`
3. Jika `undefined` → config.js tidak load atau error

**Solusi**:
- Refresh page
- Check apakah file config.js ter-load (tab Sources → cari config.js)

### Error 3: Tombol "Tambah" tidak muncul
**Penyebab**: Bucket belum dibuat
**Solusi**: Pastikan 3 buckets sudah dibuat di Supabase (products, producers, gallery)

---

## 📸 Screenshot Yang Diperlukan (Jika Error)

Jika masih error, kirim screenshot:
1. **Browser Console** (tekan F12) → screenshot semua error merah
2. **Supabase Storage** → screenshot list buckets
3. **Dashboard screen** → screenshot halaman yang bermasalah

---

## ⚡ Quick Fix Checklist

- [ ] Sudah clear cache browser (Ctrl + Shift + R)
- [ ] Sudah login dengan benar
- [ ] Console tidak ada error merah
- [ ] Menu Dashboard, Produk, Pengrajin bisa diklik
- [ ] Tombol "Tambah Produk" bisa diklik dan modal muncul
- [ ] 3 Buckets (products, producers, gallery) sudah dibuat di Supabase Storage
- [ ] Bucket semua dalam status **Public**

Jika semua ✅ → **DASHBOARD BERFUNGSI!** 🎉
