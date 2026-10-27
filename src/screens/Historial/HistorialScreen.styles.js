import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#FAF7EE' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  volver: { color: '#0F5132', fontSize: 16, fontWeight: '600' },
  titulo: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginLeft: 16 },
  lista: { padding: 16, paddingTop: 4 },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E0D5',
    padding: 14,
    marginBottom: 10,
  },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fecha: { fontSize: 13, color: '#666' },
  destino: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginTop: 6 },
  monto: { fontSize: 18, fontWeight: '700', color: '#0F5132' },
  etiqueta: {
    backgroundColor: '#DCEBDD',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  etiquetaTexto: { fontSize: 12, color: '#0F5132', fontWeight: '600' },
  pagoOk: { fontSize: 13, color: '#0F5132', marginTop: 6 },
  pagoPendiente: { fontSize: 13, color: '#DC2626', marginTop: 6 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  vacio: { color: '#666', fontSize: 15, textAlign: 'center' },
  reintentar: { color: '#0F5132', fontWeight: '600', marginTop: 12 },
});