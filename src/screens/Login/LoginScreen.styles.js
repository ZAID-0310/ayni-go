import { StyleSheet } from 'react-native';

const GREEN = '#0F5132';
const CREAM = '#FAF7EE';
const GREEN_SOFT = '#DCEBDD';
const GREEN_SOFTER = '#E8F2E6';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREAM },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 60,
  },

  // Flecha volver
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // Logo
  headerContainer: { alignItems: 'center', marginTop: 0, marginBottom: 4 },
  logoImage: { width: 300, height: 200 },

  // Título
  titleContainer: { marginBottom: 20 },
  titulo: { fontSize: 26, fontWeight: '800', color: GREEN },
  subtitulo: { fontSize: 14, color: '#555', marginTop: 4, lineHeight: 20 },

  // Formulario
  formContainer: { width: '100%' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E0D5',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    minHeight: 56,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 14,
  },
  eyeButton: { position: 'absolute', right: 14 },

  forgotWrapper: { alignSelf: 'flex-end', marginBottom: 18 },
  forgotText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  btnPrimary: {
    backgroundColor: GREEN,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  // Botón con estado de carga mejorado
  btnPrimaryLoading: {
    backgroundColor: '#0a3d25',
    opacity: 0.9,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryTextLoading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },

  // Footer
  footerContainer: { alignItems: 'center', marginTop: 28 },
  registerContainer: { flexDirection: 'row', alignItems: 'center' },
  registerText: { fontSize: 13, color: '#555' },
  registerLink: {
    fontSize: 13,
    color: GREEN,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  homeLink: { fontSize: 12, color: '#888' },

  // Decoración inferior
  bottomDecorationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 130,
    overflow: 'hidden',
  },
  hillBack: {
    position: 'absolute',
    bottom: -90,
    left: -60,
    width: 430,
    height: 200,
    borderRadius: 200,
    backgroundColor: GREEN_SOFT,
    opacity: 0.8,
  },
  hillFront: {
    position: 'absolute',
    bottom: -120,
    right: -130,
    width: 430,
    height: 210,
    borderRadius: 210,
    backgroundColor: GREEN_SOFTER,
  },

  // --- ESTILOS DEL MODAL MODERNO ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FAF7EE',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E3E0D5',
  },
  modalIconContainer: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F5132',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#0F5132',
    borderRadius: 999,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0F5132',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});