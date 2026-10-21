import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function useHistorial() {
  const [viajes, setViajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const { data, error: err } = await supabase.rpc('mi_historial', {
      p_limite: 30,
      p_offset: 0,
    });
    if (err) {
      setError(err.message);
    } else {
      setViajes(Array.isArray(data) ? data : []);    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { viajes, cargando, error, recargar: cargar };
}