import { StyleSheet } from 'react-native';

// Paleta AYNI-GO (tomada de los mockups: verde profundo, dorado del "GO", crema)
export const colors = {
  verde: '#0F5C3F',          // primario: botones, ruta, marcas
  verdeProfundo: '#0A3D2B',  // títulos y énfasis
  menta: '#E4F1E8',          // fondos suaves, estado activo
  mentaSuave: '#F3F8F4',
  crema: '#FAF8F0',          // fondo de pantalla
  dorado: '#F2B01E',         // acento: parada actual, tiempo
  doradoSuave: '#FDF3D6',
  doradoTexto: '#7A4E00',
  texto: '#16261F',
  suave: '#66756D',
  borde: '#E7E5D8',
  blanco: '#FFFFFF',
  error: '#B42318',
  errorSuave: '#FDECEA',
  gris: '#9AA6A0',
};

const sombra = {
  elevation: 2,
  shadowColor: '#0A3D2B',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.crema },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  contenido: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 48 },

  // Cabecera
  cabecera: { marginBottom: 18, paddingRight: 56 }, // deja libre el engranaje
  btnVolver: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blanco,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borde,
    marginBottom: 14,
  },
  btnVolverTexto: { fontSize: 14, fontWeight: '700', color: colors.verdeProfundo },
  titulo: { fontSize: 26, fontWeight: '800', color: colors.verdeProfundo, letterSpacing: -0.4 },
  subtituloCabecera: { fontSize: 14, color: colors.suave, marginTop: 4 },
  subtitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.verdeProfundo,
    marginTop: 20,
    marginBottom: 10,
  },
  seccionTitulo: { fontSize: 13, fontWeight: '600', color: colors.suave },

  // Tarjeta base
  card: {
    backgroundColor: colors.blanco,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borde,
    ...sombra,
  },

  // Estado vacío
  vacio: { alignItems: 'center', marginTop: 56, paddingHorizontal: 12 },
  vacioCirculo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.menta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  vacioEmoji: { fontSize: 38 },
  vacioTitulo: { fontSize: 18, fontWeight: '800', color: colors.verdeProfundo, marginBottom: 10 },
  buscandoFila: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  buscandoTexto: { fontSize: 14, color: colors.suave, fontWeight: '500', textAlign: 'center' },
  puntoEstado: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },

  // Solicitud / candidato
  solicitudEncabezado: { flexDirection: 'row', alignItems: 'center' },
  pinCirculo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.doradoSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pinEmoji: { fontSize: 18 },
  solicitudInfo: { flex: 1 },
  solicitudDestino: { fontSize: 16, fontWeight: '700', color: colors.texto, marginTop: 2 },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.mentaSuave,
    borderWidth: 1,
    borderColor: colors.menta,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 12,
  },
  chipTexto: { fontSize: 13, fontWeight: '600', color: colors.verde },

  // Botones de tarjeta (solicitudes / candidatos)
  filaBotones: { flexDirection: 'row', gap: 10, marginTop: 16 },
  botonMitad: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
  boton: { backgroundColor: colors.verde },
  botonTexto: { color: colors.blanco, fontSize: 15, fontWeight: '700' },
  botonNeutro: { backgroundColor: colors.blanco, borderWidth: 1, borderColor: colors.borde },
  botonNeutroTexto: { color: colors.texto, fontSize: 15, fontWeight: '700' },

  // Estado del viaje
  estadoPildora: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.menta,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 14,
  },
  estadoPildoraTexto: { fontSize: 14, fontWeight: '700', color: colors.verde },

  // Cupos
  cuposEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cuposResumen: { fontSize: 14, fontWeight: '800', color: colors.verdeProfundo },
  asientosFila: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  asiento: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.borde,
    borderStyle: 'dashed',
    backgroundColor: colors.crema,
    alignItems: 'center',
    justifyContent: 'center',
  },
  asientoLleno: { backgroundColor: colors.verde, borderColor: colors.verde, borderStyle: 'solid' },
  asientoTexto: { fontSize: 18 },
  cuposDetalle: { marginTop: 10, fontSize: 13, color: colors.suave, fontWeight: '500' },
  chipTiempo: {
    alignSelf: 'flex-start',
    backgroundColor: colors.doradoSuave,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 14,
  },
  chipTiempoTexto: { fontSize: 13, fontWeight: '700', color: colors.doradoTexto },
  chipTiempoFin: { backgroundColor: '#EEF1EC' },
  chipTiempoFinTexto: { color: colors.suave },

  // Total
  separador: { height: 1, backgroundColor: colors.borde, marginVertical: 14 },
  precioGrande: { fontSize: 30, fontWeight: '800', color: colors.verdeProfundo, marginTop: 2, letterSpacing: -0.5 },

  // Mapa y marcas
  mapa: {
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borde,
    marginBottom: 12,
  },
  marca: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blanco,
    backgroundColor: colors.verdeProfundo,
  },
  marcaOrigen: { backgroundColor: colors.verde },
  marcaActual: { backgroundColor: colors.dorado },
  marcaBajo: { backgroundColor: colors.gris },
  marcaTexto: { color: colors.blanco, fontWeight: '800', fontSize: 13 },
  marcaTextoActual: { color: colors.verdeProfundo },

  // Botones de acción
  fila: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btnPrimario: { backgroundColor: colors.verde },
  btnSecundario: { backgroundColor: colors.menta },
  btnContorno: { backgroundColor: colors.blanco, borderColor: colors.verde },
  btnPeligro: { backgroundColor: colors.blanco, borderColor: colors.error },
  btnTexto: { color: colors.blanco, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  btnTextoVerde: { color: colors.verde, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  btnTextoPeligro: { color: colors.error, fontWeight: '700', fontSize: 14, textAlign: 'center' },

  // Paradas
  paradaCard: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borde },
  paradaCardActual: { backgroundColor: colors.doradoSuave, borderRadius: 14, paddingHorizontal: 10, borderBottomWidth: 0 },
  paradaTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paradaTextos: { flex: 1 },
  paradaDir: { fontSize: 14, fontWeight: '700', color: colors.texto },
  paradaDirBajo: { textDecorationLine: 'line-through', color: colors.gris },
  paradaSub: { fontSize: 12, color: colors.suave, marginTop: 2 },
  paradaMonto: { fontSize: 15, fontWeight: '800', color: colors.verdeProfundo },
  etiqueta: { fontSize: 12, fontWeight: '700', marginTop: 3 },
  etiquetaOk: { color: colors.verde },
  etiquetaMal: { color: colors.error },

  // Resumen
  resumenFila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  resumenLabel: { fontSize: 14, color: colors.suave },
  resumenValor: { fontSize: 15, fontWeight: '800', color: colors.verdeProfundo },
  resumenOk: { color: colors.verde },
  resumenMal: { color: colors.error },

  textoError: {
    backgroundColor: colors.errorSuave,
    color: colors.error,
    fontSize: 13,
    fontWeight: '600',
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
});

export default styles;