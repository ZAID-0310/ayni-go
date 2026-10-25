import { StyleSheet } from 'react-native';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const BORDE = '#E3E0D5';

export default StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: CREMA },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  btnVolver: { paddingVertical: 10, paddingRight: 20, alignSelf: 'flex-start' },
  btnVolverText: { fontSize: 16, color: VERDE, fontWeight: '600' },

  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  titulo: { fontSize: 24, fontWeight: '800', color: VERDE },
  subtitulo: { fontSize: 14, color: '#666666', marginTop: 6, marginBottom: 18 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDE,
    padding: 20,
  },
  label: { fontSize: 11, fontWeight: '700', color: '#1A1A1A', marginBottom: 6, marginTop: 10, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDE,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
  },
  inputCodigo: { textAlign: 'center', fontSize: 22, letterSpacing: 6, fontWeight: '700' },

  textoError: { color: '#DC2626', fontSize: 13, marginTop: 12 },
  textoInfo: { color: VERDE, fontSize: 13, marginTop: 12 },

  btnPrimary: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  btnDeshabilitado: { opacity: 0.5 },

  linkReenviar: { alignSelf: 'center', marginTop: 14, paddingVertical: 6, paddingHorizontal: 12 },
  linkReenviarText: { color: VERDE, fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});