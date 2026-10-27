import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // copia la misma línea de useHistorial.js

export default function useTotalViajes() {
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      const { data, error } = await supabase.rpc('mi_historial', {
        p_limite: 1000,
        p_offset: 0,
      });
      if (!activo) return;
      if (!error && Array.isArray(data)) setTotal(data.length);
      setCargando(false);
    };

    cargar();
    return () => { activo = false; };
  }, []);

  return { total, cargando };
}