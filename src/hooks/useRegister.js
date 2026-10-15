import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export function useRegister({ rol, onRegistroExitoso }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [etapa, setEtapa] = useState('formulario');
  const [loading, setLoading] = useState(false);

  const enviarCodigo = async () => {
    if (!nombre.trim() || !email.trim() || !password) {
      Alert.alert('Faltan datos', 'Completa tu nombre, correo y contraseña.');
      return;
    }
    if (!rol) {
      Alert.alert('Falta el tipo de cuenta', 'Vuelve atrás y elige si eres pasajero o chofer.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    // El rol viaja en los metadatos: el Auth Hook lo lee y rechaza
    // el dominio no permitido ANTES de enviar el OTP.
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { rol } },
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

    // Segundo candado: el trigger valida dominio + rol y calcula
    // email, dominio_email y es_institucional en el servidor.
    const { error: errorPerfil } = await supabase.from('usuarios').insert({
      id: data.user.id,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      rol,
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
    nombre, setNombre,
    email, setEmail,
    password, setPassword,
    otp, setOtp,
    etapa, setEtapa,
    loading,
    enviarCodigo,
    registrarse,
    reenviarCodigo,
  };
}