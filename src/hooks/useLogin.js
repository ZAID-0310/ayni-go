import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export function useLogin({ rol, onLoginExitoso }) {
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

    if (error) {
      setLoading(false);
      Alert.alert('Error al iniciar sesión', error.message);
      return;
    }

    // Verifica que la cuenta pertenezca a la entrada elegida
    const { data: perfil, error: errorPerfil } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', data.user.id)
      .maybeSingle();

    if (errorPerfil || !perfil) {
      await supabase.auth.signOut();
      setLoading(false);
      Alert.alert('Error', 'No se pudo cargar tu perfil. Intenta de nuevo.');
      return;
    }

    if (rol && perfil.rol !== rol) {
      await supabase.auth.signOut();
      setLoading(false);
      Alert.alert(
        'Tipo de cuenta incorrecto',
        perfil.rol === 'chofer'
          ? 'Esta cuenta es de chofer. Entra por "Soy chofer".'
          : 'Esta cuenta es de pasajero. Entra por "Soy pasajero".'
      );
      return;
    }

    setLoading(false);
    if (onLoginExitoso) onLoginExitoso(data.user);
  };

  return { email, setEmail, password, setPassword, loading, iniciarSesion };
}