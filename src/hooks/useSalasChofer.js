import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';

const INTERVALO_MS = 5000;
const PING_MS = 12000;

const conTimeout = (promesa, ms) =>
  Promise.race([
    promesa,
    new Promise((_, rechazar) =>
      setTimeout(() => rechazar(new Error('timeout de ubicación')), ms)
    ),
  ]);

export function useSalasChofer() {
  const [solicitudes, setSolicitudes] = useState([]); // sin viaje: lo que puede aceptar
  const [viaje, setViaje] = useState(null);           // su sala aceptada
  const [candidatos, setCandidatos] = useState([]);   // pasajeros que puede sumar
  const [errorLista, setErrorLista] = useState(null); // del polling (no molesta)
  const [errorAccion, setErrorAccion] = useState(null); // de un botón que tocó
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [ahora, setAhora] = useState(Date.now());
  const [permisoUbicacion, setPermisoUbicacion] = useState('pendiente'); // pendiente | concedido | denegado
  const [errorUbicacion, setErrorUbicacion] = useState(null);

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

  // Ping de ubicación del chofer: permiso "mientras se usa", cada 12 s
  useEffect(() => {
    let activo = true;
    let id = null;

    const enviarPing = async () => {
      try {
        let coords = null;
        try {
          const pos = await conTimeout(
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
            8000
          );
          coords = pos.coords;
        } catch (e) {
          console.log('PING current falló', e.message);
          const ultima = await Location.getLastKnownPositionAsync().catch(() => null);
          if (ultima) coords = ultima.coords;
        }

        // Solo en desarrollo: punto de partida de prueba si el emulador no da posición
        if (!coords && __DEV__) {
          coords = { latitude: -12.0464, longitude: -77.0428 };
          console.log('PING usando ubicación de prueba');
        }
        if (!coords) throw new Error('Activa la ubicación del dispositivo');

        console.log('PING coords', coords.latitude, coords.longitude);
        const { error } = await supabase.rpc('chofer_ping', {
          p_lat: coords.latitude,
          p_lng: coords.longitude,
        });
        console.log('PING rpc', error ? error.message : 'ok');
        if (activo) setErrorUbicacion(error ? error.message : null);
      } catch (e) {
        console.log('PING error', e.message);
        if (activo) setErrorUbicacion(e.message);
      }
    };

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('PING permiso', status);
      if (!activo) return;
      if (status !== 'granted') {
        setPermisoUbicacion('denegado');
        return;
      }
      setPermisoUbicacion('concedido');
      await enviarPing();
      if (!activo) return;
      refrescar(); // ya con ubicación, pedir las solicitudes sin esperar los 5 s
      id = setInterval(enviarPing, PING_MS);
    })();

    return () => {
      activo = false;
      if (id) clearInterval(id);
    };
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

  // Todas las acciones siguen el mismo patrón; devuelve true si funcionó
  const ejecutar = async (funcion, args) => {
    setErrorAccion(null);
    setProcesando(true);
    const { error } = await supabase.rpc(funcion, args);
    if (error) setErrorAccion(error.message);
    await refrescar();
    setProcesando(false);
    return !error;
  };

  // Calcula y guarda la ruta real de la sala. No se espera: si falla, queda la línea recta
  const calcularRuta = (salaId) => {
    supabase.functions
      .invoke('ruta-sala', { body: { sala_id: salaId } })
      .catch(() => {});
  };

  const aceptarSala = async (salaId) => {
    const ok = await ejecutar('aceptar_sala', { p_sala_id: salaId });
    if (ok) calcularRuta(salaId);
  };

  const rechazarSala = (salaId) => ejecutar('rechazar_sala', { p_sala_id: salaId });

  const aprobarCandidato = async (solicitudId) => {
    const salaId = viaje.sala_id;
    const ok = await ejecutar('aprobar_candidato', {
      p_sala_id: salaId,
      p_solicitud_id: solicitudId,
    });
    if (ok) calcularRuta(salaId);
  };

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
    permisoUbicacion,
    errorUbicacion,
    aceptarSala,
    rechazarSala,
    aprobarCandidato,
    descartarCandidato,
    refrescar,
  };
}