import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHome } from '../../hooks/useHome';
import { styles } from './HomeScreen.styles';
import PedirViajeScreen from '../PedirViaje';
import SalasChoferScreen from '../SalasChofer';
import MenuLateral from '../../components/MenuLateral';

const VERDE = '#0F5132';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export default function HomeScreen({
  perfil,
  onCerrarSesion,
  onIrAVehiculo,
  onIrADocumentos,
  onIrASalasChofer,
  onIrAProgramados,
  onIrAProgramadosChofer,
  onIrAHistorial,
}) {
  const { cerrarSesion } = useHome({ onCerrarSesion });
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [enLinea, setEnLinea] = useState(true);

  const esPasajero = perfil?.rol === 'pasajero';

  const proximamente = (titulo) => Alert.alert(titulo, 'Función en desarrollo');

  // ---------- PASAJERO ----------
  if (esPasajero) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1 }}>
          <PedirViajeScreen
            perfil={perfil}
            onIrAVehiculo={onIrAVehiculo}
            onIrADocumentos={onIrADocumentos}
            onIrASalasChofer={onIrASalasChofer}
            onIrAProgramados={onIrAProgramados}
            onIrAProgramadosChofer={onIrAProgramadosChofer}
            onIrAHistorial={onIrAHistorial}
            onCerrarSesion={cerrarSesion}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ---------- CHOFER ----------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.choferContainer}>
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

        <MenuLateral
          visible={menuAbierto}
          onCerrar={() => setMenuAbierto(false)}
          perfil={perfil}
          onIrADocumentos={onIrADocumentos}
          onCerrarSesion={cerrarSesion}
        />
      </View>
    </SafeAreaView>
  );
}