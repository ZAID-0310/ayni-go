import { StyleSheet } from 'react-native';

// Paleta AYNI-GO (la misma del resto de pantallas)
export const colors = {
  verde: '#0F5C3F',
  verdeProfundo: '#0A3D2B',
  menta: '#E4F1E8',
  crema: '#FAF8F0',
  dorado: '#F2B01E',
  texto: '#16261F',
  suave: '#66756D',
  placeholder: '#9AA6A0',
  borde: '#E7E5D8',
  blanco: '#FFFFFF',
};

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.crema },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  // Logo
  logoFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  logoImagen: { width: 60, height: 68, marginRight: 10 },
  logoTexto: { fontSize: 26, fontWeight: '900', color: colors.verde, letterSpacing: -0.5, lineHeight: 28 },
  logoGo: { color: colors.dorado },
  logoLema: { fontSize: 11, fontWeight: '600', color: colors.suave },

  // Encabezado
  headerContainer: { alignItems: 'center', marginBottom: 20 },
  iconoCirculo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.menta,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.verdeProfundo,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: colors.suave,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  subtituloNegrita: { fontWeight: '700', color: colors.texto },

  // Tarjeta del formulario
  card: {
    backgroundColor: colors.blanco,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borde,
    elevation: 2,
    shadowColor: '#0A3D2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.verdeProfundo,
    marginBottom: 6,
    marginTop: 14,
  },

  // Campos
  input: {
    backgroundColor: colors.crema,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.texto,
  },
  inputFoco: { borderColor: colors.verde, backgroundColor: colors.blanco },
  inputFila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.crema,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  inputInterno: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.texto,
  },
  inputCodigo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 8,
    paddingVertical: 14,
  },

  // Botones
  btnPrimary: {
    backgroundColor: colors.verde,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  btnPrimaryText: { color: colors.blanco, fontSize: 15, fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },
  btnLink: { marginTop: 16, alignItems: 'center', paddingVertical: 4 },
  btnLinkText: { color: colors.verde, fontSize: 14, fontWeight: '700' },

  // Pie
  footerContainer: { alignItems: 'center', marginTop: 24 },
  loginContainer: { flexDirection: 'row', alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.suave },
  loginLink: { fontSize: 14, color: colors.verde, fontWeight: '700' },
  btnSecundario: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borde,
    backgroundColor: colors.blanco,
  },
  btnSecundarioText: { color: colors.verdeProfundo, fontSize: 13, fontWeight: '700' },
});