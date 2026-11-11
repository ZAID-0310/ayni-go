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

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const NARANJA = '#D9690B';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export default function SeguridadScreen({ onVolver, perfil }) {
  const esChofer = perfil?.rol === 'chofer';

  // Lo que cuenta para la verificación
  const requisitos = [
    {
      titulo: 'Correo institucional',
      detalle: perfil?.email || 'Sin correo registrado',
      ok: !!perfil?.email,
    },
  ];
  if (esChofer) {
    requisitos.push({
      titulo: 'Documentos aprobados',
      detalle: perfil?.chofer_verificado
        ? 'DNI, licencia, SOAT y tarjeta de propiedad revisados'
        : 'Faltan documentos por subir o aprobar',
      ok: !!perfil?.chofer_verificado,
    });
  }
  const completo = requisitos.every((r) => r.ok);

  const recomendados = [
    {
      titulo: 'Foto de perfil',
      detalle: perfil?.foto_url
        ? 'Tus compañeros de ruta pueden reconocerte'
        : 'Agrégala desde tu cuenta para que te reconozcan',
      ok: !!perfil?.foto_url,
    },
  ];

  const fila = (r, recomendado) => (
    <View key={r.titulo} style={styles.fila}>
      <Ionicons
        name={r.ok ? 'checkmark-circle' : recomendado ? 'ellipse-outline' : 'alert-circle'}
        size={26}
        color={r.ok ? VERDE : NARANJA}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.filaTitulo}>{r.titulo}</Text>
        <Text style={styles.filaDetalle}>{r.detalle}</Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitulo}>Seguridad</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, !completo && styles.bannerPendiente]}>
          <Ionicons
            name={completo ? 'shield-checkmark' : 'shield-outline'}
            size={56}
            color={completo ? VERDE : NARANJA}
          />
          <Text style={[styles.bannerTitulo, !completo && { color: NARANJA }]}>
            {completo ? 'Tu cuenta está verificada' : 'Falta completar tu verificación'}
          </Text>
          <Text style={styles.bannerTexto}>
            {completo
              ? 'Tu identidad fue comprobada. Los demás usuarios de Ayni Go saben que viajas con una cuenta real.'
              : 'Completa los pasos pendientes para que tu cuenta quede verificada.'}
          </Text>
        </View>

        <Text style={styles.seccion}>REQUISITOS</Text>
        {requisitos.map((r) => fila(r, false))}

        <Text style={styles.seccion}>RECOMENDADO</Text>
        {recomendados.map((r) => fila(r, true))}
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
  banner: {
    alignItems: 'center',
    backgroundColor: VERDE_SUAVE,
    borderRadius: 18,
    padding: 22,
    marginBottom: 8,
  },
  bannerPendiente: { backgroundColor: '#FDE9D3' },
  bannerTitulo: { fontSize: 20, fontWeight: '800', color: VERDE, marginTop: 10, textAlign: 'center' },
  bannerTexto: { fontSize: 14, color: '#444', marginTop: 6, textAlign: 'center' },
  seccion: { fontSize: 12, fontWeight: '700', color: VERDE, marginTop: 20, marginBottom: 8 },
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
});