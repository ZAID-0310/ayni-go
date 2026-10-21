import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const ANCHO = Math.min(Dimensions.get('window').width * 0.82, 340);
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const proximamente = (nombre) =>
  Alert.alert(nombre, 'Función en desarrollo');

export default function MenuLateral({
  visible,
  onCerrar,
  perfil,
  onIrAInicio,
  onIrAVehiculo,
  onIrADocumentos,
  onIrASalasChofer,
  onIrAProgramados,
  onIrAProgramadosChofer,
  onCerrarSesion,
}) {
    const x = useRef(new Animated.Value(-ANCHO)).current;
  const opacidadFondo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      x.setValue(-ANCHO);
      opacidadFondo.setValue(0);
      Animated.parallel([
        Animated.timing(x, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(opacidadFondo, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, x, opacidadFondo]);

  const cerrarConAnimacion = (despues) => {
    Animated.parallel([
      Animated.timing(x, { toValue: -ANCHO, duration: 200, useNativeDriver: true }),
      Animated.timing(opacidadFondo, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onCerrar();
      if (despues) despues();
    });
  };

  const nombre = perfil?.nombre || 'Usuario';
  const inicial = nombre.charAt(0).toUpperCase();
  const esChofer = perfil?.rol === 'chofer';
  const rolTexto = esChofer ? 'Chofer' : 'Pasajero';

  // Opciones que ya funcionan llevan accion; las demas muestran "Función en desarrollo"
  const items = esChofer
    ? [
        { label: 'Inicio', icono: 'home', accion: onIrAInicio, activo: true },
        { label: 'Viajes programados', icono: 'calendar-outline', accion: onIrAProgramadosChofer },
        { label: 'Ver solicitudes', icono: 'list-outline', accion: onIrASalasChofer },
        //{ label: 'Viajes programados', icono: 'calendar-outline', accion: onIrAProgramadosChofer },
        { label: 'Mi vehículo', icono: 'car-outline', accion: onIrAVehiculo },
        { label: 'Mis documentos', icono: 'document-text-outline', accion: onIrADocumentos },
        { label: 'Mis viajes', icono: 'car-sport-outline' },
        { label: 'Historial de viajes', icono: 'time-outline' },
        { label: 'Calificaciones', icono: 'star-outline' },
        { label: 'Seguridad', icono: 'shield-checkmark-outline' },
        { label: 'Ayuda y soporte', icono: 'headset-outline' },
        { label: 'Configuración', icono: 'settings-outline' },
      ]
    : [
        { label: 'Inicio', icono: 'home', accion: onIrAInicio, activo: true },
        { label: 'Viajes programados', icono: 'calendar-outline', accion: onIrAProgramados },
        { label: 'Mis viajes', icono: 'car-sport-outline' },
        //{ label: 'Viajes programados', icono: 'calendar-outline', accion: onIrAProgramados },
        { label: 'Historial de viajes', icono: 'time-outline' },
        { label: 'Seguridad', icono: 'shield-checkmark-outline' },
        { label: 'Ayuda y soporte', icono: 'headset-outline' },
        { label: 'Configuración', icono: 'settings-outline' },
      ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => cerrarConAnimacion()}>
      <View style={styles.raiz}>
        <Animated.View style={[styles.panel, { transform: [{ translateX: x }] }]}>
          <ScrollView
            contentContainerStyle={[styles.contenido, { paddingTop: STATUS_BAR + 8 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <Image
              source={require('../../assets/logo-horizontal.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Usuario */}
            <View style={styles.usuario}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>{inicial}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nombre} numberOfLines={1}>{nombre}</Text>
                <Text style={styles.email} numberOfLines={1}>{perfil?.email || ''}</Text>
                <View style={styles.badge}>
                  <Ionicons name="checkmark-circle" size={16} color={VERDE} />
                  <Text style={styles.badgeTexto}>{rolTexto}</Text>
                </View>
              </View>
            </View>

            {/* Opciones */}
            <View style={styles.lista}>
              {items.map((it) => (
                <TouchableOpacity
                  key={it.label}
                  style={[styles.fila, it.activo && styles.filaActiva]}
                  activeOpacity={0.7}
                  onPress={() =>
                    cerrarConAnimacion(() => (it.accion ? it.accion() : proximamente(it.label)))
                  }
                >
                  <Ionicons name={it.icono} size={24} color={VERDE} style={styles.filaIcono} />
                  <Text style={styles.filaTexto}>{it.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={VERDE} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.separador} />

            {/* Banner */}
            <TouchableOpacity
              style={styles.banner}
              activeOpacity={0.8}
              onPress={() => proximamente('Conduce con AYNI-GO')}
            >
              <View style={styles.bannerIcono}>
                <Ionicons name="car" size={26} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitulo}>Tu esfuerzo también te lleva lejos</Text>
                <Text style={styles.bannerSub}>Conduce con AYNI-GO</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={VERDE} />
            </TouchableOpacity>

            {/* Cerrar sesión */}
            <TouchableOpacity
              style={styles.cerrar}
              activeOpacity={0.7}
              onPress={() => cerrarConAnimacion(onCerrarSesion)}
            >
              <Ionicons name="log-out-outline" size={24} color={VERDE} style={styles.filaIcono} />
              <Text style={styles.filaTexto}>Cerrar sesión</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Zona oscura: tocar fuera cierra el menú */}
                <TouchableWithoutFeedback onPress={() => cerrarConAnimacion()}>
          <Animated.View style={[styles.fondo, { opacity: opacidadFondo }]} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, flexDirection: 'row' },
  panel: { width: ANCHO, backgroundColor: CREMA, elevation: 20 },
  fondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  contenido: { paddingHorizontal: 18, paddingBottom: 28 },

  logo: { width: 260, height: 100, alignSelf: 'flex-start', marginBottom: 0 },
    usuario: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: VERDE,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  avatarTexto: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  nombre: { fontSize: 18, fontWeight: '800', color: VERDE },
  email: { fontSize: 12, color: '#666', marginTop: 2 },
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: VERDE_SUAVE, borderRadius: 14,
    paddingHorizontal: 10, paddingVertical: 4, marginTop: 6,
  },
  badgeTexto: { color: VERDE, fontSize: 12, fontWeight: '600', marginLeft: 4 },

  lista: { marginTop: 4 },
  fila: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14,
  },
  filaActiva: { backgroundColor: VERDE_SUAVE },
  filaIcono: { marginRight: 16, width: 26 },
  filaTexto: { flex: 1, fontSize: 16, color: VERDE, fontWeight: '500' },

  separador: { height: 1, backgroundColor: '#E3E0D5', marginVertical: 14 },

  banner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: VERDE_SUAVE, borderRadius: 16, padding: 14, marginBottom: 12,
  },
  bannerIcono: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: VERDE,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  bannerTitulo: { fontSize: 14, fontWeight: '700', color: VERDE },
  bannerSub: { fontSize: 12, color: VERDE, marginTop: 2 },

  cerrar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0EEE4', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 12,
  },
});