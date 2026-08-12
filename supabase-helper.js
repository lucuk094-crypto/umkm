// Supabase Helper - Simple and reliable initialization
(function() {
  console.log('🔄 Loading Supabase helper...');
  
  function initSupabase() {
    // Check if Supabase CDN and config are loaded
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.error('❌ Supabase library not loaded');
      return false;
    }
    
    if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.anonKey) {
      console.error('❌ SUPABASE_CONFIG not found');
      return false;
    }
    
    try {
      // Store reference to createClient before overwriting
      const { createClient } = window.supabase;
      
      // Create the client
      const client = createClient(
        window.SUPABASE_CONFIG.url,
        window.SUPABASE_CONFIG.anonKey
      );
      
      // Set both references
      window.supabaseClient = client;
      window.supabase = client;
      
      console.log('✅ Supabase initialized successfully');
      console.log('📊 Project:', window.SUPABASE_CONFIG.url);
      return true;
    } catch (error) {
      console.error('❌ Error initializing Supabase:', error);
      return false;
    }
  }
  
  // Try to initialize immediately if DOM is ready
  if (document.readyState !== 'loading') {
    setTimeout(initSupabase, 100);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initSupabase, 100);
    });
  }
})();
