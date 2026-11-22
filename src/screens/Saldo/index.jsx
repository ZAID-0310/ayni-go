import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSaldo from '../../hooks/useSaldo';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const ROJO = '#B42318';
const ROJO_SUAVE = '#FDE4E1';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const MEDIOS = [
  { nombre: 'Yape', icono: 'phone-portrait-outline' },
  { nombre: 'Plin', icono: 'phone-portrait-outline' },
  { nombre: 'Tarjeta', icono: 'card-outline' },
];

const soles = (n) => 'S/ ' + Math.abs(Number(n) || 0).toFixed(2);

const fecha = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  } catch (e) {
    return '';
  }
};

export default function SaldoScreen({ onVolver }) {
  const { saldo, movimientos, cargando, error, recargar } = useSaldo();
  const [verMedios, setVerMedios] = useState(false);

  const monto = Number(saldo?.saldo) || 0;
  const minimo = Number(saldo?.minimo) || 0;
  const bajo = monto < minimo;
  const negativo = monto < 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: STATUS_BAR + 8 }]}>
        <TouchableOpacity
          onPress={onVolver}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color={VERDE} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Mi saldo</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={cargando && !!saldo}
            onRefresh={recargar}
            tintColor={VERDE}
            colors={[VERDE]}
          />
        }
      >
        {cargando && !saldo ? (
          <ActivityIndicator size="large" color={VERDE} style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.errorCaja}>
            <Text style={styles.errorTexto}>No se pudo cargar tu saldo. {error}</Text>
            <TouchableOpacity onPress={recargar} style={styles.reintentar} activeOpacity={0.8}>
              <Text style={styles.reintentarTexto}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={[styles.tarjeta, bajo && styles.tarjetaBaja]}>
              <Text style={[styles.tarjetaEtiqueta, bajo && { color: ROJO }]}>Saldo disponible</Text>
              <Text style={[styles.tarjetaMonto, bajo && { color: ROJO }]}>
                {negativo ? '-' : ''}
                {soles(monto)}
              </Text>
              {negativo ? (
                <Text style={styles.tarjetaAviso}>
                  Debes {soles(monto)}. Tu próxima recarga lo cubrirá.
                </Text>
              ) : bajo ? (
                <Text style={styles.tarjetaAviso}>
                  Necesitas al menos {soles(minimo)} para aceptar viajes.
                </Text>
              ) : (
                <Text style={styles.tarjetaOk}>Puedes aceptar viajes</Text>
              )}
              <Text style={styles.comision}>Comisión por viaje finalizado: {saldo?.comision_pct}%</Text>
            </View>

            <TouchableOpacity style={styles.botonRecargar} onPress={() => setVerMedios(true)} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={22} color="#FFF" />
              <Text style={styles.botonRecargarTexto}>Recargar saldo</Text>
            </TouchableOpacity>

            <Text style={styles.seccion}>MOVIMIENTOS</Text>
            {movimientos.length === 0 ? (
              <Text style={styles.vacio}>Aún no tienes movimientos.</Text>
            ) : (
              movimientos.map((m, i) => {
                const suma = Number(m.monto) >= 0;
                return (
                  <View key={i} style={styles.fila}>
                    <Ionicons
                      name={suma ? 'arrow-down-circle' : 'arrow-up-circle'}
                      size={28}
                      color={suma ? VERDE : ROJO}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.filaTitulo}>
                        {m.tipo === 'recarga' ? 'Recarga' : m.tipo === 'comision' ? 'Comisión' : 'Ajuste'}
                      </Text>
                      {!!m.nota && <Text style={styles.filaDetalle}>{m.nota}</Text>}
                      <Text style={styles.filaFecha}>{fecha(m.creado_en)}</Text>
                    </View>
                    <Text style={[styles.filaMonto, { color: suma ? VERDE : ROJO }]}>
                      {suma ? '+' : '-'}
                      {soles(m.monto)}
                    </Text>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={verMedios} transparent animationType="slide" onRequestClose={() => setVerMedios(false)}>
        <View style={styles.fondoModal}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setVerMedios(false)}
          />
          <View style={styles.hoja}>
            <Text style={styles.hojaTitulo}>Recargar saldo</Text>
            <Text style={styles.hojaTexto}>Elige cómo quieres recargar.</Text>
            {MEDIOS.map((med) => (
              <View key={med.nombre} style={styles.medio}>
                <Ionicons name={med.icono} size={24} color={VERDE} />
                <Text style={styles.medioNombre}>{med.nombre}</Text>
                <View style={styles.pronto}>
                  <Text style={styles.prontoTexto}>Próximamente</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.cerrar} onPress={() => setVerMedios(false)} activeOpacity={0.85}>
              <Text style={styles.cerrarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREMA },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  headerTitulo: { fontSize: 18, fontWeight: '800', color: VERDE },
  contenido: { padding: 18, paddingBottom: 40 },
  tarjeta: { backgroundColor: VERDE_SUAVE, borderRadius: 18, padding: 22, alignItems: 'center' },
  tarjetaBaja: { backgroundColor: ROJO_SUAVE },
  tarjetaEtiqueta: { fontSize: 14, fontWeight: '700', color: VERDE },
  tarjetaMonto: { fontSize: 40, fontWeight: '800', color: VERDE, marginTop: 6 },
  tarjetaAviso: { fontSize: 14, color: ROJO, marginTop: 8, textAlign: 'center', fontWeight: '600' },
  tarjetaOk: { fontSize: 14, color: VERDE, marginTop: 8, fontWeight: '600' },
  comision: { fontSize: 12, color: '#555', marginTop: 12 },
  botonRecargar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VERDE,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 14,
  },
  botonRecargarTexto: { color: '#FFF', fontSize: 16, fontWeight: '800', marginLeft: 8 },
  seccion: { fontSize: 12, fontWeight: '700', color: VERDE, marginTop: 24, marginBottom: 8 },
  vacio: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 12 },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  filaTitulo: { fontSize: 15, fontWeight: '700', color: '#222' },
  filaDetalle: { fontSize: 13, color: '#666', marginTop: 2 },
  filaFecha: { fontSize: 12, color: '#999', marginTop: 2 },
  filaMonto: { fontSize: 15, fontWeight: '800' },
  errorCaja: { backgroundColor: ROJO_SUAVE, borderRadius: 14, padding: 16, alignItems: 'center' },
  errorTexto: { color: ROJO, fontSize: 14, textAlign: 'center' },
  reintentar: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 18, backgroundColor: VERDE, borderRadius: 10 },
  reintentarTexto: { color: '#FFF', fontWeight: '700' },
  fondoModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  hoja: { backgroundColor: CREMA, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22, paddingBottom: 30 },
  hojaTitulo: { fontSize: 18, fontWeight: '800', color: VERDE },
  hojaTexto: { fontSize: 14, color: '#555', marginTop: 4, marginBottom: 14 },
  medio: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  medioNombre: { flex: 1, fontSize: 15, fontWeight: '700', color: '#222', marginLeft: 12 },
  pronto: { backgroundColor: '#EEE', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
  prontoTexto: { fontSize: 12, color: '#666', fontWeight: '600' },
  cerrar: { marginTop: 8, alignItems: 'center', paddingVertical: 12 },
  cerrarTexto: { color: VERDE, fontWeight: '800', fontSize: 15 },
});