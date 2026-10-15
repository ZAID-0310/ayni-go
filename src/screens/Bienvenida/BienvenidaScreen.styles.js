import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FDF8EC' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    gap: 16,
  },

  logo: {
  width: 220,
  height: 160,
  alignSelf: 'center',
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
  titulo: { fontSize: 34, fontWeight: '900', color: '#1A1A1A', textAlign: 'center' },
  subtitulo: { fontSize: 15, color: '#666666', textAlign: 'center', marginBottom: 16 },
  btnPrimary: {
    backgroundColor: '#F58220',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  btnSecondary: {
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnSecondaryText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  btnHint: { color: '#FFFFFFCC', fontSize: 12, marginTop: 2 },
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
    position: 'absolute', bottom: -20, right: -20,
    width: 130, height: 130, borderRadius: 65, backgroundColor: '#F7C942',
  },
  bottomOrange: {
    position: 'absolute', bottom: -40, right: -10,
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#F58220',
  },
});