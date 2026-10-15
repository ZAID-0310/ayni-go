import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  contenedor: { flex: 1, backgroundColor: '#fff' },
  contenido: { padding: 20, paddingTop: 50 },
  volver: { fontSize: 16, color: '#1a73e8', marginBottom: 12 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  estado: { fontSize: 16, marginBottom: 6 },
  dato: { fontSize: 14, color: '#444', marginBottom: 4 },
  tarjeta: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  tarjetaTitulo: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  filaBotones: { flexDirection: 'row', gap: 10, marginTop: 10 },
  botonMitad: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  boton: { backgroundColor: '#1a73e8' },
  botonTexto: { color: '#fff', fontWeight: '600' },
  botonNeutro: { backgroundColor: '#eee' },
  botonNeutroTexto: { color: '#333', fontWeight: '600' },
  textoError: { color: '#c00', marginVertical: 8 },
});

export default styles;