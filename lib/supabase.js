import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


// fetch propio: si no hay internet, el mensaje sale claro en toda la app
const fetchConAviso = async (...args) => {
  try {
    return await fetch(...args);
  } catch (e) {
    throw new TypeError('Sin conexión a internet. Revisa tu red e inténtalo de nuevo.');
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: fetchConAviso },
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});