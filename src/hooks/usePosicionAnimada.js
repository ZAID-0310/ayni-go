import { useEffect, useRef, useState } from 'react';

const DURACION_MS = 1500;
const SALTO_MAX_M = 150;
const MOVIMIENTO_MIN_M = 5;

function distM(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

// 0 = norte, 90 = este
function rumboEntre(a, b) {
  const rad = (x) => (x * Math.PI) / 180;
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x =
    Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) -
    Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// diferencia angular por el camino corto (-180..180)
const difAng = (de, a) => ((((a - de) % 360) + 540) % 360) - 180;

export default function usePosicionAnimada(pos) {
  const [animada, setAnimada] = useState(
    pos ? { lat: pos.lat, lng: pos.lng, rumbo: 0 } : null
  );
  const actual = useRef(animada);
  const rumboFinal = useRef(0);
  const raf = useRef(null);
  const ultimo = useRef(0);

  useEffect(() => {
    if (!pos) {
      actual.current = null;
      setAnimada(null);
      return undefined;
    }
    const desde = actual.current;
    const hasta = { lat: pos.lat, lng: pos.lng };

    if (desde && distM(desde, hasta) >= MOVIMIENTO_MIN_M) {
      rumboFinal.current = rumboEntre(desde, hasta);
    }
    const rumboDesde = desde?.rumbo ?? rumboFinal.current;

    if (!desde || distM(desde, hasta) > SALTO_MAX_M) {
      const p = { ...hasta, rumbo: rumboFinal.current };
      actual.current = p;
      setAnimada(p);
      return undefined;
    }

    const t0 = Date.now();
    const paso = () => {
      const k = Math.min(1, (Date.now() - t0) / DURACION_MS);
      const p = {
        lat: desde.lat + (hasta.lat - desde.lat) * k,
        lng: desde.lng + (hasta.lng - desde.lng) * k,
        rumbo: (rumboDesde + difAng(rumboDesde, rumboFinal.current) * k + 360) % 360,
      };
      actual.current = p;
      const ahora = Date.now();
      if (k === 1 || ahora - ultimo.current >= 66) {
        ultimo.current = ahora;
        setAnimada(p);
      }
      if (k < 1) raf.current = requestAnimationFrame(paso);
    };
    raf.current = requestAnimationFrame(paso);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [pos?.lat, pos?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return animada;
}