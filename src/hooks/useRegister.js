import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export function useRegister({ onRegistroExitoso }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(null);
  const [otp, setOtp] = useState('');
  const [etapa, setEtapa] = useState('formulario'); 
  const [loading, setLoading] = useState(false);

  const enviarCodigo = async () => {
    if (!nombre.trim() || !email.trim() || !password || !rol) {
      Alert.alert('Faltan datos', 'Completa tu nombre, correo, contraseña y elige tu rol.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error al registrarse', error.message);
      return;
    }

    Alert.alert('Código enviado', 'Revisa tu correo e ingresa el código para completar tu registro.');
    setEtapa('verificar');
  };

    const reenviarCodigo = async () => {
        setLoading(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email.trim().toLowerCase(),
        });
        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
            return;
        }

        Alert.alert('Código reenviado', 'Revisa tu correo de nuevo.');
    };

  const registrarse = async () => {
    if (!otp.trim()) {
      Alert.alert('Falta el código', 'Ingresa el código de 6 dígitos que te llegó al correo.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'signup',
    });

    if (error) {
      setLoading(false);
      Alert.alert('Error al verificar', error.message);
      return;
    }

    const dominioCorreo = email.trim().toLowerCase().split('@')[1];

    const { error: errorPerfil } = await supabase.from('usuarios').insert({
      id: data.user.id,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      rol: rol,
      es_institucional: true,
      dominio_email: dominioCorreo,
    });

    setLoading(false);

    if (errorPerfil) {
      Alert.alert('Error guardando perfil', errorPerfil.message);
      return;
    }

    await supabase.auth.signOut();

    Alert.alert('¡Registro exitoso!', 'Ahora inicia sesión con tu correo y contraseña.');
    if (onRegistroExitoso) onRegistroExitoso();
  };

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    rol,
    setRol,
    otp,
    setOtp,
    etapa,
    setEtapa,
    loading,
    enviarCodigo,
    registrarse,
    reenviarCodigo,
  };
}