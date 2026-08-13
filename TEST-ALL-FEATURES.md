# ✅ TESTING CHECKLIST - UMKM Desa Mlancu

**Tanggal:** 13 Agustus 2026  
**Tujuan:** Memastikan semua fitur berjalan lancar tanpa error

---

## 📱 WEBSITE (index.html)

### Navigation & Scrolling
- [ ] Navbar fixed di top dengan smooth scroll
- [ ] Menu links scroll ke section dengan smooth
- [ ] Mobile menu buka/tutup dengan smooth
- [ ] Smooth scroll ke #top, #menu, #about, #contact
- [ ] Scroll reveal animations berjalan smooth

### Hero Section
- [ ] Hero banner image tampil dengan benar
- [ ] Hero text readable dan animasi smooth
- [ ] CTA buttons berfungsi
- [ ] Responsive di mobile (hamburger menu)

### Products Section
- [ ] Products load dari database (check console log)
- [ ] Filter kategori berfungsi (All, Food, Craft, Fashion)
- [ ] Search bar filter produk
- [ ] Product cards hover effect smooth
- [ ] Wishlist button toggle (♡ ↔ ♥)
- [ ] "Lihat Detail" button membuka modal
- [ ] **MOBILE:** Horizontal scroll smooth dengan snap
- [ ] **MOBILE:** Scroll hint visible jika > 3 produk

### Product Detail Modal
- [ ] Modal open dengan smooth animation
- [ ] Close button (X) berfungsi
- [ ] Gallery thumbnails clickable
- [ ] Video thumbnail ada badge "▶"
- [ ] Quantity selector +/- berfungsi
- [ ] "Pesan Sekarang" redirect ke WhatsApp
- [ ] Reviews section tampil (jika ada)
- [ ] Rating stars tampil dengan benar
- [ ] **SMOOTH:** Modal scroll smooth dari atas ke bawah

### Producers Section
- [ ] Producers load dari database
- [ ] Profil cards tampil dengan foto
- [ ] "Lihat Profil Lengkap" link berfungsi
- [ ] WhatsApp button berfungsi
- [ ] Hover effect smooth

### Gallery Section
- [ ] Gallery grid layout 4 foto
- [ ] Images load dengan lazy loading
- [ ] Hover zoom effect smooth
- [ ] Grid responsive di mobile (2 kolom)

### Testimonials
- [ ] Testimonials load dari database
- [ ] Carousel auto-rotate setiap 5 detik
- [ ] Dots navigation berfungsi
- [ ] Transition smooth antar testimonial

### Contact Form
- [ ] Form inputs berfungsi
- [ ] Submit redirect ke WhatsApp dengan message
- [ ] Form validation (required fields)
- [ ] Toast notification muncul

### Cart Drawer
- [ ] Cart button buka drawer
- [ ] Drawer slide in dari kanan dengan smooth
- [ ] Backdrop click menutup drawer
- [ ] Close button (X) berfungsi
- [ ] Quantity +/- berfungsi
- [ ] Remove item berfungsi
- [ ] Subtotal kalkulasi benar
- [ ] **SMOOTH:** Drawer scroll smooth jika banyak item

### Footer
- [ ] Social media links berfungsi
- [ ] WhatsApp link berfungsi
- [ ] Email link berfungsi
- [ ] Copyright year benar (2026)

---

## 🎛️ ADMIN DASHBOARD (admin-dashboard.html)

### Login
- [ ] Login page tampil (admin-login.html)
- [ ] Email/password authentication berfungsi
- [ ] Error message tampil jika salah
- [ ] Redirect ke dashboard setelah login

### Dashboard Layout
- [ ] Sidebar tampil di desktop
- [ ] Sidebar hidden di mobile (≤ 1024px)
- [ ] Hamburger menu buka sidebar di mobile
- [ ] **X Button** di sidebar berfungsi (mobile)
- [ ] **Overlay** close sidebar saat di-tap (mobile)
- [ ] **Auto-close** setelah klik menu (mobile)
- [ ] Sidebar tidak menutupi konten
- [ ] **SMOOTH:** Sidebar scroll smooth

### Dashboard Page
- [ ] Stats cards tampil (Total Produk, Pengrajin, Galeri, Pesanan)
- [ ] Numbers benar dari database
- [ ] "Produk Terbaru" table tampil
- [ ] Hover effects smooth

### Products Management
- [ ] Products table load dari database
- [ ] "Tambah Produk" button berfungsi
- [ ] Modal open dengan form
- [ ] Upload gambar via URL berfungsi
- [ ] Save product ke database
- [ ] Edit button berfungsi
- [ ] Delete button berfungsi (dengan konfirmasi)
- [ ] Toast notification tampil
- [ ] **SMOOTH:** Table scroll horizontal di mobile

### Producers Management
- [ ] Producers table load
- [ ] "Tambah Pengrajin" button berfungsi
- [ ] Form lengkap dengan semua fields
- [ ] Upload foto via URL berfungsi
- [ ] Save producer ke database
- [ ] Edit/Delete berfungsi
- [ ] **SMOOTH:** Form scroll smooth di modal

### Gallery Management
- [ ] Gallery grid tampil
- [ ] "Tambah Foto" button berfungsi
- [ ] Upload image via URL
- [ ] Video support dengan badge
- [ ] Order index berfungsi
- [ ] Delete berfungsi

### Testimonials Management
- [ ] Testimonials table load
- [ ] "Tambah Testimoni" berfungsi
- [ ] Rating stars selector berfungsi
- [ ] Toggle active/inactive
- [ ] Edit/Delete berfungsi

### Orders Management
- [ ] Orders table load
- [ ] Status badges tampil (pending, completed, etc.)
- [ ] Filterable by status
- [ ] Detail view berfungsi

### Site Assets Management
- [ ] **Hero Banner:** Upload via URL ✅
- [ ] **Hero Banner:** Preview update real-time
- [ ] **Hero Banner:** Save ke database
- [ ] **About Image:** Upload via URL ✅
- [ ] **About Image:** Preview update real-time
- [ ] **About Image:** Save ke database
- [ ] **Logo:** Upload via URL ✅
- [ ] **Logo:** Preview update (jika ada)
- [ ] Current URL display tampil
- [ ] Tips section readable
- [ ] ImgBB recommendation clear

### Settings Page
- [ ] Settings form load dari database
- [ ] WhatsApp number update
- [ ] Email update
- [ ] Location address update
- [ ] Hero title/subtitle update
- [ ] Save berfungsi
- [ ] Changes reflect di website

### Logout
- [ ] Logout button berfungsi
- [ ] Session cleared
- [ ] Redirect ke login page

---

## 🎨 SMOOTH SCROLLING TESTS

### Global
- [ ] `html { scroll-behavior: smooth }` aktif
- [ ] `scroll-padding-top: 80px` untuk navbar
- [ ] `-webkit-overflow-scrolling: touch` untuk iOS

### Specific Areas
- [ ] Product grid horizontal scroll (mobile)
- [ ] Cart drawer body scroll
- [ ] Admin sidebar scroll
- [ ] Admin table scroll (horizontal di mobile)
- [ ] Modal scroll (website & dashboard)
- [ ] Product detail modal scroll
- [ ] Thumbnails horizontal scroll
- [ ] Tabs horizontal scroll (mobile)

### Custom Scrollbar
- [ ] Scrollbar visible dengan gold accent
- [ ] Hover effect berfungsi
- [ ] Thin scrollbar di mobile (4px)
- [ ] Firefox scrollbar styling

---

## 🐛 ERROR CHECKING

### Console Logs (F12 → Console)
- [ ] Tidak ada error merah
- [ ] Supabase initialized successfully
- [ ] Database fetch logs benar
- [ ] `window.setImageFromUrl` defined
- [ ] `window.SUPABASE_READY = true`

### Network Tab (F12 → Network)
- [ ] CSS files load (200 OK)
- [ ] JS files load (200 OK)
- [ ] Images load (dari ImgBB atau CDN)
- [ ] Supabase API calls berhasil (200)
- [ ] No 404 errors

### Performance
- [ ] Page load < 3 detik
- [ ] Images lazy load
- [ ] Smooth 60fps scrolling
- [ ] No layout shift
- [ ] Animations smooth (tidak lag)

---

## 📲 MOBILE TESTING

### Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Firefox Mobile
- [ ] Samsung Internet

### Orientations
- [ ] Portrait mode
- [ ] Landscape mode

### Touch Gestures
- [ ] Tap links berfungsi
- [ ] Swipe scroll smooth
- [ ] Pinch zoom (disabled on inputs)
- [ ] Pull-to-refresh

### Mobile-Specific
- [ ] Product grid swipe smooth
- [ ] Cart drawer full height
- [ ] Modal full screen (small devices)
- [ ] Sidebar overlay 100% coverage

---

## 🔥 CRITICAL BUGS TO FIX

### High Priority
- [ ] Supabase connection errors
- [ ] Database fetch failures
- [ ] Image upload errors
- [ ] Authentication issues
- [ ] Mobile navigation stuck

### Medium Priority
- [ ] Slow loading images
- [ ] Animation lag
- [ ] Scrollbar ugly
- [ ] Toast not showing

### Low Priority
- [ ] Minor styling issues
- [ ] Hover effects timing
- [ ] Icon alignment

---

## ✅ TESTING COMMANDS

### Quick Test Website
```bash
# Open in browser with cache-busting
https://umkm-desa-mlancu02.vercel.app/?v=test123
```

### Quick Test Dashboard
```bash
# Open in Incognito mode
https://umkm-desa-mlancu02.vercel.app/admin-dashboard.html?v=test123
```

### Check Console Logs
```javascript
// In browser console (F12)
console.log('Supabase Ready:', window.SUPABASE_READY);
console.log('Supabase Client:', window.supabase);
console.log('setImageFromUrl:', typeof window.setImageFromUrl);
console.log('Products:', PRODUCTS);
console.log('Settings:', SETTINGS);
```

### Test Smooth Scroll
```javascript
// In browser console
document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
```

---

## 📊 TEST RESULTS

| Feature | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Navigation | ☐ | ☐ | |
| Products | ☐ | ☐ | |
| Modal | ☐ | ☐ | |
| Cart | ☐ | ☐ | |
| Dashboard | ☐ | ☐ | |
| Site Assets | ☐ | ☐ | |
| Smooth Scroll | ☐ | ☐ | |

**Legend:**
- ✅ = Works perfectly
- ⚠️ = Minor issues
- ❌ = Broken
- ☐ = Not tested yet

---

## 🎯 FINAL CHECKLIST

Sebelum deploy production:

1. **✅ Smooth Scrolling**
   - [ ] All CSS files have smooth scroll
   - [ ] All overflow containers smooth
   - [ ] iOS momentum scrolling enabled

2. **✅ All Features Working**
   - [ ] No console errors
   - [ ] All CRUD operations work
   - [ ] Authentication secure

3. **✅ Mobile Responsive**
   - [ ] Sidebar doesn't block content
   - [ ] All buttons accessible
   - [ ] Touch targets ≥ 44px

4. **✅ Performance**
   - [ ] Images optimized
   - [ ] Lazy loading enabled
   - [ ] Minimal JS bundle

5. **✅ Cache Busting**
   - [ ] Query params on all scripts
   - [ ] vercel.json configured
   - [ ] Users notified to hard refresh

---

**READY TO DEPLOY? ✅**

Jika semua checklist ✅, website siap production!
