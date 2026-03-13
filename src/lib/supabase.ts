/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

export const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);
export const isLocalAuthBypassEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_LOCAL_AUTH_BYPASS === 'true';
export const localAuthStorageKey = 'local-auth-bypass-session';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
