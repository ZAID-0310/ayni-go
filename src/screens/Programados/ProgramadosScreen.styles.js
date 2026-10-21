import { StyleSheet, Platform, StatusBar } from 'react-native';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const DORADO = '#F5B21B';
const BORDE = '#E3E0D5';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREMA },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    paddingBottom: 8,
  },
  btnVolver: { paddingVertical: 10, paddingRight: 20 },
  btnVolverText: { fontSize: 16, color: VERDE, fontWeight: '700' },
  titulo: { fontSize: 24, fontWeight: '800', color: VERDE, marginTop: 4 },
  scroll: { padding: 20, paddingBottom: 40 },
  cargando: { marginTop: 24 },
  vacio: { textAlign: 'center', color: '#666', marginTop: 32, fontSize: 15 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: BORDE,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etiqueta: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#E3E3E3' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  badge_pendiente: { backgroundColor: '#FCE8B0' },
  badge_aceptado: { backgroundColor: VERDE_SUAVE },
  badge_en_curso: { backgroundColor: VERDE },
  badge_vencido: { backgroundColor: '#E8E6DC' },
  badge_cancelado: { backgroundColor: '#FEE2E2' },

  direccion: { fontSize: 14, color: '#444', marginTop: 8 },
  hora: { fontSize: 14, color: '#1A1A1A', fontWeight: '700', marginTop: 6 },
  chofer: { fontSize: 13, color: '#444', marginTop: 6 },
  asientos: { fontSize: 13, color: '#666', marginTop: 4 },

  acciones: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  horaBox: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: BORDE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },

  btnPrincipal: {
    backgroundColor: VERDE,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 4,
  },
  btnPrincipalChico: {
    backgroundColor: VERDE,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  btnPrincipalText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: VERDE,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 18,
    marginRight: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  btnOutlineText: { color: VERDE, fontWeight: '700', fontSize: 15 },
  btnTexto: { paddingVertical: 10, alignItems: 'center' },
  btnTextoText: { color: '#666', fontSize: 14 },
});