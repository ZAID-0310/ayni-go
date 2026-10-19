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

export default function HomeScreen({
  perfil,
  onCerrarSesion,
  onIrAVehiculo,
  onIrADocumentos,
  onIrAPedirViaje,
  onIrASalasChofer,
  onIrAProgramados,
  onIrAProgramadosChofer
}) {
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });

  const nombre = perfil?.nombre || 'Usuario';
  const inicial = nombre.charAt(0).toUpperCase();
  const rol = perfil?.rol || '';
  const rolTexto = rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : 'Sin rol';
  const esChofer = rol === 'chofer';
  const esPasajero = rol === 'pasajero';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Decoración superior */}
        <View style={styles.topDecoration} />

        <View style={styles.perfilCard}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
          </View>

          {/* Saludo y datos */}
          <Text style={styles.saludo}>¡Hola, {nombre}!</Text>
          <Text style={styles.email} numberOfLines={1}>
            {perfil?.email || '-'}
          </Text>
          <View style={styles.rolBadge}>
            <Text style={styles.rolBadgeText}>{rolTexto}</Text>
          </View>

          <View style={styles.separador} />

          {/* Acciones */}
          <View style={styles.acciones}>
            {esPasajero && (
              <TouchableOpacity
                style={styles.btnPrincipal}
                onPress={onIrAPedirViaje}
                activeOpacity={0.8}
              >
              <Text style={styles.btnPrincipalText}>Pedir viaje</Text>
              </TouchableOpacity>
            )}

            {esPasajero && (
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={onIrAProgramados}
                activeOpacity={0.8}
              >
                <Text style={styles.btnOutlineText}>Viajes programados</Text>
              </TouchableOpacity>
            )}

            {esChofer && (
              <>
                <TouchableOpacity
                  style={styles.btnPrincipal}
                  onPress={onIrASalasChofer}
                  activeOpacity={0.8}
                >
                <Text style={styles.btnPrincipalText}>Ver solicitudes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={onIrAProgramadosChofer}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnOutlineText}>Viajes programados</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={onIrAVehiculo}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnOutlineText}>Mi vehículo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={onIrADocumentos}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnOutlineText}>Mis documentos</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Cerrar sesión */}
          <TouchableOpacity
            style={styles.btnLogout}
            onPress={cerrarSesion}
            activeOpacity={0.6}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#F58220" />
            ) : (
              <Text style={styles.btnLogoutText}>Cerrar sesión</Text>
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