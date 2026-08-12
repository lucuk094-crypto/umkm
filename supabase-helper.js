// Supabase Helper - Initializes Supabase client immediately
console.log('🔄 Supabase helper loaded');

// Check if dependencies are available
if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase CDN library not loaded! Make sure <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> is loaded first.');
}

if (typeof window.SUPABASE_CONFIG === 'undefined') {
  console.error('❌ SUPABASE_CONFIG not found! Make sure config.js is loaded first.');
}

// Initialize immediately - scripts are loaded synchronously
if (window.supabase && window.supabase.createClient && window.SUPABASE_CONFIG) {
  try {
    console.log('🔧 Creating Supabase client...');
    console.log('📊 Project URL:', window.SUPABASE_CONFIG.url);
    
    // Store the createClient function before overwriting
    const { createClient } = window.supabase;
    
    // Create client instance
    const client = createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
    
    // Verify client has necessary methods
    if (!client.from) {
      console.error('❌ Supabase client missing .from() method!');
    }
    
    // Set global references
    window.supabaseClient = client;
    window.supabase = client;
    
    console.log('✅ Supabase client initialized successfully');
    console.log('✅ Methods available:', Object.keys(client).join(', '));
    
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
  }
} else {
  console.error('❌ Cannot initialize Supabase - missing dependencies');
  console.log('Debug info:', {
    hasSupabaseLibrary: !!window.supabase,
    hasCreateClient: !!(window.supabase && window.supabase.createClient),
    hasConfig: !!window.SUPABASE_CONFIG
  });
}
