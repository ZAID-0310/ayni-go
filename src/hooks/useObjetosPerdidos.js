import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export function useObjetosPerdidos() {
  const [viajes, setViajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const { data, error: err } = await supabase.rpc('viajes_para_reportar');
    if (err) {
      console.error('Error al cargar viajes:', err.message);
      setError('No se pudieron cargar tus viajes');
      setViajes([]);
    } else {
      setViajes(Array.isArray(data) ? data : []);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const enviar = async ({ salaId, objeto, detalles, telefono, autoriza }) => {
    setEnviando(true);
    const { error: err } = await supabase.rpc('reportar_objeto_perdido', {
      p_sala_id: salaId,
      p_objeto: objeto,
      p_detalles: detalles,
      p_telefono: telefono,
      p_autoriza: autoriza,
    });
    setEnviando(false);
    if (err) return { ok: false, mensaje: err.message };
    return { ok: true };
  };

  return { viajes, cargando, error, cargar, enviando, enviar };
}