import { StyleSheet } from 'react-native';

// Paleta AYNI-GO (la misma de SalasChoferScreen)
export const colors = {
  verde: '#0F5C3F',
  verdeProfundo: '#0A3D2B',
  menta: '#E4F1E8',
  mentaSuave: '#F3F8F4',
  crema: '#FAF8F0',
  dorado: '#F2B01E',
  doradoSuave: '#FDF3D6',
  doradoTexto: '#7A4E00',
  texto: '#16261F',
  suave: '#66756D',
  borde: '#E7E5D8',
  blanco: '#FFFFFF',
  error: '#B42318',
  errorSuave: '#FDECEA',
  neutroSuave: '#EEF1EC',
};

const sombra = {
  elevation: 2,
  shadowColor: '#0A3D2B',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
};

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.crema },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },

  // Encabezado fijo
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.crema,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerConScroll: {
    borderBottomColor: colors.borde,
    elevation: 3,
    shadowColor: '#0A3D2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  // Lados del mismo ancho: el logo queda centrado y el engranaje flotante libre
  headerLado: { width: 56, justifyContent: 'center' },
  btnMenu: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },

  // Logo
  logoFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoImagen: { width: 60, height: 68, marginRight: 10 },
  logoTexto: { fontSize: 26, fontWeight: '900', color: colors.verde, letterSpacing: -0.5, lineHeight: 28 },
  logoGo: { color: colors.dorado },
  logoLema: { fontSize: 11, fontWeight: '600', color: colors.suave },

  // Encabezado de contenido
  titulo: { fontSize: 26, fontWeight: '800', color: colors.verdeProfundo, letterSpacing: -0.4 },
  subtitulo: { fontSize: 14, color: colors.suave, marginTop: 4, marginBottom: 18, lineHeight: 20 },

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

  // Progreso
  progresoFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  progresoTitulo: { fontSize: 15, fontWeight: '800', color: colors.verdeProfundo },
  progresoCuenta: { fontSize: 14, fontWeight: '700', color: colors.verde },
  barraFondo: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutroSuave,
    marginTop: 12,
    overflow: 'hidden',
  },
  barraRelleno: { height: 8, borderRadius: 4, backgroundColor: colors.verde },
  progresoAviso: { fontSize: 13, color: colors.suave, marginTop: 10 },
  progresoAvisoError: { color: colors.error, fontWeight: '600' },

  // Documento
  docFila: { flexDirection: 'row', alignItems: 'center' },
  docIcono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docInfo: { flex: 1 },
  itemNombre: { fontSize: 15, fontWeight: '700', color: colors.texto },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 5,
  },
  badgeTexto: { fontSize: 12, fontWeight: '700' },

  motivo: {
    backgroundColor: colors.errorSuave,
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },
  motivoTexto: { fontSize: 13, color: colors.error, fontWeight: '600', lineHeight: 18 },

  // Botones
  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginTop: 14,
  },
  btnPrimario: { backgroundColor: colors.verde },
  btnContorno: { backgroundColor: colors.blanco, borderColor: colors.verde },
  btnDisabled: { opacity: 0.6 },
  btnTextoPrimario: { color: colors.blanco, fontSize: 14, fontWeight: '700' },
  btnTextoContorno: { color: colors.verde, fontSize: 14, fontWeight: '700' },
});