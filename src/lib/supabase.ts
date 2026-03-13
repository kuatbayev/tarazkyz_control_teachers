/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

export const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);
export const isLocalAuthBypassEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_LOCAL_AUTH_BYPASS === 'true';
export const localAuthStorageKey = 'local-auth-bypass-session';
export const rememberMeStorageKey = 'auth-remember-me';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

const isBrowser = typeof window !== 'undefined';

const shouldRememberSession = () => {
  if (!isBrowser) {
    return true;
  }

  return window.localStorage.getItem(rememberMeStorageKey) !== 'false';
};

const authStorage = {
  getItem(key: string) {
    if (!isBrowser) {
      return null;
    }

    if (shouldRememberSession()) {
      return window.localStorage.getItem(key);
    }

    return window.sessionStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (!isBrowser) {
      return;
    }

    if (shouldRememberSession()) {
      window.sessionStorage.removeItem(key);
      window.localStorage.setItem(key, value);
      return;
    }

    window.localStorage.removeItem(key);
    window.sessionStorage.setItem(key, value);
  },
  removeItem(key: string) {
    if (!isBrowser) {
      return;
    }

    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export const setRememberMePreference = (rememberMe: boolean) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(rememberMeStorageKey, rememberMe ? 'true' : 'false');
};

export const getRememberMePreference = () => {
  if (!isBrowser) {
    return true;
  }

  return shouldRememberSession();
};

export const setStoredLocalAuthSession = (rememberMe: boolean) => {
  if (!isBrowser) {
    return;
  }

  if (rememberMe) {
    window.sessionStorage.removeItem(localAuthStorageKey);
    window.localStorage.setItem(localAuthStorageKey, 'true');
    return;
  }

  window.localStorage.removeItem(localAuthStorageKey);
  window.sessionStorage.setItem(localAuthStorageKey, 'true');
};

export const getStoredLocalAuthSession = () => {
  if (!isBrowser) {
    return false;
  }

  return (
    window.localStorage.getItem(localAuthStorageKey) === 'true' ||
    window.sessionStorage.getItem(localAuthStorageKey) === 'true'
  );
};

export const clearStoredLocalAuthSession = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(localAuthStorageKey);
  window.sessionStorage.removeItem(localAuthStorageKey);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
