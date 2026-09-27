import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { useVehicle } from '../../hooks/useVehicle';
import styles from './VehicleScreen.styles';

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

  if (cargandoInicial) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (vehiculo) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Tu vehículo</Text>
        <View style={styles.infoBox}>
          <Text>Placa: {vehiculo.placa}</Text>
          <Text>Modelo: {vehiculo.modelo}</Text>
          <Text>Capacidad: {vehiculo.capacidad_pasajeros} pasajeros</Text>
        </View>
        <Button title="Volver" onPress={onVolver} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registra tu vehículo</Text>
      <Text style={styles.subtitulo}>Necesitas esto para poder aceptar pasajeros</Text>

      <TextInput
        style={styles.input}
        placeholder="Placa (ej: ABC-123)"
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo (ej: Toyota Yaris)"
        value={modelo}
        onChangeText={setModelo}
      />
      <TextInput
        style={styles.input}
        placeholder="Capacidad de pasajeros (ej: 4)"
        value={capacidad}
        onChangeText={setCapacidad}
        keyboardType="number-pad"
      />

      <Button
        title={cargando ? 'Guardando...' : 'Registrar vehículo'}
        onPress={() => registrarVehiculo(onVolver)}
        disabled={cargando}
      />

      <Button title="Volver" onPress={onVolver} />
    </View>
  );
}