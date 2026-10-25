import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgramadosChofer } from '../../hooks/useProgramadosChofer';
import { formatearHora } from '../../hooks/useProgramados';
import { styles } from './ProgramadosChoferScreen.styles';

const km = (m) => (Number(m ?? 0) / 1000).toFixed(1);

export default function ProgramadosChoferScreen({ onVolver, onIrAlViaje }) {
  const insets = useSafeAreaInsets();
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
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVolver} style={styles.btnVolver}>
          <Text style={styles.btnVolverText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Viajes programados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {cargando ? (
          <ActivityIndicator style={styles.cargando} color="#0F5132" />
        ) : null}
        {error ? <Text style={styles.textoError}>{error}</Text> : null}

        <Text style={styles.seccion}>Mis viajes aceptados</Text>
        {!cargando && aceptados.length === 0 ? (
          <Text style={styles.vacio}>Aún no aceptaste ningún viaje.</Text>
        ) : null}
        {aceptados.map((p) => (
          <View key={p.id} style={styles.card}>
            <View style={styles.pastilla}>
              <Text style={styles.pastillaTexto}>{'Sale: ' + formatearHora(p.hora_salida)}</Text>
            </View>
            <Text style={styles.direccion} numberOfLines={2}>
              {p.destino?.direccion || 'Destino sin nombre'}
            </Text>
            <Text style={styles.sub}>{'Pasajero: ' + (p.pasajero?.nombre || '')}</Text>
            <Text style={styles.sub}>
              {'Asientos en esa franja: ' + p.ocupados + ' de ' + p.capacidad}
            </Text>
            <View style={styles.acciones}>
              <TouchableOpacity
                style={[styles.btnPrincipal, trabajando && styles.btnDeshabilitado]}
                onPress={() => confirmarPreparar(p)}
                disabled={trabajando}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrincipalText}>Preparar viaje</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnOutline, trabajando && styles.btnDeshabilitado]}
                onPress={() => soltar(p.id)}
                disabled={trabajando}
                activeOpacity={0.8}
              >
                <Text style={styles.btnOutlineText}>Soltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.seccion}>Disponibles</Text>
        {!cargando && disponibles.length === 0 ? (
          <Text style={styles.vacio}>No hay viajes programados por ahora.</Text>
        ) : null}
        {disponibles.map((p) => (
          <View key={p.id} style={styles.card}>
            <View style={styles.pastilla}>
              <Text style={styles.pastillaTexto}>{'Sale: ' + formatearHora(p.hora_salida)}</Text>
            </View>
            <Text style={styles.direccion} numberOfLines={2}>
              {p.destino?.direccion || 'Destino sin nombre'}
            </Text>
            <Text style={styles.sub}>
              {'A ' + km(p.distancia_origen_m) + ' km del punto de partida'}
            </Text>
            <View style={styles.acciones}>
              <TouchableOpacity
                style={[styles.btnPrincipal, trabajando && styles.btnDeshabilitado]}
                onPress={() => aceptar(p.id)}
                disabled={trabajando}
                activeOpacity={0.8}
              >
                <Text style={styles.btnPrincipalText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}