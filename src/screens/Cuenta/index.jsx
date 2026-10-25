import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from '../../hooks/useHome';
import { useFotoPerfil } from '../../hooks/useFotoPerfil';
import Avatar from '../../components/Avatar';

const VERDE = '#0F5132';

export default function CuentaScreen({ perfil, onIrAVehiculo, onCerrarSesion, onFotoActualizada }) {
  const insets = useSafeAreaInsets();
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });
  const { fotoUrl, subiendo, error, elegir, quitar } = useFotoPerfil(perfil?.id, perfil?.foto_url);
  const nombre = perfil?.nombre || 'Usuario';
  const esChofer = perfil?.rol === 'chofer';
  const rolTexto = esChofer ? 'Chofer' : 'Pasajero';

  // Avisa a App.js para que el resto de pantallas vean la foto nueva
  useEffect(() => {
    if (fotoUrl !== (perfil?.foto_url ?? null)) onFotoActualizada?.(fotoUrl);
  }, [fotoUrl]);

  const cambiarFoto = () => {
    const botones = [
      { text: 'Tomar foto', onPress: () => elegir('camara') },
      { text: 'Elegir de la galería', onPress: () => elegir('galeria') },
    ];
    if (fotoUrl) botones.push({ text: 'Quitar foto', style: 'destructive', onPress: quitar });
    botones.push({ text: 'Cancelar', style: 'cancel' });
    Alert.alert('Foto de perfil', undefined, botones);
  };

  return (
    <View style={[styles.contenedor, { paddingTop: insets.top + 16 }]}>
      <View style={styles.tarjeta}>
        <TouchableOpacity onPress={cambiarFoto} disabled={subiendo} activeOpacity={0.8}>
          <Avatar
            uri={fotoUrl}
            nombre={nombre}
            tamano={88}
            colorFondo={VERDE}
            colorTexto="#FFFFFF"
          />
          <View style={styles.camara}>
            {subiendo ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}

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
  camara: {
    position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14,
    backgroundColor: VERDE, borderWidth: 2, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  error: { color: '#DC2626', fontSize: 12, marginTop: 8, textAlign: 'center' },
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