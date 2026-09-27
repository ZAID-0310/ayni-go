import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export function useLogin({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Faltan datos', 'Ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error al iniciar sesión', error.message);
      return;
    }

    if (onLoginExitoso && data.user) {
      onLoginExitoso(data.user);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    iniciarSesion,
  };
}