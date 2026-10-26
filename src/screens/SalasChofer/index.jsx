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
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSalasChofer } from '../../hooks/useSalasChofer';
import useUbicacionesSala from '../../hooks/useUbicacionesSala';
import styles, { colors } from './SalasChoferScreen.styles';

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

function Cabecera({ titulo, subtitulo, onVolver }) {
  return (
    <View style={styles.cabecera}>
      {onVolver ? (
        <TouchableOpacity onPress={onVolver} activeOpacity={0.7} style={{ paddingVertical: 6, alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.verde }}>← Volver</Text>
        </TouchableOpacity>
      ) : null}
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
function MapaChofer({ origen, ruta, paradas, actual, pasajeros = [], miUbicacion = null }) {
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
    <View style={styles.mapa}>
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
            {/* Borde blanco para que la ruta resalte sobre las calles */}
            <Mapbox.LineLayer
              id="rutaChoferBorde"
              style={{ lineColor: '#FFFFFF', lineWidth: 9, lineCap: 'round', lineJoin: 'round' }}
            />
            <Mapbox.LineLayer
              id="rutaChoferLinea"
              aboveLayerID="rutaChoferBorde"
              style={{ lineColor: colors.verde, lineWidth: 5, lineCap: 'round', lineJoin: 'round' }}
            />
          </Mapbox.ShapeSource>
        ) : null}

        <Mapbox.PointAnnotation id="origenChofer" coordinate={[origen.lng, origen.lat]}>
          <View style={[styles.marca, styles.marcaOrigen]}>
            <Text style={styles.marcaTexto}>🚏</Text>
          </View>
        </Mapbox.PointAnnotation>

                <Mapbox.ShapeSource
          id="paradasChofer"
          shape={{
            type: 'FeatureCollection',
            features: paradas.map((p) => ({
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
              properties: {
                orden: String(p.orden),
                color: p.bajo
                  ? colors.gris
                  : actual?.pasajero_id === p.pasajero_id
                    ? colors.dorado
                    : colors.verdeProfundo,
                textoColor:
                  !p.bajo && actual?.pasajero_id === p.pasajero_id
                    ? colors.verdeProfundo
                    : '#FFFFFF',
              },
            })),
          }}
        >
          <Mapbox.CircleLayer
            id="paradasCirculos"
            style={{
              circleRadius: 14,
              circleColor: ['get', 'color'],
              circleStrokeColor: '#FFFFFF',
              circleStrokeWidth: 2,
            }}
          />
          <Mapbox.SymbolLayer
            id="paradasNumeros"
            style={{
              textField: ['get', 'orden'],
              textSize: 14,
              textColor: ['get', 'textoColor'],
              textAllowOverlap: true,
              textIgnorePlacement: true,
            }}
          />
        </Mapbox.ShapeSource>
              {miUbicacion ? (
          <Mapbox.ShapeSource
            id="miPosicion"
            shape={{
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [miUbicacion.lng, miUbicacion.lat] },
              properties: {},
            }}
          >
            <Mapbox.CircleLayer
              id="miHalo"
              style={{ circleRadius: 18, circleColor: colors.verde, circleOpacity: 0.2 }}
            />
            <Mapbox.CircleLayer
              id="miPunto"
              style={{
                circleRadius: 8,
                circleColor: colors.verde,
                circleStrokeColor: '#FFFFFF',
                circleStrokeWidth: 3,
              }}
            />
          </Mapbox.ShapeSource>
        ) : null}

        {pasajeros.length > 0 ? (
          <Mapbox.ShapeSource
            id="pasajerosEnVivo"
            shape={{
              type: 'FeatureCollection',
              features: pasajeros.map((p) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
                properties: { id: String(p.pasajero_id) },
              })),
            }}
          >
            <Mapbox.CircleLayer
              id="pasajerosHalo"
              style={{ circleRadius: 18, circleColor: '#2563EB', circleOpacity: 0.2 }}
            />
            <Mapbox.CircleLayer
              id="pasajerosPunto"
              style={{
                circleRadius: 8,
                circleColor: '#2563EB',
                circleStrokeColor: '#FFFFFF',
                circleStrokeWidth: 3,
              }}
            />
          </Mapbox.ShapeSource>
        ) : null}
      </Mapbox.MapView>
    </View>
  );
}

export default function SalasChoferScreen({ onVolver }) {
  const insets = useSafeAreaInsets();
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
    miUbicacion,
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

    const hayViajeActivo =
    viaje?.estado === 'abierta_con_chofer' || viaje?.estado === 'en_curso';
  const { pasajeros: pasajerosEnVivo } = useUbicacionesSala(
    
    viaje?.sala_id ?? viaje?.id ?? null,
    hayViajeActivo
  );
  

  const cerrarYVolver = () => {
    cerrarResumen();
    onVolver?.();
  };

  if (cargandoInicial) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color={colors.verde} />
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
        <ScrollView
          style={styles.scroll}
                    contentContainerStyle={[styles.contenido, { paddingBottom: 48 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <Cabecera onVolver={cerrarYVolver} titulo="Viaje finalizado" />
          <View style={styles.card}>
            <Text style={styles.seccionTitulo}>Resumen de cobro</Text>
            <View style={styles.resumenFila}>
              <Text style={styles.resumenLabel}>Total esperado</Text>
              <Text style={styles.resumenValor}>{soles(resumen.total_esperado)}</Text>
            </View>
            <View style={styles.resumenFila}>
              <Text style={styles.resumenLabel}>Cobrado</Text>
              <Text style={[styles.resumenValor, styles.resumenOk]}>{soles(resumen.total_cobrado)}</Text>
            </View>
            <View style={styles.resumenFila}>
              <Text style={styles.resumenLabel}>Sin cobrar</Text>
              <Text style={[styles.resumenValor, styles.resumenMal]}>{soles(resumen.total_sin_cobrar)}</Text>
            </View>
          </View>

          <Text style={styles.subtitulo}>Pasajeros</Text>
          <View style={styles.card}>
            {lista.map((p, i) => (
              <View key={i} style={styles.paradaCard}>
                <View style={styles.paradaTop}>
                  <View style={styles.paradaTextos}>
                    <Text style={styles.paradaDir}>{p.direccion || 'Sin referencia'}</Text>
                    <Text style={styles.paradaSub}>{p.nombre}</Text>
                    <Text
                      style={[
                        styles.etiqueta,
                        p.estado_pago === 'pagado' ? styles.etiquetaOk : styles.etiquetaMal,
                      ]}
                    >
                      {TEXTO_PAGO[p.estado_pago] ?? p.estado_pago}
                    </Text>
                  </View>
                  <Text style={styles.paradaMonto}>{soles(p.monto)}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnPrimario, { flex: 0, marginTop: 14 }]}
            onPress={cerrarYVolver}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTexto}>Listo</Text>
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
        <ScrollView
          style={styles.scroll}
                    contentContainerStyle={[styles.contenido, { paddingBottom: 48 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <Cabecera titulo="Tu viaje" />
          <View style={styles.estadoPildora}>
            <PuntoEstado color={colors.verde} pulsar={viaje.estado === 'abierta_con_chofer'} />
            <Text style={styles.estadoPildoraTexto}>
              {TEXTO_ESTADO[viaje.estado] ?? viaje.estado}
            </Text>
          </View>

          {/* Cupos, tiempo y total */}
          <View style={styles.card}>
            <View style={styles.cuposEncabezado}>
              <Text style={styles.seccionTitulo}>Pasajeros</Text>
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

            <View style={styles.separador} />

            <Text style={styles.seccionTitulo}>
              {enCurso ? 'Total del viaje' : 'Total estimado'}
            </Text>
            <Text style={styles.precioGrande}>{soles(viaje.precio_general)}</Text>
          </View>

          {/* Mapa con ruta y paradas */}
          {paradas.length > 0 ? (
            <MapaChofer
              origen={viaje.origen}
              ruta={viaje.ruta}
              paradas={paradas}
              actual={enCurso ? actual : null}
              pasajeros={pasajerosEnVivo ?? []}
              miUbicacion={miUbicacion}
            />
          ) : null}

          {/* Iniciar viaje */}
          {viaje.estado === 'abierta_con_chofer' ? (
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnPrimario,
                { flex: 0, marginBottom: 12 },
                procesando && { opacity: 0.6 },
              ]}
              onPress={iniciarViaje}
              disabled={procesando}
              activeOpacity={0.8}
            >
              <Text style={styles.btnTexto}>
                Iniciar viaje ({viaje.pasajeros}{' '}
                {viaje.pasajeros === 1 ? 'pasajero' : 'pasajeros'})
              </Text>
            </TouchableOpacity>
          ) : null}

          {/* Navegación a la parada actual */}
          {enCurso && actual ? (
            <View style={styles.card}>
              <Text style={styles.seccionTitulo}>Siguiente parada ({actual.orden})</Text>
              <Text style={[styles.paradaDir, { fontSize: 16, marginTop: 4 }]}>
                {actual.direccion || 'Sin referencia'}
              </Text>
              <View style={styles.fila}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnContorno]}
                  onPress={() => abrirWaze(actual)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnTextoVerde}>Waze</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnContorno]}
                  onPress={() => abrirGoogle(actual)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnTextoVerde}>Google Maps</Text>
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
                      style={[styles.paradaCard, esActual && styles.paradaCardActual]}
                    >
                      <View style={styles.paradaTop}>
                        <View
                          style={[styles.marca, esActual && styles.marcaActual, p.bajo && styles.marcaBajo]}
                        >
                          <Text style={[styles.marcaTexto, esActual && styles.marcaTextoActual]}>
                            {p.orden}
                          </Text>
                        </View>
                        <View style={styles.paradaTextos}>
                          <Text
                            style={[styles.paradaDir, p.bajo && styles.paradaDirBajo]}
                            numberOfLines={2}
                          >
                            {p.direccion || 'Sin referencia'}
                          </Text>
                          <Text style={styles.paradaSub}>{p.nombre}</Text>
                          {p.bajo ? (
                            <Text
                              style={[
                                styles.etiqueta,
                                p.estado_pago === 'pagado' ? styles.etiquetaOk : styles.etiquetaMal,
                              ]}
                            >
                              {p.estado_pago === 'pagado' ? 'Bajó y pagó' : 'Bajó sin pagar'}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={styles.paradaMonto}>{soles(p.monto)}</Text>
                      </View>

                      {enCurso && !p.bajo ? (
                        <View style={styles.fila}>
                          <TouchableOpacity
                            style={[styles.btn, styles.btnPrimario, procesando && { opacity: 0.6 }]}
                            onPress={() => marcarBajada(p.pasajero_id, true)}
                            disabled={procesando}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.btnTexto}>Bajó y pagó</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.btn, styles.btnPeligro, procesando && { opacity: 0.6 }]}
                            onPress={() => marcarBajada(p.pasajero_id, false)}
                            disabled={procesando}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.btnTextoPeligro}>Bajó sin pagar</Text>
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
              style={[
                styles.btn,
                styles.btnSecundario,
                { flex: 0, marginTop: 4 },
                procesando && { opacity: 0.6 },
              ]}
              onPress={finalizarViaje}
              disabled={procesando}
              activeOpacity={0.8}
            >
              <Text style={styles.btnTextoVerde}>Finalizar viaje</Text>
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
                  <PuntoEstado color={colors.dorado} pulsar />
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
                      <Text style={styles.seccionTitulo}>Destino</Text>
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
      <ScrollView
        style={styles.scroll}
                  contentContainerStyle={[styles.contenido, { paddingBottom: 48 + insets.bottom }]}
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
              <PuntoEstado color={colors.dorado} pulsar />
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
                  <Text style={styles.seccionTitulo}>Destino</Text>
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