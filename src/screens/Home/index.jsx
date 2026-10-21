import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from '../../hooks/useHome';
import { styles } from './HomeScreen.styles';
import PedirViajeScreen from '../PedirViaje';
import SalasChoferScreen from '../SalasChofer';
import BarraInferior from '../../components/BarraInferior';
import MenuLateral from '../../components/MenuLateral';

const VERDE = '#0F5132';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const TABS_CHOFER = [
  { id: 'solicitudes', label: 'Solicitudes', icono: 'list' },
  { id: 'vehiculo', label: 'Mi vehículo', icono: 'car' },
  { id: 'documentos', label: 'Documentos', icono: 'document-text' },
  { id: 'programados', label: 'Programados', icono: 'calendar' },
];

export default function HomeScreen({
  perfil,
  onCerrarSesion,
  onIrAVehiculo,
  onIrADocumentos,
  onIrAPedirViaje,
  onIrASalasChofer,
  onIrAProgramadosChofer,
  onIrAProgramados,
 // onIrAProgramadosChofer,
}) {
  const { loading, cerrarSesion } = useHome({ onCerrarSesion });
  const [tab, setTab] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [enLinea, setEnLinea] = useState(true);

  const nombre = perfil?.nombre || 'Usuario';
  const inicial = nombre.charAt(0).toUpperCase();
  const rol = perfil?.rol || '';
  const rolTexto = rol ? rol.charAt(0).toUpperCase() + rol.slice(1) : 'Sin rol';
  const esPasajero = rol === 'pasajero';
  const esChofer = rol === 'chofer';

  const proximamente = (titulo) => Alert.alert(titulo, 'Función en desarrollo');

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
            <TouchableOpacity style={styles.btnOutline} onPress={onIrAProgramadosChofer} activeOpacity={0.8}>
              <Text style={styles.btnOutlineText}>Viajes programados</Text>
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
          <ActivityIndicator color={VERDE} />
        ) : (
          <Text style={styles.btnLogoutText}>Cerrar sesión</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // ---------- PASAJERO (sin cambios) ----------
  if (esPasajero) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1 }}>
          <View style={[{ flex: 1 }, tab !== 'inicio' && { display: 'none' }]}>
            <PedirViajeScreen
              perfil={perfil}
              onIrAVehiculo={onIrAVehiculo}
              onIrADocumentos={onIrADocumentos}
              onIrASalasChofer={onIrASalasChofer}
              onIrAProgramados={onIrAProgramados}
              onIrAProgramadosChofer={onIrAProgramadosChofer}
              onCerrarSesion={cerrarSesion}
            />
          </View>

          {tab === 'viajes' && (
            <View style={styles.tabVacio}>
              <Text style={styles.tabVacioTitulo}>Mis viajes</Text>
              <View style={{ width: '80%', marginTop: 16 }}>
                <TouchableOpacity
                  style={styles.btnPrincipal}
                  onPress={onIrAProgramados}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnPrincipalText}>Viajes programados</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {tab === 'notificaciones' && (
            <View style={styles.tabVacio}>
              <Text style={styles.tabVacioTitulo}>Notificaciones</Text>
              <Text style={styles.tabVacioTexto}>Próximamente</Text>
            </View>
          )}

          {tab === 'perfil' && <View style={styles.tabPerfil}>{tarjetaPerfil}</View>}
        </View>

        <BarraInferior activa={tab} onCambiar={setTab} />
      </SafeAreaView>
    );
  }

  // ---------- CHOFER: solicitudes en Home + barra inferior ----------
  const cambiarTabChofer = (id) => {
    if (id === 'vehiculo') return onIrAVehiculo && onIrAVehiculo();
    if (id === 'documentos') return onIrADocumentos && onIrADocumentos();
    if (id === 'programados') {
      return onIrAProgramadosChofer
        ? onIrAProgramadosChofer()
        : proximamente('Viajes programados');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.choferContainer}>
        {/* Cabecera: menú, estado, campana */}
        <View style={[styles.choferHeader, { paddingTop: STATUS_BAR + 8 }]}>
          <TouchableOpacity
            onPress={() => setMenuAbierto(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="menu" size={28} color={VERDE} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.estadoPildora, !enLinea && styles.estadoPildoraOff]}
            onPress={() => setEnLinea(!enLinea)}
            activeOpacity={0.8}
          >
            <View style={[styles.estadoPunto, !enLinea && styles.estadoPuntoOff]} />
            <Text style={[styles.estadoTexto, !enLinea && styles.estadoTextoOff]}>
              {enLinea ? 'En línea' : 'Desconectado'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => proximamente('Notificaciones')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={26} color={VERDE} />
          </TouchableOpacity>
        </View>

        {/* Contenido: lista de solicitudes */}
        <View style={{ flex: 1 }}>
          {enLinea ? (
            <SalasChoferScreen perfil={perfil} />
          ) : (
            <View style={styles.tabVacio}>
              <Ionicons name="moon-outline" size={40} color={VERDE} />
              <Text style={[styles.tabVacioTitulo, { marginTop: 12 }]}>Estás desconectado</Text>
              <Text style={styles.tabVacioTexto}>Conéctate para ver solicitudes</Text>
            </View>
          )}
        </View>

        <BarraInferior activa="solicitudes" onCambiar={cambiarTabChofer} tabs={TABS_CHOFER} />

        <MenuLateral
          visible={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
          perfil={perfil}
          onIrAInicio={() => {}}
          onIrAVehiculo={onIrAVehiculo}
          onIrADocumentos={onIrADocumentos}
          onIrASalasChofer={() => {}}
          onIrAProgramadosChofer={onIrAProgramadosChofer}
          onCerrarSesion={cerrarSesion}
        />
      </View>
    </SafeAreaView>
  );
}