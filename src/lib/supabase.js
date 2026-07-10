import { createClient } from '@supabase/supabase-js';

// Use env vars (Cloudflare/Vercel injected), or fall back to the project defaults.
// The anon key is a public key — safe to embed in client-side code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    || 'https://xlipywjzyuixdwngkmhm.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaXB5d2p6eXVpeGR3bmdrbWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NzE0NDAsImV4cCI6MjA5OTI0NzQ0MH0.1G1Vy1ZRJpYy-zr9NYs3u4HJMIxxnDSDp-FsgW77qKs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
