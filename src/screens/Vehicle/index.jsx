import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVehicle } from '../../hooks/useVehicle';
import styles from './VehicleScreen.styles';

const VERDE = '#0F5132';

function Cabecera({ onVolver, titulo }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onVolver} style={styles.btnVolver} activeOpacity={0.7}>
        <Text style={styles.btnVolverText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.tituloPantalla}>{titulo}</Text>
    </View>
  );
}

export default function VehicleScreen({ usuario, onVolver }) {
  const insets = useSafeAreaInsets();
  const {
    placa, setPlaca,
    modelo, setModelo,
    capacidad, setCapacidad,
    vehiculo,
    cargando,
    cargandoInicial,
    registrarVehiculo,
  } = useVehicle(usuario);

  // ---------- Cargando ----------
  if (cargandoInicial) {
    return (
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={VERDE} />
        </View>
      </View>
    );
  }

  // ---------- Vehículo ya registrado ----------
  if (vehiculo) {
    const asientos = Math.min(Number(vehiculo.capacidad_pasajeros) || 0, 8);

    return (
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <Cabecera onVolver={onVolver} titulo="Mi vehículo" />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.iconoCirculo}>
              <Ionicons name="car" size={36} color={VERDE} />
            </View>

            <Text style={styles.titulo}>Tu vehículo</Text>
            <Text style={styles.subtituloCentro}>Registrado y listo para viajar</Text>

            <View style={styles.placa}>
              <Text style={styles.placaTexto}>{vehiculo.placa}</Text>
            </View>

            <View style={styles.separador} />

            <View style={styles.filaDato}>
              <Text style={styles.datoLabel}>MODELO</Text>
              <Text style={styles.datoValor}>{vehiculo.modelo}</Text>
            </View>

            <View style={styles.cuposBloque}>
              <View style={styles.filaDato}>
                <Text style={styles.datoLabel}>CAPACIDAD</Text>
                <Text style={styles.datoValor}>
                  {vehiculo.capacidad_pasajeros + ' pasajeros'}
                </Text>
              </View>
              <View style={styles.asientosFila}>
                {Array.from({ length: asientos }).map((_, i) => (
                  <View key={i} style={styles.asiento}>
                    <Ionicons name="person" size={18} color="#FFFFFF" />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------- Formulario de registro ----------
  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Cabecera onVolver={onVolver} titulo="Mi vehículo" />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <View style={styles.iconoCirculo}>
              <Ionicons name="car" size={36} color={VERDE} />
            </View>
            <Text style={styles.titulo}>Registra tu vehículo</Text>
            <Text style={styles.subtituloCentro}>
              Necesitas esto para poder aceptar pasajeros
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>PLACA</Text>
            <TextInput
              style={styles.input}
              placeholder="ABC-123"
              placeholderTextColor="#999999"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>MODELO</Text>
            <TextInput
              style={styles.input}
              placeholder="Toyota Yaris"
              placeholderTextColor="#999999"
              value={modelo}
              onChangeText={setModelo}
            />

            <Text style={styles.label}>CAPACIDAD DE PASAJEROS</Text>
            <TextInput
              style={styles.input}
              placeholder="4"
              placeholderTextColor="#999999"
              value={capacidad}
              onChangeText={setCapacidad}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={[styles.btnPrimary, cargando && styles.btnDeshabilitado]}
              onPress={() => registrarVehiculo(onVolver)}
              activeOpacity={0.8}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>Registrar vehículo</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}