# 🔧 Cara Test & Fix Site Assets Upload

## ✅ Status: All Upload Handlers Fixed

Semua fungsi upload handler sudah di-expose ke `window` object:
- ✅ `window.handleHeroBannerUpload` 
- ✅ `window.handleAboutImageUpload`
- ✅ `window.handleLogoUpload`
- ✅ `window.attachUploadHandlers`

---

## 🧪 Langkah Testing

### 1. Wait for Vercel Deployment
Perubahan sudah di-push ke GitHub. Tunggu 1-2 menit sampai Vercel selesai deploy.

Cek di: https://vercel.com/your-dashboard

### 2. Hard Refresh Browser
Setelah deploy selesai, buka dashboard admin dan lakukan **hard refresh**:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

Atau clear cache browser dulu.

### 3. Test Upload di Dashboard
1. Login ke Dashboard Admin
2. Klik menu **"Site Settings"**
3. Coba upload:
   - Hero Banner (max 2MB)
   - About Image (max 2MB)
   - Logo (max 1MB)
4. Cek Console untuk error/log

### 4. Gunakan Diagnostic Tool
Buka file ini di browser untuk test lengkap:
```
test-site-assets.html
```

Tool ini akan mengecek:
- ✅ Koneksi Supabase
- ✅ Settings table & data
- ✅ Storage bucket "site-assets"
- ✅ Upload functionality (optional test)

---

## 🐛 Troubleshooting

### Problem 1: Upload button tidak ada reaksi
**Penyebab:** Event handler tidak attach

**Solusi:**
1. Buka Browser Console (F12)
2. Cek apakah ada error saat klik "Site Settings"
3. Ketik ini di console:
   ```javascript
   console.log(typeof window.attachUploadHandlers);
   console.log(typeof window.handleHeroBannerUpload);
   ```
4. Harusnya muncul `"function"` bukan `"undefined"`

### Problem 2: Error "bucket not found"
**Penyebab:** Bucket `site-assets` belum dibuat

**Solusi:**
1. Buka Supabase Dashboard
2. Ke **Storage** → **Create new bucket**
3. Nama: `site-assets`
4. **Penting:** Set ke **PUBLIC**

### Problem 3: Error "permission denied" atau "policy"
**Penyebab:** RLS policy atau bucket tidak PUBLIC

**Solusi A - Set Bucket PUBLIC:**
1. Buka Supabase Dashboard
2. Storage → Bucket `site-assets`
3. Settings → Make Public

**Solusi B - Disable RLS untuk Storage:**
```sql
-- Di Supabase SQL Editor
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

### Problem 4: Error "settings table not found"
**Penyebab:** SQL belum dijalankan

**Solusi:**
1. Buka Supabase SQL Editor
2. Run file: `ADD-SITE-ASSETS.sql`
3. Cek apakah berhasil:
   ```sql
   SELECT * FROM settings WHERE key LIKE '%_url';
   ```

---

## 📋 Checklist Setup

Pastikan semua ini sudah dilakukan:

- [ ] Run `SETUP-SUPABASE.sql` (setup awal database)
- [ ] Run `FIX-RLS-POLICIES.sql` (fix permissions)
- [ ] Run `ADD-SITE-ASSETS.sql` (add settings table entries)
- [ ] Buat bucket `site-assets` di Supabase Storage
- [ ] Set bucket `site-assets` ke **PUBLIC**
- [ ] Deploy ke Vercel sudah selesai
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Test upload dari Dashboard Admin

---

## 🎯 Expected Behavior

### Saat Upload Berhasil:
1. Toast notification: "Uploading..."
2. Progress upload di console
3. Toast notification: "✅ ... berhasil diupdate!"
4. Preview gambar langsung muncul
5. URL tersimpan di database

### Console Logs Normal:
```
Site Settings page opened
Attaching upload handlers...
Elements found: {heroBanner: true, aboutImage: true, logo: true}
Upload handlers attached!
Upload hero banner started: my-image.jpg
Uploading to bucket site-assets: hero-banner-1234567890.jpg
Upload success: {path: "...", id: "...", fullPath: "..."}
Public URL: https://...supabase.co/storage/v1/object/public/site-assets/...
Database updated successfully
```

---

## 🔍 Debug Commands

Jika masih error, coba command ini di Browser Console:

### Cek Supabase Connection:
```javascript
console.log('Supabase:', window.supabase);
window.supabase.from('settings').select('*').then(console.log);
```

### Cek Upload Handlers:
```javascript
console.log('attachUploadHandlers:', typeof window.attachUploadHandlers);
console.log('handleHeroBannerUpload:', typeof window.handleHeroBannerUpload);
console.log('handleAboutImageUpload:', typeof window.handleAboutImageUpload);
console.log('handleLogoUpload:', typeof window.handleLogoUpload);
```

### Cek Storage Bucket:
```javascript
window.supabase.storage.listBuckets().then(console.log);
window.supabase.storage.from('site-assets').list().then(console.log);
```

### Manual Attach Handlers (if needed):
```javascript
window.attachUploadHandlers();
```

---

## 📞 Report Issue

Jika masih error setelah semua langkah di atas:
1. Screenshot error di Console
2. Screenshot Supabase Storage buckets
3. Copy-paste hasil command debug di atas
4. Kasih info step mana yang gagal

---

**Last Updated:** 2026-08-12
**Status:** ✅ Ready for testing
