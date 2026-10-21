import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useVehicle } from '../../hooks/useVehicle';
import styles from './VehicleScreen.styles';

function Decoraciones() {
  return (
    <>
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecorationContainer}>
        <View style={styles.bottomYellow} />
        <View style={styles.bottomOrange} />
      </View>
    </>
  );
}

export default function VehicleScreen({ usuario, onVolver }) {
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#F58220" />
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Vehículo ya registrado ----------
  if (vehiculo) {
    const asientos = Math.min(Number(vehiculo.capacidad_pasajeros) || 0, 8);

    return (
      <SafeAreaView style={styles.safeArea}>
        <Decoraciones />
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconoCirculo}>
              <Text style={styles.iconoEmoji}>🚗</Text>
            </View>

            <Text style={styles.titulo}>Tu vehículo</Text>
            <Text style={styles.subtituloCentro}>Registrado y listo para viajar</Text>

            {/* Placa */}
            <View style={styles.placa}>
              <Text style={styles.placaTexto}>{vehiculo.placa}</Text>
            </View>

            <View style={styles.separador} />

            {/* Modelo */}
            <View style={styles.filaDato}>
              <Text style={styles.datoLabel}>MODELO</Text>
              <Text style={styles.datoValor}>{vehiculo.modelo}</Text>
            </View>

            {/* Capacidad */}
            <View style={styles.cuposBloque}>
              <View style={styles.filaDato}>
                <Text style={styles.datoLabel}>CAPACIDAD</Text>
                <Text style={styles.datoValor}>
                  {vehiculo.capacidad_pasajeros} pasajeros
                </Text>
              </View>
              <View style={styles.asientosFila}>
                {Array.from({ length: asientos }).map((_, i) => (
                  <View key={i} style={styles.asiento}>
                    <Text style={styles.asientoTexto}>👤</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnOutline}
              onPress={onVolver}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Formulario de registro ----------
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Decoraciones />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <View style={styles.iconoCirculo}>
              <Text style={styles.iconoEmoji}>🚗</Text>
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
              placeholderTextColor="#999"
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>MODELO</Text>
            <TextInput
              style={styles.input}
              placeholder="Toyota Yaris"
              placeholderTextColor="#999"
              value={modelo}
              onChangeText={setModelo}
            />

            <Text style={styles.label}>CAPACIDAD DE PASAJEROS</Text>
            <TextInput
              style={styles.input}
              placeholder="4"
              placeholderTextColor="#999"
              value={capacidad}
              onChangeText={setCapacidad}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={styles.btnPrimary}
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

            <TouchableOpacity
              style={styles.btnVolverLink}
              onPress={onVolver}
              activeOpacity={0.6}
            >
              <Text style={styles.btnVolverLinkText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}