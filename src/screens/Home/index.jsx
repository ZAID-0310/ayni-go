import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator 
} from 'react-native';
import { useHome } from '../../hooks/useHome';
import { styles } from './HomeScreen.styles';

export default function HomeScreen({ perfil, onCerrarSesion,onIrAVehiculo,onIrADocumentos  }) {
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Decoración superior */}
        <View style={styles.topDecoration} />

        {/* Tarjeta de información del usuario */}
        <View style={styles.card}>
          <Text style={styles.titulo}>¡Bienvenido, {perfil?.nombre || 'Usuario'}!</Text>

          <View style={styles.infoContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>CORREO</Text>
              <Text style={styles.value}>{perfil?.email || '-'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>ROL</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{perfil?.rol || 'Sin Rol'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>ID</Text>
              <Text style={[styles.value, { fontSize: 11, color: '#888' }]} numberOfLines={1} ellipsizeMode="middle">
                {perfil?.id || '-'}
              </Text>
            </View>
          </View>
          {perfil?.rol === 'chofer' && (
            <TouchableOpacity 
                style={styles.btnSecondary} 
                onPress={onIrAVehiculo}
                activeOpacity={0.8}
            >
                <Text style={styles.btnSecondaryText}>Mi vehículo</Text>
            </TouchableOpacity>
          )}
          {perfil?.rol === 'chofer' && (
            <TouchableOpacity 
              style={styles.btnSecondary} 
              onPress={onIrADocumentos}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>Mis documentos</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.btnSecondary} 
            onPress={cerrarSesion} 
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnSecondaryText}>Cerrar sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Decoración inferior */}
        <View style={styles.bottomDecorationContainer}>
          <View style={styles.bottomYellow} />
          <View style={styles.bottomOrange} />
        </View>
      </View>
    </SafeAreaView>
  );
}