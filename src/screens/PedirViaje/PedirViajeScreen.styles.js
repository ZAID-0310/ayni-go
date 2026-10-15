import { StyleSheet } from 'react-native';

// Estilos mínimos y funcionales. El diseño final se puede reemplazar sin
// tocar index.jsx, siempre que se mantengan los mismos nombres de estilo.
const styles = StyleSheet.create({
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  contenedor: { flex: 1, padding: 24, paddingTop: 56, backgroundColor: '#fff' },
  contenedorMapa: { flex: 1 },
  mapa: { flex: 1 },

  mapaContenedor: { flex: 1 },

  cargandoMapa: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    zIndex: 10,
  },
  cargandoMapaTexto: { marginTop: 12, fontSize: 16, color: '#444' },

  volver: { fontSize: 16, color: '#1a1a1a' },
  botonVolverFlotante: {
    position: 'absolute',
    top: 48,
    left: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

    mapaViaje: {
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 12,
  },

  titulo: { fontSize: 24, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  estado: { fontSize: 18, marginBottom: 16 },
  dato: { fontSize: 16, marginBottom: 6 },

  tarjeta: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tarjetaTitulo: { fontSize: 14, color: '#666', marginBottom: 6 },

  marcadorOrigen: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563eb',
    borderWidth: 3,
    borderColor: '#fff',
  },
  marcadorDestino: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#dc2626',
    borderWidth: 3,
    borderColor: '#fff',
  },

  panelInferior: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelTitulo: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  boton: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botonDeshabilitado: { opacity: 0.4 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },

  botonSecundario: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
    alignItems: 'center',
  },
  botonSecundarioTexto: { color: '#dc2626', fontSize: 16, fontWeight: '600' },

  textoError: { color: '#dc2626', fontSize: 14, marginTop: 12, marginBottom: 4 },
  confirmacion: { marginTop: 24 },
  filaBotones: { flexDirection: 'row', gap: 12, marginTop: 12 },
  botonMitad: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  botonNeutro: { borderWidth: 1, borderColor: '#ddd' },
  botonNeutroTexto: { color: '#1a1a1a', fontSize: 16, fontWeight: '600' },
  botonPeligro: { backgroundColor: '#dc2626' },


  // ---- Buscador de destino ----
  buscador: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
  },
  buscadorInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    elevation: 4,
  },
  buscadorCargando: { position: 'absolute', right: 14, top: 14 },
  sugerencia: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 4,
  },
  sugerenciaNombre: { fontSize: 15, fontWeight: '600' },
  sugerenciaDetalle: { fontSize: 12, color: '#666' },
});

export default styles;
