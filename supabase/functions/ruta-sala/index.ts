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
      const cabecera = req.headers.get('Authorization') ?? '';
  const token = cabecera.replace(/^Bearer\s+/i, '');
  console.log('RUTA-SALA cabecera:', cabecera ? `${cabecera.length} caracteres, empieza con "${cabecera.slice(0, 12)}"` : 'VACÍA', '| token:', token.length);
  const { data: { user }, error: errAuth } = await supabase.auth.getUser(token);
  if (!user) {
    console.log('RUTA-SALA auth:', errAuth?.message, errAuth?.status);
    return json({ error: 'No autenticado' }, 401);
  }

  // 2. Validar sala_id
  const { sala_id } = await req.json();
  if (typeof sala_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(sala_id)) {
    return json({ error: 'sala_id inválido' }, 400);
  }

  // 3. Destino final desde la BD (también verifica que eres el chofer)
  const { data: dest, error: errDest } = await supabase.rpc('destino_final_sala', {
    p_sala_id: sala_id,
  });
  if (errDest || !dest) return json({ error: 'No autorizado o sala sin destino' }, 403);

  // 4. Origen desde la BD
  const { data: cfg, error: errCfg } = await supabase
    .from('config_salas').select('origen_lat, origen_lng').single();
  if (errCfg || !cfg) return json({ error: 'Sin origen configurado' }, 500);

  // 5. Directions
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${cfg.origen_lng},${cfg.origen_lat};${dest.lng},${dest.lat}` +
    `?geometries=geojson&overview=full&access_token=${Deno.env.get('MAPBOX_TOKEN')}`;
  const r = await fetch(url);
  if (!r.ok) return json({ error: 'Mapbox no respondió' }, 502);
  const d = await r.json();
  const ruta = d.routes?.[0];
  if (!ruta) return json({ error: 'No hay ruta' }, 404);

  // 6. Guardar con service_role (solo esta función puede escribir la ruta)
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { error: errSave } = await admin.rpc('guardar_ruta_sala', {
    p_sala_id: sala_id,
    p_geojson: JSON.stringify(ruta.geometry),
  });
  if (errSave) return json({ error: 'No se pudo guardar la ruta' }, 500);

  return json({ ok: true, distancia_m: ruta.distance, duracion_s: ruta.duration });
});