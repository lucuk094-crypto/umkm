// Product Gallery & Reviews Management for Admin Dashboard

// Global state
let currentEditProductId = null;
let productGalleryItems = [];
let productReviewsItems = [];

// Show product modal with tabs
async function showProductModalWithTabs(productId = null) {
  const isEdit = !!productId;
  currentEditProductId = productId;
  let product = null;
  
  if (isEdit) {
    const { data } = await window.supabase.from('products').select('*').eq('id', productId).single();
    product = data;
  }
  
  const { data: producers } = await window.supabase.from('producers').select('id, name');
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modalBackdrop');
  
  modal.innerHTML = `
    <div class="modal-header">
      <h3>${isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    
    <!-- Tabs Navigation -->
    <div class="modal-tabs">
      <button class="modal-tab active" data-tab="basic">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
        </svg>
        Info Dasar
      </button>
      ${isEdit ? `
      <button class="modal-tab" data-tab="gallery">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <path d="M21 15l-5-5L5 21"></path>
        </svg>
        Gallery
      </button>
      <button class="modal-tab" data-tab="reviews">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        Reviews
      </button>
      ` : ''}
    </div>
    
    <div class="modal-body">
      <!-- Tab: Basic Info -->
      <div class="tab-content active" id="tab-basic">
        <form id="productForm">
          <div class="form-row">
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
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Harga (Rp) *</label>
              <input type="number" name="price" value="${product?.price || ''}" required>
            </div>
            <div class="form-group">
              <label>Stok</label>
              <input type="number" name="stock" value="${product?.stock || 0}">
            </div>
          </div>
          
          <div class="form-group">
            <label>Pembuat</label>
            <select name="producer_id">
              <option value="">Pilih Pengrajin</option>
              ${producers?.map(p => `<option value="${p.id}" ${product?.producer_id === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label>Deskripsi Singkat</label>
            <textarea name="description" rows="2" placeholder="Deskripsi singkat untuk card produk">${product?.description || ''}</textarea>
          </div>
          
          <div class="form-group">
            <label>Deskripsi Lengkap</label>
            <textarea name="long_description" rows="4" placeholder="Deskripsi detail yang muncul di modal produk">${product?.long_description || ''}</textarea>
          </div>
          
          <div class="form-group">
            <label>Proses Pembuatan</label>
            <textarea name="process" rows="3" placeholder="Jelaskan proses pembuatan produk">${product?.process || ''}</textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Bahan Baku</label>
              <input type="text" name="material" value="${product?.material || ''}" placeholder="Contoh: Singkong lokal">
            </div>
            <div class="form-group">
              <label>Berat (gram)</label>
              <input type="number" name="weight" value="${product?.weight || ''}" placeholder="250">
            </div>
          </div>
          
          <div class="form-group">
            <label>Dimensi (PxLxT cm)</label>
            <input type="text" name="dimensions" value="${product?.dimensions || ''}" placeholder="20x15x5">
          </div>
          
          <div class="form-group">
            <label>Gambar Utama Produk</label>
            <div id="productImageUpload"></div>
            <input type="hidden" name="image_url" id="productImageUrl" value="${product?.image_url || ''}">
          </div>
          
          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" name="is_active" ${product?.is_active !== false ? 'checked' : ''}>
              <span>Produk Aktif (tampil di website)</span>
            </label>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" onclick="closeModal()">Batal</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update Produk' : 'Simpan Produk'}</button>
          </div>
        </form>
      </div>
      
      ${isEdit ? `
      <!-- Tab: Gallery -->
      <div class="tab-content" id="tab-gallery">
        <div class="tab-header">
          <p class="muted">Upload foto/video proses pembuatan, hasil produk, atau foto detail produk</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="addGalleryItem()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tambah Media
          </button>
        </div>
        <div id="galleryList" class="gallery-grid">
          <!-- Gallery items will be loaded here -->
        </div>
      </div>
      
      <!-- Tab: Reviews -->
      <div class="tab-content" id="tab-reviews">
        <div class="tab-header">
          <p class="muted">Kelola ulasan dan testimoni pembeli untuk produk ini</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="addReview()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tambah Review
          </button>
        </div>
        <div id="reviewsList">
          <!-- Reviews will be loaded here -->
        </div>
      </div>
      ` : ''}
    </div>
  `;
  
  backdrop.classList.add('show');
  modal.classList.add('show');
  
  // Initialize tabs
  initModalTabs();
  
  // Initialize image uploader for main product image
  const uploader = window.createImageUploader({
    containerId: 'productImageUpload',
    bucket: 'products',
    onSuccess: (url) => {
      document.getElementById('productImageUrl').value = url;
    },
    onError: (error) => {
      showToast(error, 'error');
    }
  });
  
  if (product?.image_url) {
    uploader.setPreviewUrl(product.image_url);
  }
  
  // Form submit handler
  document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveProductFromModal(productId, new FormData(e.target));
  });
  
  // Load gallery and reviews if editing
  if (isEdit) {
    loadProductGallery(productId);
    loadProductReviews(productId);
  }
}

// Initialize modal tabs
function initModalTabs() {
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active to clicked tab
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });
}

// Save product (basic info)
async function saveProductFromModal(productId, formData) {
  try {
    const data = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: parseInt(formData.get('price')),
      description: formData.get('description') || null,
      long_description: formData.get('long_description') || null,
      process: formData.get('process') || null,
      material: formData.get('material') || null,
      weight: formData.get('weight') ? parseInt(formData.get('weight')) : null,
      dimensions: formData.get('dimensions') || null,
      stock: parseInt(formData.get('stock')) || 0,
      image_url: formData.get('image_url') || null,
      is_active: formData.get('is_active') === 'on',
      producer_id: formData.get('producer_id') || null,
      producer_name: null
    };
    
    if (data.producer_id && data.producer_id !== '') {
      try {
        const { data: producer } = await window.supabase
          .from('producers')
          .select('name')
          .eq('id', data.producer_id)
          .single();
        
        if (producer) data.producer_name = producer.name;
      } catch (e) {
        console.warn('Could not fetch producer name:', e);
      }
    }
    
    if (productId) {
      const { error } = await window.supabase.from('products').update(data).eq('id', productId);
      if (error) throw error;
      showToast('✅ Produk berhasil diupdate');
    } else {
      const { data: newProduct, error } = await window.supabase.from('products').insert([data]).select().single();
      if (error) throw error;
      showToast('✅ Produk berhasil ditambahkan');
      
      // Update current product ID for gallery/reviews
      currentEditProductId = newProduct.id;
      
      // Reload modal with edit mode
      setTimeout(() => {
        showProductModalWithTabs(newProduct.id);
      }, 500);
    }
    
    if (productId) closeModal();
    loadProducts();
  } catch (error) {
    console.error('Error saving product:', error);
    showToast(`Gagal menyimpan produk: ${error.message}`, 'error');
  }
}

// Load product gallery
async function loadProductGallery(productId) {
  try {
    const { data, error } = await window.supabase
      .from('product_gallery')
      .select('*')
      .eq('product_id', productId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    productGalleryItems = data || [];
    renderProductGallery();
    
  } catch (error) {
    console.error('Error loading gallery:', error);
    document.getElementById('galleryList').innerHTML = '<p class="muted center">Gagal memuat gallery</p>';
  }
}

// Render product gallery
function renderProductGallery() {
  const container = document.getElementById('galleryList');
  
  if (productGalleryItems.length === 0) {
    container.innerHTML = '<p class="muted center" style="grid-column: 1/-1;">Belum ada media. Klik "Tambah Media" untuk upload.</p>';
    return;
  }
  
  container.innerHTML = productGalleryItems.map((item, index) => `
    <div class="gallery-item" data-id="${item.id}">
      <div class="gallery-preview">
        ${item.media_type === 'video' ? 
          `<video src="${item.media_url}" style="width:100%;height:100%;object-fit:cover;"></video>
           <div class="video-badge">VIDEO</div>` :
          `<img src="${item.media_url}" style="width:100%;height:100%;object-fit:cover;">`
        }
      </div>
      <div class="gallery-info">
        <input type="text" placeholder="Caption (optional)" value="${item.caption || ''}" 
               onchange="updateGalleryCaption('${item.id}', this.value)" 
               style="width:100%;padding:8px;background:var(--glass);border:1px solid var(--border);border-radius:8px;color:var(--fg);font-size:0.85rem;">
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-icon" onclick="moveGalleryItem('${item.id}', -1)" title="Move up">↑</button>
          <button class="btn-icon" onclick="moveGalleryItem('${item.id}', 1)" title="Move down">↓</button>
          <button class="btn-icon danger" onclick="deleteGalleryItem('${item.id}')" title="Delete">🗑</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Add gallery item
function addGalleryItem() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,video/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      showToast('Uploading media...', 'info');
      
      const isVideo = file.type.startsWith('video/');
      const fileName = `${currentEditProductId}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data, error } = await window.supabase.storage
        .from('product-gallery')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = window.supabase.storage
        .from('product-gallery')
        .getPublicUrl(fileName);
      
      // Insert to database
      const { error: dbError } = await window.supabase
        .from('product_gallery')
        .insert([{
          product_id: currentEditProductId,
          media_url: publicUrl,
          media_type: isVideo ? 'video' : 'image',
          order_index: productGalleryItems.length
        }]);
      
      if (dbError) throw dbError;
      
      showToast('✅ Media berhasil ditambahkan');
      loadProductGallery(currentEditProductId);
      
    } catch (error) {
      console.error('Error uploading media:', error);
      showToast('Gagal upload media: ' + error.message, 'error');
    }
  };
  input.click();
}

// Update gallery caption
async function updateGalleryCaption(id, caption) {
  try {
    const { error } = await window.supabase
      .from('product_gallery')
      .update({ caption })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating caption:', error);
    showToast('Gagal update caption', 'error');
  }
}

// Move gallery item order
async function moveGalleryItem(id, direction) {
  const index = productGalleryItems.findIndex(item => item.id === id);
  const newIndex = index + direction;
  
  if (newIndex < 0 || newIndex >= productGalleryItems.length) return;
  
  // Swap orders
  const temp = productGalleryItems[index].order_index;
  productGalleryItems[index].order_index = productGalleryItems[newIndex].order_index;
  productGalleryItems[newIndex].order_index = temp;
  
  try {
    await window.supabase
      .from('product_gallery')
      .update({ order_index: productGalleryItems[index].order_index })
      .eq('id', productGalleryItems[index].id);
    
    await window.supabase
      .from('product_gallery')
      .update({ order_index: productGalleryItems[newIndex].order_index })
      .eq('id', productGalleryItems[newIndex].id);
    
    loadProductGallery(currentEditProductId);
  } catch (error) {
    console.error('Error moving item:', error);
    showToast('Gagal mengubah urutan', 'error');
  }
}

// Delete gallery item
async function deleteGalleryItem(id) {
  if (!confirm('Hapus media ini?')) return;
  
  try {
    const { error } = await window.supabase
      .from('product_gallery')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showToast('✅ Media dihapus');
    loadProductGallery(currentEditProductId);
  } catch (error) {
    console.error('Error deleting media:', error);
    showToast('Gagal menghapus media', 'error');
  }
}

// Load product reviews
async function loadProductReviews(productId) {
  try {
    const { data, error } = await window.supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    productReviewsItems = data || [];
    renderProductReviews();
    
  } catch (error) {
    console.error('Error loading reviews:', error);
    document.getElementById('reviewsList').innerHTML = '<p class="muted center">Gagal memuat reviews</p>';
  }
}

// Render product reviews
function renderProductReviews() {
  const container = document.getElementById('reviewsList');
  
  if (productReviewsItems.length === 0) {
    container.innerHTML = '<p class="muted center">Belum ada review. Klik "Tambah Review" untuk menambahkan.</p>';
    return;
  }
  
  container.innerHTML = productReviewsItems.map(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = new Date(review.created_at).toLocaleDateString('id-ID');
    
    return `
      <div class="review-item">
        <div class="review-header">
          <div>
            <strong>${review.customer_name}</strong>
            ${review.is_verified ? '<span class="badge-verified">✓ Verified</span>' : ''}
            <div class="review-stars" style="color: var(--gold);">${stars}</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn-sm btn-ghost" onclick="toggleReviewActive('${review.id}', ${!review.is_active})">
              ${review.is_active ? '👁️ Visible' : '🚫 Hidden'}
            </button>
            <button class="btn-sm btn-ghost" onclick="deleteReview('${review.id}')">🗑️</button>
          </div>
        </div>
        <p class="review-text">${review.review_text}</p>
        <p class="muted small">Ditambahkan: ${date}</p>
      </div>
    `;
  }).join('');
}

// Add review
function addReview() {
  // Simple prompt-based review add (can be enhanced with modal)
  const name = prompt('Nama customer:');
  if (!name) return;
  
  const rating = parseInt(prompt('Rating (1-5):'));
  if (!rating || rating < 1 || rating > 5) {
    showToast('Rating harus 1-5', 'error');
    return;
  }
  
  const text = prompt('Review text:');
  if (!text) return;
  
  saveReview({ name, rating, text });
}

// Save review
async function saveReview({ name, rating, text }) {
  try {
    const { error } = await window.supabase
      .from('product_reviews')
      .insert([{
        product_id: currentEditProductId,
        customer_name: name,
        rating: rating,
        review_text: text,
        is_verified: false,
        is_active: true
      }]);
    
    if (error) throw error;
    
    showToast('✅ Review berhasil ditambahkan');
    loadProductReviews(currentEditProductId);
  } catch (error) {
    console.error('Error adding review:', error);
    showToast('Gagal menambahkan review', 'error');
  }
}

// Toggle review active status
async function toggleReviewActive(id, isActive) {
  try {
    const { error } = await window.supabase
      .from('product_reviews')
      .update({ is_active: isActive })
      .eq('id', id);
    
    if (error) throw error;
    
    showToast(`Review ${isActive ? 'ditampilkan' : 'disembunyikan'}`);
    loadProductReviews(currentEditProductId);
  } catch (error) {
    console.error('Error toggling review:', error);
    showToast('Gagal mengubah status review', 'error');
  }
}

// Delete review
async function deleteReview(id) {
  if (!confirm('Hapus review ini?')) return;
  
  try {
    const { error } = await window.supabase
      .from('product_reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showToast('✅ Review dihapus');
    loadProductReviews(currentEditProductId);
  } catch (error) {
    console.error('Error deleting review:', error);
    showToast('Gagal menghapus review', 'error');
  }
}

// Override original showProductModal
window.showProductModal = showProductModalWithTabs;
