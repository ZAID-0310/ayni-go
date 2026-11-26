import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMisCalificaciones } from '../../hooks/useMisCalificaciones';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const DORADO = '#E0A800';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const formatoFecha = (valor) => {
  if (!valor) return '';
  const d = new Date(valor);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

// Carita según las estrellas (índice 0 = 1 estrella)
const CARITAS = ['😞', '🙁', '😐', '😊', '😄'];

function Estrellas({ cantidad, tamano = 16 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={n <= cantidad ? 'star' : 'star-outline'}
          size={tamano}
          color={DORADO}
        />
      ))}
    </View>
  );
}

export default function CalificacionesScreen({ onVolver, perfil }) {
  const { promedio, total, lista, cargando, error, recargar } = useMisCalificaciones();
  // Quien te calificó tiene el rol contrario al tuyo
  const quienCalifica = perfil?.rol === 'chofer' ? 'Pasajero' : 'Chofer';

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
        <Text style={styles.headerTitulo}>Calificaciones</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={VERDE} />
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Text style={styles.vacio}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={recargar} activeOpacity={0.8}>
            <Text style={styles.btnTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
          <View style={styles.resumen}>
            <Text style={styles.promedio}>{promedio !== null ? Number(promedio).toFixed(1) : '—'}</Text>
            <Estrellas cantidad={Math.round(promedio || 0)} tamano={22} />
            <Text style={styles.total}>
              {total === 1 ? '1 calificación' : `${total} calificaciones`}
            </Text>
          </View>

          {lista.length === 0 ? (
            <Text style={styles.vacio}>Todavía no tienes calificaciones</Text>
          ) : (
            lista.map((c, i) => (
            <View key={i} style={styles.card}>
                <View style={styles.cardFila}>
                  <View style={styles.carita}>
                    <Text style={styles.caritaTexto}>{CARITAS[(c.estrellas || 1) - 1]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.quien}>{quienCalifica}</Text>
                    <Estrellas cantidad={c.estrellas} />
                  </View>
                  <Text style={styles.fecha}>{formatoFecha(c.fecha)}</Text>
                </View>
                {c.comentario ? <Text style={styles.comentario}>{c.comentario}</Text> : null}
              </View>
            ))
          )}
        </ScrollView>
      )}
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
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  contenido: { padding: 18, paddingBottom: 40 },
  resumen: {
    alignItems: 'center',
    backgroundColor: VERDE_SUAVE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  promedio: { fontSize: 44, fontWeight: '800', color: VERDE },
  total: { fontSize: 13, color: VERDE, marginTop: 6 },
  vacio: { textAlign: 'center', color: '#666', fontSize: 15, marginTop: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
cardFila: { flexDirection: 'row', alignItems: 'center' },
  carita: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  caritaTexto: { fontSize: 26 },
  quien: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 2 },
  fecha: { fontSize: 12, color: '#666', alignSelf: 'flex-start' },
  comentario: { fontSize: 14, color: '#333', marginTop: 10, marginLeft: 56 },
  btn: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  btnTexto: { color: '#FFFFFF', fontWeight: '700' },
});