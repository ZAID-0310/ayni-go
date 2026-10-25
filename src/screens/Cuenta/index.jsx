import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHome } from '../../hooks/useHome';

const VERDE = '#0F5132';

export default function CuentaScreen({ perfil, onIrAVehiculo, onCerrarSesion }) {
  const insets = useSafeAreaInsets();
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });
  const nombre = perfil?.nombre || 'Usuario';
  const esChofer = perfil?.rol === 'chofer';
  const rolTexto = esChofer ? 'Chofer' : 'Pasajero';

  return (
    <View style={[styles.contenedor, { paddingTop: insets.top + 16 }]}>
      <View style={styles.tarjeta}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{nombre.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.email} numberOfLines={1}>{perfil?.email || '-'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>{rolTexto}</Text>
        </View>

        {esChofer ? (
          <View style={styles.acciones}>
            <TouchableOpacity style={styles.btn} onPress={onIrAVehiculo} activeOpacity={0.8}>
              <Text style={styles.btnTexto}>Mi vehículo</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity style={styles.logout} onPress={cerrarSesion} disabled={loading} activeOpacity={0.6}>
          {loading ? (
            <ActivityIndicator color={VERDE} />
          ) : (
            <Text style={styles.logoutTexto}>Cerrar sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#FAF7EE', paddingHorizontal: 16 },
  tarjeta: {
    backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1,
    borderColor: '#E3E0D5', padding: 20, alignItems: 'center',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: VERDE,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTexto: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  nombre: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginTop: 12 },
  email: { fontSize: 13, color: '#666', marginTop: 2 },
  badge: { backgroundColor: '#DCEBDD', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 },
  badgeTexto: { color: VERDE, fontSize: 12, fontWeight: '600' },
  acciones: { width: '100%', marginTop: 16 },
  btn: {
    borderWidth: 1, borderColor: VERDE, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', marginBottom: 10,
  },
  btnTexto: { color: VERDE, fontSize: 15, fontWeight: '600' },
  logout: { marginTop: 14, paddingVertical: 10 },
  logoutTexto: { color: '#DC2626', fontSize: 15, fontWeight: '600' },
});