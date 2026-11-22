import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { obtenerRespuestaBot, respuestaPorFaq, MENSAJE_ESCALAR } from '../constants/respuestasBot';

const INTERVALO_MS = 4000;

export default function useChatSoporte() {
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
    const activo = useRef(true);
  const mensajesRef = useRef([]);

  const cargar = useCallback(async () => {
    const { data, error: err } = await supabase.rpc('mis_mensajes_soporte', { p_limite: 100 });
    if (!activo.current) return;
    if (err) {
      setError(err.message);
    } else {
      setError(null);
      mensajesRef.current = data || [];
      setMensajes(data || []);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    activo.current = true;
    cargar();
    const t = setInterval(cargar, INTERVALO_MS);
    return () => {
      activo.current = false;
      clearInterval(t);
    };
  }, [cargar]);

  const enviar = useCallback(
    async (texto, faqId) => {
      const limpio = (texto || '').trim();
      if (!limpio) return false;
      setEnviando(true);
      const { error: err } = await supabase.rpc('enviar_mensaje_soporte', { p_texto: limpio });
      setEnviando(false);
      if (err) {
        setError(err.message);
        return false;
      }
            // Respuesta automática. Si falla, no afecta el envío del mensaje.
      try {
        let bot = null;
        if (faqId === 'asesor') bot = { texto: MENSAJE_ESCALAR, tipo: 'escalar' };
        else if (faqId) bot = respuestaPorFaq(faqId);
        if (!bot) bot = obtenerRespuestaBot(limpio);
        // El mensaje de espera («un asesor te responderá») sale solo una vez por caso.
        const yaHayEspera = (mensajesRef.current || []).some(
          (m) => m.de_admin && m.texto === bot.texto
        );
        if (!(bot.tipo !== 'faq' && yaHayEspera)) {
          await supabase.rpc('guardar_respuesta_bot', { p_texto: bot.texto });
        }
      } catch (e) {}
      await cargar();
      return true;
    },
    [cargar]
  );

  return { mensajes, cargando, enviando, error, enviar };
}