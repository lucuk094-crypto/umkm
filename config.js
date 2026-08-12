// Supabase Configuration
// PENTING: Ganti dengan kredensial Supabase Anda

window.SUPABASE_CONFIG = {
  url: 'https://jrbvxdstpobmfavurvsh.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyYnZ4ZHN0cG9ibWZhdnVydnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDE0NzgsImV4cCI6MjEwMjA3NzQ3OH0.iHDDFD7PuN0OV-mCX7XS30QYgJbvHf20HwQJDZoJoys'
};

console.log('🔧 Config.js loaded!');
console.log('📊 Supabase URL:', window.SUPABASE_CONFIG.url);

// Track initialization state
window.SUPABASE_READY = false;
window.SUPABASE_INIT_ATTEMPTS = 0;

// Function to initialize Supabase client
window.initializeSupabase = function() {
  window.SUPABASE_INIT_ATTEMPTS++;
  console.log(`🚀 initializeSupabase() called (attempt #${window.SUPABASE_INIT_ATTEMPTS})`);
  
  // Check if Supabase library is loaded
  if (typeof window.supabase === 'undefined') {
    console.error('❌ window.supabase is undefined - CDN not loaded yet');
    return false;
  }
  
  // Check if createClient exists
  if (typeof window.supabase.createClient !== 'function') {
    console.error('❌ window.supabase.createClient is not a function');
    console.log('📊 Debug - window.supabase type:', typeof window.supabase);
    console.log('📊 Debug - window.supabase keys:', Object.keys(window.supabase || {}).slice(0, 20));
    return false;
  }

  try {
    console.log('✅ Supabase CDN loaded, creating client...');
    
    // Store the createClient function before overwriting
    const { createClient } = window.supabase;
    
    // Create the Supabase client instance
    const client = createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
    
    // Verify client has necessary methods
    if (!client || typeof client.from !== 'function') {
      console.error('❌ Created client is invalid or missing .from() method!');
      console.log('📊 Client type:', typeof client);
      console.log('📊 Client keys:', Object.keys(client || {}).slice(0, 20));
      return false;
    }
    
    // Set global references (overwrite the library object with client instance)
    window.supabase = client;
    window.supabaseClient = client;
    window.SUPABASE_READY = true;
    
    console.log('✅ Supabase client initialized successfully!');
    console.log('✅ Client methods available:', Object.keys(client).slice(0, 10).join(', '));
    console.log('✅ window.SUPABASE_READY = true');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    console.error('📊 Error stack:', error.stack);
    return false;
  }
};

// Wait for Supabase CDN to load with polling
window.waitForSupabaseCDN = function(callback, maxAttempts = 50, interval = 100) {
  let attempts = 0;
  
  console.log('⏳ Waiting for Supabase CDN to load...');
  
  const checkInterval = setInterval(() => {
    attempts++;
    
    // Check if Supabase CDN loaded
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      console.log(`✅ Supabase CDN loaded after ${attempts * interval}ms`);
      clearInterval(checkInterval);
      
      // Initialize now
      const success = window.initializeSupabase();
      
      if (success && callback) {
        callback(true);
      }
      
      return;
    }
    
    // Max attempts reached
    if (attempts >= maxAttempts) {
      console.error(`❌ Supabase CDN failed to load after ${attempts * interval}ms`);
      console.error('📊 window.supabase type:', typeof window.supabase);
      clearInterval(checkInterval);
      
      if (callback) {
        callback(false);
      }
    }
  }, interval);
};

// Start waiting for CDN
console.log('⏳ Starting CDN wait polling...');
window.waitForSupabaseCDN((success) => {
  if (success) {
    console.log('🎉 Supabase fully initialized and ready!');
  } else {
    console.error('💔 Supabase initialization failed');
  }
});
