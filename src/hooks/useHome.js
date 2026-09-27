import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export function useHome({ onCerrarSesion }) {
  const [loading, setLoading] = useState(false);

  const cerrarSesion = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      Alert.alert('Error al cerrar sesión', error.message);
      return;
    }

    if (onCerrarSesion) {
      onCerrarSesion();
    }
  };

  return {
    loading,
    cerrarSesion,
  };
}