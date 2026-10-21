import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF8EC',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 60,
    justifyContent: 'center',
  },

  // Decoración
  topDecoration: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#F7C942',
  },
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

  // Tarjeta
  card: {
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
  iconoCirculo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FDE9D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconoEmoji: {
    fontSize: 34,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtituloCentro: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  // Placa
  placa: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1E1E1E',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 28,
  },
  placaTexto: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1E1E1E',
    letterSpacing: 4,
  },
  separador: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 22,
  },

  // Datos
  filaDato: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.6,
  },
  datoValor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cuposBloque: {
    width: '100%',
    marginTop: 18,
    marginBottom: 24,
    padding: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  asientosFila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  asiento: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F58220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  asientoTexto: {
    fontSize: 16,
  },

  // Formulario
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333333',
  },

  // Botones
  btnPrimary: {
    backgroundColor: '#F58220',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnOutline: {
    width: '100%',
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
  btnVolverLink: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnVolverLinkText: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});