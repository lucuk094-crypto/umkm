// UMKM Desa Mlancu — Platform UMKM Lokal

// Wait for Supabase to initialize
function waitForSupabase() {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    const checkSupabase = () => {
      attempts++;
      
      // Check if supabase client has the methods we need
      if (window.supabase && typeof window.supabase.from === 'function') {
        console.log('✅ Supabase ready for website');
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.warn('⚠️ Supabase timeout after 5 seconds');
        resolve(false);
      } else {
        setTimeout(checkSupabase, 100);
      }
    };
    checkSupabase();
  });
}

// Data akan diambil dari Supabase
let PRODUCTS = [];
let PRODUCERS = [];
let GALLERY_ITEMS = [];
let TESTIMONIALS = [];
let SETTINGS = {};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ===== FETCH DATA FROM SUPABASE =====

async function fetchProducts() {
  try {
    await waitForSupabase(); // Wait for supabase to be ready
    
    const { data, error } = await window.supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform data untuk kompatibilitas dengan kode existing
    PRODUCTS = data.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image_url || 'https://via.placeholder.com/400',
      description: p.description || '',
      producer: p.producer_name || 'UMKM Desa Mlancu',
      process: p.process || '',
      material: p.material || '',
      stock: p.stock || 0
    }));

    console.log('✅ Products loaded:', PRODUCTS.length);
    renderProducts();
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    // Fallback ke data default jika error
    loadDefaultProducts();
  }
}

async function fetchProducers() {
  try {
    await waitForSupabase(); // Wait for supabase to be ready
    
    const { data, error } = await window.supabase
      .from('producers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    PRODUCERS = data || [];
    console.log('✅ Producers loaded:', PRODUCERS.length);
    renderProducers();
  } catch (error) {
    console.error('❌ Error fetching producers:', error);
  }
}

async function fetchGallery() {
  try {
    await waitForSupabase(); // Wait for supabase to be ready
    
    const { data, error } = await window.supabase
      .from('gallery')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(4);

    if (error) throw error;

    GALLERY_ITEMS = data || [];
    console.log('✅ Gallery loaded:', GALLERY_ITEMS.length);
    renderGallery();
  } catch (error) {
    console.error('❌ Error fetching gallery:', error);
  }
}

async function fetchTestimonials() {
  try {
    await waitForSupabase(); // Wait for supabase to be ready
    
    const { data, error } = await window.supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    TESTIMONIALS = data || [];
    console.log('✅ Testimonials loaded:', TESTIMONIALS.length);
    renderTestimonials();
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
  }
}

async function fetchSettings() {
  try {
    await waitForSupabase(); // Wait for supabase to be ready
    
    const { data, error } = await window.supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    // Convert array to object key-value
    SETTINGS = {};
    data?.forEach(item => {
      SETTINGS[item.key] = item.value;
    });

    console.log('✅ Settings loaded:', Object.keys(SETTINGS).length);
    applySettings();
  } catch (error) {
    console.error('❌ Error fetching settings:', error);
  }
}

function applySettings() {
  // Update kontak WhatsApp jika ada di settings
  if (SETTINGS.whatsapp_number) {
    // Update semua link WhatsApp di halaman
    const waLinks = document.querySelectorAll('a[href^="https://wa.me"]');
    waLinks.forEach(link => {
      const currentHref = link.getAttribute('href');
      link.setAttribute('href', currentHref.replace(/6285854321098/g, SETTINGS.whatsapp_number));
    });
  }

  // Update alamat jika ada
  if (SETTINGS.address) {
    const addressElements = document.querySelectorAll('.contact-info p:nth-child(2)');
    addressElements.forEach(el => {
      const content = el.innerHTML;
      if (content.includes('Balai Desa Mlancu')) {
        el.innerHTML = content.replace('Balai Desa Mlancu', SETTINGS.address);
      }
    });
  }
}

function loadDefaultProducts() {
  // Fallback data jika Supabase belum setup atau error
  PRODUCTS = [
    { 
      id: 'keripik-singkong', 
      name: 'Keripik Singkong Pedas', 
      price: 15000, 
      category: 'Food', 
      image: 'https://i.ibb.co/QF3vhckg/product-espresso.jpg', 
      description: 'Keripik singkong renyah dengan bumbu pedas khas. Dibuat dari singkong pilihan kebun warga desa.',
      producer: 'Ibu Dewi Kusuma',
      process: 'Singkong diiris tipis, digoreng dengan minyak bersih, dibumbui resep rahasia keluarga 3 generasi',
      material: 'Singkong lokal Desa Mlancu'
    },
    { 
      id: 'anyaman-bambu', 
      name: 'Tas Anyaman Bambu', 
      price: 85000, 
      category: 'Craft', 
      image: 'https://i.ibb.co/jk5GpZ4N/product-cappuccino.jpg', 
      description: 'Tas anyaman bambu berkualitas, kuat, dan tahan lama. Dibuat dengan teknik tradisional turun-temurun.',
      producer: 'Ibu Siti Aminah',
      process: 'Bambu dipilih, dibelah, dianyam secara manual dengan pola tradisional, finishing rapi',
      material: 'Bambu dari kebun sendiri di Desa Mlancu'
    },
    { 
      id: 'kopi-robusta', 
      name: 'Kopi Robusta Lokal', 
      price: 45000, 
      category: 'Food', 
      image: 'https://i.ibb.co/RT8DmgwX/product-caramel.jpg', 
      description: 'Kopi robusta dari kebun warga dengan citarasa khas pegunungan. Disangrai manual menggunakan tungku tradisional.',
      producer: 'Pak Ahmad Riyadi (Kelompok Tani Kopi)',
      process: 'Panen manual pilih merah, jemur alami 7 hari, sangrai tungku manual, sortir biji terbaik',
      material: 'Biji kopi dari kebun 5 hektar di lereng Desa Mlancu'
    },
    { 
      id: 'emping-melinjo', 
      name: 'Emping Melinjo Premium', 
      price: 35000, 
      category: 'Food', 
      image: 'https://i.ibb.co/FkqmhF80/product-mocha.jpg', 
      description: 'Emping melinjo renyah hasil olahan rumahan. Tanpa bahan pengawet, aman dan sehat untuk dikonsumsi.',
      producer: 'Ibu Marsinah',
      process: 'Kupas biji melinjo, pipihkan manual satu per satu, jemur 2 hari, goreng sebelum kemasan',
      material: 'Melinjo dari pohon warga Desa Mlancu'
    },
    { 
      id: 'batik-cap', 
      name: 'Kain Batik Cap', 
      price: 125000, 
      category: 'Fashion', 
      image: 'https://i.ibb.co/kNnpKVP/product-vanilla.jpg', 
      description: 'Kain batik cap motif tradisional khas daerah. Warna tahan lama dengan pewarna alami.',
      producer: 'Pak Slamet Riyanto',
      process: 'Kain mori dicap manual, pewarnaan alami dari tanaman, fiksasi, cuci bersih, jemur',
      material: 'Kain mori berkualitas, pewarna alami dari kulit kayu dan daun'
    },
    { 
      id: 'kerajinan-rotan', 
      name: 'Keranjang Rotan', 
      price: 55000, 
      category: 'Craft', 
      image: 'https://i.ibb.co/bDb7Nw6/product-coldbrew.jpg', 
      description: 'Keranjang serbaguna dari rotan pilihan. Anyaman kuat dan rapi, cocok untuk berbagai keperluan.',
      producer: 'Ibu Sumiati',
      process: 'Rotan direndam, dibelah, dihaluskan, dianyam pola tradisional, finishing dengan pewarna alami',
      material: 'Rotan dari hutan rakyat Desa Mlancu'
    },
  ];
  console.log('⚠️ Using default products (Supabase not configured)');
  renderProducts();
}



// Year
$('#year').textContent = new Date().getFullYear();

// Navbar scroll
const navbar = $('#navbar');
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
$('#menuBtn').addEventListener('click', () => $('#mobileMenu').classList.toggle('open'));
$$('.mobile-menu a').forEach(a => a.addEventListener('click', () => $('#mobileMenu').classList.remove('open')));

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));

// Products & menu
let currentCat = 'All';
let currentQuery = '';
const wishlist = new Set();
const grid = $('#productGrid');

function renderProducts() {
  const list = PRODUCTS.filter(p =>
    (currentCat === 'All' || p.category === currentCat) &&
    p.name.toLowerCase().includes(currentQuery.toLowerCase())
  );
  grid.innerHTML = list.map((p, i) => `
    <article class="product reveal" style="transition-delay:${i * 60}ms">
      <div class="product-img">
        <span class="product-cat">${p.category}</span>
        <button class="wish ${wishlist.has(p.id) ? 'active' : ''}" data-wish="${p.id}" aria-label="Wishlist">${wishlist.has(p.id) ? '♥' : '♡'}</button>
        <img src="${p.image}" alt="${p.name}" loading="lazy"/>
      </div>
      <div class="product-body">
        <div class="product-row">
          <h3>${p.name}</h3>
          <span class="product-price">Rp ${p.price.toLocaleString('id-ID')}</span>
        </div>
        <p class="muted small">${p.description}</p>
        <p class="muted small" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); font-size: 0.8rem;">
          <b style="color: var(--gold);">Pembuat:</b> ${p.producer}
        </p>
        <button class="add-btn" data-add="${p.id}" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Pesan via WhatsApp
        </button>
      </div>
    </article>
  `).join('');
  $$('#productGrid .reveal').forEach(el => io.observe(el));
  $$('[data-add]').forEach(b => b.addEventListener('click', () => addToCart(b.dataset.add)));
  $$('[data-wish]').forEach(b => b.addEventListener('click', () => toggleWish(b.dataset.wish)));
}

// Render Producers
function renderProducers() {
  if (!PRODUCERS.length) return;

  const producersContainer = document.querySelector('#producers .grid');
  if (!producersContainer) return;

  producersContainer.innerHTML = PRODUCERS.map(p => `
    <div class="feature reveal" style="text-align: left; padding: 32px; cursor: pointer; transition: transform 0.3s ease;" onclick="window.location.href='producer-detail.html?slug=${p.slug || ''}'">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
        ${p.photo_url ? 
          `<img src="${p.photo_url}" alt="${p.name}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover;">` :
          `<div style="width: 64px; height: 64px; border-radius: 50%; background: var(--grad-gold); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #1a1208;">
            ${p.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>`
        }
        <div>
          <h3 style="margin-bottom: 4px; font-size: 1.3rem;">${p.name}</h3>
          <p class="muted small" style="margin: 0;">${p.role || 'Pengrajin'}</p>
        </div>
      </div>
      <p class="muted" style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">
        ${p.description ? p.description.substring(0, 120) + '...' : (p.story ? p.story.substring(0, 120) + '...' : 'Pengrajin berpengalaman dari Desa Mlancu')}
      </p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;">
        ${p.since_year ? `<span style="padding: 6px 14px; border-radius: 999px; border: 1px solid var(--border); background: var(--glass); font-size: 0.75rem;">Sejak ${p.since_year}</span>` : ''}
        ${p.team_size ? `<span style="padding: 6px 14px; border-radius: 999px; border: 1px solid var(--border); background: var(--glass); font-size: 0.75rem;">${p.team_size} Pengrajin</span>` : ''}
      </div>
      <div style="display: flex; gap: 12px; margin-top: 20px;">
        <a href="producer-detail.html?slug=${p.slug || ''}" class="btn btn-primary" style="flex: 1; font-size: 0.875rem; text-align: center;" onclick="event.stopPropagation();">Lihat Profil Lengkap</a>
        ${p.whatsapp ? `<a href="https://wa.me/${p.whatsapp}?text=Halo%20${encodeURIComponent(p.name)}%2C%20saya%20tertarik%20dengan%20produk%20Anda" target="_blank" class="btn btn-ghost" style="flex: 1; font-size: 0.875rem; text-align: center;" onclick="event.stopPropagation();">WhatsApp</a>` : ''}
      </div>
    </div>
  `).join('');

  // Re-observe for reveal animation
  document.querySelectorAll('#producers .reveal').forEach(el => io.observe(el));
  
  // Add hover effect
  document.querySelectorAll('#producers .feature').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px)');
    card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
  });
}

// Render Gallery
function renderGallery() {
  if (!GALLERY_ITEMS.length) return;

  const galleryContainer = document.querySelector('.gallery');
  if (!galleryContainer) return;

  // Gunakan 4 foto pertama untuk grid layout
  const galleryHTML = GALLERY_ITEMS.slice(0, 4).map((item, index) => {
    const classes = ['g1', 'g2', 'g3', 'g4'];
    return `<img src="${item.image_url}" alt="${item.title || 'Galeri ' + (index + 1)}" class="${classes[index]} reveal" loading="lazy" />`;
  }).join('');

  galleryContainer.innerHTML = galleryHTML;

  // Re-observe for reveal animation
  document.querySelectorAll('.gallery .reveal').forEach(el => io.observe(el));
}

// Render Testimonials
function renderTestimonials() {
  if (!TESTIMONIALS.length) return;

  const tStage = document.getElementById('tStage');
  if (!tStage) return;

  tStage.innerHTML = TESTIMONIALS.map((t, index) => `
    <div class="t-card ${index === 0 ? 'active' : ''}">
      <p class="t-quote">"${t.message || t.quote}"</p>
      <div class="t-author">— ${t.customer_name}${t.customer_role ? ', ' + t.customer_role : ''}</div>
    </div>
  `).join('');

  // Update dots
  const tDots = document.getElementById('tDots');
  tDots.innerHTML = '';
  TESTIMONIALS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 't-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => setT(i));
    tDots.appendChild(d);
  });

  // Reset carousel
  const tCards = document.querySelectorAll('.t-card');
  let tIdx = 0;
  
  function setT(i) {
    tIdx = i;
    tCards.forEach((c, k) => c.classList.toggle('active', k === i));
    document.querySelectorAll('.t-dot').forEach((d, k) => d.classList.toggle('active', k === i));
  }
  
  // Auto-rotate testimonials
  setInterval(() => setT((tIdx + 1) % tCards.length), 5000);
}

function toggleWish(id) {
  wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
  renderProducts();
}

// Tabs
$$('.tab').forEach(t => t.addEventListener('click', () => {
  $$('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  currentCat = t.dataset.cat;
  renderProducts();
}));
$('#search').addEventListener('input', e => { currentQuery = e.target.value; renderProducts(); });

// Cart
let cart = [];
const drawer = $('#cartDrawer');
const backdrop = $('#drawerBackdrop');
const itemsEl = $('#cartItems');
const subtotalEl = $('#subtotal');
const badgeEl = $('#cartBadge');

function openCart() { drawer.classList.add('open'); backdrop.classList.add('open'); }
function closeCart() { drawer.classList.remove('open'); backdrop.classList.remove('open'); }
$('#cartBtn').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  // Buat pesan WhatsApp
  const message = `Halo, saya tertarik untuk memesan:

*${p.name}*
Harga: Rp ${p.price.toLocaleString('id-ID')}
Pembuat: ${p.producer}

Mohon informasi lebih lanjut mengenai ketersediaan dan pengiriman. Terima kasih!`;
  
  const waUrl = `https://wa.me/6285854321098?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  toast(`Mengarahkan ke WhatsApp untuk memesan ${p.name}`);
}
function changeQty(id, d) {
  const i = cart.findIndex(c => c.id === id);
  if (i < 0) return;
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  renderCart();
}
function removeItem(id) { cart = cart.filter(c => c.id !== id); renderCart(); }

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  badgeEl.hidden = count === 0;
  badgeEl.textContent = count;
  subtotalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty muted center">Keranjang Anda kosong.</p>';
    return;
  }
  itemsEl.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}"/>
      <div class="cart-item-info">
        <div class="row">
          <span class="name">${i.name}</span>
          <button class="remove" data-rm="${i.id}" aria-label="Remove">✕</button>
        </div>
        <span class="price">Rp ${(i.price * i.qty).toLocaleString('id-ID')}</span>
        <div class="qty">
          <button data-dec="${i.id}">−</button>
          <span>${i.qty}</span>
          <button data-inc="${i.id}">+</button>
        </div>
      </div>
    </div>
  `).join('');
  $$('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.inc, 1)));
  $$('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  $$('[data-rm]').forEach(b => b.addEventListener('click', () => removeItem(b.dataset.rm)));
}

// ===== INITIALIZE APP =====
// Load all data from Supabase on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing UMKM Desa Mlancu website...');
  
  // Wait for Supabase to be ready
  const supabaseReady = await waitForSupabase();
  
  if (!supabaseReady) {
    console.warn('⚠️ Supabase not ready. Using default data.');
    loadDefaultProducts();
    return;
  }

  // Fetch all data from database
  console.log('📡 Fetching data from Supabase...');
  try {
    await Promise.all([
      fetchProducts(),
      fetchProducers(),
      fetchGallery(),
      fetchTestimonials(),
      fetchSettings()
    ]);
    console.log('✅ All data loaded successfully!');
  } catch (error) {
    console.error('❌ Error loading data:', error);
    loadDefaultProducts();
  }
});

// Toast
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// Contact form
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const nama = e.target[0].value;
  const wa = e.target[1].value;
  const produk = e.target[2].value;
  const catatan = e.target[3].value;
  
  const message = `*PESANAN BARU*

Nama: ${nama}
WhatsApp: ${wa}
Produk: ${produk}
Catatan: ${catatan}

Mohon konfirmasi untuk pesanan ini. Terima kasih!`;
  
  const waUrl = `https://wa.me/6285854321098?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  toast('Mengarahkan ke WhatsApp untuk konfirmasi pesanan');
  e.target.reset();
});
