import { useState, useEffect, useRef } from 'react';

const nuevoToken = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });

// Buscador de lugares (Mapbox Search Box) con sugerencias
export default function useBuscadorLugar(proximidad) {
  const [texto, setTexto] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const sesion = useRef(nuevoToken());
  const textoElegido = useRef(null);
  const pLat = proximidad?.lat;
  const pLng = proximidad?.lng;

  useEffect(() => {
    const t = texto.trim();
    if (t.length < 3 || t === textoElegido.current) {
      setSugerencias([]);
      return;
    }
    let vigente = true;
    const id = setTimeout(async () => {
      setBuscando(true);
      try {
        const url =
          'https://api.mapbox.com/search/searchbox/v1/suggest' +
          `?q=${encodeURIComponent(t)}` +
          `&session_token=${sesion.current}` +
          (pLat != null ? `&proximity=${pLng},${pLat}` : '') +
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
      } catch {
        if (vigente) setSugerencias([]);
      } finally {
        if (vigente) setBuscando(false);
      }
    }, 400);
    return () => {
      vigente = false;
      clearTimeout(id);
    };
  }, [texto, pLat, pLng]);

  const elegir = async (s) => {
    try {
      const url =
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${s.id}` +
        `?session_token=${sesion.current}` +
        `&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`;
      const r = await fetch(url);
      const d = await r.json();
      const [lng, lat] = d.features[0].geometry.coordinates;
      textoElegido.current = s.nombre;
      setTexto(s.nombre);
      setSugerencias([]);
      sesion.current = nuevoToken();
      return { lat, lng, nombre: s.nombre };
    } catch {
      return null;
    }
  };

  const limpiar = () => {
    textoElegido.current = null;
    setTexto('');
    setSugerencias([]);
  };

  return { texto, setTexto, sugerencias, buscando, elegir, limpiar };
}