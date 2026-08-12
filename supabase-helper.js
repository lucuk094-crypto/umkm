// Supabase Helper - Initialize Supabase client
(function() {
  let retryCount = 0;
  const maxRetries = 50; // 5 seconds total (50 * 100ms)
  
  // Wait for Supabase CDN to load
  function initSupabase() {
    // Check if Supabase CDN loaded
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      // Check if config exists
      if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
        try {
          // Create client if not exists
          if (!window.supabaseClient) {
            const supabaseLib = window.supabase; // Save reference to library
            
            window.supabaseClient = supabaseLib.createClient(
              window.SUPABASE_CONFIG.url,
              window.SUPABASE_CONFIG.anonKey
            );
            
            // Use supabaseClient as the main client
            window.supabase = window.supabaseClient;
            
            console.log('✅ Supabase initialized successfully');
            console.log('📊 Project URL:', window.SUPABASE_CONFIG.url);
            console.log('🔑 Anon Key:', window.SUPABASE_CONFIG.anonKey.substring(0, 20) + '...');
          }
        } catch (error) {
          console.error('❌ Error creating Supabase client:', error);
        }
      } else {
        console.error('❌ SUPABASE_CONFIG not found or incomplete');
        console.log('💡 Make sure config.js is loaded before supabase-helper.js');
      }
    } else {
      // Retry if not loaded yet
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(initSupabase, 100);
      } else {
        console.error('❌ Supabase CDN failed to load after 5 seconds');
        console.log('💡 Check your internet connection or try refreshing the page');
      }
    }
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
  } else {
    initSupabase();
  }
})();
