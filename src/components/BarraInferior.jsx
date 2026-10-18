import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VERDE = '#0F5132';

const TABS = [
  { id: 'inicio', label: 'Inicio', icono: 'home' },
  { id: 'viajes', label: 'Viajes', icono: 'car' },
  { id: 'notificaciones', label: 'Notificaciones', icono: 'notifications' },
  { id: 'perfil', label: 'Perfil', icono: 'person' },
];

export default function BarraInferior({ activa, onCambiar }) {
  return (
    <View style={styles.barra}>
      {TABS.map((t) => {
        const activo = activa === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.tab}
            onPress={() => onCambiar(t.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activo ? t.icono : `${t.icono}-outline`}
              size={24}
              color={activo ? VERDE : '#7A7A7A'}
            />
            <Text style={[styles.label, activo && styles.labelActivo]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E3E0D5',
    paddingTop: 8,
    paddingBottom: 14,
    elevation: 12,
  },
  tab: { flex: 1, alignItems: 'center' },
  label: { fontSize: 11, color: '#7A7A7A', marginTop: 2 },
  labelActivo: { color: VERDE, fontWeight: '700' },
});