import { StyleSheet } from 'react-native';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const DORADO = '#F5B21B';
const BORDE = '#E3E0D5';

export const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: CREMA },
  mapa: { flex: 1 },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CREMA },
  textoCentrado: { marginTop: 12, color: '#666', fontSize: 15 },

  marcadorOrigen: { width: 10, height: 10, borderRadius: 5, backgroundColor: VERDE },
  marcadorDestino: { width: 10, height: 10, borderRadius: 5, backgroundColor: DORADO },

  botonVolver: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 4,
  },
  botonVolverTexto: { color: VERDE, fontWeight: '700', fontSize: 15 },

  buscador: {
    position: 'absolute',
    top: 96,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDE,
    elevation: 4,
    overflow: 'hidden',
  },
  buscadorInput: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1A1A1A' },
  buscadorCargando: { paddingVertical: 8 },
  sugerencia: { paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  sugerenciaNombre: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  sugerenciaDetalle: { fontSize: 12, color: '#666', marginTop: 2 },

  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '55%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    elevation: 8,
  },
  panelTitulo: { fontSize: 16, fontWeight: '700', color: VERDE },
  dato: { fontSize: 14, color: '#333', marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: BORDE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
    marginTop: 10,
  },
  fila: { flexDirection: 'row' },
  inputEtiqueta: { flex: 1, marginRight: 8 },
  inputHora: { width: 90 },
  textoError: { color: '#DC2626', marginTop: 10, fontSize: 13 },

  boton: {
    backgroundColor: VERDE,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 14,
    elevation: 4,
  },
  botonDeshabilitado: { opacity: 0.45 },
  botonTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnTexto: { paddingVertical: 12 },
  btnTextoText: { color: VERDE, fontWeight: '700', fontSize: 15 },
});