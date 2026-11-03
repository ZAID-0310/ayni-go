import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useMisCalificaciones() {
  const [promedio, setPromedio] = useState(null);
  const [total, setTotal] = useState(0);
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const { data, error: err } = await supabase.rpc('mis_calificaciones_recibidas');
    if (err) {
      console.error('Error al cargar calificaciones:', err.message);
      setError('No se pudieron cargar tus calificaciones');
    } else if (data) {
      setPromedio(data.promedio);
      setTotal(data.total || 0);
      setLista(data.lista || []);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { promedio, total, lista, cargando, error, recargar: cargar };
}