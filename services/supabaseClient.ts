
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const getEnv = (key: string) => {
  try {
    // Intenta obtener de process (Vercel/Node) o import.meta (Vite)
    // @ts-ignore
    return (typeof process !== 'undefined' && process.env && process.env[key]) || 
           // @ts-ignore
           (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) || 
           '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
