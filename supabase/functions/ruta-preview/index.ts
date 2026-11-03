import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  // 1. Verificar sesión
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
  );
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: { user }, error: errorAuth } = await supabase.auth.getUser(token);
  if (!user) {
    console.error('RUTA-PREVIEW auth:', errorAuth?.message ?? 'sin usuario', errorAuth?.status ?? '');
    return json({ error: 'No autenticado' }, 401);
  }

  // 2. Validar destino
  const { lat, lng, origen_lat, origen_lng } = await req.json();
  if (typeof lat !== 'number' || typeof lng !== 'number' ||
      Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return json({ error: 'Destino inválido' }, 400);
  }

  // 3. Origen desde la BD (el cliente no lo elige): el de su sala activa, o el punto base
  let oLat: number;
  let oLng: number;
  const { data: org } = await supabase.rpc('origen_mi_viaje');
  if (org) {
    oLat = org.lat;
    oLng = org.lng;
  } else if (
    typeof origen_lat === 'number' && typeof origen_lng === 'number' &&
    Math.abs(origen_lat) <= 90 && Math.abs(origen_lng) <= 180
  ) {
    // Sin viaje activo: vista previa con la recogida que eligió el pasajero
    oLat = origen_lat;
    oLng = origen_lng;
  } else {
    const { data: cfg, error } = await supabase
      .from('config_salas').select('origen_lat, origen_lng').single();
    if (error || !cfg) return json({ error: 'Sin origen configurado' }, 500);
    oLat = cfg.origen_lat;
    oLng = cfg.origen_lng;
  }

  // 4. Directions
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${oLng},${oLat};${lng},${lat}` +
    `?geometries=geojson&overview=full&access_token=${Deno.env.get('MAPBOX_TOKEN')}`;
  const r = await fetch(url);
  if (!r.ok) return json({ error: 'Mapbox no respondió' }, 502);
  const d = await r.json();
  const ruta = d.routes?.[0];
  if (!ruta) return json({ error: 'No hay ruta' }, 404);

  return json({
    geometry: ruta.geometry,
    distancia_m: ruta.distance,
    duracion_s: ruta.duration,
  });
});