import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  titulo: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text },
  subtitulo: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: spacing.md },
  infoBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    gap: 4,
  },
});