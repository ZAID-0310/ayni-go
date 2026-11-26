import { useCallback, useState } from 'react';
import { supabase } from '../../lib/supabase';


export function useCalificaciones() {
  const [pendientes, setPendientes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);

  const abrir = useCallback(async (salaId) => {
    if (!salaId) return;
    const { data, error: err } = await supabase.rpc('calificaciones_pendientes', {
      p_sala_id: salaId,
    });
    if (err) {
      console.error('Error al cargar calificaciones:', err.message);
      return;
    }
    if (data && data.length > 0) {
      setPendientes(data);
      setError(null);
      setVisible(true);
    }
  }, []);

  const calificar = useCallback(async (salaId, usuarioId, estrellas, comentario) => {
    setError(null);
    const { error: err } = await supabase.rpc('calificar', {
      p_sala_id: salaId,
      p_calificado_id: usuarioId,
      p_estrellas: estrellas,
      p_comentario: comentario || null,
    });
    if (err) {
      setError(err.message);
      return false;
    }
    return true;
  }, []);

  const cerrar = useCallback(() => setVisible(false), []);

  return { pendientes, visible, error, abrir, calificar, cerrar };
}