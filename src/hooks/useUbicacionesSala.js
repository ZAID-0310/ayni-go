import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { supabase } from '../../lib/supabase';

// Lee ubicaciones_sala cada pocos segundos mientras haya sala activa.
// activo=false (o salaId=null) detiene el polling y limpia los datos.
export default function useUbicacionesSala(salaId, activo = true, intervaloMs = 4000) {
  const [chofer, setChofer] = useState(null); // {lat, lng, actualizado_en} | null
  const [pasajeros, setPasajeros] = useState([]); // [{pasajero_id, nombre, lat, lng, actualizado_en}]
  const enCursoRef = useRef(false);

  useEffect(() => {
    if (!salaId || !activo) {
      setChofer(null);
      setPasajeros([]);
      return undefined;
    }

    let cancelado = false;

    const leer = async () => {
      if (enCursoRef.current) return; // evita solapar llamadas
      enCursoRef.current = true;
      try {
        const { data, error } = await supabase.rpc('ubicaciones_sala', { p_sala_id: salaId });
        if (cancelado || error || !data) return;
        setChofer(data.chofer ?? null);
        setPasajeros(Array.isArray(data.pasajeros) ? data.pasajeros : []);
      } finally {
        enCursoRef.current = false;
      }
    };

    leer();
    const timer = setInterval(() => {
      if (AppState.currentState === 'active') leer(); // pausa si la app está en segundo plano
    }, intervaloMs);

    return () => {
      cancelado = true;
      clearInterval(timer);
    };
  }, [salaId, activo, intervaloMs]);

  return { chofer, pasajeros };
}