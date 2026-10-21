import { StyleSheet } from 'react-native';

const GREEN = '#0F5132';
const CREAM = '#FAF7EE';
const GREEN_SOFT = '#DCEBDD';
const GREEN_SOFTER = '#E8F2E6';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREAM },

  container: {
    flex: 1,
    backgroundColor: CREAM,
    paddingHorizontal: 28,
    overflow: 'hidden',
  },

  // Decoraciones superiores
  topBlobA: {
    position: 'absolute', top: -90, left: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: GREEN_SOFT, opacity: 0.8,
  },
  topBlobB: {
    position: 'absolute', top: -60, right: -110,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: GREEN_SOFTER,
  },

  // Decoración inferior
  bottomDecorationContainer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 190, overflow: 'hidden',
  },
  skyline: {
    position: 'absolute', bottom: 95, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-evenly', opacity: 0.5,
  },
  building: {
    width: 20, backgroundColor: GREEN_SOFT,
    borderTopLeftRadius: 3, borderTopRightRadius: 3,
  },
  hillBack: {
    position: 'absolute', bottom: -100, left: -60,
    width: 430, height: 220, borderRadius: 220,
    backgroundColor: GREEN_SOFT, opacity: 0.8,
  },
  hillFront: {
    position: 'absolute', bottom: -140, right: -130,
    width: 430, height: 230, borderRadius: 230,
    backgroundColor: GREEN_SOFTER,
  },

  // Logo y eslogan (el paddingTop se suma en el JSX)
  header: { alignItems: 'center', flexShrink: 0 },
  logo: { width: 240, height: 140 },
  slogan: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
    color: GREEN,
    textAlign: 'center',
  },

  // Ilustración: centrada en el espacio libre entre logo y botones
  illustrationContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: '118%',
    aspectRatio: 1.5,
    alignSelf: 'center',
  },

  // Botones inferiores
  actions: { flexShrink: 0, paddingTop: 8, paddingBottom: 28 },
  subtitulo: {
    fontSize: 15, color: GREEN, opacity: 0.8,
    textAlign: 'center', marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: GREEN, borderRadius: 999,
    paddingVertical: 15, alignItems: 'center', marginBottom: 12,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  btnHintLight: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 3 },
  btnSecondary: {
    borderWidth: 1.5, borderColor: GREEN, backgroundColor: 'transparent',
    borderRadius: 999, paddingVertical: 15, alignItems: 'center',
  },
  btnSecondaryText: { color: GREEN, fontSize: 16, fontWeight: '700' },
  btnHintDark: { color: GREEN, opacity: 0.7, fontSize: 12, marginTop: 3 },
});