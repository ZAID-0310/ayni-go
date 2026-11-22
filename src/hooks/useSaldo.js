import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export default function useSaldo() {
  const [saldo, setSaldo] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

    const [refrescando, setRefrescando] = useState(false);

  const refrescar = useCallback(async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  }, [cargar]);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const [resSaldo, resMov] = await Promise.all([
      supabase.rpc('mi_saldo'),
      supabase.rpc('mis_movimientos', { p_limite: 30, p_desde: 0 }),
    ]);
    if (resSaldo.error) {
      setError(resSaldo.error.message);
    } else {
      setSaldo(resSaldo.data);
    }
    if (!resMov.error) {
      setMovimientos(resMov.data || []);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { saldo, movimientos, cargando, error, recargar: cargar };
}