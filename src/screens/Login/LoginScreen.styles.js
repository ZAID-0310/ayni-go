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
});