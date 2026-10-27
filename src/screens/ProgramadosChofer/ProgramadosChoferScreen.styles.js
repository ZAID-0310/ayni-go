import { StyleSheet } from 'react-native';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const BORDE = '#E3E0D5';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREMA },

  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  btnVolver: { paddingVertical: 10, paddingRight: 20, alignSelf: 'flex-start' },
  btnVolverText: { fontSize: 16, color: VERDE, fontWeight: '600' },
  titulo: { fontSize: 24, fontWeight: '800', color: VERDE, marginTop: 4 },

  scroll: { padding: 20, paddingBottom: 32 },
  cargando: { marginTop: 24 },
  seccion: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 18 },
  vacio: { color: '#666', marginTop: 10, fontSize: 14 },
  textoError: { color: '#DC2626', marginTop: 10, fontSize: 13 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDE,
    padding: 16,
    marginTop: 12,
  },
  pastilla: {
    alignSelf: 'flex-start',
    backgroundColor: VERDE_SUAVE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pastillaTexto: { fontSize: 14, fontWeight: '700', color: VERDE },
  direccion: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginTop: 10 },
  sub: { fontSize: 13, color: '#666', marginTop: 4 },

  acciones: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  btnPrincipal: {
    backgroundColor: VERDE,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  btnPrincipalText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginRight: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  btnOutlineText: { color: VERDE, fontWeight: '700', fontSize: 15 },
  btnDeshabilitado: { opacity: 0.5 },
});