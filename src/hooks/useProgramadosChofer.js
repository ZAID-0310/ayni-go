import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export function useProgramadosChofer() {
  const [disponibles, setDisponibles] = useState([]);
  const [aceptados, setAceptados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    const { data, error: err } = await supabase.rpc('programados_disponibles');
    if (err) {
      console.log('programados_disponibles error:', err.message);
      setError(err.message);
    } else {
      setDisponibles(data?.disponibles ?? []);
      setAceptados(data?.aceptados ?? []);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 10000);
    return () => clearInterval(t);
  }, [cargar]);

  const ejecutar = async (nombre, params) => {
    setError(null);
    setTrabajando(true);
    const { data, error: err } = await supabase.rpc(nombre, params);
    if (err) setError(err.message);
    await cargar();
    setTrabajando(false);
    return err ? null : data;
  };

  const aceptar = (id) => ejecutar('aceptar_programado', { p_id: id });
  const soltar = (id) => ejecutar('soltar_programado', { p_id: id });

  // Crea la sala con todo el grupo y calcula la ruta real (sin esperar, como aceptarSala)
  const preparar = async (id) => {
    const r = await ejecutar('preparar_programado', { p_id: id });
    if (!r?.sala_id) return false;
    supabase.functions
      .invoke('ruta-sala', { body: { sala_id: r.sala_id } })
      .catch(() => {});
    return true;
  };

  return { disponibles, aceptados, cargando, trabajando, error, aceptar, soltar, preparar };
}