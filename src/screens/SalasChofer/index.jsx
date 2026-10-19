import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Animated,
  Linking,
  StyleSheet,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useSalasChofer } from '../../hooks/useSalasChofer';
import styles from './SalasChoferScreen.styles';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

const TEXTO_ESTADO = {
  abierta_con_chofer: 'Sala abierta, sumando pasajeros',
  en_curso: 'Viaje en curso',
};

const km = (m) => (Number(m ?? 0) / 1000).toFixed(1);
const soles = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;

const mmss = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const TEXTO_PAGO = {
  pendiente: 'Sin marcar',
  pagado: 'Pagó',
  sin_pagar: 'No pagó',
};

// Estilos propios de esta tanda (no dependen del archivo .styles.js)
const x = StyleSheet.create({
  mapa: { height: 230, borderRadius: 16, overflow: 'hidden' },
  marca: {
    width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff', backgroundColor: '#1E1E1E',
  },
  marcaActual: { backgroundColor: '#F58220' },
  marcaBajo: { backgroundColor: '#9CA3AF' },
  marcaTexto: { color: '#fff', fontWeight: '700', fontSize: 13 },
  precioGrande: { fontSize: 28, fontWeight: '800', color: '#1E1E1E', marginTop: 4 },
  fila: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnNaranja: { backgroundColor: '#F58220' },
  btnVerde: { backgroundColor: '#16A34A' },
  btnRojo: { backgroundColor: '#DC2626' },
  btnGris: { backgroundColor: '#E5E7EB' },
  btnOscuro: { backgroundColor: '#1E1E1E' },
  btnTexto: { color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center' },
  btnTextoOscuro: { color: '#1E1E1E', fontWeight: '700', fontSize: 14 },
  paradaCard: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  paradaCardActual: { backgroundColor: '#FFF7ED', borderRadius: 12, paddingHorizontal: 8 },
  paradaTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paradaTextos: { flex: 1 },
  paradaDir: { fontSize: 14, fontWeight: '700', color: '#1E1E1E' },
  paradaSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  paradaMonto: { fontSize: 15, fontWeight: '800', color: '#1E1E1E' },
  etiqueta: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  resumenFila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  resumenLabel: { fontSize: 14, color: '#374151' },
  resumenValor: { fontSize: 14, fontWeight: '700', color: '#1E1E1E' },
});

function Decoraciones() {
  return (
    <>
      <View style={styles.topDecoration} />
      <View style={styles.bottomDecorationContainer}>
        <View style={styles.bottomYellow} />
        <View style={styles.bottomOrange} />
      </View>
    </>
  );
}

function Cabecera({ onVolver, titulo, subtitulo }) {
  return (
    <View style={styles.cabecera}>
      <TouchableOpacity style={styles.btnVolver} onPress={onVolver} activeOpacity={0.7}>
        <Text style={styles.btnVolverTexto}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtituloCabecera}>{subtitulo}</Text> : null}
    </View>
  );
}

function PuntoEstado({ color, pulsar }) {
  const opacidad = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulsar) {
      opacidad.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidad, { toValue: 0.25, duration: 700, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulsar, opacidad]);

  return (
    <Animated.View
      style={[styles.puntoEstado, { backgroundColor: color, opacity: opacidad }]}
    />
  );
}

// Mapa del chofer: ruta real (GeoJSON) y paradas numeradas
function MapaChofer({ origen, ruta, paradas, actual }) {
  const camara = useRef(null);

  const linea = useMemo(() => {
    try {
      return ruta ? JSON.parse(ruta) : null;
    } catch {
      return null;
    }
  }, [ruta]);

  const clave = `${linea?.coordinates?.length ?? 0}-${paradas.length}`;

  useEffect(() => {
    const pts =
      linea?.coordinates ??
      [
        ...(origen ? [[origen.lng, origen.lat]] : []),
        ...paradas.map((p) => [p.lng, p.lat]),
      ];
    if (pts.length < 2) return;
    const lngs = pts.map((p) => p[0]);
    const lats = pts.map((p) => p[1]);
    camara.current?.fitBounds(
      [Math.max(...lngs), Math.max(...lats)],
      [Math.min(...lngs), Math.min(...lats)],
      [40, 40, 40, 40],
      600
    );
  }, [clave]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!origen) return null;

  return (
    <View style={x.mapa}>
      <Mapbox.MapView style={{ flex: 1 }}>
        <Mapbox.Camera
          ref={camara}
          defaultSettings={{ centerCoordinate: [origen.lng, origen.lat], zoomLevel: 12 }}
        />
        {linea ? (
          <Mapbox.ShapeSource
            id="rutaChofer"
            shape={{ type: 'Feature', geometry: linea, properties: {} }}
          >
            <Mapbox.LineLayer
              id="rutaChoferLinea"
              style={{ lineColor: '#F58220', lineWidth: 5, lineCap: 'round', lineJoin: 'round' }}
            />
          </Mapbox.ShapeSource>
        ) : null}

        <Mapbox.PointAnnotation id="origenChofer" coordinate={[origen.lng, origen.lat]}>
          <View style={x.marca}>
            <Text style={x.marcaTexto}>🚏</Text>
          </View>
        </Mapbox.PointAnnotation>

        {paradas.map((p) => (
          <Mapbox.PointAnnotation
            key={`${p.pasajero_id}-${p.bajo}-${actual?.pasajero_id === p.pasajero_id}`}
            id={`parada-${p.pasajero_id}`}
            coordinate={[p.lng, p.lat]}
          >
            <View
              style={[
                x.marca,
                actual?.pasajero_id === p.pasajero_id && x.marcaActual,
                p.bajo && x.marcaBajo,
              ]}
            >
              <Text style={x.marcaTexto}>{p.orden}</Text>
            </View>
          </Mapbox.PointAnnotation>
        ))}
      </Mapbox.MapView>
    </View>
  );
}

export default function SalasChoferScreen({ onVolver }) {
  const {
    solicitudes,
    viaje,
    candidatos,
    segundosRestantes,
    errorLista,
    errorAccion,
    cargandoInicial,
    procesando,
    permisoUbicacion,
    errorUbicacion,
    aceptarSala,
    rechazarSala,
    aprobarCandidato,
    descartarCandidato,
    iniciarViaje,
    marcarBajada,
    finalizarViaje,
    resumen,
    cerrarResumen,
  } = useSalasChofer();

  if (cargandoInicial) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#F58220" />
        </View>
      </SafeAreaView>
    );
  }

  const mensajeError = errorAccion ?? errorLista;
  const avisoUbicacion =
    permisoUbicacion === 'denegado'
      ? 'Activa el permiso de ubicación para recibir solicitudes (Ajustes → Apps → Ayni Go → Permisos).'
      : errorUbicacion
        ? 'No pudimos obtener tu ubicación. Activa la ubicación del dispositivo para recibir solicitudes.'
        : null;

  // ---------- Resumen del viaje terminado ----------
  if (resumen) {
    const lista = resumen.pasajeros ?? [];
    return (
      <SafeAreaView style={styles.safeArea}>
        <Decoraciones />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contenido}
          showsVerticalScrollIndicator={false}
        >
          <Cabecera onVolver={cerrarResumen} titulo="Viaje finalizado" />
          <View style={styles.card}>
            <Text style={styles.seccionTitulo}>RESUMEN DE COBRO</Text>
            <View style={x.resumenFila}>
              <Text style={x.resumenLabel}>Total esperado</Text>
              <Text style={x.resumenValor}>{soles(resumen.total_esperado)}</Text>
            </View>
            <View style={x.resumenFila}>
              <Text style={x.resumenLabel}>Cobrado</Text>
              <Text style={[x.resumenValor, { color: '#16A34A' }]}>{soles(resumen.total_cobrado)}</Text>
            </View>
            <View style={x.resumenFila}>
              <Text style={x.resumenLabel}>Sin cobrar</Text>
              <Text style={[x.resumenValor, { color: '#DC2626' }]}>{soles(resumen.total_sin_cobrar)}</Text>
            </View>
          </View>

          <Text style={styles.subtitulo}>Pasajeros</Text>
          <View style={styles.card}>
            {lista.map((p, i) => (
              <View key={i} style={x.paradaCard}>
                <View style={x.paradaTop}>
                  <View style={x.paradaTextos}>
                    <Text style={x.paradaDir}>{p.direccion || 'Sin referencia'}</Text>
                    <Text style={x.paradaSub}>{p.nombre}</Text>
                    <Text
                      style={[
                        x.etiqueta,
                        { color: p.estado_pago === 'pagado' ? '#16A34A' : '#DC2626' },
                      ]}
                    >
                      {TEXTO_PAGO[p.estado_pago] ?? p.estado_pago}
                    </Text>
                  </View>
                  <Text style={x.paradaMonto}>{soles(p.monto)}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[x.btn, x.btnNaranja, { marginTop: 14 }]} onPress={cerrarResumen} activeOpacity={0.8}>
            <Text style={x.btnTexto}>Listo</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------- Con sala ----------
  if (viaje) {
    const libres = viaje.capacidad - viaje.pasajeros;
    const ventanaAbierta = segundosRestantes != null && segundosRestantes > 0;
    const paradas = viaje.paradas ?? [];
    const enCurso = viaje.estado === 'en_curso';
    const actual = paradas.find((p) => !p.bajo) ?? null;

    const abrirWaze = (p) =>
      Linking.openURL(`https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`).catch(() => {});
    const abrirGoogle = (p) =>
      Linking.openURL(
        `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`
      ).catch(() => {});

    return (
      <SafeAreaView style={styles.safeArea}>
        <Decoraciones />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contenido}
          showsVerticalScrollIndicator={false}
        >
          <Cabecera onVolver={onVolver} titulo="Tu viaje" />

          <View style={styles.estadoPildora}>
            <PuntoEstado color="#16A34A" pulsar={viaje.estado === 'abierta_con_chofer'} />
            <Text style={styles.estadoPildoraTexto}>
              {TEXTO_ESTADO[viaje.estado] ?? viaje.estado}
            </Text>
          </View>

          {/* Cupos, tiempo y total */}
          <View style={styles.card}>
            <View style={styles.cuposEncabezado}>
              <Text style={styles.seccionTitulo}>PASAJEROS</Text>
              <Text style={styles.cuposResumen}>
                {viaje.pasajeros} de {viaje.capacidad}
              </Text>
            </View>
            <View style={styles.asientosFila}>
              {Array.from({ length: viaje.capacidad }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.asiento, i < viaje.pasajeros && styles.asientoLleno]}
                >
                  <Text style={styles.asientoTexto}>{i < viaje.pasajeros ? '👤' : ''}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.cuposDetalle}>
              {libres === 0
                ? 'Sala completa'
                : `${libres} ${libres === 1 ? 'cupo libre' : 'cupos libres'}`}
            </Text>

            {viaje.estado === 'abierta_con_chofer' && segundosRestantes != null ? (
              <View style={[styles.chipTiempo, !ventanaAbierta && styles.chipTiempoFin]}>
                <Text style={[styles.chipTiempoTexto, !ventanaAbierta && styles.chipTiempoFinTexto]}>
                  {ventanaAbierta
                    ? `⏱️ Tiempo para sumar pasajeros: ${mmss(segundosRestantes)}`
                    : 'La ventana para sumar pasajeros terminó'}
                </Text>
              </View>
            ) : null}

            <Text style={[styles.seccionTitulo, { marginTop: 12 }]}>
              {enCurso ? 'TOTAL DEL VIAJE' : 'TOTAL ESTIMADO'}
            </Text>
            <Text style={x.precioGrande}>{soles(viaje.precio_general)}</Text>
          </View>

          {/* Mapa con ruta y paradas */}
          {paradas.length > 0 ? (
            <MapaChofer
              origen={viaje.origen}
              ruta={viaje.ruta}
              paradas={paradas}
              actual={enCurso ? actual : null}
            />
          ) : null}

          {/* Iniciar viaje */}
          {viaje.estado === 'abierta_con_chofer' ? (
            <TouchableOpacity
              style={[x.btn, x.btnVerde, { marginTop: 14 }, procesando && { opacity: 0.6 }]}
              onPress={iniciarViaje}
              disabled={procesando}
              activeOpacity={0.8}
            >
              <Text style={x.btnTexto}>Iniciar viaje ({viaje.pasajeros}{' '}
                {viaje.pasajeros === 1 ? 'pasajero' : 'pasajeros'})</Text>
            </TouchableOpacity>
          ) : null}

          {/* Navegación a la parada actual */}
          {enCurso && actual ? (
            <View style={styles.card}>
              <Text style={styles.seccionTitulo}>PARADA {actual.orden} · SIGUIENTE</Text>
              <Text style={x.paradaDir}>{actual.direccion || 'Sin referencia'}</Text>
              <View style={x.fila}>
                <TouchableOpacity style={[x.btn, x.btnOscuro]} onPress={() => abrirWaze(actual)} activeOpacity={0.8}>
                  <Text style={x.btnTexto}>Waze</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[x.btn, x.btnOscuro]} onPress={() => abrirGoogle(actual)} activeOpacity={0.8}>
                  <Text style={x.btnTexto}>Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Paradas */}
          {paradas.length > 0 ? (
            <>
              <Text style={styles.subtitulo}>Paradas</Text>
              <View style={styles.card}>
                {paradas.map((p) => {
                  const esActual = enCurso && actual?.pasajero_id === p.pasajero_id;
                  return (
                    <View
                      key={p.pasajero_id}
                      style={[x.paradaCard, esActual && x.paradaCardActual]}
                    >
                      <View style={x.paradaTop}>
                        <View style={[x.marca, esActual && x.marcaActual, p.bajo && x.marcaBajo]}>
                          <Text style={x.marcaTexto}>{p.orden}</Text>
                        </View>
                        <View style={x.paradaTextos}>
                          <Text
                            style={[x.paradaDir, p.bajo && { textDecorationLine: 'line-through', color: '#9CA3AF' }]}
                            numberOfLines={2}
                          >
                            {p.direccion || 'Sin referencia'}
                          </Text>
                          <Text style={x.paradaSub}>{p.nombre}</Text>
                          {p.bajo ? (
                            <Text
                              style={[
                                x.etiqueta,
                                { color: p.estado_pago === 'pagado' ? '#16A34A' : '#DC2626' },
                              ]}
                            >
                              {p.estado_pago === 'pagado' ? 'Bajó y pagó' : 'Bajó sin pagar'}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={x.paradaMonto}>{soles(p.monto)}</Text>
                      </View>

                      {enCurso && !p.bajo ? (
                        <View style={x.fila}>
                          <TouchableOpacity
                            style={[x.btn, x.btnVerde, procesando && { opacity: 0.6 }]}
                            onPress={() => marcarBajada(p.pasajero_id, true)}
                            disabled={procesando}
                            activeOpacity={0.8}
                          >
                            <Text style={x.btnTexto}>Bajó y pagó</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[x.btn, x.btnRojo, procesando && { opacity: 0.6 }]}
                            onPress={() => marcarBajada(p.pasajero_id, false)}
                            disabled={procesando}
                            activeOpacity={0.8}
                          >
                            <Text style={x.btnTexto}>Bajó sin pagar</Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}

          {/* Finalizar manual */}
          {enCurso ? (
            <TouchableOpacity
              style={[x.btn, x.btnGris, { marginTop: 14 }, procesando && { opacity: 0.6 }]}
              onPress={finalizarViaje}
              disabled={procesando}
              activeOpacity={0.8}
            >
              <Text style={x.btnTextoOscuro}>Finalizar viaje</Text>
            </TouchableOpacity>
          ) : null}

          {mensajeError ? <Text style={styles.textoError}>{mensajeError}</Text> : null}
          {avisoUbicacion ? <Text style={styles.textoError}>{avisoUbicacion}</Text> : null}

          {/* Candidatos */}
          {viaje.estado === 'abierta_con_chofer' && ventanaAbierta && libres > 0 ? (
            <>
              <Text style={styles.subtitulo}>Pasajeros en tu ruta</Text>
              {candidatos.length === 0 ? (
                <View style={styles.buscandoFila}>
                  <PuntoEstado color="#F58220" pulsar />
                  <Text style={styles.buscandoTexto}>Buscando pasajeros cerca de tu ruta…</Text>
                </View>
              ) : null}
              {candidatos.map((c) => (
                <View key={c.solicitud_id} style={styles.card}>
                  <View style={styles.solicitudEncabezado}>
                    <View style={styles.pinCirculo}>
                      <Text style={styles.pinEmoji}>📍</Text>
                    </View>
                    <View style={styles.solicitudInfo}>
                      <Text style={styles.seccionTitulo}>DESTINO</Text>
                      <Text style={styles.solicitudDestino} numberOfLines={2}>
                        {c.direccion || 'Sin referencia'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chip}>
                    <Text style={styles.chipTexto}>
                      A {km(c.distancia_al_origen_m)} km del punto de partida
                    </Text>
                  </View>
                  <View style={styles.filaBotones}>
                    <TouchableOpacity
                      style={[styles.botonMitad, styles.botonNeutro]}
                      onPress={() => descartarCandidato(c.solicitud_id)}
                      disabled={procesando}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.botonNeutroTexto}>Descartar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.botonMitad, styles.boton]}
                      onPress={() => aprobarCandidato(c.solicitud_id)}
                      disabled={procesando}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.botonTexto}>Aprobar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------- Sin sala: solicitudes que puede aceptar ----------
  return (
    <SafeAreaView style={styles.safeArea}>
      <Decoraciones />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <Cabecera
          onVolver={onVolver}
          titulo="Solicitudes"
          subtitulo="Pasajeros que esperan un chofer"
        />

        {mensajeError ? <Text style={styles.textoError}>{mensajeError}</Text> : null}
        {avisoUbicacion ? <Text style={styles.textoError}>{avisoUbicacion}</Text> : null}

        {!mensajeError && !avisoUbicacion && solicitudes.length === 0 ? (
          <View style={styles.vacio}>
            <View style={styles.vacioCirculo}>
              <Text style={styles.vacioEmoji}>🚗</Text>
            </View>
            <Text style={styles.vacioTitulo}>No hay solicitudes por ahora</Text>
            <View style={styles.buscandoFila}>
              <PuntoEstado color="#F58220" pulsar />
              <Text style={styles.buscandoTexto}>Se actualiza solo</Text>
            </View>
            <Text style={styles.buscandoTexto}>
              Recibes solicitudes cuando estás a menos de 5 km del punto de partida.
            </Text>
          </View>
        ) : null}

        {solicitudes.map((s) => {
          const destino = s.destinos?.[0];
          return (
            <View key={s.sala_id} style={styles.card}>
              <View style={styles.solicitudEncabezado}>
                <View style={styles.pinCirculo}>
                  <Text style={styles.pinEmoji}>📍</Text>
                </View>
                <View style={styles.solicitudInfo}>
                  <Text style={styles.seccionTitulo}>DESTINO</Text>
                  <Text style={styles.solicitudDestino} numberOfLines={2}>
                    {destino?.direccion || 'Sin referencia'}
                  </Text>
                </View>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipTexto}>
                  A {km(s.distancia_max_m)} km del punto de partida
                </Text>
              </View>
              <View style={styles.filaBotones}>
                <TouchableOpacity
                  style={[styles.botonMitad, styles.botonNeutro]}
                  onPress={() => rechazarSala(s.sala_id)}
                  disabled={procesando}
                  activeOpacity={0.8}
                >
                  <Text style={styles.botonNeutroTexto}>Descartar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonMitad, styles.boton]}
                  onPress={() => aceptarSala(s.sala_id)}
                  disabled={procesando}
                  activeOpacity={0.8}
                >
                  <Text style={styles.botonTexto}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}