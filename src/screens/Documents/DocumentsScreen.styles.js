import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';

export default StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, gap: spacing.md },
  titulo: { fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text },
  itemDoc: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  itemNombre: { fontSize: fontSize.md, fontWeight: 'bold', marginBottom: 4 },
  estadoPendiente: { color: '#d97706' },
  estadoAprobado: { color: '#16a34a' },
  estadoRechazado: { color: '#dc2626' },
});