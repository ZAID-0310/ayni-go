import { StyleSheet } from 'react-native';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const BORDE = '#E3E0D5';

export default StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREMA },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  btnVolver: { paddingVertical: 10, paddingRight: 20, alignSelf: 'flex-start' },
  btnVolverText: { fontSize: 16, color: VERDE, fontWeight: '600' },
  tituloPantalla: { fontSize: 24, fontWeight: '800', color: VERDE, marginTop: 4 },

  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32 },

  // Tarjeta
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDE,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  iconoCirculo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: VERDE_SUAVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  titulo: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
  subtituloCentro: { fontSize: 13, color: '#666666', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  headerContainer: { alignItems: 'center', marginBottom: 20 },

  // Placa
  placa: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1A1A1A',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 28,
  },
  placaTexto: { fontSize: 26, fontWeight: '900', color: '#1A1A1A', letterSpacing: 4 },
  separador: { width: '100%', height: 1, backgroundColor: BORDE, marginVertical: 22 },

  // Datos
  filaDato: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datoLabel: { fontSize: 11, fontWeight: '700', color: '#666666', letterSpacing: 0.6 },
  datoValor: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  cuposBloque: {
    width: '100%',
    marginTop: 18,
    padding: 14,
    backgroundColor: CREMA,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDE,
  },
  asientosFila: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  asiento: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },

  // Formulario
  formContainer: {
    width: '100%',
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

  // Botones
  btnPrimary: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  btnDeshabilitado: { opacity: 0.5 },
});