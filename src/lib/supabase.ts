import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Auth kullanmıyoruz
    autoRefreshToken: false,
  },
});

// Database types
export interface Session {
  id: string;
  owner: string;
  repo: string;
  branch: string;
  created_at: string;
  last_accessed_at: string;
  expires_at: string;
  is_active: boolean;
}