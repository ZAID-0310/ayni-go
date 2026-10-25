import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
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
  const rolTexto = esChofer ? 'Chofer Verificado' : 'Pasajero Ayni-Go';

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
    <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
      
      {/* Encabezado Estilizado similar al referente */}
      <View style={styles.headerBar}>
        <View style={{ width: 32 }} />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.editIconBtn} onPress={cambiarFoto} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={20} color={VERDE} />
        </TouchableOpacity>
      </View>

      {/* Tarjeta Principal Flotante */}
      <View style={styles.tarjeta}>
        
        {/* Contenedor del Avatar con borde moderno */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={cambiarFoto} disabled={subiendo} activeOpacity={0.8}>
            <View style={styles.avatarBorderWrapper}>
              <Avatar
                uri={fotoUrl}
                nombre={nombre}
                tamano={100}
                colorFondo={VERDE}
                colorTexto="#FFFFFF"
              />
            </View>
            <View style={styles.camaraBadge}>
              {subiendo ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Información del Usuario */}
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.email} numberOfLines={1}>{perfil?.email || '-'}</Text>
        
        <View style={styles.badge}>
          <Ionicons name={esChofer ? "car-sport" : "person"} size={14} color={VERDE} style={{ marginRight: 6 }} />
          <Text style={styles.badgeTexto}>{rolTexto}</Text>
        </View>

        {/* Sección de Estadísticas Estilo Tarjeta Referente */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>VIAJES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>RATING</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1°</Text>
            <Text style={styles.statLabel}>NIVEL</Text>
          </View>
        </View>

        {/* Botones de Acción Estilizados (como los botones inferiores de la ref) */}
        <View style={styles.acciones}>
          {esChofer ? (
            <TouchableOpacity style={styles.btnPrimaryModern} onPress={onIrAVehiculo} activeOpacity={0.85}>
              <Ionicons name="car-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnPrimaryTexto}>Administrar mi vehículo</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.btnSecondaryModern} onPress={cambiarFoto} activeOpacity={0.85}>
            <Ionicons name="image-outline" size={18} color={VERDE} style={{ marginRight: 8 }} />
            <Text style={styles.btnSecondaryTexto}>Cambiar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity style={styles.logout} onPress={cerrarSesion} disabled={loading} activeOpacity={0.6}>
          {loading ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="log-out-outline" size={16} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.logoutTexto}>Cerrar sesión</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    backgroundColor: '#FAF7EE', 
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E0D5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tarjeta: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    borderWidth: 1,
    borderColor: '#E3E0D5', 
    padding: 24, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    marginTop: 4,
    marginBottom: 12,
  },
  avatarBorderWrapper: {
    padding: 3,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: VERDE,
    borderStyle: 'dashed', // Toque moderno tipo anillo de perfil
  },
  camaraBadge: {
    position: 'absolute', 
    right: 4, 
    bottom: 4, 
    width: 32, 
    height: 32, 
    borderRadius: 16,
    backgroundColor: VERDE, 
    borderWidth: 2.5, 
    borderColor: '#FFFFFF',
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  error: { color: '#DC2626', fontSize: 12, marginTop: 8, textAlign: 'center' },
  nombre: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginTop: 4, textAlign: 'center' },
  email: { fontSize: 13, color: '#666', marginTop: 2, textAlign: 'center' },
  badge: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCEBDD', 
    borderRadius: 20, 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    marginTop: 12,
  },
  badgeTexto: { color: VERDE, fontSize: 12, fontWeight: '700' },
  
  /* Bloque de Estadísticas (inspirado en la referencia de los contadores) */
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FAF7EE',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E3E0D5',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777777',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E3E0D5',
  },

  acciones: { width: '100%', marginTop: 4 },
  btnPrimaryModern: {
    flexDirection: 'row',
    backgroundColor: VERDE,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: VERDE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnPrimaryTexto: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  btnSecondaryModern: {
    flexDirection: 'row',
    backgroundColor: '#F3F0E6',
    borderWidth: 1,
    borderColor: '#E3E0D5',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  btnSecondaryTexto: { color: VERDE, fontSize: 15, fontWeight: '600' },
  
  logout: { marginTop: 18, paddingVertical: 8, alignItems: 'center' },
  logoutTexto: { color: '#DC2626', fontSize: 14, fontWeight: '700' },
});