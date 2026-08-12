# 📎 Fitur Upload via URL - Site Assets

## ✅ Fitur Baru: Upload Gambar via URL

Sekarang ada **2 cara** untuk set gambar di Site Assets Dashboard:

### 1️⃣ **Upload File** (Seperti biasa)
- Klik tombol "Upload File"
- Pilih file dari komputer
- File diupload ke Supabase Storage
- Max 2MB

### 2️⃣ **Paste URL** (Baru! ✨)
- Paste link gambar langsung (dari imgbb, imgur, cloudinary, dll)
- Klik "Set URL"
- Langsung tersimpan dan tampil preview
- Tidak ada limit ukuran
- Lebih cepat (tidak perlu upload)

---

## 🎯 Kapan Pakai URL?

### Pakai **URL** jika:
✅ Gambar sudah ada di hosting (imgbb, imgur, etc)
✅ File terlalu besar untuk upload (>2MB)
✅ Mau lebih cepat (tidak perlu upload)
✅ Gambar dari website lain yang bisa diakses public

### Pakai **Upload File** jika:
✅ Gambar ada di komputer lokal
✅ Belum punya hosting gambar
✅ Mau full control (stored di Supabase Storage sendiri)

---

## 📋 Cara Pakai: Upload via URL

### Step 1: Copy URL Gambar
Dapatkan link gambar dari:
- **ImgBB:** https://imgbb.com (free image hosting)
- **Imgur:** https://imgur.com
- **Cloudinary:** https://cloudinary.com
- **Supabase Storage:** (dari upload sebelumnya)
- Website lain (pastikan public & HTTPS)

### Step 2: Paste URL di Dashboard
1. Login ke Dashboard Admin
2. Klik menu **"Site Settings"**
3. Scroll ke section yang mau diganti (Hero Banner / About Image / Logo)
4. Di field **"Atau paste URL gambar:"**, paste link
5. Klik **"Set URL"**

### Step 3: Preview & Save
- Preview gambar muncul otomatis
- URL tersimpan di database
- Website langsung update (hard refresh: Ctrl+Shift+R)

---

## 🖼️ Contoh URL yang Valid

### ✅ Format Benar:
```
https://i.ibb.co/abc123/image.jpg
https://imgur.com/xyz456.png
https://res.cloudinary.com/demo/image/upload/sample.jpg
https://your-domain.supabase.co/storage/v1/object/public/site-assets/hero.jpg
```

### ❌ Format Salah:
```
http://example.com/image.jpg  ❌ (harus HTTPS)
/images/photo.png  ❌ (bukan full URL)
C:\Users\Pictures\photo.jpg  ❌ (local file path)
```

---

## 🔧 Fitur Validasi

### Auto-Check saat Set URL:

1. **Format URL Check** ✅
   - URL harus valid format (https://...)
   - Toast error kalau format salah

2. **Image Extension Check** ⚠️
   - Warning kalau URL tidak berakhir `.jpg`, `.png`, dll
   - Tetap bisa lanjut kalau yakin (confirmation)

3. **Image Load Test** 🖼️
   - Test load gambar dulu sebelum save
   - Gagal kalau:
     * Image tidak exist / 404
     * CORS blocked
     * Network error

4. **Preview Update** 👁️
   - Preview langsung update kalau berhasil
   - URL tersimpan di database
   - Clear input setelah success

---

## 🐛 Troubleshooting

### Problem 1: "Image failed to load"
**Cause:** URL tidak valid, image 404, atau network issue

**Fix:**
1. Test URL di browser tab baru
2. Pastikan image bisa diakses public
3. Check typo di URL
4. Coba hosting lain (imgbb, imgur)

### Problem 2: "Image blocked by CORS policy"
**Cause:** Server gambar block CORS (cross-origin requests)

**Fix:**
1. Pakai Upload File instead
2. Atau re-upload gambar ke hosting yang support CORS:
   - ✅ ImgBB (support CORS)
   - ✅ Imgur (support CORS)
   - ✅ Cloudinary (support CORS)
   - ❌ Some websites block CORS

### Problem 3: URL tidak berakhir dengan .jpg/.png
**Behavior:** Warning muncul tapi bisa lanjut

**Fix:**
- Jika yakin itu gambar, klik "OK" untuk lanjut
- Jika bukan gambar, paste URL yang benar

### Problem 4: Preview tidak update
**Cause:** Cache browser atau Supabase belum sync

**Fix:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Wait 1-2 detik lalu refresh

---

## 📊 Technical Details

### Database:
- Table: `settings`
- Keys: `hero_banner_url`, `about_image_url`, `site_logo_url`
- URL tersimpan langsung tanpa upload file

### Function:
- `window.setImageFromUrl(assetType)`
- Parameters: `'heroBanner'`, `'aboutImage'`, or `'logo'`
- Returns: Success/error message

### Process Flow:
```
1. User paste URL
2. Validate URL format
3. Test image load
4. Save to database (settings table)
5. Update preview
6. Clear input
7. Show success toast
```

---

## 🎨 UI Components

### HTML Elements:
```html
<input type="url" id="heroBannerUrlInput" />
<button onclick="window.setImageFromUrl('heroBanner')">Set URL</button>
```

### Asset Types:
- `heroBanner` → Hero Banner section
- `aboutImage` → About section image
- `logo` → Site logo

---

## ✅ Success Criteria

Setelah set URL, harusnya:
- ✅ Preview gambar langsung muncul di dashboard
- ✅ URL tersimpan di "URL saat ini: ..."
- ✅ Toast notification success
- ✅ Website update (setelah refresh)
- ✅ Database updated

---

## 📝 Best Practices

### Untuk Performance:
1. Use optimized images (compress dulu sebelum upload ke hosting)
2. Use CDN hosting (imgbb, imgur, cloudinary)
3. Recommended sizes:
   - Hero Banner: 1920x1080px, <500KB
   - About Image: 800x1000px, <300KB
   - Logo: 200x60px, <100KB

### Untuk Reliability:
1. Use stable hosting (jangan hosting yang sering down)
2. Always use HTTPS (not HTTP)
3. Test URL sebelum paste (buka di tab baru)
4. Backup URL di notepad (kalau mau ganti lagi)

### Untuk Security:
1. Only use trusted image hosts
2. Don't use suspicious URLs
3. Check image before setting (preview)

---

## 🔄 Cara Ganti Gambar

### Dari File Upload ke URL:
1. Copy URL dari file yang sudah diupload (lihat di "URL saat ini")
2. Atau upload ke hosting lain (imgbb)
3. Paste URL baru
4. Done!

### Dari URL ke Upload File:
1. Download gambar dari URL
2. Upload via "Upload File" button
3. File tersimpan di Supabase Storage
4. URL otomatis ganti ke Supabase URL

---

## 🚀 Next Steps

Setelah deploy:
1. Wait for Vercel deployment (1-2 menit)
2. Hard refresh dashboard (Ctrl+Shift+R)
3. Login → Site Settings
4. Test paste URL gambar
5. Check preview muncul
6. Refresh website → gambar updated

---

**Status:** ✅ Ready to use
**Deployment:** Pushed to GitHub
**Files Changed:**
- `admin-dashboard.html` (added URL input fields)
- `admin-script.js` (added setImageFromUrl function)

**Last Updated:** 2026-08-12
