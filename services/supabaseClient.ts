
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Variables obtenidas del entorno (Vercel/Vite)
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Flag para verificar si la infraestructura de base de datos está lista.
 */
export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

/**
 * Cliente de Supabase. Solo se inicializa si hay configuración.
 */
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
