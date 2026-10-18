import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useHome } from '../../hooks/useHome';
import { styles } from './HomeScreen.styles';
import PedirViajeScreen from '../PedirViaje';
import BarraInferior from '../../components/BarraInferior';

export default function HomeScreen({
  perfil,
  onCerrarSesion,
  onIrAVehiculo,
  onIrADocumentos,
  onIrAPedirViaje,
  onIrASalasChofer,
}) {
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });
  const [tab, setTab] = useState('inicio');

  const nombre = perfil?.nombre || 'Usuario';
  const inicial = nombre.charAt(0).toUpperCase();
  const rol = perfil?.rol || '';
  const rolTexto = rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : 'Sin rol';
  const esChofer = rol === 'chofer';
  const esPasajero = rol === 'pasajero';

  const tarjetaPerfil = (
    <View style={styles.perfilCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{inicial}</Text>
      </View>

      <Text style={styles.saludo}>¡Hola, {nombre}!</Text>
      <Text style={styles.email} numberOfLines={1}>
        {perfil?.email || '-'}
      </Text>
      <View style={styles.rolBadge}>
        <Text style={styles.rolBadgeText}>{rolTexto}</Text>
      </View>

      {esChofer && (
        <>
          <View style={styles.separador} />
          <View style={styles.acciones}>
            <TouchableOpacity style={styles.btnPrincipal} onPress={onIrASalasChofer} activeOpacity={0.8}>
              <Text style={styles.btnPrincipalText}>Ver solicitudes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={onIrAVehiculo} activeOpacity={0.8}>
              <Text style={styles.btnOutlineText}>Mi vehículo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={onIrADocumentos} activeOpacity={0.8}>
              <Text style={styles.btnOutlineText}>Mis documentos</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
  );

  // ---------- PASAJERO: mapa + barra inferior ----------
  if (esPasajero) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1 }}>
          <View style={[{ flex: 1 }, tab !== 'inicio' && { display: 'none' }]}>
            <PedirViajeScreen />
          </View>

          {tab === 'viajes' && (
            <View style={styles.tabVacio}>
              <Text style={styles.tabVacioTitulo}>Mis viajes</Text>
              <Text style={styles.tabVacioTexto}>Próximamente</Text>
            </View>
          )}

          {tab === 'notificaciones' && (
            <View style={styles.tabVacio}>
              <Text style={styles.tabVacioTitulo}>Notificaciones</Text>
              <Text style={styles.tabVacioTexto}>Próximamente</Text>
            </View>
          )}

          {tab === 'perfil' && (
            <View style={styles.tabPerfil}>{tarjetaPerfil}</View>
          )}
        </View>

        <BarraInferior activa={tab} onCambiar={setTab} />
      </SafeAreaView>
    );
  }

  // ---------- CHOFER: home de siempre ----------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topDecoration} />
        {tarjetaPerfil}
        <View style={styles.bottomDecorationContainer}>
          <View style={styles.bottomYellow} />
          <View style={styles.bottomOrange} />
        </View>
      </View>
    </SafeAreaView>
  );
}