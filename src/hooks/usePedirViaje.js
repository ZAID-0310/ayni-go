import { useState, useEffect, useCallback,useRef} from 'react';
import { supabase } from '../../lib/supabase';


// Cada cuántos ms se consulta el estado del viaje mientras hay uno activo
const INTERVALO_MS = 5000;

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
  // Viaje activo (lo que devuelve mi_viaje_activo) o null si no hay
  const [viaje, setViaje] = useState(null);
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
    setViaje(data);
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
    const { error: errorRpc } = await supabase.rpc('cancelar_pedido');
    if (errorRpc) {
      setError(errorRpc.message);
    }
    setConfirmandoCancelar(false);
    await refrescar();
    setCargando(false);
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
  };
}