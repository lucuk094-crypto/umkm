# 🔌 CEK KONEKSI SUPABASE - PANDUAN LENGKAP

## ✅ STATUS KONEKSI SAAT INI

Berdasarkan konfigurasi yang sudah ada:

### 1. Credentials Supabase ✅
- **Project URL**: `https://jrbvxdstpobmfavurvsh.supabase.co`
- **Anon Key**: Sudah terisi (eyJhbGci...)
- **File**: `config.js` ✅

### 2. Helper Files ✅
- `config.js` - Konfigurasi Supabase ✅
- `supabase-helper.js` - Inisialisasi client ✅
- `admin-script.js` - Script dashboard lengkap ✅

### 3. Load Order di HTML ✅
```html
<!-- Urutan yang benar -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
<script src="supabase-helper.js"></script>
<script src="admin-script.js"></script>
```

---

## 🧪 CARA TEST KONEKSI

### Metode 1: Menggunakan Test Page (RECOMMENDED)

1. **Buka browser** (Chrome, Firefox, Edge)
2. **Buka file**: `test-supabase.html`
3. **Lihat hasilnya**:
   - ✅ Hijau = Berhasil
   - ❌ Merah = Error
   - ⏳ Kuning = Pending (perlu klik tombol)
4. **Klik tombol-tombol test** untuk cek detail:
   - "Test Koneksi Database" - cek koneksi ke Supabase
   - "Test Auth" - cek authentication
   - "Check Tables" - cek semua tables (products, producers, dll)

### Metode 2: Menggunakan Browser Console

1. **Buka `admin-login.html`** di browser
2. **Tekan F12** untuk buka Developer Tools
3. **Masuk ke tab Console**
4. **Ketik command berikut** satu per satu:

```javascript
// 1. Cek Supabase CDN sudah load
console.log('Supabase CDN:', typeof window.supabase);
// Expected: "function"

// 2. Cek Config
console.log('Config:', window.SUPABASE_CONFIG);
// Expected: { url: "https://...", anonKey: "eyJ..." }

// 3. Cek Client
console.log('Client:', window.supabaseClient || window.supabase);
// Expected: Object dengan properties auth, from, dll

// 4. Test koneksi database
const testDB = async () => {
  const { data, error } = await window.supabase.from('products').select('count', { count: 'exact', head: true });
  console.log('DB Test:', { data, error });
};
testDB();
// Expected: { data: null, error: null } atau count data

// 5. Cek session
const checkSession = async () => {
  const { data } = await window.supabase.auth.getSession();
  console.log('Session:', data);
};
checkSession();
// Expected: session object jika sudah login
```

### Metode 3: Login ke Dashboard Langsung

1. **Buka `admin-login.html`**
2. **Login** dengan:
   - Email: `admin@desamlancu.id`
   - Password: `AdminUMKM@02!`
3. **Lihat Console** (F12):
   - ✅ Jika muncul: `✅ Supabase initialized successfully`
   - ✅ Jika redirect ke dashboard tanpa error
   - ❌ Jika muncul error, baca pesan errornya

---

## 🔍 TROUBLESHOOTING

### Error 1: "Supabase belum terkonfigurasi"

**Penyebab:**
- CDN Supabase belum load
- Config.js tidak terbaca

**Solusi:**
1. Pastikan ada koneksi internet (CDN harus download)
2. Cek urutan script di HTML
3. Hard refresh: `Ctrl + Shift + R`

---

### Error 2: "Invalid API key"

**Penyebab:**
- Anon Key salah atau expired
- URL Supabase salah

**Solusi:**
1. Buka Supabase Dashboard: https://app.supabase.com
2. Pilih project Anda
3. Masuk ke **Settings** → **API**
4. Copy **Project URL** dan **anon public** key yang baru
5. Update di `config.js`:
```javascript
window.SUPABASE_CONFIG = {
  url: 'YOUR_PROJECT_URL',
  anonKey: 'YOUR_ANON_KEY'
};
```

---

### Error 3: "Row Level Security policy violation"

**Penyebab:**
- RLS (Row Level Security) di Supabase tidak mengizinkan akses

**Solusi:**
1. Buka Supabase Dashboard
2. Masuk ke **Authentication** → **Policies**
3. Untuk setiap table (products, producers, gallery, testimonials, orders, settings):
   - Pastikan ada policy **"Enable read access for all users"**
   - Pastikan ada policy **"Enable full access for authenticated users"**

Atau jalankan SQL ini di **SQL Editor**:
```sql
-- Enable RLS untuk semua table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON producers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON gallery FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON testimonials FOR SELECT USING (true);

-- Policy: Authenticated full access
CREATE POLICY "Enable full access for authenticated users" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON producers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable full access for authenticated users" ON settings FOR ALL USING (auth.role() = 'authenticated');
```

---

### Error 4: "Invalid login credentials"

**Penyebab:**
- Email/password salah
- User belum dibuat di Supabase

**Solusi:**
1. Buka Supabase Dashboard
2. Masuk ke **Authentication** → **Users**
3. Klik **"Add user"** → **"Create new user"**
4. Isi:
   - Email: `admin@desamlancu.id`
   - Password: `AdminUMKM@02!`
   - **Auto Confirm User**: ✅ CENTANG
5. Klik **"Create user"**
6. Coba login lagi

---

### Error 5: "Failed to fetch" atau "Network error"

**Penyebab:**
- Tidak ada koneksi internet
- Supabase project di-pause
- CORS issue

**Solusi:**
1. Cek koneksi internet
2. Cek status project di Supabase Dashboard
3. Pastikan project tidak di-pause (free tier pause setelah 7 hari tidak aktif)
4. Jika paused, klik **"Restore"** di dashboard

---

### Error 6: "relation does not exist"

**Penyebab:**
- Table belum dibuat di database

**Solusi:**
1. Buka Supabase Dashboard
2. Masuk ke **SQL Editor**
3. Jalankan file `SETUP-SUPABASE.sql` yang ada di project ini
4. Atau copy-paste semua SQL dari file tersebut dan run

---

## 📊 EXPECTED RESULTS (Jika Berhasil)

### Di Console Browser:
```
✅ Supabase initialized successfully
```

### Di Test Page:
```
1. CDN Supabase: ✅ Success
2. Config File: ✅ Success
3. Supabase Client: ✅ Success
4. Database Connection: ✅ Success
5. Authentication: ✅ Success (jika sudah login)
6. Tables Check: 
   ✅ products: X rows
   ✅ producers: X rows
   ✅ gallery: X rows
   ✅ testimonials: X rows
   ✅ orders: X rows
   ✅ settings: X rows
```

### Di Dashboard Admin:
- Statistik menampilkan angka (bukan 0 terus)
- Tabel produk/pengrajin/dll bisa load data
- Tombol "Tambah" bisa diklik dan muncul form
- Data bisa disimpan dan muncul di tabel

---

## 🎯 CHECKLIST KONEKSI SUPABASE

Gunakan checklist ini untuk memastikan semua sudah benar:

### Setup di Supabase Dashboard:
- [ ] Project sudah dibuat
- [ ] Database tables sudah dibuat (6 tables)
- [ ] RLS policies sudah diaktifkan
- [ ] User admin sudah dibuat di Authentication
- [ ] Storage buckets sudah dibuat (optional)

### Setup di Project:
- [ ] `config.js` sudah terisi URL dan Anon Key
- [ ] `supabase-helper.js` ada di folder
- [ ] `admin-script.js` lengkap (807 baris)
- [ ] File HTML load script dengan urutan benar

### Testing:
- [ ] Buka `test-supabase.html` - semua hijau
- [ ] Buka `admin-login.html` - bisa login tanpa error
- [ ] Dashboard bisa load data dari Supabase
- [ ] Bisa tambah/edit/hapus data

---

## 🚀 QUICK START (Jika Belum Jalan)

### 1. Cek Config (30 detik)
```javascript
// Buka admin-login.html, tekan F12, ketik:
console.log(window.SUPABASE_CONFIG);
```
- Jika `undefined` → config.js tidak load
- Jika ada URL dan key → config OK ✅

### 2. Cek Client (30 detik)
```javascript
// Di console yang sama, ketik:
console.log(window.supabase);
```
- Jika `undefined` → client tidak terbuat
- Jika ada object → client OK ✅

### 3. Test Database (1 menit)
```javascript
// Di console, ketik:
const test = async () => {
  const { data, error } = await window.supabase.from('products').select('*').limit(1);
  console.log('Test:', { data, error });
};
test();
```
- Jika `error: null` → database OK ✅
- Jika ada error → baca pesan errornya

### 4. Login Test (1 menit)
- Buka `admin-login.html`
- Login dengan admin@desamlancu.id / AdminUMKM@02!
- Jika masuk dashboard → authentication OK ✅
- Jika error → cek user sudah dibuat belum

---

## 📞 SUPPORT

Jika masih ada masalah setelah mengikuti panduan ini:

1. **Screenshot error di console** (F12 → Console tab)
2. **Screenshot Supabase dashboard** (bagian API settings)
3. **Jelaskan step yang sudah dilakukan**
4. **Kirimkan informasi tersebut**

---

## ✨ NEXT STEPS (Setelah Koneksi OK)

1. ✅ Test semua fitur dashboard (tambah, edit, hapus)
2. ✅ Upload gambar produk (via ImgBB atau Supabase Storage)
3. ✅ Tambah data pengrajin lengkap
4. ✅ Update pengaturan website
5. ✅ Cek tampilan di website utama (index.html)
6. ✅ Deploy ke Vercel/Netlify (optional)

---

**Koneksi Supabase sudah terkonfigurasi dengan benar! Sekarang tinggal test saja.** 🎉
