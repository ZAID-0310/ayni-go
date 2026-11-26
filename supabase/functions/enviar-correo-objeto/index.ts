import nodemailer from 'npm:nodemailer@6.9.16';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const auth = req.headers.get('Authorization') ?? '';
    if (!auth) return json({ error: 'No autenticado' }, 401);

    const { id } = await req.json();
    if (!id) return json({ error: 'Falta el id del reporte' }, 400);

    // Todo se hace con la sesión de quien llama: si no es admin, las funciones SQL lo rechazan
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } },
    );

    const { data: esAdmin } = await supabase.rpc('es_admin');
    if (esAdmin !== true) return json({ error: 'No autorizado' }, 403);

    const { data: d, error: errDetalle } = await supabase.rpc('admin_detalle_objeto_perdido', {
      p_id: id,
    });
    if (errDetalle || !d) return json({ error: errDetalle?.message ?? 'Reporte no encontrado' }, 404);
    if (!d.chofer_email) return json({ error: 'El chofer no tiene correo registrado' }, 422);
    if (d.estado === 'resuelto' || d.estado === 'descartado') {
      return json({ error: 'Este reporte ya está cerrado' }, 409);
    }

    const usuarioSmtp = Deno.env.get('SMTP_USER');
    const claveSmtp = Deno.env.get('SMTP_PASS');
    if (!usuarioSmtp || !claveSmtp) {
      console.error('ENVIAR-CORREO: faltan SMTP_USER o SMTP_PASS');
      return json({ error: 'El envío de correos no está configurado' }, 500);
    }

    const nombrePasajero = (d.pasajero_nombre ?? 'Un pasajero').split(' ')[0];
    const nombreChofer = (d.chofer_nombre ?? 'chofer').split(' ')[0];
    const fechaViaje = d.fecha_viaje
      ? new Date(d.fecha_viaje).toLocaleString('es-PE', { timeZone: 'America/Lima' })
      : 'fecha no disponible';
    const detalles = d.detalles ? String(d.detalles) : 'Sin detalles adicionales';
    const destino = d.destino_viaje ? String(d.destino_viaje) : 'no disponible';

    const asunto = 'Ayni Go: un pasajero perdió un objeto en tu viaje';
    const texto = [
      `Hola ${nombreChofer},`,
      '',
      `${nombrePasajero} reportó que perdió un objeto en el viaje del ${fechaViaje}.`,
      '',
      `Objeto: ${d.objeto}`,
      `Detalles: ${detalles}`,
      `Destino del pasajero: ${destino}`,
      '',
      `Si lo encontraste, comunícate con ${nombrePasajero} al ${d.telefono}.`,
      'El pasajero autorizó compartir este número para coordinar la devolución.',
      '',
      'Gracias por tu ayuda.',
      'Equipo Ayni Go',
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;color:#222">
        <h2 style="color:#0F5132">Un pasajero perdió un objeto</h2>
        <p>Hola ${esc(nombreChofer)},</p>
        <p>${esc(nombrePasajero)} reportó que perdió un objeto en el viaje del <b>${esc(fechaViaje)}</b>.</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#666">Objeto</td><td><b>${esc(String(d.objeto))}</b></td></tr>
          <tr><td style="padding:6px 0;color:#666">Detalles</td><td>${esc(detalles)}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Destino del pasajero</td><td>${esc(destino)}</td></tr>
        </table>
        <p>Si lo encontraste, comunícate con ${esc(nombrePasajero)} al
          <b style="font-size:18px">${esc(String(d.telefono))}</b>.</p>
        <p style="color:#666;font-size:13px">El pasajero autorizó compartir este número para coordinar la devolución.</p>
        <p>Gracias por tu ayuda.<br>Equipo Ayni Go</p>
      </div>`;

    // El puerto 465 (TLS directo): Supabase bloquea los puertos 25 y 587 en las Edge Functions
    const transporte = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: usuarioSmtp, pass: claveSmtp },
    });

    try {
      await transporte.sendMail({
        from: `"Ayni Go" <${usuarioSmtp}>`,
        to: d.chofer_email,
        subject: asunto,
        text: texto,
        html,
      });
    } catch (e) {
      console.error('ENVIAR-CORREO fallo SMTP:', (e as Error).message);
      return json({ error: 'No se pudo enviar el correo. Revisa la configuración del SMTP.' }, 502);
    }

    // Solo se marca como enviado si el correo salió
    const { error: errEstado } = await supabase.rpc('admin_cambiar_estado_objeto', {
      p_id: id,
      p_estado: 'enviado_al_chofer',
    });
    if (errEstado) {
      console.error('ENVIAR-CORREO estado:', errEstado.message);
      return json({ ok: true, aviso: 'El correo se envió, pero no se pudo actualizar el estado' });
    }

    return json({ ok: true, enviado_a: d.chofer_email });
  } catch (e) {
    console.error('ENVIAR-CORREO error:', (e as Error).message);
    return json({ error: 'Error inesperado' }, 500);
  }
});