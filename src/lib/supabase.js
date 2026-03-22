import { createClient } from '@supabase/supabase-js';

// Use env vars (Cloudflare/Vercel injected), or fall back to the project defaults.
// The anon key is a public key — safe to embed in client-side code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    || 'https://syixfcvvnrmxsknuuhgf.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aXhmY3Z2bnJteHNrbnV1aGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjAzNDAsImV4cCI6MjA4NzkzNjM0MH0.cauM138JqM7ckPAb92apXfSAv5CTUiGqsZtnuCLv7jk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
