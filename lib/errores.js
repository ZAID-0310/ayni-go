// Convierte el error de Supabase en un mensaje entendible
export function mensajeError(err) {
  const texto = String(err?.message ?? err ?? '');
  if (/network request failed|failed to fetch|network error|timeout|timed out/i.test(texto)) {
    return 'Sin conexión a internet. Revisa tu red e inténtalo de nuevo.';
  }
  return texto;
}