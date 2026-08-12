// UMKM Desa Mlancu — Platform UMKM Lokal

// Wait for Supabase to initialize
function waitForSupabase() {
  return new Promise((resolve) => {
    console.log('⏳ waitForSupabase() called');
    
    // First, try to initialize if not done yet
    if (window.initializeSupabase && (!window.supabase.from)) {
      console.log('🔧 Calling window.initializeSupabase()...');
      const initialized = window.initializeSupabase();
      if (initialized) {
        console.log('✅ Supabase initialized immediately');
        resolve(true);
        return;
      }
    }
    
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max
    
    const checkSupabase = () => {
      attempts++;
      
      console.log(`🔍 Checking Supabase (attempt ${attempts}/${maxAttempts})...`);
      console.log('  window.supabase exists:', !!window.supabase);
      console.log('  window.supabase.from exists:', !!(window.supabase && window.supabase.from));
      console.log('  typeof window.supabase.from:', typeof (window.supabase && window.supabase.from));
      
      // Check if supabase client has the methods we need
      if (window.supabase && typeof window.supabase.from === 'function') {
        console.log('✅ Supabase ready for website');
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.error('⚠️ Supabase timeout after 5 seconds');
        console.error('Final state:', {
          supabaseExists: !!window.supabase,
          supabaseType: typeof window.supabase,
          hasFromMethod: !!(window.supabase && window.supabase.from),
          supabaseKeys: window.supabase ? Object.keys(window.supabase).slice(0, 10) : []
        });
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
  console.log('📦 Starting fetchProducts()...');
  
  try {
    console.log('⏳ Waiting for Supabase...');
    const supabaseReady = await waitForSupabase();
    
    if (!supabaseReady) {
      console.error('❌ Supabase not ready, using default products');
      loadDefaultProducts();
      return;
    }
    
    console.log('🔍 Attempting to fetch products from database...');
    console.log('  Using client:', window.supabase);
    
    const { data, error } = await window.supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    console.log('📡 Database response:', { data, error });

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No products found in database');
      loadDefaultProducts();
      return;
    }

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

    console.log('✅ Products loaded from database:', PRODUCTS.length);
    console.log('📋 Products:', PRODUCTS);
    renderProducts();
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
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
  // Update hero banner image if available
  if (SETTINGS.hero_banner_url) {
    const heroBanner = document.getElementById('heroBanner');
    if (heroBanner) {
      heroBanner.src = SETTINGS.hero_banner_url;
    }
  }
  
  // Update site title if available
  if (SETTINGS.site_title) {
    document.title = SETTINGS.site_title + ' — Platform Jual Beli Produk Lokal';
  }
  
  // Update about image if available
  if (SETTINGS.about_image_url) {
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
      aboutImage.src = SETTINGS.about_image_url;
    }
  }
  
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
        <button class="add-btn" data-view="${p.id}" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Lihat Detail
        </button>
      </div>
    </article>
  `).join('');
  $$('#productGrid .reveal').forEach(el => io.observe(el));
  $$('[data-view]').forEach(b => b.addEventListener('click', () => openProductModal(b.dataset.view)));
  $$('[data-wish]').forEach(b => b.addEventListener('click', () => toggleWish(b.dataset.wish)));
  
  // Show scroll hint on mobile if there are more than 3 products
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint && list.length > 3 && window.innerWidth <= 960) {
    scrollHint.style.display = 'block';
    
    // Hide hint after first scroll
    const productGrid = document.getElementById('productGrid');
    productGrid.addEventListener('scroll', () => {
      scrollHint.style.display = 'none';
    }, { once: true });
  } else if (scrollHint) {
    scrollHint.style.display = 'none';
  }
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


// ===== PRODUCT DETAIL MODAL =====
let currentProduct = null;
let currentProductGallery = [];
let currentProductReviews = [];
let modalQuantity = 1;

const productModal = document.getElementById('productModal');
const closeProductModalBtn = document.getElementById('closeProductModal');

// Open product detail modal
async function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  currentProduct = product;
  modalQuantity = 1;
  
  // Show modal
  productModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Load product details
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = `Rp ${product.price.toLocaleString('id-ID')}`;
  document.getElementById('modalProductCategory').textContent = product.category;
  document.getElementById('modalProductDescription').textContent = product.description || 'Tidak ada deskripsi';
  document.getElementById('modalQuantity').textContent = modalQuantity;
  
  // Stock status
  const stockEl = document.getElementById('modalProductStock');
  if (product.stock > 10) {
    stockEl.textContent = `Stok tersedia (${product.stock})`;
    stockEl.classList.remove('low');
  } else if (product.stock > 0) {
    stockEl.textContent = `Stok terbatas (${product.stock} tersisa)`;
    stockEl.classList.add('low');
  } else {
    stockEl.textContent = 'Stok habis';
    stockEl.classList.add('low');
  }
  
  // Load product gallery
  await loadProductGallery(productId);
  
  // Load product reviews
  await loadProductReviews(productId);
  
  // Load product specs if available
  loadProductSpecs(product);
}

// Close modal
function closeProductModal() {
  productModal.classList.remove('open');
  document.body.style.overflow = '';
  currentProduct = null;
  currentProductGallery = [];
  currentProductReviews = [];
  modalQuantity = 1;
}

// Load product gallery from database
async function loadProductGallery(productId) {
  try {
    await waitForSupabase();
    
    const { data, error } = await window.supabase
      .from('product_gallery')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    currentProductGallery = data || [];
    
    // If no gallery, use main product image
    if (currentProductGallery.length === 0) {
      currentProductGallery = [{
        media_url: currentProduct.image,
        media_type: 'image',
        caption: currentProduct.name
      }];
    }
    
    renderProductGallery();
    
  } catch (error) {
    console.error('Error loading product gallery:', error);
    // Fallback to main image
    currentProductGallery = [{
      media_url: currentProduct.image,
      media_type: 'image',
      caption: currentProduct.name
    }];
    renderProductGallery();
  }
}

// Render product gallery
function renderProductGallery() {
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.getElementById('productThumbnails');
  
  if (currentProductGallery.length === 0) return;
  
  // Set first item as main
  const firstItem = currentProductGallery[0];
  if (firstItem.media_type === 'video') {
    mainImage.innerHTML = `<video src="${firstItem.media_url}" controls autoplay loop></video>`;
  } else {
    mainImage.innerHTML = `<img src="${firstItem.media_url}" alt="${firstItem.caption || 'Product'}">`;
  }
  
  // Render thumbnails
  thumbnails.innerHTML = currentProductGallery.map((item, index) => `
    <div class="product-thumb ${index === 0 ? 'active' : ''} ${item.media_type}" data-index="${index}">
      ${item.media_type === 'video' ? 
        `<video src="${item.media_url}"></video>` : 
        `<img src="${item.media_url}" alt="${item.caption || 'Thumbnail'}">`
      }
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      const item = currentProductGallery[index];
      
      // Update main image
      if (item.media_type === 'video') {
        mainImage.innerHTML = `<video src="${item.media_url}" controls autoplay loop></video>`;
      } else {
        mainImage.innerHTML = `<img src="${item.media_url}" alt="${item.caption || 'Product'}">`;
      }
      
      // Update active state
      document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Load product reviews
async function loadProductReviews(productId) {
  try {
    await waitForSupabase();
    
    const { data, error } = await window.supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    currentProductReviews = data || [];
    renderProductReviews();
    
  } catch (error) {
    console.error('Error loading product reviews:', error);
    currentProductReviews = [];
    renderProductReviews();
  }
}

// Render product reviews
function renderProductReviews() {
  const reviewsSummary = document.getElementById('reviewsSummary');
  const reviewsList = document.getElementById('reviewsList');
  const modalProductRating = document.getElementById('modalProductRating');
  const modalProductStars = document.getElementById('modalProductStars');
  
  if (currentProductReviews.length === 0) {
    reviewsSummary.innerHTML = `<p class="muted center" style="width:100%">Belum ada ulasan untuk produk ini</p>`;
    reviewsList.innerHTML = '';
    modalProductRating.textContent = '(0 ulasan)';
    modalProductStars.textContent = '☆☆☆☆☆';
    return;
  }
  
  // Calculate rating statistics
  const totalReviews = currentProductReviews.length;
  const avgRating = currentProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const ratingCounts = [0, 0, 0, 0, 0];
  currentProductReviews.forEach(r => ratingCounts[r.rating - 1]++);
  
  // Update stars display
  const fullStars = Math.floor(avgRating);
  const halfStar = avgRating % 1 >= 0.5;
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) starsHtml += '★';
  if (halfStar) starsHtml += '☆';
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) starsHtml += '☆';
  modalProductStars.textContent = starsHtml;
  modalProductRating.textContent = `(${totalReviews} ulasan)`;
  
  // Render summary
  reviewsSummary.innerHTML = `
    <div class="reviews-score">
      <div class="reviews-score-number">${avgRating.toFixed(1)}</div>
      <div class="reviews-score-stars">${starsHtml}</div>
      <div class="reviews-score-count">${totalReviews} ulasan</div>
    </div>
    <div class="reviews-bars">
      ${[5,4,3,2,1].map(star => {
        const count = ratingCounts[star - 1];
        const percentage = (count / totalReviews * 100).toFixed(0);
        return `
          <div class="review-bar">
            <div class="review-bar-label">${star} bintang</div>
            <div class="review-bar-track">
              <div class="review-bar-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="review-bar-count">${count}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  // Render reviews list
  reviewsList.innerHTML = currentProductReviews.map(review => {
    const reviewStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const reviewDate = new Date(review.created_at).toLocaleDateString('id-ID', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    const initials = review.customer_name.split(' ').map(n => n[0]).join('').substring(0, 2);
    
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">
            ${review.customer_photo ? 
              `<img src="${review.customer_photo}" alt="${review.customer_name}">` : 
              initials
            }
          </div>
          <div class="review-info">
            <div class="review-name ${review.is_verified ? 'verified' : ''}">${review.customer_name}</div>
            <div class="review-date">${reviewDate}</div>
          </div>
          <div class="review-stars">${reviewStars}</div>
        </div>
        <div class="review-text">${review.review_text}</div>
      </div>
    `;
  }).join('');
}

// Load product specs
function loadProductSpecs(product) {
  const specsEl = document.getElementById('modalProductSpecs');
  
  const specs = [];
  if (product.producer) specs.push({ label: 'Pembuat', value: product.producer });
  if (product.material) specs.push({ label: 'Bahan', value: product.material });
  if (product.weight) specs.push({ label: 'Berat', value: `${product.weight}g` });
  if (product.dimensions) specs.push({ label: 'Dimensi', value: product.dimensions });
  if (product.process) specs.push({ label: 'Proses', value: product.process });
  
  if (specs.length === 0) {
    specsEl.style.display = 'none';
    return;
  }
  
  specsEl.style.display = 'block';
  specsEl.innerHTML = `
    <h3>Spesifikasi</h3>
    <div class="specs-list">
      ${specs.map(spec => `
        <div class="spec-item">
          <span class="spec-label">${spec.label}</span>
          <span class="spec-value">${spec.value}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Modal quantity controls
document.getElementById('increaseQty').addEventListener('click', () => {
  if (currentProduct && modalQuantity < currentProduct.stock) {
    modalQuantity++;
    document.getElementById('modalQuantity').textContent = modalQuantity;
  }
});

document.getElementById('decreaseQty').addEventListener('click', () => {
  if (modalQuantity > 1) {
    modalQuantity--;
    document.getElementById('modalQuantity').textContent = modalQuantity;
  }
});

// Add to cart from modal (goes to cart, not direct WhatsApp)
document.getElementById('addToCartModal').addEventListener('click', () => {
  if (!currentProduct) return;
  
  // Find existing item in cart
  const existingItem = cart.find(item => item.id === currentProduct.id);
  
  if (existingItem) {
    existingItem.qty += modalQuantity;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      qty: modalQuantity
    });
  }
  
  renderCart();
  toast(`${modalQuantity}x ${currentProduct.name} ditambahkan ke keranjang`);
  closeProductModal();
});

// Wishlist from modal
document.getElementById('wishlistModal').addEventListener('click', () => {
  if (!currentProduct) return;
  toggleWish(currentProduct.id);
  const btn = document.getElementById('wishlistModal');
  btn.textContent = wishlist.has(currentProduct.id) ? '♥' : '♡';
  toast(wishlist.has(currentProduct.id) ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist');
});

// Close modal handlers
closeProductModalBtn.addEventListener('click', closeProductModal);
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
});

// Update product cards to open modal instead of direct WhatsApp
// This will be handled in renderProducts() - change data-add to data-view


// Checkout - send to WhatsApp with cart details
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    toast('Keranjang Anda kosong');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  let message = `*PESANAN BARU*\n\n`;
  message += `Detail Pesanan:\n`;
  message += `━━━━━━━━━━━━━━━\n`;
  
  cart.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`;
    message += `   Jumlah: ${item.qty}x\n`;
    message += `   Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
    message += `   Subtotal: Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
  });
  
  message += `\n━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL: Rp ${total.toLocaleString('id-ID')}*\n\n`;
  message += `Mohon konfirmasi ketersediaan dan detail pengiriman. Terima kasih!`;
  
  const waUrl = `https://wa.me/6285854321098?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  
  toast('Mengarahkan ke WhatsApp untuk konfirmasi pesanan');
});
