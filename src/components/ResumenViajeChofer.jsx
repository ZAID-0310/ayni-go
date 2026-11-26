import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const NARANJA = '#D9690B';

const soles = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;

export default function ResumenViajeChofer({ resumen, textoPago, onCerrar }) {
  const insets = useSafeAreaInsets();
  const lista = resumen.pasajeros ?? [];
  const sinCobrar = Number(resumen.total_sin_cobrar ?? 0);
  const todoCobrado = sinCobrar === 0 && Number(resumen.total_cobrado ?? 0) > 0;

  return (
    <View style={s.raiz}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.cabecera, { paddingTop: insets.top + 36 }]}>
          <View style={s.circulo}>
            <Ionicons name="checkmark" size={46} color="#FFFFFF" />
          </View>
          <Text style={s.titulo}>Viaje finalizado</Text>
          <Text style={s.subtitulo}>
            {lista.length === 1 ? '1 pasajero' : `${lista.length} pasajeros`}
          </Text>
        </View>

        <View style={s.tarjeta}>
          <Text style={s.etiqueta}>TOTAL ESPERADO</Text>
          <Text style={s.monto}>{soles(resumen.total_esperado)}</Text>

          <View style={s.cajas}>
            <View style={[s.caja, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#15803D" />
              <Text style={s.cajaEtiqueta}>Cobrado</Text>
              <Text style={[s.cajaValor, { color: '#15803D' }]}>
                {soles(resumen.total_cobrado)}
              </Text>
            </View>
            <View style={[s.caja, { backgroundColor: sinCobrar > 0 ? '#FDE9D3' : '#F1F1F1' }]}>
              <Ionicons
                name="time"
                size={20}
                color={sinCobrar > 0 ? NARANJA : '#888'}
              />
              <Text style={s.cajaEtiqueta}>Sin cobrar</Text>
              <Text style={[s.cajaValor, { color: sinCobrar > 0 ? NARANJA : '#888' }]}>
                {soles(resumen.total_sin_cobrar)}
              </Text>
            </View>
          </View>
        </View>

        <View style={s.lista}>
          <Text style={s.listaTitulo}>PASAJEROS</Text>
          {lista.map((p, i) => {
            const pagado = p.estado_pago === 'pagado';
            const inicial = (p.nombre ?? '?').trim().charAt(0).toUpperCase() || '?';
            return (
              <View key={i} style={s.pasajero}>
                <View style={s.avatar}>
                  <Text style={s.avatarTexto}>{inicial}</Text>
                </View>
                <View style={s.pasajeroInfo}>
                  <Text style={s.pasajeroNombre} numberOfLines={1}>
                    {p.nombre ?? 'Pasajero'}
                  </Text>
                  <Text style={s.pasajeroDir} numberOfLines={2}>
                    {p.direccion || 'Sin referencia'}
                  </Text>
                  <View
                    style={[
                      s.pildora,
                      { backgroundColor: pagado ? '#DCFCE7' : '#FDE9D3' },
                    ]}
                  >
                    <Text
                      style={[
                        s.pildoraTexto,
                        { color: pagado ? '#15803D' : NARANJA },
                      ]}
                    >
                      {textoPago?.[p.estado_pago] ?? p.estado_pago}
                    </Text>
                  </View>
                </View>
                <Text style={s.pasajeroMonto}>{soles(p.monto)}</Text>
              </View>
            );
          })}
        </View>

        <View style={s.nota}>
          <Ionicons name="information-circle-outline" size={20} color={VERDE} />
          <Text style={s.notaTexto}>
            {todoCobrado
              ? 'Cobraste a todos tus pasajeros. ¡Buen trabajo!'
              : 'Revisa los pagos pendientes: la app solo registra lo que marcas al bajar cada pasajero.'}
          </Text>
        </View>
      </ScrollView>

      <View style={[s.pie, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={s.boton} onPress={onCerrar} activeOpacity={0.85}>
          <Text style={s.botonTexto}>Listo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: CREMA },
  cabecera: {
    backgroundColor: VERDE,
    alignItems: 'center',
    paddingBottom: 84,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  circulo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  titulo: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -56,
    padding: 22,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  etiqueta: { fontSize: 12, fontWeight: '700', color: '#888', letterSpacing: 1 },
  monto: { fontSize: 46, fontWeight: '800', color: VERDE, marginTop: 4 },
  cajas: { flexDirection: 'row', alignSelf: 'stretch', marginTop: 18 },
  caja: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cajaEtiqueta: { fontSize: 12, color: '#555', marginTop: 4 },
  cajaValor: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  lista: { marginHorizontal: 20, marginTop: 22 },
  listaTitulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 10,
  },
  pasajero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: VERDE_SUAVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarTexto: { fontSize: 18, fontWeight: '800', color: VERDE },
  pasajeroInfo: { flex: 1, marginRight: 10 },
  pasajeroNombre: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  pasajeroDir: { fontSize: 13, color: '#666', marginTop: 2 },
  pildora: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  pildoraTexto: { fontSize: 12, fontWeight: '700' },
  pasajeroMonto: { fontSize: 17, fontWeight: '800', color: VERDE },
  nota: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VERDE_SUAVE,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
  },
  notaTexto: { flex: 1, fontSize: 13, color: VERDE, marginLeft: 10, lineHeight: 18 },
  pie: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: CREMA,
  },
  boton: {
    backgroundColor: VERDE,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});