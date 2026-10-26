import { StyleSheet } from 'react-native';

export const COLORES = {
  verde: '#0F5132',
  verdeClaro: '#DCEBDD',
  crema: '#FAF7EE',
  cremaOscuro: '#F3F0E6',
  borde: '#E3E0D5',
  texto: '#1A1A1A',
  textoSuave: '#666666',
  peligro: '#DC2626',
  blanco: '#FFFFFF',
};

const styles = StyleSheet.create({
  // Contenedor
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORES.crema,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Encabezado
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerSpacer: { width: 32 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORES.texto },
  editIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORES.blanco,
    borderWidth: 1,
    borderColor: COLORES.borde,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tarjeta principal
  tarjeta: {
    backgroundColor: COLORES.blanco,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // Avatar
  avatarContainer: { marginTop: 4, marginBottom: 12 },
  avatarBorderWrapper: {
    padding: 3,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORES.verde,
    borderStyle: 'dashed',
  },
  camaraBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORES.verde,
    borderWidth: 2.5,
    borderColor: COLORES.blanco,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },

  // Datos del usuario
  error: { color: COLORES.peligro, fontSize: 12, marginTop: 8, textAlign: 'center' },
  nombre: { fontSize: 22, fontWeight: '800', color: COLORES.texto, marginTop: 4, textAlign: 'center' },
  email: { fontSize: 13, color: COLORES.textoSuave, marginTop: 2, textAlign: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.verdeClaro,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 12,
  },
  badgeIcono: { marginRight: 6 },
  badgeTexto: { color: COLORES.verde, fontSize: 12, fontWeight: '700' },

  // Estadísticas
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORES.crema,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORES.borde,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 16, fontWeight: '800', color: COLORES.texto },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#777777', marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 24, backgroundColor: COLORES.borde },

  // Acciones
  acciones: { width: '100%', marginTop: 4 },
  btnIcono: { marginRight: 8 },
  btnPrimaryModern: {
    flexDirection: 'row',
    backgroundColor: COLORES.verde,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: COLORES.verde,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnPrimaryTexto: { color: COLORES.blanco, fontSize: 15, fontWeight: '700' },
  btnSecondaryModern: {
    flexDirection: 'row',
    backgroundColor: COLORES.cremaOscuro,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  btnSecondaryTexto: { color: COLORES.verde, fontSize: 15, fontWeight: '600' },

  // Cerrar sesión
  logout: { marginTop: 18, paddingVertical: 8, alignItems: 'center' },
  logoutFila: { flexDirection: 'row', alignItems: 'center' },
  logoutIcono: { marginRight: 6 },
  logoutTexto: { color: COLORES.peligro, fontSize: 14, fontWeight: '700' },
});

export default styles;