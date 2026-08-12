// Upload Helper - Drag & Drop Image Upload to Supabase Storage
// UMKM Desa Mlancu

class ImageUploader {
  constructor(config) {
    this.containerId = config.containerId;
    this.bucket = config.bucket; // 'products', 'producers', or 'gallery'
    this.onSuccess = config.onSuccess || (() => {});
    this.onError = config.onError || (() => {});
    this.maxSize = config.maxSize || 5 * 1024 * 1024; // 5MB default
    this.allowedTypes = config.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="upload-area" id="${this.containerId}-area">
        <div class="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div class="upload-text">
          <strong>Drag & drop gambar di sini</strong>
          <span>atau klik untuk pilih file</span>
        </div>
        <input type="file" id="${this.containerId}-input" accept="image/*" hidden>
        <div class="upload-progress" id="${this.containerId}-progress" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill" id="${this.containerId}-fill"></div>
          </div>
          <span class="progress-text" id="${this.containerId}-text">Uploading...</span>
        </div>
        <div class="upload-preview" id="${this.containerId}-preview" style="display: none;">
          <img id="${this.containerId}-img" alt="Preview">
          <button type="button" class="btn-remove" id="${this.containerId}-remove">✕</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const area = document.getElementById(`${this.containerId}-area`);
    const input = document.getElementById(`${this.containerId}-input`);
    const removeBtn = document.getElementById(`${this.containerId}-remove`);

    // Click to select file
    area.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-remove')) {
        input.click();
      }
    });

    // File selected
    input.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFile(e.target.files[0]);
      }
    });

    // Drag & drop
    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('drag-over');
    });

    area.addEventListener('dragleave', () => {
      area.classList.remove('drag-over');
    });

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length > 0) {
        this.handleFile(e.dataTransfer.files[0]);
      }
    });

    // Remove image
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.reset();
      });
    }
  }

  async handleFile(file) {
    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.onError('Format file tidak didukung. Gunakan JPG, PNG, atau GIF');
      return;
    }

    // Validate file size
    if (file.size > this.maxSize) {
      this.onError(`Ukuran file terlalu besar. Maksimal ${this.maxSize / 1024 / 1024}MB`);
      return;
    }

    // Show progress
    this.showProgress();

    try {
      // Upload to Supabase Storage
      const url = await this.uploadToSupabase(file);
      
      // Show preview
      this.showPreview(url);
      
      // Callback
      this.onSuccess(url);
    } catch (error) {
      console.error('Upload error:', error);
      this.onError(error.message || 'Gagal upload gambar');
      this.hideProgress();
    }
  }

  async uploadToSupabase(file) {
    if (!window.supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filepath = `${filename}`;

    // Upload file
    const { data, error } = await window.supabase.storage
      .from(this.bucket)
      .upload(filepath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: urlData } = window.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filepath);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return urlData.publicUrl;
  }

  showProgress() {
    document.getElementById(`${this.containerId}-progress`).style.display = 'block';
    document.getElementById(`${this.containerId}-preview`).style.display = 'none';
    
    // Simulate progress (since Supabase doesn't provide real progress)
    let progress = 0;
    const fill = document.getElementById(`${this.containerId}-fill`);
    const text = document.getElementById(`${this.containerId}-text`);
    
    const interval = setInterval(() => {
      progress += 10;
      fill.style.width = progress + '%';
      text.textContent = `Uploading... ${progress}%`;
      
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);
    
    // Store interval ID to clear later
    this.progressInterval = interval;
  }

  hideProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    document.getElementById(`${this.containerId}-progress`).style.display = 'none';
    const fill = document.getElementById(`${this.containerId}-fill`);
    const text = document.getElementById(`${this.containerId}-text`);
    fill.style.width = '0%';
    text.textContent = 'Uploading...';
  }

  showPreview(url) {
    this.hideProgress();
    
    const preview = document.getElementById(`${this.containerId}-preview`);
    const img = document.getElementById(`${this.containerId}-img`);
    
    img.src = url;
    preview.style.display = 'flex';
    
    // Store URL for later use
    this.uploadedUrl = url;
  }

  reset() {
    const preview = document.getElementById(`${this.containerId}-preview`);
    const input = document.getElementById(`${this.containerId}-input`);
    
    preview.style.display = 'none';
    input.value = '';
    this.uploadedUrl = null;
    
    this.onSuccess('');
  }

  getUploadedUrl() {
    return this.uploadedUrl || '';
  }

  setPreviewUrl(url) {
    if (url) {
      const preview = document.getElementById(`${this.containerId}-preview`);
      const img = document.getElementById(`${this.containerId}-img`);
      
      img.src = url;
      preview.style.display = 'flex';
      this.uploadedUrl = url;
    }
  }
}

// Global helper function untuk create uploader
window.createImageUploader = function(config) {
  return new ImageUploader(config);
};
