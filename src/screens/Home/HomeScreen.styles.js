import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF8EC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  topDecoration: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#F7C942',
  },

  // Tarjeta de perfil
  perfilCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#F58220',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saludo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  rolBadge: {
    backgroundColor: '#FDE9D3',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  rolBadgeText: {
    color: '#D9690B',
    fontWeight: '700',
    fontSize: 13,
  },
  separador: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 24,
  },

  // Botones
  acciones: {
    width: '100%',
    gap: 12,
  },
  btnPrincipal: {
    backgroundColor: '#F58220',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  btnPrincipalText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: '#1E1E1E',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: '600',
  },
  btnLogout: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnLogoutText: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '600',
  },

  // Decoración inferior
  bottomDecorationContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 140,
    height: 140,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  bottomYellow: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#F7C942',
  },
  bottomOrange: {
    position: 'absolute',
    bottom: -40,
    right: -10,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F58220',
  },
    tabVacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF7EE',
  },
  tabVacioTitulo: { fontSize: 22, fontWeight: '800', color: '#0F5132' },
  tabVacioTexto: { fontSize: 14, color: '#777', marginTop: 6 },
  tabPerfil: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#FAF7EE',
  },
});