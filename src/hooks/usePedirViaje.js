import { useState, useEffect, useCallback,useRef} from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import useUbicacionesSala from './useUbicacionesSala';
import { nombreDeLugar } from '../../lib/geocoding';


// Cada cuántos ms se consulta el estado del viaje mientras hay uno activo
const INTERVALO_MS = 2000;
// Identificador de la sesión de búsqueda (agrupa suggest + retrieve)
const nuevoToken = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

export function usePedirViaje() {
  // Punto de partida fijo (viene de config_salas): { lat, lng }
  const [origen, setOrigen] = useState(null);
  // Destino elegido en el mapa: { lat, lng, direccion }
  const [destino, setDestino] = useState(null);
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const reqDireccion = useRef(0);
  // Viaje activo (lo que devuelve mi_viaje_activo) o null si no hay
    const [viaje, setViaje] = useState(null);
  // Para detectar el paso de "hay viaje" a "no hay viaje"
  const viajeRef = useRef(null);
  // Evita mostrar "viaje cancelado" cuando el pasajero canceló él mismo
   const cancelacionPropia = useRef(false);
  // sala_id del viaje cuyo resumen ya se mostró (evita repetirlo al finalizar)
  const resumenMostrado = useRef(null);
  // Resumen final del viaje y aviso de cancelación
  const [resumen, setResumen] = useState(null);
  const [avisoCancelado, setAvisoCancelado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  // Mensaje de error visible en la pantalla (en vez de Alert nativo)
  const [error, setError] = useState(null);
  // Confirmación de cancelar, también dentro de la pantalla
  const [confirmandoCancelar, setConfirmandoCancelar] = useState(false);
  // Ruta origen → destino del pasajero: { geometry, distancia_m, duracion_s } o null
  const [ruta, setRuta] = useState(null);
  // Evita pedir dos veces la misma ruta (cada solicitud cuesta)
  const rutaPedidaPara = useRef(null);
  // Buscador de destino
  const [consulta, setConsulta] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const textoElegido = useRef(null); // evita buscar de nuevo justo después de elegir
  const sesionBusqueda = useRef(nuevoToken());


    const refrescar = useCallback(async () => {
    const { data, error } = await supabase.rpc('mi_viaje_activo');
    if (error) {
      console.error('Error al consultar el viaje:', error.message);
      return;
    }

       const previo = viajeRef.current;
    viajeRef.current = data;
    setViaje(data);

    // El chofer ya marcó mi bajada: resumen inmediato, sin esperar el fin del viaje
    if (
      data?.estado === 'en_curso' &&
      data.mi_destino?.bajo &&
      resumenMostrado.current !== data.sala_id
    ) {
      const m = data.mi_destino;
      const monto = Number(m.monto ?? 0);
      const pagado = m.estado_pago === 'pagado';
      resumenMostrado.current = data.sala_id;
      setResumen({
        sala_id: data.sala_id,
        parcial: true,
        total_esperado: monto,
        total_cobrado: pagado ? monto : 0,
        total_sin_cobrar: pagado ? 0 : monto,
        pasajeros: [
          { direccion: m.direccion, orden: m.orden, monto, estado_pago: m.estado_pago },
        ],
      });
    }

    // Había viaje y ahora no: terminó o se canceló
    if (previo && !data) {
      if (previo.estado === 'en_curso') {
        // Si ya vio su resumen al bajar, no se vuelve a mostrar
        if (resumenMostrado.current !== previo.sala_id) {
          const { data: res, error: errorRes } = await supabase.rpc('resumen_viaje');
          if (errorRes) {
            console.error('Error al cargar el resumen:', errorRes.message);
          } else if (res) {
            resumenMostrado.current = previo.sala_id;
            setResumen(res);
          }
        }
      } else if (!cancelacionPropia.current) {
        setAvisoCancelado(true);
      }
      cancelacionPropia.current = false;
    }
  }, []);

  const cargarOrigen = useCallback(async () => {
    const { data, error } = await supabase
      .from('config_salas')
      .select('origen_lat, origen_lng')
      .maybeSingle();

    if (error) {
      console.error('Error al cargar el origen:', error.message);
      return;
    }
    if (data) {
      setOrigen({ lat: data.origen_lat, lng: data.origen_lng });
    }
  }, []);

  // Al abrir la pantalla: origen fijo y ¿ya tengo un viaje en curso?
  useEffect(() => {
    Promise.all([cargarOrigen(), refrescar()]).finally(() =>
      setCargandoInicial(false)
    );
  }, [cargarOrigen, refrescar]);

  // Mientras haya viaje activo, se mantiene actualizado (pasajeros, chofer, estado)
  const hayViaje = !!viaje;
  useEffect(() => {
    if (!hayViaje) return;
    const id = setInterval(refrescar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [hayViaje, refrescar]);

    // Compartir ubicación solo con chofer asignado y mientras no me haya bajado
  const seguirViaje =
    hayViaje &&
    (viaje.estado === 'abierta_con_chofer' || viaje.estado === 'en_curso') &&
    !viaje.mi_destino?.bajo;

  // Posición del chofer, leída cada 4 s
  const { chofer: choferEnVivo } = useUbicacionesSala(
    seguirViaje ? viaje.sala_id : null,
    seguirViaje
  );

  // Mi ping al servidor cada 6 s (solo con la app abierta)
  useEffect(() => {
    if (!seguirViaje) return;
    let cancelado = false;

        const enviar = async () => {
      if (AppState.currentState !== 'active') {
        console.log('PING_PAS saltado: app no activa');
        return;
      }
      try {
        const pos = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          new Promise((_, rechazar) =>
            setTimeout(() => rechazar(new Error('timeout GPS')), 8000)
          ),
        ]);
        if (cancelado) return;
        const { data, error } = await supabase.rpc('pasajero_ping', {
          p_lat: pos.coords.latitude,
          p_lng: pos.coords.longitude,
        });
        console.log('PING_PAS resultado:', data, error?.message ?? 'sin error');
      } catch (e) {
        console.log('PING_PAS fallo:', e?.message);
      }
    };

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('PING_PAS permiso:', status);
      if (cancelado || status !== 'granted') return;
      enviar();
    })();

    const id = setInterval(enviar, 6000);
    return () => {
      cancelado = true;
      clearInterval(id);
    };
  }, [seguirViaje]);

  // El destino del viaje: el que acaba de elegir, o el que devuelve mi_viaje_activo
  const destinoViaje = destino ?? viaje?.mi_destino ?? null;
  const dLat = destinoViaje?.lat;
  const dLng = destinoViaje?.lng;

  // Pide la ruta UNA vez por destino, en cuanto hay viaje activo
  useEffect(() => {
    if (!hayViaje) {
      setRuta(null);
      rutaPedidaPara.current = null;
      return;
    }
    if (dLat == null || dLng == null) return;

    const clave = `${dLat},${dLng}`;
    if (rutaPedidaPara.current === clave) return;
    rutaPedidaPara.current = clave; // se marca antes: si falla, no reintenta en bucle

    (async () => {
      const { data, error: errorFn } = await supabase.functions.invoke('ruta-preview', {
        body: { lat: dLat, lng: dLng },
      });
      if (errorFn || !data?.geometry) {
        console.error('No se pudo cargar la ruta:', errorFn?.message ?? data?.error);
        setRuta(null);
        return;
      }
      setRuta(data);
    })();
  }, [hayViaje, dLat, dLng]);

  // Busca sugerencias 400 ms después de que el usuario deja de escribir
  useEffect(() => {
    const texto = consulta.trim();
    if (!origen || texto.length < 3 || texto === textoElegido.current) {
      setSugerencias([]);
      return;
    }

    let vigente = true;
    const id = setTimeout(async () => {
      setBuscando(true);
      try {
        const url =
          'https://api.mapbox.com/search/searchbox/v1/suggest' +
          `?q=${encodeURIComponent(texto)}` +
          `&session_token=${sesionBusqueda.current}` +
          `&proximity=${origen.lng},${origen.lat}` +
          '&country=pe&language=es&limit=5' +
          `&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`;
        const r = await fetch(url);
        const d = await r.json();
        if (!vigente) return;
        setSugerencias(
          (d.suggestions ?? []).map((s) => ({
            id: s.mapbox_id,
            nombre: s.name ?? '',
            detalle: s.full_address ?? s.place_formatted ?? '',
          }))
        );
      } catch (e) {
        if (vigente) setSugerencias([]);
      } finally {
        if (vigente) setBuscando(false);
      }
    }, 400);

    return () => {
      vigente = false;
      clearTimeout(id);
    };
  }, [consulta, origen]);


const moverDestino = useCallback(async (lat, lng) => {
  const id = ++reqDireccion.current;
  setDestino((actual) => ({ ...actual, lat, lng, lugar: null }));
  setBuscandoDireccion(true);
  try {
    const nombre = await nombreDeLugar(lat, lng);
    if (id !== reqDireccion.current) return; // el puntero ya se movió
    setDestino((actual) => (actual ? { ...actual, lugar: nombre ?? null } : actual));
  } catch {
    // sin nombre: el viaje se puede pedir igual
  } finally {
    if (id === reqDireccion.current) setBuscandoDireccion(false);
  }
}, []);


const elegirSugerencia = async (s) => {
  try {
    const url =
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${s.id}` +
      `?session_token=${sesionBusqueda.current}` +
      `&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`;
    const r = await fetch(url);
    const d = await r.json();
    const [lng, lat] = d.features[0].geometry.coordinates;

    textoElegido.current = s.nombre;
    setConsulta(s.nombre);
    setSugerencias([]);
    reqDireccion.current++;
    setBuscandoDireccion(false);
    setDestino((actual) => ({ ...actual, lat, lng, lugar: s.nombre }));
    sesionBusqueda.current = nuevoToken(); // cierra la sesión: la próxima búsqueda es nueva
    return { lat, lng };
  } catch (e) {
    setError('No se pudo ubicar ese lugar. Intenta con otro o toca el mapa.');
    return null;
  }
};

  const pedirViaje = async () => {
    setError(null);

    if (!destino) {
      setError('Toca el mapa para elegir a dónde vas.');
      return;
    }

    setCargando(true);
    const { error: errorRpc } = await supabase.rpc('pedir_viaje', {
      p_lat: destino.lat,
      p_lng: destino.lng,
      p_direccion:
        [destino.lugar, destino.direccion].filter(Boolean).join(' — ') || null,
    });

    if (errorRpc) {
      setCargando(false);
      setError(errorRpc.message);
      return;
    }

    await refrescar();
    setCargando(false);
  };

  // Cancelar en dos pasos: primero se pide confirmar, luego se ejecuta
  const pedirCancelar = () => {
    setError(null);
    setConfirmandoCancelar(true);
  };

  const descartarCancelar = () => setConfirmandoCancelar(false);

  const confirmarCancelar = async () => {
    setCargando(true);
    cancelacionPropia.current = true;
    const { error: errorRpc } = await supabase.rpc('cancelar_pedido');
    if (errorRpc) {
      cancelacionPropia.current = false;
      setError(errorRpc.message);
    }
    setConfirmandoCancelar(false);
    await refrescar();
    setCargando(false);
  };

    const reiniciarPedido = () => {
    setDestino(null);
    setConsulta('');
    setSugerencias([]);
    textoElegido.current = null;
  };

  const cerrarResumen = () => {
    setResumen(null);
    reiniciarPedido();
  };

  const cerrarAviso = () => {
    setAvisoCancelado(false);
    reiniciarPedido();
  };

  // Una vez que el viaje arrancó ya no se puede cancelar
  const puedeCancelar = !!viaje && viaje.estado !== 'en_curso';

  return {
    origen,
    destino, setDestino,
    viaje,
    cargando,
    cargandoInicial,
    puedeCancelar,
    error,
    confirmandoCancelar,
    pedirViaje,
    pedirCancelar,
    descartarCancelar,
    confirmarCancelar,
    refrescar,
    ruta,
    destinoViaje,    
    consulta, 
    setConsulta,
    sugerencias,
    buscando,
    elegirSugerencia,
    moverDestino,
    buscandoDireccion,
    resumen,
    cerrarResumen,
    avisoCancelado,
    cerrarAviso,
    choferEnVivo,
  };
}