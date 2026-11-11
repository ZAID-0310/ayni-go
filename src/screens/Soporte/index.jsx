import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export default function SoporteScreen({ onVolver, onIrAFaq }) {
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
        <Text style={styles.headerTitulo}>Ayuda y soporte</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.contenido}>
        <Text style={styles.intro}>¿En qué podemos ayudarte?</Text>

        <TouchableOpacity style={styles.opcion} onPress={onIrAFaq} activeOpacity={0.8}>
          <View style={styles.icono}>
            <Ionicons name="help-circle-outline" size={28} color={VERDE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.opcionTitulo}>Preguntas frecuentes</Text>
            <Text style={styles.opcionDetalle}>Respuestas rápidas sobre viajes, pagos y cuenta</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={VERDE} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcion} activeOpacity={0.8}>
          <View style={styles.icono}>
            <Ionicons name="chatbubbles-outline" size={28} color={VERDE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.opcionTitulo}>Chatear con soporte</Text>
            <Text style={styles.opcionDetalle}>Habla con el equipo de Ayni Go</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={VERDE} />
        </TouchableOpacity>
      </View>
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
  contenido: { padding: 18 },
  intro: { fontSize: 15, color: '#444', marginBottom: 16 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  icono: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: VERDE_SUAVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  opcionTitulo: { fontSize: 16, fontWeight: '700', color: '#222' },
  opcionDetalle: { fontSize: 13, color: '#666', marginTop: 2 },
});