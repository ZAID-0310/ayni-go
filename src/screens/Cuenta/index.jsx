import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from '../../hooks/useHome';
import { useFotoPerfil } from '../../hooks/useFotoPerfil';
import useTotalViajes from '../../hooks/useTotalViajes';
import Avatar from '../../components/Avatar';
import styles, { COLORES } from './CuentaScreen.styles';

// Cada cuántos viajes sube de nivel (ajústalo a tu gusto)
const VIAJES_POR_NIVEL = 50;

export default function CuentaScreen({ perfil, onIrAVehiculo, onCerrarSesion, onFotoActualizada }) {
  const insets = useSafeAreaInsets();
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });
  const { fotoUrl, subiendo, error, elegir, quitar } = useFotoPerfil(perfil?.id, perfil?.foto_url);
  const { total: totalViajes, cargando: cargandoViajes } = useTotalViajes();

  const nombre = perfil?.nombre || 'Usuario';
  const esChofer = perfil?.rol === 'chofer';
  const rolTexto = esChofer ? 'Chofer Verificado' : 'Pasajero Ayni-Go';

  const nivel = Math.floor(totalViajes / VIAJES_POR_NIVEL) + 1;

  const stats = [
    { valor: cargandoViajes ? '-' : totalViajes, label: 'VIAJES' },
    { valor: '-', label: 'RATING' },
    { valor: `${nivel}°`, label: 'NIVEL' },
  ];

  // Avisa a App.js para que el resto de pantallas vean la foto nueva
  useEffect(() => {
    if (fotoUrl !== (perfil?.foto_url ?? null)) onFotoActualizada?.(fotoUrl);
  }, [fotoUrl]);

  const cambiarFoto = () => {
    const botones = [
      { text: 'Tomar foto', onPress: () => elegir('camara') },
      { text: 'Elegir de la galería', onPress: () => elegir('galeria') },
      ...(fotoUrl ? [{ text: 'Quitar foto', style: 'destructive', onPress: quitar }] : []),
      { text: 'Cancelar', style: 'cancel' },
    ];
    Alert.alert('Foto de perfil', undefined, botones);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado */}
      <View style={styles.headerBar}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.editIconBtn} onPress={cambiarFoto} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={20} color={COLORES.verde} />
        </TouchableOpacity>
      </View>

      {/* Tarjeta principal */}
      <View style={styles.tarjeta}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={cambiarFoto} disabled={subiendo} activeOpacity={0.8}>
            <View style={styles.avatarBorderWrapper}>
              <Avatar
                uri={fotoUrl}
                nombre={nombre}
                tamano={100}
                colorFondo={COLORES.verde}
                colorTexto={COLORES.blanco}
              />
            </View>
            <View style={styles.camaraBadge}>
              {subiendo ? (
                <ActivityIndicator size="small" color={COLORES.blanco} />
              ) : (
                <Ionicons name="camera" size={14} color={COLORES.blanco} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.email} numberOfLines={1}>{perfil?.email || '-'}</Text>

        <View style={styles.badge}>
          <Ionicons
            name={esChofer ? 'car-sport' : 'person'}
            size={14}
            color={COLORES.verde}
            style={styles.badgeIcono}
          />
          <Text style={styles.badgeTexto}>{rolTexto}</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{s.valor}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Acciones */}
        <View style={styles.acciones}>
          {esChofer ? (
            <TouchableOpacity style={styles.btnPrimaryModern} onPress={onIrAVehiculo} activeOpacity={0.85}>
              <Ionicons name="car-outline" size={18} color={COLORES.blanco} style={styles.btnIcono} />
              <Text style={styles.btnPrimaryTexto}>Administrar mi vehículo</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.btnSecondaryModern} onPress={cambiarFoto} activeOpacity={0.85}>
            <Ionicons name="image-outline" size={18} color={COLORES.verde} style={styles.btnIcono} />
            <Text style={styles.btnSecondaryTexto}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logout} onPress={cerrarSesion} disabled={loading} activeOpacity={0.6}>
          {loading ? (
            <ActivityIndicator color={COLORES.peligro} />
          ) : (
            <View style={styles.logoutFila}>
              <Ionicons name="log-out-outline" size={16} color={COLORES.peligro} style={styles.logoutIcono} />
              <Text style={styles.logoutTexto}>Cerrar sesión</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}