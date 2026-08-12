// Generate config.js from environment variables for Vercel deployment
const fs = require('fs');

const config = `// Supabase Configuration - Auto-generated from environment variables
window.SUPABASE_CONFIG = {
  url: '${process.env.VITE_SUPABASE_URL || 'https://jrbvxdstpobmfavurvsh.supabase.co'}',
  anonKey: '${process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyYnZ4ZHN0cG9ibWZhdnVydnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MDE0NzgsImV4cCI6MjEwMjA3NzQ3OH0.iHDDFD7PuN0OV-mCX7XS30QYgJbvHf20HwQJDZoJoys'}',
};
`;

fs.writeFileSync('config.js', config);
console.log('✅ config.js generated successfully');
