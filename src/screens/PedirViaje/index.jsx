import React, { useEffect, useRef, useState } from 'react';
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
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

function MapaRuta({ origen, destino, ruta, style }) {
  const camara = useRef(null);

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
  }, [ruta, origen, destino]);

  return (
    <Mapbox.MapView style={style}>
      <Mapbox.Camera
        ref={camara}
        defaultSettings={{
          centerCoordinate: [origen.lng, origen.lat],
          zoomLevel: 12,
        }}
      />

      {ruta?.geometry ? (
        <Mapbox.ShapeSource
          id="rutaPreview"
          shape={{ type: 'Feature', geometry: ruta.geometry, properties: {} }}
        >
          <Mapbox.LineLayer
            id="rutaLinea"
            style={{
              lineColor: '#F58220',
              lineWidth: 5,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </Mapbox.ShapeSource>
      ) : null}

      <Mapbox.PointAnnotation id="origenViaje" coordinate={[origen.lng, origen.lat]} anchor={{ x: 0.5, y: 1 }}>
        <Marcador icono="🚏" estiloPunto={styles.marcadorOrigen} />
      </Mapbox.PointAnnotation>
      {destino ? (
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
        <Text style={styles.tituloResumen}>Viaje finalizado 🎉</Text>
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

export default function PedirViajeScreen({ onVolver, onMenu, onCampana }) {
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
  } = usePedirViaje();

  const camaraRef = useRef(null);
  const [mapaListo, setMapaListo] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMapaListo(true), 6000);
    return () => clearTimeout(id);
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
  if (!viaje && resumen) {
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
            ruta={ruta}
          />
        ) : (
          <View style={styles.mapaViajeFull} />
        )}

        <TouchableOpacity
          style={styles.botonVolverFlotante}
          onPress={onVolver}
          activeOpacity={0.8}
        >
          <Text style={styles.volverTextoFlotante}>← Volver</Text>
        </TouchableOpacity>

        {/* Tarjeta inferior */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetContenido}
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
                    <Text style={styles.asientoTexto}>
                      {i < viaje.pasajeros ? '👤' : ''}
                    </Text>
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
        </View>
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
          <TouchableOpacity onPress={onVolver} style={styles.btnSecondarySimple}>
            <Text style={styles.btnSecondaryTextSimple}>← Volver</Text>
          </TouchableOpacity>
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
            <Marcador icono="🚏" estiloPunto={styles.marcadorOrigen} />
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
              <TouchableOpacity onPress={onMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
          <View style={styles.panelInferior}>
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
    </View>
  );
}