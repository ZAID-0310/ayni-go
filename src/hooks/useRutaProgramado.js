import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Ruta de vista previa (punto base → destino) y tope de precio para viajes programados.
// Pide la ruta 500 ms después del último cambio de destino, para no gastar llamadas a Mapbox.
export function useRutaProgramado(origen, destino) {
  const [tarifaKm, setTarifaKm] = useState(null);
  const [rutaPreview, setRutaPreview] = useState(null);
  const [calculandoRuta, setCalculandoRuta] = useState(false);
  const [errorRuta, setErrorRuta] = useState(false);
  const [reintento, setReintento] = useState(0);
  const req = useRef(0);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('config_salas')
        .select('tarifa_por_km')
        .maybeSingle();
      if (error) {
        console.error('Error al cargar la tarifa:', error.message);
        return;
      }
      if (data) setTarifaKm(Number(data.tarifa_por_km));
    })();
  }, []);

  const lat = destino?.lat;
  const lng = destino?.lng;
  const oLat = origen?.lat;
  const oLng = origen?.lng;

  useEffect(() => {
    const id = ++req.current;
    setRutaPreview(null);
    setErrorRuta(false);
    if (lat == null || lng == null || oLat == null || oLng == null) {
      setCalculandoRuta(false);
      return undefined;
    }
    setCalculandoRuta(true);

    const temporizador = setTimeout(async () => {
      let data = null;
      let errorFn = null;
      for (let intento = 0; intento < 3; intento++) {
        if (intento > 0) {
          await supabase.auth.refreshSession().catch(() => {});
          await new Promise((r) => setTimeout(r, 1500));
        }
        if (id !== req.current) return;
        const r = await supabase.functions.invoke('ruta-preview', {
          body: { lat, lng, origen_lat: oLat, origen_lng: oLng },
        });
        data = r.data;
        errorFn = r.error;
        if (!errorFn && data?.geometry) break;
      }
      if (id !== req.current) return;
      if (errorFn || !data?.geometry) {
        console.log('RUTA_PROG fallo:', errorFn?.message ?? data?.error);
        setErrorRuta(true);
      } else {
        setRutaPreview(data);
      }
      setCalculandoRuta(false);
    }, 500);

    return () => {
      clearTimeout(temporizador);
      req.current++;
    };
  }, [lat, lng, oLat, oLng, reintento]);

  // Tope: tarifa × km de la ruta. Compartir solo lo baja.
  const precioMaximo =
    Number.isFinite(tarifaKm) && rutaPreview?.distancia_m != null
      ? Math.round((tarifaKm * rutaPreview.distancia_m) / 10) / 100
      : null;

  return {
    rutaPreview,
    calculandoRuta,
    errorRuta,
    precioMaximo,
    reintentarRuta: () => setReintento((n) => n + 1),
  };
}