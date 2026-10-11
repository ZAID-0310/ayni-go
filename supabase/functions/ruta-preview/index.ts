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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: 'No autenticado' }, 401);

  // 2. Validar destino
  const { lat, lng } = await req.json();
  if (typeof lat !== 'number' || typeof lng !== 'number' ||
      Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return json({ error: 'Destino inválido' }, 400);
  }

  // 3. Origen desde la BD (el cliente no lo elige)
  const { data: cfg, error } = await supabase
    .from('config_salas').select('origen_lat, origen_lng').single();
  if (error || !cfg) return json({ error: 'Sin origen configurado' }, 500);

  // 4. Directions
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${cfg.origen_lng},${cfg.origen_lat};${lng},${lat}` +
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