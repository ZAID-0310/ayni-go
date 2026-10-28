import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MenuLateral from '../../components/MenuLateral';
import PinInicio from '../../components/PinInicio';
import PinFoto from '../../components/PinFoto';
import Avatar from '../../components/Avatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';
import { usePedirViaje } from '../../hooks/usePedirViaje';
import styles from './PedirViajeScreen.styles';


Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

const VERDE = '#0F5132';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const TEXTO_ESTADO = {
  formando: 'Buscando chofer…',
  abierta_con_chofer: 'Chofer asignado',
  en_curso: 'Viaje en curso',
};

function Marcador({ icono, estiloPunto }) {
  return (
    <View style={{ alignItems: 'center', width: 40 }}>
      <Text style={{ fontSize: 22, lineHeight: 28 }}>{icono}</Text>
      <View style={estiloPunto} />
    </View>
  );
}

// Distancia aproximada en metros entre dos puntos [lng, lat]
const distM = (a, b) => {
  const dx = (a[0] - b[0]) * Math.cos((a[1] * Math.PI) / 180) * 111320;
  const dy = (a[1] - b[1]) * 110574;
  return Math.sqrt(dx * dx + dy * dy);
};

// Corta los tramos en la posición del chofer: lo recorrido queda aparte.
// Solo busca hacia adelante (desdeIdx) y no corta si está a más de toleranciaM de la ruta.
function recortarTramos(tramos, pos, desdeIdx, toleranciaM = 150) {
  const todas = [];
  tramos.forEach((t, k) => t.coordenadas.forEach((c, j) => todas.push({ c, k, j })));
  if (todas.length === 0) return { restantes: tramos, recorrido: null, idx: 0 };

  let idx = Math.min(desdeIdx, todas.length - 1);
  if (pos) {
    let mejor = -1;
    let min = Infinity;
    for (let i = idx; i < todas.length; i++) {
      const d = distM(todas[i].c, [pos.lng, pos.lat]);
      if (d < min) {
        min = d;
        mejor = i;
      }
    }
    if (mejor >= 0 && min <= toleranciaM) idx = mejor;
  }
  if (idx === 0) return { restantes: tramos, recorrido: null, idx };

  const corte = todas[idx];
  const restantes = tramos
    .map((t, k) => {
      if (k < corte.k) return null;
      return k === corte.k ? { ...t, coordenadas: t.coordenadas.slice(corte.j) } : t;
    })
    .filter((t) => t && t.coordenadas.length >= 2);
  const recorrido = todas.slice(0, idx + 1).map((x) => x.c);
  return { restantes, recorrido: recorrido.length >= 2 ? recorrido : null, idx };
}

// Un color por tramo (igual que en el mapa del chofer)
const COLORES_TRAMO = ['#EA580C', '#7C3AED', '#0D9488', '#DB2777'];
const colorDeOrden = (orden) => COLORES_TRAMO[(Math.max(1, orden) - 1) % COLORES_TRAMO.length];

// Parte la ruta en tramos: origen → parada 1 → parada 2 → ...
function partirRuta(coordenadas, paradas) {
  if (!coordenadas?.length || !paradas?.length) return [];
  const masCercano = (p) => {
    let mejor = 0;
    let min = Infinity;
    coordenadas.forEach(([lng, lat], i) => {
      const d = (lng - p.lng) ** 2 + (lat - p.lat) ** 2;
      if (d < min) {
        min = d;
        mejor = i;
      }
    });
    return mejor;
  };
  const ordenadas = [...paradas].sort((a, b) => a.orden - b.orden);
  let desde = 0;
  return ordenadas.map((p, k) => {
    let hasta = masCercano(p);
    if (k === ordenadas.length - 1) hasta = coordenadas.length - 1;
    if (hasta <= desde) hasta = Math.min(desde + 1, coordenadas.length - 1);
    const tramo = { orden: p.orden, color: colorDeOrden(p.orden), coordenadas: coordenadas.slice(desde, hasta + 1) };
    desde = hasta;
    return tramo;
  });
}

// Pin de una parada; al cargar la foto se redibuja (Android la deja vacía la primera vez)
function PinParada({ parada }) {
  const ref = useRef(null);
  return (
    <Mapbox.PointAnnotation
      ref={ref}
      id={`parada-${parada.orden}`}
      coordinate={[parada.lng, parada.lat]}
      anchor={{ x: 0.5, y: 1 }}
    >
      <PinFoto
        uri={parada.foto_url}
        orden={parada.orden}
        color={colorDeOrden(parada.orden)}
        resaltado={!!parada.es_mia}
        onCargada={() => ref.current?.refresh()}
      />
    </Mapbox.PointAnnotation>
  );
}

function MapaRuta({ origen, destino, ruta, rutaSala, paradas, chofer, miUbicacion, style }) {
  const camara = useRef(null);

  // ruta_sala llega como texto JSON
  const coordsSala = useMemo(() => {
    try {
      const g = typeof rutaSala === 'string' ? JSON.parse(rutaSala) : rutaSala;
      return g?.coordinates?.length >= 2 ? g.coordinates : null;
    } catch {
      return null;
    }
  }, [rutaSala]);

  const paradasValidas = (paradas ?? []).filter((p) => p.orden != null);
  const paradasKey = paradasValidas.map((p) => `${p.orden}:${p.lat}:${p.lng}`).join('|');
  const paradasPines = paradasValidas.filter((p) => !p.bajo);

  // Ruta cortada según el avance del chofer
  const coordsRuta = coordsSala ?? ruta?.geometry?.coordinates;
  const rutaClave = coordsRuta?.length
    ? `${coordsRuta.length}|${coordsRuta[0][0]}|${coordsRuta[coordsRuta.length - 1][0]}`
    : '';
  const tramos = useMemo(() => {
    if (!coordsRuta || coordsRuta.length < 2) return [];
    if (coordsSala && paradasValidas.length > 0) {
      const t = partirRuta(coordsSala, paradasValidas).filter((x) => x.coordenadas.length >= 2);
      if (t.length > 0) return t;
    }
    return [{ orden: 0, color: '#F58220', coordenadas: coordsRuta }];
  }, [rutaClave, paradasKey]); // eslint-disable-line react-hooks/exhaustive-deps


  const avance = useRef(0);
  const tramosPrevios = useRef(null);
  const corte = useMemo(() => {
    if (tramosPrevios.current !== tramos) {
      tramosPrevios.current = tramos; // ruta nueva: el avance vuelve a empezar
      avance.current = 0;
    }
    const r = recortarTramos(tramos, chofer, avance.current);
    avance.current = r.idx;
    return r;
  }, [tramos, chofer]);

   // Clave estable: solo cambia si cambian los puntos o la ruta de verdad,
  // no cada vez que el refresco del viaje crea objetos nuevos.
  const clave = [
    origen?.lat,
    origen?.lng,
    destino?.lat,
    destino?.lng,
    ruta?.geometry?.coordinates?.length ?? 0,
  ].join('|');

  useEffect(() => {
    if (!origen || !destino) return;
    const puntos = ruta?.geometry?.coordinates ?? [
      [origen.lng, origen.lat],
      [destino.lng, destino.lat],
    ];
    const lngs = puntos.map((p) => p[0]);
    const lats = puntos.map((p) => p[1]);
    camara.current?.fitBounds(
      [Math.max(...lngs), Math.max(...lats)], // noreste
      [Math.min(...lngs), Math.min(...lats)], // suroeste
      [50, 50, 50, 50],
      600
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  return (
    <Mapbox.MapView style={style}>
      <Mapbox.Camera
        ref={camara}
        defaultSettings={{
          centerCoordinate: [origen.lng, origen.lat],
          zoomLevel: 12,
        }}
      />

            {tramos.length > 0 ? (
        <Mapbox.ShapeSource
          id="rutaPreview"
          shape={{
            type: 'FeatureCollection',
            features: [
              ...(corte.recorrido
                ? [{
                    type: 'Feature',
                    properties: { color: '#C9C5B8' },
                    geometry: { type: 'LineString', coordinates: corte.recorrido },
                  }]
                : []),
              ...corte.restantes.map((t) => ({
                type: 'Feature',
                properties: { color: t.color },
                geometry: { type: 'LineString', coordinates: t.coordenadas },
              })),
            ],
          }}
        >
          <Mapbox.LineLayer
            id="rutaLinea"
            style={{
              lineColor: ['get', 'color'],
              lineWidth: 5,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </Mapbox.ShapeSource>
      ) : null}

            {chofer ? (
        <Mapbox.ShapeSource
          id="choferEnVivo"
          shape={{
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [chofer.lng, chofer.lat] },
            properties: {},
          }}
        >
          <Mapbox.CircleLayer
            id="choferHalo"
            style={{ circleRadius: 18, circleColor: VERDE, circleOpacity: 0.2 }}
          />
          <Mapbox.CircleLayer
            id="choferPunto"
            style={{
              circleRadius: 8,
              circleColor: VERDE,
              circleStrokeColor: '#FFFFFF',
              circleStrokeWidth: 3,
            }}
          />
        </Mapbox.ShapeSource>
      ) : null}

            {miUbicacion ? (
        <Mapbox.ShapeSource
          id="miPosicionPasajero"
          shape={{
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [miUbicacion.lng, miUbicacion.lat] },
            properties: {},
          }}
        >
          <Mapbox.CircleLayer
            id="miHaloPasajero"
            style={{ circleRadius: 18, circleColor: '#2563EB', circleOpacity: 0.2 }}
          />
          <Mapbox.CircleLayer
            id="miPuntoPasajero"
            style={{
              circleRadius: 8,
              circleColor: '#2563EB',
              circleStrokeColor: '#FFFFFF',
              circleStrokeWidth: 3,
            }}
          />
        </Mapbox.ShapeSource>
      ) : null}

      <Mapbox.PointAnnotation id="origenViaje" coordinate={[origen.lng, origen.lat]} anchor={{ x: 0.5, y: 1 }}>
        <PinInicio />
      </Mapbox.PointAnnotation>
        {paradasPines.map((p) => (
      <PinParada key={p.orden} parada={p} />
      ))}
      {destino && paradasValidas.length === 0 ? (
        <Mapbox.PointAnnotation
          id="destinoViaje"
          coordinate={[destino.lng, destino.lat]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <Marcador icono="🏁" estiloPunto={styles.marcadorDestino} />
        </Mapbox.PointAnnotation>
      ) : null}
    </Mapbox.MapView>
  );
}
const dinero = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;

// parada_actual puede venir como número o como objeto: se acepta ambos
const numeroParada = (p) => (p && typeof p === 'object' ? p.orden : p);

function ResumenViaje({ resumen, onCerrar }) {
  const lista = resumen.pasajeros ?? resumen.paradas ?? [];
  const mio = lista[0] ?? null;
  const esperado = Number(resumen.total_esperado ?? mio?.monto ?? 0);
  const pagado =
    Number(resumen.total_cobrado ?? 0) > 0 &&
    Number(resumen.total_sin_cobrar ?? 0) === 0;

  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.tarjetaResumen}>
                <Text style={styles.tituloResumen}>
          {resumen.parcial
            ? (pagado ? 'Bajaste y pagaste ✅' : 'Bajaste del viaje')
            : 'Viaje finalizado 🎉'}
        </Text>
        <Text style={styles.subtitulo}>Gracias por viajar con Ayni Go.</Text>

        {mio?.direccion ? (
          <>
            <Text style={styles.etiqueta}>TU DESTINO</Text>
            <Text style={styles.destinoResumen} numberOfLines={2}>
              {mio.direccion}
            </Text>
          </>
        ) : null}

        <Text style={styles.etiqueta}>TU MONTO</Text>
        <Text style={styles.montoGrande}>{dinero(esperado)}</Text>

        <View
          style={[
           styles.estadoPago,
            { backgroundColor: pagado ? '#DCFCE7' : '#FDE9D3' },
          ]}
        >
          <Text
            style={[
             styles.estadoPagoTexto,
              { color: pagado ? '#15803D' : '#D9690B' },
            ]}
          >
            {pagado ? 'Pago registrado' : 'Pago pendiente'}
          </Text>
        </View>

        <TouchableOpacity style={styles.botonResumen} onPress={onCerrar} activeOpacity={0.8}>
          <Text style={styles.botonResumenTexto}>Listo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AvisoCancelado({ onCerrar }) {
  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.tarjetaResumen}>
        <Text style={styles.tituloResumen}>El viaje se canceló</Text>
        <Text style={styles.subtitulo}>
          Tu viaje ya no está activo. Puedes pedir uno nuevo cuando quieras.
        </Text>
        <TouchableOpacity style={styles.botonResumen} onPress={onCerrar} activeOpacity={0.8}>
          <Text style={styles.botonResumenTexto}>Entendido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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

export default function PedirViajeScreen({
  onVolver,
  onMenu,
  onCampana,
  perfil,
  onIrAVehiculo,
  onIrADocumentos,
  onIrASalasChofer,
  onIrAProgramados,
  onIrAProgramadosChofer,
  onCerrarSesion,
}) {
  const {
    origen,
    viaje,
    cargando,
    cargandoInicial,
    puedeCancelar,
    error,
    confirmandoCancelar,
    pedirViaje,
    pedirCancelar,
    descartarCancelar,
    confirmarCancelar,
    ruta,
    destinoViaje,
    consulta, setConsulta,
    sugerencias,
    buscando,
    elegirSugerencia,
    destino,
    setDestino,
    moverDestino,
    buscandoDireccion,
    resumen,
    cerrarResumen,
    avisoCancelado,
    cerrarAviso,
      choferEnVivo,
      miUbicacion,
  } = usePedirViaje();

  const insets = useSafeAreaInsets();
  const camaraRef = useRef(null);
    const [mapaListo, setMapaListo] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
    const [tecladoAlto, setTecladoAlto] = useState(0);

  // Tarjeta deslizable: solo la rayita se arrastra
  const ASOMA = 90; // lo que queda visible al bajarla
  const alturaSheet = useRef(0);
  const sheetY = useRef(new Animated.Value(0)).current;
  const colapsado = useRef(false);

  const maxBajada = () => Math.max(0, alturaSheet.current - ASOMA);
  const moverSheet = (abajo) => {
    colapsado.current = abajo;
    Animated.spring(sheetY, {
      toValue: abajo ? maxBajada() : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const panSheet = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const base = colapsado.current ? maxBajada() : 0;
        sheetY.setValue(Math.min(maxBajada(), Math.max(0, base + g.dy)));
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) < 5 && Math.abs(g.dy) < 5) {
          moverSheet(!colapsado.current); // un toque la alterna
        } else if (g.dy > 40) {
          moverSheet(true);
        } else if (g.dy < -40) {
          moverSheet(false);
        } else {
          moverSheet(colapsado.current);
        }
      },
    })
  ).current;

  useEffect(() => {
    const mostrar = Keyboard.addListener('keyboardDidShow', (e) =>
      setTecladoAlto(e.endCoordinates.height)
    );
    const ocultar = Keyboard.addListener('keyboardDidHide', () =>
      setTecladoAlto(0)
    );
    return () => {
      mostrar.remove();
      ocultar.remove();
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMapaListo(true), 2500);    return () => clearTimeout(id);
  }, []);

  if (cargandoInicial) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centrado}>
          <ActivityIndicator size="large" color="#1E1E1E" />
          <Text style={styles.cargandoMapaTexto}>Cargando información...</Text>
        </View>
      </SafeAreaView>
    );
  }

     // ---------- Viaje terminado o cancelado ----------
    if (resumen) {
    return <ResumenViaje resumen={resumen} onCerrar={cerrarResumen} />;
  }
  if (!viaje && avisoCancelado) {
    return <AvisoCancelado onCerrar={cerrarAviso} />;
  }

  // ---------- Ya tiene un viaje activo: se muestra su estado ----------
  if (viaje) {
    const libres = viaje.capacidad - viaje.pasajeros;
    const buscandoEstado = viaje.estado === 'formando';
    const colorEstado = buscandoEstado ? '#F58220' : '#16A34A';
    const fondoEstado = buscandoEstado ? '#FDE9D3' : '#DCFCE7';
    const textoColorEstado = buscandoEstado ? '#D9690B' : '#15803D';

    const monto = viaje.mi_destino?.monto;
    const enCurso = viaje.estado === 'en_curso';
    const miOrden = viaje.mi_destino?.orden;
    const paradaActual = numeroParada(viaje.parada_actual);
    const pagoRegistrado = viaje.mi_destino?.estado_pago === 'pagado';

    return (
      <View style={styles.viajeContenedor}>
        {/* Mapa a pantalla completa en la parte de arriba */}
        {origen && destinoViaje?.lat != null ? (
          <MapaRuta
            style={styles.mapaViajeFull}
            origen={origen}
            destino={destinoViaje}
            chofer={choferEnVivo}
            miUbicacion={miUbicacion}
            ruta={ruta}
            rutaSala={viaje.ruta_sala}
            paradas={viaje.paradas_sala}
          />
        ) : (
          <View style={styles.mapaViajeFull} />
        )}

        {onVolver ? (
          <TouchableOpacity
            style={styles.botonVolverFlotante}
            onPress={onVolver}
            activeOpacity={0.8}
          >
            <Text style={styles.volverTextoFlotante}>← Volver</Text>
          </TouchableOpacity>
        ) : null}

        {/* Tarjeta inferior */}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}
          onLayout={(e) => {
            alturaSheet.current = e.nativeEvent.layout.height;
            if (colapsado.current) sheetY.setValue(maxBajada());
          }}
        >
          <View
            {...panSheet.panHandlers}
            style={{ paddingTop: 12, paddingBottom: 10, alignItems: 'center' }}
          >
            <View style={styles.sheetHandle} />
          </View>

          <ScrollView
            style={styles.sheetScroll}
                        contentContainerStyle={[styles.sheetContenido, { paddingBottom: 28 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Estado */}
            <View style={[styles.estadoPildora, { backgroundColor: fondoEstado }]}>
              <PuntoEstado color={colorEstado} pulsar={buscandoEstado} />
              <Text style={[styles.estadoPildoraTexto, { color: textoColorEstado }]}>
                {TEXTO_ESTADO[viaje.estado] ?? viaje.estado}
              </Text>
            </View>

            {/* Distancia y tiempo */}
            {ruta ? (
              <View style={styles.chipsFila}>
                <View style={styles.chip}>
                  <Text style={styles.chipTexto}>
                    📍 {(ruta.distancia_m / 1000).toFixed(1)} km
                  </Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipTexto}>
                    ⏱️ {Math.round(ruta.duracion_s / 60)} min
                  </Text>
                </View>
              </View>
            ) : null}

                        {/* Precio, parada y pago */}
            {monto != null && !buscandoEstado ? (
              <View style={styles.precioBloque}>
                <View style={styles.precioFila}>
                  <View>
                    <Text style={styles.seccionTitulo}>
                      {enCurso ? 'TU PRECIO' : 'TU PRECIO ESTIMADO'}
                    </Text>
                    <Text style={styles.precioMonto}>{dinero(monto)}</Text>
                    {!enCurso ? (
                      <Text style={styles.precioNota}>
                        Puede bajar si se suman más pasajeros
                      </Text>
                    ) : null}
                  </View>
                  {enCurso && miOrden != null ? (
                    <View style={styles.paradaChip}>
                      <Text style={styles.paradaChipTexto}>Tu parada #{miOrden}</Text>
                    </View>
                  ) : null}
                </View>

                {enCurso && paradaActual != null ? (
                  <Text style={styles.precioNota}>Parada actual: #{paradaActual}</Text>
                ) : null}

                {enCurso ? (
                  <View
                    style={[
                     styles.pagoPildora,
                      { backgroundColor: pagoRegistrado ? '#DCFCE7' : '#FDE9D3' },
                    ]}
                  >
                    <Text
                      style={[
                       styles.pagoPildoraTexto,
                        { color: pagoRegistrado ? '#15803D' : '#D9690B' },
                      ]}
                    >
                      {pagoRegistrado ? 'Pago registrado' : 'Pago pendiente'}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Destino */}
            {viaje.mi_destino?.direccion ? (
              <View style={styles.destinoFila}>
                <View style={styles.destinoIcono}>
                  <Text style={styles.destinoIconoTexto}>📍</Text>
                </View>
                <View style={styles.destinoInfo}>
                  <Text style={styles.seccionTitulo}>TU DESTINO</Text>
                  <Text style={styles.destinoTexto} numberOfLines={2}>
                    {viaje.mi_destino.direccion}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Cupos */}
            <View style={styles.cuposBloque}>
              <View style={styles.cuposEncabezado}>
                <Text style={styles.seccionTitulo}>COMPAÑEROS DE RUTA</Text>
                <Text style={styles.cuposResumen}>
                  {viaje.pasajeros} de {viaje.capacidad}
                </Text>
              </View>
              <View style={styles.asientosFila}>
                {Array.from({ length: viaje.capacidad }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.asiento,
                      i < viaje.pasajeros && styles.asientoLleno,
                    ]}
                  >
                                        {viaje.paradas_sala?.[i] ? (
                      <Avatar
                        uri={viaje.paradas_sala[i].foto_url}
                        nombre={String(viaje.paradas_sala[i].orden)}
                        tamano={36}
                        style={{
                          borderWidth: viaje.paradas_sala[i].es_mia ? 3 : 2,
                          borderColor: colorDeOrden(viaje.paradas_sala[i].orden),
                          opacity: viaje.paradas_sala[i].bajo ? 0.4 : 1,
                        }}
                      />
                    ) : (
                      <Text style={styles.asientoTexto}>
                        {i < viaje.pasajeros ? '👤' : ''}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              <Text style={styles.cuposDetalle}>
                {libres === 0
                  ? 'Sala completa'
                  : `${libres} ${libres === 1 ? 'cupo libre' : 'cupos libres'}`}
              </Text>
            </View>

            {/* Chofer */}
            {viaje.chofer ? (
              <View style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>TU CHOFER ASIGNADO</Text>
                <Text style={styles.datoChoferNombre}>{viaje.chofer.nombre}</Text>
                <Text style={styles.datoChoferDetalle}>
                  🚗 {viaje.chofer.modelo} ·{' '}
                  <Text style={styles.negrita}>{viaje.chofer.placa}</Text>
                </Text>
              </View>
            ) : null}

            {error ? <Text style={styles.textoError}>{error}</Text> : null}

            {/* Cancelar */}
            {puedeCancelar && !confirmandoCancelar ? (
              <TouchableOpacity
                style={styles.btnCancelarLink}
                onPress={pedirCancelar}
                disabled={cargando}
                activeOpacity={0.6}
              >
                <Text style={styles.btnCancelarLinkTexto}>Cancelar pedido</Text>
              </TouchableOpacity>
            ) : null}

            {puedeCancelar && confirmandoCancelar ? (
              <View style={styles.confirmacion}>
                <Text style={styles.dato}>¿Seguro que quieres cancelar tu pedido?</Text>
                <View style={styles.filaBotones}>
                  <TouchableOpacity
                    style={[styles.botonMitad, styles.botonNeutro]}
                    onPress={descartarCancelar}
                    disabled={cargando}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.botonNeutroTexto}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.botonMitad, styles.botonPeligro]}
                    onPress={confirmarCancelar}
                    disabled={cargando}
                    activeOpacity={0.8}
                  >
                    {cargando ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.botonTexto}>Sí, cancelar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  // ---------- Sin viaje: se elige el destino en el mapa ----------
  if (!origen) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centrado}>
          <Text style={styles.dato}>
            No se pudo cargar el punto de partida. Revisa config_salas.
          </Text>
          {onVolver ? (
            <TouchableOpacity onPress={onVolver} style={styles.btnSecondarySimple}>
              <Text style={styles.btnSecondaryTextSimple}>← Volver</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  const manejarToque = (evento) => {
    const [lng, lat] = evento.geometry.coordinates;
    moverDestino(lat, lng);
    Keyboard.dismiss();
  };

  const elegir = async (s) => {
    Keyboard.dismiss();
    const punto = await elegirSugerencia(s);
    if (!punto) return;
    camaraRef.current?.setCamera({
      centerCoordinate: [punto.lng, punto.lat],
      zoomLevel: 15,
      animationDuration: 600,
    });
  };

  const cambiarReferencia = (texto) => {
    setDestino((actual) =>
      actual ? { ...actual, direccion: texto.trim() || null } : actual
    );
  };

  return (
    <View style={styles.contenedorMapa}>
      <View
        style={[styles.mapaContenedor, { opacity: mapaListo ? 1 : 0 }]}
        pointerEvents={mapaListo ? 'auto' : 'none'}
      >
        <Mapbox.MapView
          style={styles.mapa}
          onPress={manejarToque}
                    onDidFinishLoadingMap={() => setMapaListo(true)}
          onDidFinishRenderingMapFully={() => setMapaListo(true)}
        >
          <Mapbox.Camera
            ref={camaraRef}
            defaultSettings={{
              centerCoordinate: [origen.lng, origen.lat],
              zoomLevel: 13,
            }}
            animationDuration={0}          
          />

          <Mapbox.PointAnnotation id="origen" coordinate={[origen.lng, origen.lat]} anchor={{ x: 0.5, y: 1 }}>
            <PinInicio />
          </Mapbox.PointAnnotation>

          {destino ? (
            <Mapbox.PointAnnotation
              id="destino"
              coordinate={[destino.lng, destino.lat]}
              anchor={{ x: 0.5, y: 1 }}
            >
              <Marcador icono="🏁" estiloPunto={styles.marcadorDestino} />
            </Mapbox.PointAnnotation>
          ) : null}
        </Mapbox.MapView>
      </View>

      {mapaListo ? (
        <>
          {/* Cabecera + tarjeta de origen / destino */}
          <View style={styles.topOverlay}>
            <View style={[styles.header, { paddingTop: STATUS_BAR + 8 }]}>
              <TouchableOpacity
                onPress={() => (onMenu ? onMenu() : setMenuAbierto(true))}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="menu" size={28} color={VERDE} />
              </TouchableOpacity>

              <Image
                source={require('../../../assets/logo-texto.png')}
                style={styles.logoHeader}
                resizeMode="contain"
              />

              <TouchableOpacity onPress={onCampana} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="notifications-outline" size={26} color={VERDE} />
              </TouchableOpacity>
            </View>

            <View style={styles.rutaCard}>
              <View style={styles.rutaFila}>
                <View style={styles.puntoOrigen} />
                <Text style={styles.rutaTexto} numberOfLines={1}>
                  Punto de recogida
                </Text>
              </View>

              <View style={styles.rutaSeparador} />

              <View style={styles.rutaFila}>
                <View style={styles.puntoDestino} />
                <TextInput
                  style={styles.rutaInput}
                  placeholder="¿A dónde vamos?"
                  placeholderTextColor="#888"
                  value={consulta}
                  onChangeText={setConsulta}
                />
                {buscando ? <ActivityIndicator color={VERDE} /> : null}
              </View>

              {sugerencias && sugerencias.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={styles.sugerenciaItem}
                  onPress={() => elegir(s)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sugerenciaNombre}>{s.nombre}</Text>
                  <Text style={styles.sugerenciaDetalle}>{s.detalle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Parte de abajo: destino elegido + botón */}
          <View
            style={[
              styles.panelInferior,
              {
                paddingBottom: 16 + (tecladoAlto > 0 ? 0 : insets.bottom),
                bottom: tecladoAlto,
              },
            ]}
          >
            {destino || error ? (
              <View style={styles.destinoCard}>
                {destino ? (
                  <>
                    <Text style={styles.panelTitulo}>📍 Destino elegido</Text>
                    <Text style={styles.dato} numberOfLines={2}>
                      {buscandoDireccion
                        ? 'Buscando dirección…'
                        : (destino.lugar ?? 'Punto elegido en el mapa')}
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Detalle extra (opcional): ej. frente al parque"
                      placeholderTextColor="#888"
                      onChangeText={cambiarReferencia}
                    />
                  </>
                ) : null}
                {error ? <Text style={styles.textoError}>{error}</Text> : null}
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.boton, (!destino || cargando || buscandoDireccion) && styles.botonDeshabilitado]}
              onPress={pedirViaje}
              disabled={!destino || cargando || buscandoDireccion}
              activeOpacity={0.8}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="car-outline" size={22} color="#fff" style={styles.botonIcono} />
                  <Text style={styles.botonTexto}>Solicitar taxi</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {!mapaListo ? (
        <View style={styles.cargandoMapa}>
          <ActivityIndicator size="large" color={VERDE} />
          <Text style={styles.cargandoMapaTexto}>Te estamos ubicando…</Text>
        </View>
      ) : null}

      {/* Menú lateral (hamburguesa) */}
      <MenuLateral
        visible={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        perfil={perfil}
        onIrAInicio={() => {}}
        onIrAVehiculo={onIrAVehiculo}
        onIrADocumentos={onIrADocumentos}
        onIrASalasChofer={onIrASalasChofer}
        onIrAProgramados={onIrAProgramados}
        onIrAProgramadosChofer={onIrAProgramadosChofer}
        onCerrarSesion={onCerrarSesion}
      />
    </View>
  );
}