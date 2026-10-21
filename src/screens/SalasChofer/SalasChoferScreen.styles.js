import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDF8EC',
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  contenido: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
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

  // Cabecera
  cabecera: {
    marginBottom: 20,
    paddingRight: 56, // deja libre el engranaje de arriba a la derecha
  },
  btnVolver: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 16,
  },
  btnVolverTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  subtituloCabecera: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 22,
    marginBottom: 10,
  },
  seccionTitulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.6,
  },

  // Tarjeta base
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  // Estado vacío
  vacio: {
    alignItems: 'center',
    marginTop: 50,
  },
  vacioCirculo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FDE9D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  vacioEmoji: {
    fontSize: 40,
  },
  vacioTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  buscandoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  buscandoTexto: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  puntoEstado: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  // Solicitud / candidato
  solicitudEncabezado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinCirculo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FDE9D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pinEmoji: {
    fontSize: 18,
  },
  solicitudInfo: {
    flex: 1,
  },
  solicitudDestino: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 12,
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
  },

  // Botones
  filaBotones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  botonMitad: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 25,
    alignItems: 'center',
  },
  boton: {
    backgroundColor: '#F58220',
    elevation: 2,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botonNeutro: {
    backgroundColor: '#F0F0F0',
  },
  botonNeutroTexto: {
    color: '#333333',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Estado del viaje
  estadoPildora: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  estadoPildoraTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
  },

  // Cupos
  cuposEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cuposResumen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  asientosFila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  asiento: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  asientoLleno: {
    backgroundColor: '#F58220',
    borderColor: '#F58220',
    borderStyle: 'solid',
  },
  asientoTexto: {
    fontSize: 18,
  },
  cuposDetalle: {
    marginTop: 10,
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  chipTiempo: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDE9D3',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 14,
  },
  chipTiempoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D9690B',
  },
  chipTiempoFin: {
    backgroundColor: '#F0F0F0',
  },
  chipTiempoFinTexto: {
    color: '#666666',
  },

  // Paradas (línea de tiempo)
  paradaFila: {
    flexDirection: 'row',
  },
  paradaIzquierda: {
    alignItems: 'center',
    marginRight: 14,
  },
  paradaNumero: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paradaNumeroTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  paradaLinea: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 4,
    minHeight: 16,
  },
  paradaInfo: {
    flex: 1,
    paddingBottom: 16,
  },
  paradaTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  paradaNombre: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },

  textoError: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 8,
  },
});

export default styles;