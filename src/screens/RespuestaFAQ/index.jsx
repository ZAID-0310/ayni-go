import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FAQ } from '../../constants/faq';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export default function RespuestaFAQScreen({ faqId, onVolver }) {
  const faq = FAQ.find((f) => f.id === faqId);

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
        <Text style={styles.headerTitulo}>Respuesta</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
        {faq ? (
          <View style={styles.tarjeta}>
            <Text style={styles.pregunta}>{faq.pregunta}</Text>
            <Text style={styles.respuesta}>{faq.respuesta}</Text>
          </View>
        ) : (
          <Text style={styles.respuesta}>No encontramos esta pregunta.</Text>
        )}
      </ScrollView>
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
  tarjeta: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20 },
  pregunta: { fontSize: 20, fontWeight: '800', color: VERDE, marginBottom: 14 },
  respuesta: { fontSize: 16, lineHeight: 24, color: '#333' },
});