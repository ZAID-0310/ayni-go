import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

const INTERVALO_MS = 5000;

export function useSalasChofer() {
  const [solicitudes, setSolicitudes] = useState([]); // sin viaje: lo que puede aceptar
  const [viaje, setViaje] = useState(null);           // su sala aceptada
  const [candidatos, setCandidatos] = useState([]);   // pasajeros que puede sumar
  const [errorLista, setErrorLista] = useState(null); // del polling (no molesta)
  const [errorAccion, setErrorAccion] = useState(null); // de un botón que tocó
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [ahora, setAhora] = useState(Date.now());

  const refrescar = useCallback(async () => {
    const { data: v, error: e1 } = await supabase.rpc('mi_viaje_activo');
    if (e1) {
      setErrorLista(e1.message);
      return;
    }

    if (v) {
      setViaje(v);
      setSolicitudes([]);
      if (v.estado === 'abierta_con_chofer') {
        const { data: c, error: e2 } = await supabase.rpc('candidatos_para_sala', {
          p_sala_id: v.sala_id,
        });
        if (e2) {
          setErrorLista(e2.message);
          return;
        }
        setCandidatos(c ?? []);
      } else {
        setCandidatos([]);
      }
    } else {
      setViaje(null);
      setCandidatos([]);
      const { data: s, error: e3 } = await supabase.rpc('salas_disponibles');
      if (e3) {
        setErrorLista(e3.message);
        return;
      }
      setSolicitudes(s ?? []);
    }
    setErrorLista(null);
  }, []);

  // Al abrir y luego cada 5 s
  useEffect(() => {
    refrescar().finally(() => setCargandoInicial(false));
    const id = setInterval(refrescar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [refrescar]);

  // Reloj de 1 s solo mientras hay ventana de reclutamiento
  const hasta = viaje?.reclutamiento_hasta ?? null;
  useEffect(() => {
    if (!hasta) return;
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [hasta]);

  const segundosRestantes = hasta
    ? Math.max(0, Math.floor((new Date(hasta).getTime() - ahora) / 1000))
    : null;

  // Todas las acciones siguen el mismo patrón
  const ejecutar = async (funcion, args) => {
    setErrorAccion(null);
    setProcesando(true);
    const { error } = await supabase.rpc(funcion, args);
    if (error) setErrorAccion(error.message);
    await refrescar();
    setProcesando(false);
  };

  const aceptarSala = (salaId) => ejecutar('aceptar_sala', { p_sala_id: salaId });
  const rechazarSala = (salaId) => ejecutar('rechazar_sala', { p_sala_id: salaId });
  const aprobarCandidato = (solicitudId) =>
    ejecutar('aprobar_candidato', { p_sala_id: viaje.sala_id, p_solicitud_id: solicitudId });
  const descartarCandidato = (solicitudId) =>
    ejecutar('rechazar_candidato', { p_sala_id: viaje.sala_id, p_solicitud_id: solicitudId });

  return {
    solicitudes,
    viaje,
    candidatos,
    segundosRestantes,
    errorLista,
    errorAccion,
    cargandoInicial,
    procesando,
    aceptarSala,
    rechazarSala,
    aprobarCandidato,
    descartarCandidato,
    refrescar,
  };
}