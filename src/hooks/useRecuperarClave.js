import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useRecuperarClave({ onTerminado }) {
  const [paso, setPaso] = useState('correo'); // 'correo' | 'codigo' | 'clave'
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [clave, setClave] = useState('');
  const [clave2, setClave2] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const limpiar = () => {
    setError('');
    setInfo('');
  };

  const enviarCodigo = async () => {
    limpiar();
    const email = correo.trim().toLowerCase();
    if (!email.includes('@')) {
      setError('Escribe un correo válido.');
      return;
    }
    setCargando(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email);
    setCargando(false);
    if (err) {
      setError('No se pudo enviar el código. Intenta en unos minutos.');
      return;
    }
    setInfo('Si el correo está registrado, te enviamos un código.');
    setPaso('codigo');
  };

  const verificarCodigo = async () => {
    limpiar();
    if (codigo.trim().length < 6) {
      setError('Escribe el código completo.');
      return;
    }
    setCargando(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email: correo.trim().toLowerCase(),
      token: codigo.trim(),
      type: 'recovery',
    });
    setCargando(false);
    if (err) {
      setError('Código incorrecto o vencido.');
      return;
    }
    setPaso('clave');
  };

  const guardarClave = async () => {
    limpiar();
    if (clave.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (clave !== clave2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setCargando(true);
    const { error: err } = await supabase.auth.updateUser({ password: clave });
    if (err) {
      setCargando(false);
      setError('No se pudo guardar la contraseña. Intenta de nuevo.');
      return;
    }
    // verifyOtp abrió sesión: se cierra para que entre por el Login normal
    await supabase.auth.signOut();
    setCargando(false);
    onTerminado();
  };

  // Si abandona después de verificar el código, no deja una sesión abierta
  const cancelar = async (volver) => {
    if (paso === 'clave') await supabase.auth.signOut();
    volver();
  };

  return {
    paso, correo, setCorreo, codigo, setCodigo, clave, setClave, clave2, setClave2,
    cargando, error, info, enviarCodigo, verificarCodigo, guardarClave, cancelar,
  };
}