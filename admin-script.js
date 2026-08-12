// Admin Dashboard Script - UMKM Desa Mlancu

// Helper to get supabase instance
function getSupabase() {
  return window.supabase || window.supabaseClient;
}
// ============================================
// SET IMAGE FROM URL (EXPOSED IMMEDIATELY)
// ============================================
window.setImageFromUrl = async function(assetType) {
  console.log('🔗 Setting ' + assetType + ' from URL...');
  const inputId = assetType + 'UrlInput';
  const previewId = assetType + 'Preview';
  const urlDisplayId = assetType + 'Url';
  const input = document.getElementById(inputId);
  if (!input) { alert('Error: Input not found'); return; }
  const imageUrl = input.value.trim();
  if (!imageUrl) { alert('Masukkan URL gambar'); return; }
  try { new URL(imageUrl); } catch (e) { alert('URL tidak valid'); return; }
  try {
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      testImg.onload = resolve;
      testImg.onerror = () => reject(new Error('Image failed to load'));
      testImg.src = imageUrl;
    });
    let settingsKey = assetType === 'heroBanner' ? 'hero_banner_url' : assetType === 'aboutImage' ? 'about_image_url' : 'site_logo_url';
    await waitForSupabase();
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not initialized');
    const { error } = await supabase.from('settings').upsert({ key: settingsKey, value: imageUrl }, { onConflict: 'key' });
    if (error) throw error;
    const preview = document.getElementById(previewId);
    if (preview) preview.innerHTML = '<img src="' + imageUrl + '" style="width:100%;height:100%;object-fit:cover;">';
    const urlDisplay = document.getElementById(urlDisplayId);
    if (urlDisplay) urlDisplay.textContent = imageUrl;
    input.value = '';
    if (typeof showToast === 'function') showToast('✅ ' + assetType + ' berhasil diupdate!'); else alert('✅ Berhasil!');
  } catch (error) {
    console.error('Error:', error);
    if (typeof showToast === 'function') showToast('Error: ' + error.message, 'error'); else alert('Error: ' + error.message);
  }
};
console.log('✅ window.setImageFromUrl loaded');


// Wait for supabase to be loaded
window.addEventListener('DOMContentLoaded', () => {
  // Initialize after DOM loaded
  initializeDashboard();
});

async function initializeDashboard() {
  const supabase = getSupabase();
  await checkAuth();
}

// Check authentication
async function checkAuth() {
  const supabase = getSupabase();
  
  if (!supabase) {
    alert('Supabase belum terkonfigurasi. Periksa file config.js');
    window.location.href = 'admin-login.html';
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    window.location.href = 'admin-login.html';
    return;
  }

  // Set user name
  document.getElementById('userName').textContent = session.user.email?.split('@')[0] || 'Admin';
  
  // Load dashboard data
  loadDashboard();
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  const supabase = getSupabase();
  await supabase.auth.signOut();
  window.location.href = 'admin-login.html';
});

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pageContents = document.querySelectorAll('.page-content');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.dataset.page;
    
    // Update active nav
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // Show page
    pageContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    
    // Update title
    document.getElementById('pageTitle').textContent = item.querySelector('span').textContent;
    
    // Load page data
    loadPageData(page);
  });
});

// Toggle sidebar on mobile
document.getElementById('toggleSidebar')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('adminToast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Load Dashboard Data
async function loadDashboard() {
  const supabase = getSupabase();
  try {
    // Get counts
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: producersCount } = await supabase.from('producers').select('*', { count: 'exact', head: true });
    const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    document.getElementById('totalProducts').textContent = productsCount || 0;
    document.getElementById('totalProducers').textContent = producersCount || 0;
    document.getElementById('totalGallery').textContent = galleryCount || 0;
    document.getElementById('totalOrders').textContent = ordersCount || 0;

    // Load recent products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    renderRecentProducts(products || []);
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showToast('Gagal memuat dashboard', 'error');
  }
}

function renderRecentProducts(products) {
  const tbody = document.getElementById('recentProducts');
  if (!products.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada produk</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>Rp ${p.price.toLocaleString('id-ID')}</td>
      <td>${p.stock || 0}</td>
      <td><span class="status-badge ${p.is_active ? 'active' : 'inactive'}">${p.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
    </tr>
  `).join('');
}

// Load Page Data
async function loadPageData(page) {
  const supabase = getSupabase();
  switch(page) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'products':
      loadProducts();
      break;
    case 'producers':
      loadProducers();
      break;
    case 'gallery':
      loadGallery();
      break;
    case 'testimonials':
      loadTestimonials();
      break;
    case 'orders':
      loadOrders();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

// ===== PRODUCTS MANAGEMENT =====
async function loadProducts() {
  const supabase = getSupabase();
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tbody = document.getElementById('productsTable');
    if (!products.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada produk</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image_url || 'https://via.placeholder.com/48'}" alt="${p.name}"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${p.producer_name || '-'}</td>
        <td>Rp ${p.price.toLocaleString('id-ID')}</td>
        <td>${p.stock || 0}</td>
        <td><span class="status-badge ${p.is_active ? 'active' : 'inactive'}">${p.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="editProduct('${p.id}')" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="deleteProduct('${p.id}')" title="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Gagal memuat produk', 'error');
  }
}

// Add Product Button
document.getElementById('addProductBtn')?.addEventListener('click', () => {
  showProductModal();
});

async function showProductModal(productId = null) {
  const supabase = getSupabase();
  const isEdit = !!productId;
  let product = null;

  if (isEdit) {
    const { data } = await supabase.from('products').select('*').eq('id', productId).single();
    product = data;
  }

  // Get producers for dropdown
  const { data: producers } = await supabase.from('producers').select('id, name');

  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');

  modal.innerHTML = `
    <div class="modal-header">
      <h3>${isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="productForm" class="modal-body">
      <div class="form-group">
        <label>Nama Produk *</label>
        <input type="text" name="name" value="${product?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Kategori *</label>
        <select name="category" required>
          <option value="Food" ${product?.category === 'Food' ? 'selected' : ''}>Makanan</option>
          <option value="Craft" ${product?.category === 'Craft' ? 'selected' : ''}>Kerajinan</option>
          <option value="Fashion" ${product?.category === 'Fashion' ? 'selected' : ''}>Fashion</option>
        </select>
      </div>
      <div class="form-group">
        <label>Harga (Rp) *</label>
        <input type="number" name="price" value="${product?.price || ''}" required>
      </div>
      <div class="form-group">
        <label>Pembuat</label>
        <select name="producer_id">
          <option value="">Pilih Pengrajin</option>
          ${producers?.map(p => `<option value="${p.id}" ${product?.producer_id === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Deskripsi</label>
        <textarea name="description" rows="3">${product?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Proses Pembuatan</label>
        <textarea name="process" rows="3">${product?.process || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Bahan Baku</label>
        <input type="text" name="material" value="${product?.material || ''}">
      </div>
      <div class="form-group">
        <label>Stok</label>
        <input type="number" name="stock" value="${product?.stock || 0}">
      </div>
      <div class="form-group">
        <label>URL Gambar</label>
        <input type="url" name="image_url" value="${product?.image_url || ''}" placeholder="https://...">
        <small>Atau upload gambar ke Supabase Storage</small>
      </div>
      <div class="form-group">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" name="is_active" ${product?.is_active !== false ? 'checked' : ''}>
          <span>Produk Aktif</span>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Simpan'}</button>
      </div>
    </form>
  `;

  backdrop.classList.add('show');
  modal.classList.add('show');

  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveProduct(productId, new FormData(e.target));
  });
}

async function saveProduct(productId, formData) {
  const supabase = getSupabase();
  try {
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: parseInt(formData.get('price')),
      description: formData.get('description'),
      process: formData.get('process'),
      material: formData.get('material'),
      stock: parseInt(formData.get('stock')) || 0,
      image_url: formData.get('image_url'),
      is_active: formData.get('is_active') === 'on',
      producer_id: formData.get('producer_id') || null
    };

    // Get producer name if selected
    if (data.producer_id) {
      const { data: producer } = await supabase.from('producers').select('name').eq('id', data.producer_id).single();
      data.producer_name = producer?.name;
    }

    if (productId) {
      const { error } = await supabase.from('products').update(data).eq('id', productId);
      if (error) throw error;
      showToast('Produk berhasil diupdate');
    } else {
      const { error } = await supabase.from('products').insert([data]);
      if (error) throw error;
      showToast('Produk berhasil ditambahkan');
    }

    closeModal();
    loadProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    showToast('Gagal menyimpan produk', 'error');
  }
}

async function deleteProduct(id) {
  const supabase = getSupabase();
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    showToast('Produk berhasil dihapus');
    loadProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
    showToast('Gagal menghapus produk', 'error');
  }
}

window.editProduct = (id) => showProductModal(id);
window.deleteProduct = deleteProduct;

// ===== PRODUCERS MANAGEMENT =====
async function loadProducers() {
  const supabase = getSupabase();
  try {
    const { data: producers, error } = await supabase
      .from('producers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tbody = document.getElementById('producersTable');
    if (!producers.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada pengrajin</td></tr>';
      return;
    }

    tbody.innerHTML = producers.map(p => `
      <tr>
        <td><img src="${p.photo_url || 'https://via.placeholder.com/48'}" alt="${p.name}" style="border-radius: 50%;"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.role}</td>
        <td>${p.since_year || '-'}</td>
        <td>${p.team_size || '-'} orang</td>
        <td>${p.whatsapp || '-'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="editProducer('${p.id}')" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="deleteProducer('${p.id}')" title="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading producers:', error);
    showToast('Gagal memuat pengrajin', 'error');
  }
}

document.getElementById('addProducerBtn')?.addEventListener('click', () => {
  showProducerModal();
});

async function showProducerModal(producerId = null) {
  const supabase = getSupabase();
  const isEdit = !!producerId;
  let producer = null;

  if (isEdit) {
    const { data } = await supabase.from('producers').select('*').eq('id', producerId).single();
    producer = data;
  }

  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');

  modal.innerHTML = `
    <div class="modal-header">
      <h3>${isEdit ? 'Edit Pengrajin' : 'Tambah Pengrajin Baru'}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="producerForm" class="modal-body" style="max-height: 70vh; overflow-y: auto;">
      
      <h4 style="color: var(--gold); margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Informasi Dasar</h4>
      
      <div class="form-group">
        <label>Nama Lengkap *</label>
        <input type="text" name="name" value="${producer?.name || ''}" required>
      </div>
      
      <div class="form-group">
        <label>Peran/Profesi *</label>
        <input type="text" name="role" value="${producer?.role || ''}" placeholder="Pengrajin Anyaman Bambu" required>
      </div>

      <div class="form-group">
        <label>Deskripsi Singkat</label>
        <textarea name="description" rows="2" placeholder="Deskripsi singkat untuk preview card...">${producer?.description || ''}</textarea>
        <small>Deskripsi pendek yang akan muncul di card pengrajin (maks 150 karakter)</small>
      </div>
      
      <h4 style="color: var(--gold); margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Identitas Usaha</h4>
      
      <div class="form-group">
        <label>Nama Pemilik Usaha</label>
        <input type="text" name="owner_name" value="${producer?.owner_name || ''}" placeholder="Nama pemilik">
      </div>
      
      <div class="form-group">
        <label>Nama Usaha/Brand</label>
        <input type="text" name="business_name" value="${producer?.business_name || ''}" placeholder="Usaha Anyaman Siti">
      </div>
      
      <div class="form-group">
        <label>Nama Pembuat Produk</label>
        <input type="text" name="maker_name" value="${producer?.maker_name || ''}" placeholder="Bisa sama dengan pemilik">
      </div>
      
      <div class="form-group">
        <label>Status Usaha</label>
        <select name="business_status">
          <option value="">Pilih Status</option>
          <option value="Usaha Rumahan" ${producer?.business_status === 'Usaha Rumahan' ? 'selected' : ''}>Usaha Rumahan</option>
          <option value="Kelompok Usaha" ${producer?.business_status === 'Kelompok Usaha' ? 'selected' : ''}>Kelompok Usaha</option>
          <option value="Koperasi" ${producer?.business_status === 'Koperasi' ? 'selected' : ''}>Koperasi</option>
          <option value="CV" ${producer?.business_status === 'CV' ? 'selected' : ''}>CV</option>
          <option value="PT" ${producer?.business_status === 'PT' ? 'selected' : ''}>PT</option>
        </select>
      </div>
      
      <h4 style="color: var(--gold); margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Kontak & Lokasi</h4>
      
      <div class="form-group">
        <label>Nomor WhatsApp</label>
        <input type="text" name="whatsapp" value="${producer?.whatsapp || ''}" placeholder="628xxxxxxxxxx">
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value="${producer?.email || ''}" placeholder="email@example.com">
      </div>
      
      <div class="form-group">
        <label>Dusun</label>
        <input type="text" name="village" value="${producer?.village || ''}" placeholder="Nama Dusun">
      </div>
      
      <div class="form-group">
        <label>Alamat Lengkap</label>
        <textarea name="full_address" rows="2" placeholder="Alamat lengkap usaha...">${producer?.full_address || producer?.address || ''}</textarea>
      </div>
      
      <h4 style="color: var(--gold); margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Informasi Usaha</h4>
      
      <div class="form-group">
        <label>Tahun Mulai Usaha</label>
        <input type="number" name="since_year" value="${producer?.since_year || ''}" placeholder="2015">
      </div>
      
      <div class="form-group">
        <label>Jumlah Anggota/Pengrajin</label>
        <input type="number" name="team_size" value="${producer?.team_size || ''}" placeholder="8">
      </div>
      
      <div class="form-group">
        <label>Produk yang Ditawarkan</label>
        <input type="text" name="products_offered" value="${producer?.products_offered || ''}" placeholder="Anyaman bambu, tas, keranjang">
      </div>
      
      <div class="form-group">
        <label>Cerita Usaha</label>
        <textarea name="story" rows="5" placeholder="Ceritakan tentang perjalanan usaha, inspirasi, tantangan...">${producer?.story || ''}</textarea>
      </div>
      
      <div class="form-group">
        <label>Prestasi & Pencapaian</label>
        <textarea name="achievements" rows="3" placeholder="Prestasi, penghargaan, atau pencapaian penting...">${producer?.achievements || ''}</textarea>
      </div>
      
      <h4 style="color: var(--gold); margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">Media</h4>
      
      <div class="form-group">
        <label>URL Foto Profil</label>
        <input type="url" name="photo_url" value="${producer?.photo_url || ''}" placeholder="https://...">
      </div>
      
      <div class="form-group">
        <label>Instagram</label>
        <input type="text" name="instagram" value="${producer?.instagram || ''}" placeholder="@username">
      </div>
      
      <div class="form-group">
        <label>Facebook</label>
        <input type="text" name="facebook" value="${producer?.facebook || ''}" placeholder="nama.facebook">
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Simpan'}</button>
      </div>
    </form>
  `;

  backdrop.classList.add('show');
  modal.classList.add('show');

  document.getElementById('producerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveProducer(producerId, new FormData(e.target));
  });
}

async function saveProducer(producerId, formData) {
  const supabase = getSupabase();
  try {
    const name = formData.get('name');
    
    // Generate slug dari name jika belum ada
    let slug = formData.get('slug');
    if (!slug || !producerId) {
      slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    const data = {
      name: name,
      role: formData.get('role'),
      description: formData.get('description'),
      owner_name: formData.get('owner_name'),
      business_name: formData.get('business_name'),
      maker_name: formData.get('maker_name'),
      business_status: formData.get('business_status'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      village: formData.get('village'),
      full_address: formData.get('full_address'),
      address: formData.get('full_address'), // Keep for backward compatibility
      since_year: parseInt(formData.get('since_year')) || null,
      team_size: parseInt(formData.get('team_size')) || null,
      products_offered: formData.get('products_offered'),
      story: formData.get('story'),
      achievements: formData.get('achievements'),
      photo_url: formData.get('photo_url'),
      instagram: formData.get('instagram'),
      facebook: formData.get('facebook'),
      slug: slug
    };

    if (producerId) {
      const { error } = await supabase.from('producers').update(data).eq('id', producerId);
      if (error) throw error;
      showToast('Pengrajin berhasil diupdate');
    } else {
      const { error } = await supabase.from('producers').insert([data]);
      if (error) throw error;
      showToast('Pengrajin berhasil ditambahkan');
    }

    closeModal();
    loadProducers();
  } catch (error) {
    console.error('Error saving producer:', error);
    showToast('Gagal menyimpan pengrajin: ' + error.message, 'error');
  }
}

async function deleteProducer(id) {
  const supabase = getSupabase();
  if (!confirm('Yakin ingin menghapus pengrajin ini?')) return;

  try {
    const { error } = await supabase.from('producers').delete().eq('id', id);
    if (error) throw error;
    showToast('Pengrajin berhasil dihapus');
    loadProducers();
  } catch (error) {
    console.error('Error deleting producer:', error);
    showToast('Gagal menghapus pengrajin', 'error');
  }
}

window.editProducer = (id) => showProducerModal(id);
window.deleteProducer = deleteProducer;

// ===== GALLERY MANAGEMENT =====
async function loadGallery() {
  const supabase = getSupabase();
  try {
    const { data: gallery, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;

    const grid = document.getElementById('galleryGrid');
    if (!gallery.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><p>Belum ada foto di galeri</p></div>';
      return;
    }

    grid.innerHTML = gallery.map(g => `
      <div class="gallery-item">
        <img src="${g.image_url}" alt="${g.title || 'Galeri'}">
        <div class="gallery-item-info">
          <div class="gallery-item-title">${g.title || 'Tanpa Judul'}</div>
          <div class="gallery-item-desc">${g.description || ''}</div>
          <div class="gallery-item-actions">
            <button class="btn-icon" onclick="editGallery('${g.id}')" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="deleteGallery('${g.id}')" title="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading gallery:', error);
    showToast('Gagal memuat galeri', 'error');
  }
}

document.getElementById('addGalleryBtn')?.addEventListener('click', () => {
  showGalleryModal();
});

window.editGallery = (id) => showGalleryModal(id);
window.deleteGallery = async (id) => {
  if (!confirm('Yakin ingin menghapus foto ini?')) return;
  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    showToast('Foto berhasil dihapus');
    loadGallery();
  } catch (error) {
    console.error('Error deleting gallery:', error);
    showToast('Gagal menghapus foto', 'error');
  }
};

async function showGalleryModal(galleryId = null) {
  const supabase = getSupabase();
  const isEdit = !!galleryId;
  let gallery = null;

  if (isEdit) {
    const { data } = await supabase.from('gallery').select('*').eq('id', galleryId).single();
    gallery = data;
  }

  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');

  modal.innerHTML = `
    <div class="modal-header">
      <h3>${isEdit ? 'Edit Galeri' : 'Tambah Foto Galeri'}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="galleryForm" class="modal-body">
      <div class="form-group">
        <label>Judul Foto</label>
        <input type="text" name="title" value="${gallery?.title || ''}" placeholder="Proses Pembuatan Anyaman">
      </div>
      <div class="form-group">
        <label>Deskripsi</label>
        <textarea name="description" rows="2" placeholder="Pengrajin sedang menganyam bambu...">${gallery?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>URL Foto *</label>
        <input type="url" name="image_url" value="${gallery?.image_url || ''}" placeholder="https://..." required>
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <input type="text" name="category" value="${gallery?.category || ''}" placeholder="proses_anyaman, proses_kopi">
      </div>
      <div class="form-group">
        <label>Urutan Tampilan</label>
        <input type="number" name="order_index" value="${gallery?.order_index || 0}">
      </div>
      <div class="form-group">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" name="is_active" ${gallery?.is_active !== false ? 'checked' : ''}>
          <span>Tampilkan di Website</span>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Simpan'}</button>
      </div>
    </form>
  `;

  backdrop.classList.add('show');
  modal.classList.add('show');

  document.getElementById('galleryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveGallery(galleryId, new FormData(e.target));
  });
}

async function saveGallery(galleryId, formData) {
  const supabase = getSupabase();
  try {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      category: formData.get('category'),
      order_index: parseInt(formData.get('order_index')) || 0,
      is_active: formData.get('is_active') === 'on'
    };

    if (galleryId) {
      const { error } = await supabase.from('gallery').update(data).eq('id', galleryId);
      if (error) throw error;
      showToast('Galeri berhasil diupdate');
    } else {
      const { error } = await supabase.from('gallery').insert([data]);
      if (error) throw error;
      showToast('Foto berhasil ditambahkan');
    }

    closeModal();
    loadGallery();
  } catch (error) {
    console.error('Error saving gallery:', error);
    showToast('Gagal menyimpan galeri', 'error');
  }
}

// ===== TESTIMONIALS MANAGEMENT =====
async function loadTestimonials() {
  const supabase = getSupabase();
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tbody = document.getElementById('testimonialsTable');
    if (!testimonials.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada testimoni</td></tr>';
      return;
    }

    tbody.innerHTML = testimonials.map(t => `
      <tr>
        <td><strong>${t.customer_name}</strong></td>
        <td>${t.customer_role || '-'}</td>
        <td style="max-width: 300px;">${t.quote.substring(0, 100)}${t.quote.length > 100 ? '...' : ''}</td>
        <td>${'⭐'.repeat(t.rating || 5)}</td>
        <td><span class="status-badge ${t.is_active ? 'active' : 'inactive'}">${t.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon" onclick="editTestimonial('${t.id}')" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="deleteTestimonial('${t.id}')" title="Hapus">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading testimonials:', error);
    showToast('Gagal memuat testimoni', 'error');
  }
}

document.getElementById('addTestimonialBtn')?.addEventListener('click', () => {
  showTestimonialModal();
});

async function showTestimonialModal(testimonialId = null) {
  const supabase = getSupabase();
  const isEdit = !!testimonialId;
  let testimonial = null;

  if (isEdit) {
    const { data } = await supabase.from('testimonials').select('*').eq('id', testimonialId).single();
    testimonial = data;
  }

  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');

  modal.innerHTML = `
    <div class="modal-header">
      <h3>${isEdit ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form id="testimonialForm" class="modal-body">
      <div class="form-group">
        <label>Nama Pemberi Testimoni *</label>
        <input type="text" name="customer_name" value="${testimonial?.customer_name || ''}" required>
      </div>
      <div class="form-group">
        <label>Peran/Asal</label>
        <input type="text" name="customer_role" value="${testimonial?.customer_role || ''}" placeholder="Pembeli Setia">
      </div>
      <div class="form-group">
        <label>Testimoni *</label>
        <textarea name="quote" rows="4" required>${testimonial?.quote || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Rating (1-5)</label>
        <input type="number" name="rating" min="1" max="5" value="${testimonial?.rating || 5}">
      </div>
      <div class="form-group">
        <label style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" name="is_active" ${testimonial?.is_active !== false ? 'checked' : ''}>
          <span>Tampilkan di Website</span>
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Simpan'}</button>
      </div>
    </form>
  `;

  backdrop.classList.add('show');
  modal.classList.add('show');

  document.getElementById('testimonialForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveTestimonial(testimonialId, new FormData(e.target));
  });
}

async function saveTestimonial(testimonialId, formData) {
  const supabase = getSupabase();
  try {
    const data = {
      customer_name: formData.get('customer_name'),
      customer_role: formData.get('customer_role'),
      quote: formData.get('quote'),
      rating: parseInt(formData.get('rating')) || 5,
      is_active: formData.get('is_active') === 'on'
    };

    if (testimonialId) {
      const { error } = await supabase.from('testimonials').update(data).eq('id', testimonialId);
      if (error) throw error;
      showToast('Testimoni berhasil diupdate');
    } else {
      const { error } = await supabase.from('testimonials').insert([data]);
      if (error) throw error;
      showToast('Testimoni berhasil ditambahkan');
    }

    closeModal();
    loadTestimonials();
  } catch (error) {
    console.error('Error saving testimonial:', error);
    showToast('Gagal menyimpan testimoni', 'error');
  }
}

async function deleteTestimonial(id) {
  const supabase = getSupabase();
  if (!confirm('Yakin ingin menghapus testimoni ini?')) return;

  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    showToast('Testimoni berhasil dihapus');
    loadTestimonials();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    showToast('Gagal menghapus testimoni', 'error');
  }
}

window.editTestimonial = (id) => showTestimonialModal(id);
window.deleteTestimonial = deleteTestimonial;

// ===== ORDERS MANAGEMENT =====
async function loadOrders() {
  const supabase = getSupabase();
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tbody = document.getElementById('ordersTable');
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada pesanan</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${new Date(o.created_at).toLocaleDateString('id-ID')}</td>
        <td><strong>${o.customer_name}</strong></td>
        <td>${o.customer_whatsapp}</td>
        <td>${o.product_name || '-'}</td>
        <td>${o.quantity || '-'}</td>
        <td><span class="status-badge ${o.status === 'completed' ? 'active' : o.status === 'confirmed' ? 'pending' : 'inactive'}">${o.status}</span></td>
        <td>
          <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding: 6px; border-radius: 8px; border: 1px solid var(--border); background: var(--glass); color: var(--fg);">
            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>Dikonfirmasi</option>
            <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>Selesai</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
    showToast('Gagal memuat pesanan', 'error');
  }
}

window.updateOrderStatus = async (orderId, status) => {
  const supabase = getSupabase();
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;
    showToast('Status pesanan diupdate');
    loadOrders();
  } catch (error) {
    console.error('Error updating order:', error);
    showToast('Gagal update status', 'error');
  }
};


// ===== SITE ASSETS MANAGEMENT =====
async function loadSiteAssets() {
  console.log('📦 Loading site assets...');
  const supabase = getSupabase();
  
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['hero_banner_url', 'about_image_url', 'site_logo_url']);
    
    if (error) throw error;
    console.log('✅ Site assets loaded:', settings);
    
    const settingsMap = {};
    if (settings) {
      settings.forEach(s => { settingsMap[s.key] = s.value; });
    }
    
    const heroBannerUrl = settingsMap['hero_banner_url'] || 'https://i.ibb.co/84zR6qfT/hero-img.png';
    const heroBannerPreview = document.getElementById('heroBannerPreview');
    const heroBannerUrlDisplay = document.getElementById('heroBannerUrl');
    
    if (heroBannerPreview) {
      heroBannerPreview.innerHTML = `<img src="" alt="Hero Banner" style="width: 100%; height: 100%; object-fit: cover;">`;
    }
    if (heroBannerUrlDisplay) {
      heroBannerUrlDisplay.textContent = heroBannerUrl;
    }
    
    const aboutImageUrl = settingsMap['about_image_url'] || 'https://i.ibb.co/7Tpv4J9/about-coffee-bag.jpg';
    const aboutImagePreview = document.getElementById('aboutImagePreview');
    const aboutImageUrlDisplay = document.getElementById('aboutImageUrl');
    
    if (aboutImagePreview) {
      aboutImagePreview.innerHTML = `<img src="" alt="About Image" style="width: 100%; height: 100%; object-fit: cover;">`;
    }
    if (aboutImageUrlDisplay) {
      aboutImageUrlDisplay.textContent = aboutImageUrl;
    }
    
    const logoUrl = settingsMap['site_logo_url'];
    const logoPreview = document.getElementById('logoPreview');
    const logoUrlDisplay = document.getElementById('logoUrl');
    
    if (logoPreview) {
      if (logoUrl) {
        logoPreview.innerHTML = `<img src="" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 20px;">`;
      } else {
        logoPreview.innerHTML = `<div style="display: grid; place-items: center; height: 100%; color: var(--muted);"><p>Belum ada logo</p></div>`;
      }
    }
    if (logoUrlDisplay) {
      logoUrlDisplay.textContent = logoUrl || '-';
    }
    
    console.log('✅ Site assets UI updated');
    
  } catch (error) {
    console.error('❌ Error in loadSiteAssets:', error);
    showToast('Gagal memuat site assets', 'error');
  }
}
// ===== SETTINGS MANAGEMENT =====
async function loadSettings() {
  const supabase = getSupabase();
  try {
    const { data: settings, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    const form = document.getElementById('settingsForm');
    if (!form) return;

    settings.forEach(setting => {
      const input = form.elements[setting.key];
      if (input) input.value = setting.value || '';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveSettings(new FormData(e.target));
    });
  } catch (error) {
    console.error('Error loading settings:', error);
    showToast('Gagal memuat pengaturan', 'error');
  }
}

async function saveSettings(formData) {
  const supabase = getSupabase();
  try {
    const settings = [
      { key: 'whatsapp_number', value: formData.get('whatsapp_number') },
      { key: 'email', value: formData.get('email') },
      { key: 'location_address', value: formData.get('location_address') },
      { key: 'operating_hours', value: formData.get('operating_hours') },
      { key: 'hero_title', value: formData.get('hero_title') },
      { key: 'hero_subtitle', value: formData.get('hero_subtitle') }
    ];

    for (const setting of settings) {
      const { error } = await supabase
        .from('settings')
        .upsert(setting, { onConflict: 'key' });
      
      if (error) throw error;
    }

    showToast('Pengaturan berhasil disimpan');
  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('Gagal menyimpan pengaturan', 'error');
  }
}

// Close Modal
function closeModal() {
  document.getElementById('modal').classList.remove('show');
  document.getElementById('modalBackdrop').classList.remove('show');
}

window.closeModal = closeModal;

// Click outside modal to close
document.getElementById('modalBackdrop')?.addEventListener('click', closeModal);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});



