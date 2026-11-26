import { FAQ } from './faq';

// Reglas: palabras clave (sin tildes, en minúscula) -> id de la FAQ.
// Las respuestas salen de faq.js, así los textos viven en un solo lugar.
const REGLAS = [
  { id: 'pedir', claves: ['pedir', 'pido', 'solicitar', 'solicito', 'pedido', 'pedi un', 'como funciona', 'buscar chofer', 'taxi'] },
  { id: 'precio', claves: ['precio', 'tarifa', 'costo', 'cuesta', 'cuanto sale', 'cuanto cobran', 'caro', 'barato', 'kilometro'] },
  { id: 'pago', claves: ['pagar', 'pago', 'efectivo', 'yape', 'plin', 'tarjeta', 'cobrar'] },
  { id: 'cancelar', claves: ['cancelar', 'cancelo', 'cancelacion', 'anular'] },
  { id: 'companeros', claves: ['companero', 'companeros', 'compartir', 'compartido', 'otros pasajeros', 'grupo'] },
  { id: 'objeto', claves: ['perdi', 'olvide', 'objeto', 'mochila', 'celular perdido', 'cartera', 'pertenencia'] },
  { id: 'emergencia', claves: ['emergencia', 'peligro', 'auxilio', 'ayuda urgente'] },
  { id: 'ubicacion', claves: ['ubicacion', 'gps', 'permiso', 'localizacion', 'donde estoy'] },
  { id: 'verificada', claves: ['verificada', 'verificacion', 'verificar', 'cuenta verificada', 'seguridad'] },
];

// Temas delicados: no responde el bot, los ve una persona.
const ESCALAR = [
  'queja', 'reclamo', 'robo', 'robaron', 'accidente', 'acoso', 'acosaron',
  'agresion', 'maltrato', 'devolucion', 'reembolso', 'me cobraron', 'cobro de mas',
  'denuncia', 'estafa', 'saldo', 'comision', 'recarga',
];

export const MENSAJE_ESCALAR =
  'Gracias por escribirnos. Un asesor de Ayni Go revisará tu caso y te responderá aquí lo antes posible.';
export const MENSAJE_SIN_COINCIDENCIA =
  'Un asesor te responderá pronto. Mientras tanto, puedes revisar las preguntas frecuentes en Ayuda y soporte.';

function normalizar(t) {
  return String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Devuelve { texto, tipo } con tipo: 'faq' | 'escalar' | 'sin_coincidencia'
export function obtenerRespuestaBot(textoUsuario) {
  const t = ' ' + normalizar(textoUsuario) + ' ';

  if (ESCALAR.some((c) => t.includes(c))) {
    return { texto: MENSAJE_ESCALAR, tipo: 'escalar' };
  }

  let mejor = null;
  let mejorPuntos = 0;
  for (const regla of REGLAS) {
    const puntos = regla.claves.filter((c) => t.includes(c)).length;
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejor = regla;
    }
  }

  if (mejor) {
    const faq = FAQ.find((f) => f.id === mejor.id);
    if (faq) return { texto: faq.respuesta, tipo: 'faq' };
  }
  return { texto: MENSAJE_SIN_COINCIDENCIA, tipo: 'sin_coincidencia' };
}

export function respuestaPorFaq(id) {
  const faq = FAQ.find((f) => f.id === id);
  return faq ? { texto: faq.respuesta, tipo: 'faq' } : null;
}