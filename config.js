// Supabase Configuration
// PENTING: Ganti dengan kredensial Supabase Anda

window.SUPABASE_CONFIG = {
  url: 'https://jrbvxdstpobmfavurvsh.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyYnZ4ZHN0cG9ibWZhdnVydnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDE0NzgsImV4cCI6MjEwMjA3NzQ3OH0.iHDDFD7PuN0OV-mCX7XS30QYgJbvHf20HwQJDZoJoys'
};

console.log('🔧 Config.js loaded!');
console.log('📊 Supabase URL:', window.SUPABASE_CONFIG.url);

// Function to initialize Supabase client
window.initializeSupabase = function() {
  console.log('🚀 initializeSupabase() called');
  
  if (!window.supabase) {
    console.error('❌ window.supabase not found!');
    return false;
  }
  
  if (!window.supabase.createClient) {
    console.error('❌ window.supabase.createClient not found!');
    console.log('window.supabase type:', typeof window.supabase);
    console.log('window.supabase keys:', Object.keys(window.supabase || {}));
    return false;
  }

  try {
    console.log('✅ Creating Supabase client...');
    
    // Store the createClient function
    const createClientFunc = window.supabase.createClient;
    
    // Create the Supabase client
    const client = createClientFunc(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
    
    // Verify client
    if (!client.from || typeof client.from !== 'function') {
      console.error('❌ Created client missing .from() method!');
      console.log('Client type:', typeof client);
      console.log('Client keys:', Object.keys(client).slice(0, 15));
      return false;
    }
    
    // Overwrite with client instance
    window.supabase = client;
    window.supabaseClient = client;
    
    console.log('✅ Supabase client initialized successfully!');
    console.log('✅ typeof window.supabase.from:', typeof window.supabase.from);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    return false;
  }
};

// Try to initialize immediately
console.log('⏳ Attempting immediate initialization...');
if (window.supabase) {
  console.log('✅ window.supabase exists, initializing now...');
  window.initializeSupabase();
} else {
  console.log('⚠️ window.supabase not ready yet, will retry from script.js');
}
