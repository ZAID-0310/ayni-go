import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const NARANJA = '#D9690B';

const dinero = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;

function Fila({ icono, etiqueta, valor, color, ultima }) {
  return (
    <View style={[s.fila, !ultima && s.filaLinea]}>
      <View style={s.filaIcono}>
        <Ionicons name={icono} size={18} color={VERDE} />
      </View>
      <View style={s.filaInfo}>
        <Text style={s.filaEtiqueta}>{etiqueta}</Text>
        <Text style={[s.filaValor, color ? { color } : null]} numberOfLines={2}>
          {valor}
        </Text>
      </View>
    </View>
  );
}

export default function ResumenViaje({ resumen, onCerrar }) {
  const insets = useSafeAreaInsets();
  const lista = resumen.pasajeros ?? resumen.paradas ?? [];
  const mio = lista[0] ?? null;
  const esperado = Number(resumen.total_esperado ?? mio?.monto ?? 0);
  const cobrado = Number(resumen.total_cobrado ?? 0);
  const sinCobrar = Number(resumen.total_sin_cobrar ?? 0);
  const pagado = cobrado > 0 && sinCobrar === 0;

  const titulo = resumen.parcial
    ? (pagado ? 'Bajaste y pagaste' : 'Bajaste del viaje')
    : 'Viaje finalizado';

  const filas = [];
  if (mio?.direccion) {
    filas.push({ icono: 'location-outline', etiqueta: 'Tu destino', valor: mio.direccion });
  }
  if (mio?.orden != null) {
    filas.push({ icono: 'flag-outline', etiqueta: 'Tu parada', valor: `Parada #${mio.orden}` });
  }
  if (cobrado > 0) {
    filas.push({ icono: 'cash-outline', etiqueta: 'Pagado', valor: dinero(cobrado), color: '#15803D' });
  }
  if (sinCobrar > 0) {
    filas.push({ icono: 'time-outline', etiqueta: 'Por pagar', valor: dinero(sinCobrar), color: NARANJA });
  }

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
          <Text style={s.titulo}>{titulo}</Text>
          <Text style={s.subtitulo}>Gracias por viajar con Ayni Go</Text>
        </View>

        <View style={s.tarjeta}>
          <Text style={s.etiqueta}>TU MONTO</Text>
          <Text style={s.monto}>{dinero(esperado)}</Text>
          <View style={[s.pildora, { backgroundColor: pagado ? '#DCFCE7' : '#FDE9D3' }]}>
            <Ionicons
              name={pagado ? 'checkmark-circle' : 'time'}
              size={16}
              color={pagado ? '#15803D' : NARANJA}
            />
            <Text style={[s.pildoraTexto, { color: pagado ? '#15803D' : NARANJA }]}>
              {pagado ? 'Pago registrado' : 'Pago pendiente'}
            </Text>
          </View>

          {filas.length > 0 ? (
            <View style={s.detalle}>
              {filas.map((f, i) => (
                <Fila key={f.etiqueta} {...f} ultima={i === filas.length - 1} />
              ))}
            </View>
          ) : null}
        </View>

        <View style={s.nota}>
          <Ionicons name="information-circle-outline" size={20} color={VERDE} />
          <Text style={s.notaTexto}>
            {pagado
              ? 'Tu pago quedó registrado. ¡Esperamos verte pronto en otro viaje!'
              : 'Recuerda pagar al chofer en efectivo. La app solo registra el pago.'}
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
  pildora: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 10,
  },
  pildoraTexto: { fontSize: 13, fontWeight: '700', marginLeft: 6 },
  detalle: { alignSelf: 'stretch', marginTop: 22 },
  fila: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  filaLinea: { borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  filaIcono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: VERDE_SUAVE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  filaInfo: { flex: 1 },
  filaEtiqueta: { fontSize: 12, color: '#888' },
  filaValor: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 2 },
  nota: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: VERDE_SUAVE,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 16,
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