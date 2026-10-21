import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useProgramadosChofer } from '../../hooks/useProgramadosChofer';
import { formatearHora } from '../../hooks/useProgramados';
import { styles } from './ProgramadosChoferScreen.styles';

const km = (m) => (Number(m ?? 0) / 1000).toFixed(1);

export default function ProgramadosChoferScreen({ onVolver, onIrAlViaje }) {
  const { disponibles, aceptados, cargando, trabajando, error, aceptar, soltar, preparar } =
    useProgramadosChofer();

  const confirmarPreparar = (p) => {
    Alert.alert(
      'Preparar viaje',
      'Se creará el viaje con todos los pasajeros de esa franja horaria. ¿Continuar?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, preparar',
          onPress: async () => {
            const ok = await preparar(p.id);
            if (ok) onIrAlViaje();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVolver} style={styles.btnVolver}>
          <Text style={styles.btnVolverText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Viajes programados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {cargando && <ActivityIndicator style={styles.cargando} color="#F58220" />}
        {error ? <Text style={styles.textoError}>{error}</Text> : null}

        <Text style={styles.seccion}>Mis viajes aceptados</Text>
        {!cargando && aceptados.length === 0 && (
          <Text style={styles.vacio}>Aún no aceptaste ningún viaje.</Text>
        )}
        {aceptados.map((p) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.hora}>Sale: {formatearHora(p.hora_salida)}</Text>
            <Text style={styles.direccion} numberOfLines={2}>
              {p.destino?.direccion || 'Destino sin nombre'}
            </Text>
            <Text style={styles.sub}>Pasajero: {p.pasajero?.nombre}</Text>
            <Text style={styles.sub}>
              Asientos en esa franja: {p.ocupados} de {p.capacidad}
            </Text>
            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.btnPrincipal}
                onPress={() => confirmarPreparar(p)}
                disabled={trabajando}
              >
                <Text style={styles.btnPrincipalText}>Preparar viaje</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnOutline}
                onPress={() => soltar(p.id)}
                disabled={trabajando}
              >
                <Text style={styles.btnOutlineText}>Soltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.seccion}>Disponibles</Text>
        {!cargando && disponibles.length === 0 && (
          <Text style={styles.vacio}>No hay viajes programados por ahora.</Text>
        )}
        {disponibles.map((p) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.hora}>Sale: {formatearHora(p.hora_salida)}</Text>
            <Text style={styles.direccion} numberOfLines={2}>
              {p.destino?.direccion || 'Destino sin nombre'}
            </Text>
            <Text style={styles.sub}>A {km(p.distancia_origen_m)} km del punto de partida</Text>
            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.btnPrincipal}
                onPress={() => aceptar(p.id)}
                disabled={trabajando}
              >
                <Text style={styles.btnPrincipalText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}