import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useHistorial from '../../hooks/useHistorial';
import styles from './HistorialScreen.styles';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatearFecha(iso) {
  if (!iso) return '';
  // Lima es UTC-5 todo el año (sin horario de verano)
  const d = new Date(new Date(iso).getTime() - 5 * 60 * 60 * 1000);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return d.getUTCDate() + ' ' + MESES[d.getUTCMonth()] + ' ' + d.getUTCFullYear() + ', ' + hh + ':' + mm;
}

function soles(n) {
  return 'S/ ' + Number(n || 0).toFixed(2);
}

export default function HistorialScreen({ onVolver }) {
  const insets = useSafeAreaInsets();
  const { viajes, cargando, error, recargar } = useHistorial();

  return (
    <View style={[styles.contenedor, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVolver}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Mis viajes</Text>
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator color="#0F5132" />
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Text style={styles.vacio}>No se pudo cargar tu historial.</Text>
          <TouchableOpacity onPress={recargar}>
            <Text style={styles.reintentar}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : viajes.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.vacio}>Aún no tienes viajes finalizados.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.lista, { paddingBottom: 24 }]}>                   
         {viajes.map((v) =>
            v.pasajeros !== undefined ? (
              <View key={v.sala_id} style={styles.tarjeta}>
                <View style={styles.fila}>
                  <Text style={styles.fecha}>{formatearFecha(v.fecha)}</Text>
                  <View style={styles.etiqueta}>
                    <Text style={styles.etiquetaTexto}>
                      {v.pasajeros === 1 ? '1 pasajero' : v.pasajeros + ' pasajeros'}
                    </Text>
                  </View>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.destino}>Total esperado</Text>
                  <Text style={styles.monto}>{soles(v.total_esperado)}</Text>
                </View>
                <View style={styles.fila}>
                  <Text style={styles.pagoOk}>{'Cobrado ' + soles(v.total_cobrado)}</Text>
                  {Number(v.total_sin_cobrar) > 0 ? (
                    <Text style={styles.pagoPendiente}>{'Sin cobrar ' + soles(v.total_sin_cobrar)}</Text>
                  ) : null}
                </View>
              </View>
            ) : (
              <View key={v.sala_id} style={styles.tarjeta}>
                <View style={styles.fila}>
                  <Text style={styles.fecha}>{formatearFecha(v.fecha)}</Text>
                  <View style={styles.etiqueta}>
                    <Text style={styles.etiquetaTexto}>
                      {v.programado ? 'Programado' : 'Viaje ahora'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.destino}>{v.destino || 'Destino'}</Text>
                <View style={styles.fila}>
                  <Text style={v.estado_pago === 'pagado' ? styles.pagoOk : styles.pagoPendiente}>
                    {v.estado_pago === 'pagado' ? 'Pago registrado' : 'Pago pendiente'}
                  </Text>
                  <Text style={styles.monto}>{soles(v.monto)}</Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}