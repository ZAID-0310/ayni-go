import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { nombreDeLugar } from '../../lib/geocoding';

const nuevoToken = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

// Elegir un destino: tocar el mapa o buscar por texto.
// Mismo comportamiento que en Pedir viaje, sin pedir nada al servidor.
export function useElegirDestino() {
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null); // { lat, lng, lugar, direccion }
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  const reqDireccion = useRef(0);
  const textoElegido = useRef(null);
  const sesionBusqueda = useRef(nuevoToken());

  // Punto de partida fijo (solo para centrar el mapa y sesgar la búsqueda)
  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('config_salas')
        .select('origen_lat, origen_lng')
        .maybeSingle();
      if (err) {
        console.error('Error al cargar el origen:', err.message);
        return;
      }
      if (data) setOrigen({ lat: data.origen_lat, lng: data.origen_lng });
    })();
  }, []);

  // Sugerencias 400 ms después de dejar de escribir
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

  // Toque en el mapa: guarda el punto y busca el nombre de la calle
  const moverDestino = useCallback(async (lat, lng) => {
    const id = ++reqDireccion.current;
    setDestino((actual) => ({ ...actual, lat, lng, lugar: null }));
    setBuscandoDireccion(true);
    try {
      const nombre = await nombreDeLugar(lat, lng);
      if (id !== reqDireccion.current) return;
      setDestino((actual) => (actual ? { ...actual, lugar: nombre ?? null } : actual));
    } catch {
      // sin nombre: se puede guardar igual
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
      sesionBusqueda.current = nuevoToken();
      return { lat, lng };
    } catch (e) {
      setError('No se pudo ubicar ese lugar. Intenta con otro o toca el mapa.');
      return null;
    }
  };

  const cambiarReferencia = (texto) => {
    setDestino((actual) =>
      actual ? { ...actual, direccion: texto.trim() || null } : actual
    );
  };

  // Texto que se guarda como dirección: calle + detalle opcional
  const direccionFinal = destino
    ? [destino.lugar, destino.direccion].filter(Boolean).join(' — ') || null
    : null;

  return {
    origen,
    destino,
    buscandoDireccion,
    consulta,
    setConsulta,
    sugerencias,
    buscando,
    error,
    setError,
    moverDestino,
    elegirSugerencia,
    cambiarReferencia,
    direccionFinal,
  };
}