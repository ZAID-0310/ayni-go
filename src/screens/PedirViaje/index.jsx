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
  Animated
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { usePedirViaje } from '../../hooks/usePedirViaje';
import styles from './PedirViajeScreen.styles';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

const TEXTO_ESTADO = {
  formando: 'Buscando compañeros de ruta…',
  abierta_con_chofer: 'Chofer asignado',
  cerrada_buscando_chofer: 'Sala completa, buscando chofer…',
  en_curso: 'Viaje en curso',
};

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

      <Mapbox.PointAnnotation id="origenViaje" coordinate={[origen.lng, origen.lat]}>
        <View style={styles.marcadorOrigen} />
      </Mapbox.PointAnnotation>
      {destino ? (
        <Mapbox.PointAnnotation
          id="destinoViaje"
          coordinate={[destino.lng, destino.lat]}
        >
          <View style={styles.marcadorDestino} />
        </Mapbox.PointAnnotation>
      ) : null}
    </Mapbox.MapView>
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

export default function PedirViajeScreen({ onVolver }) {
  const {
    origen,
    destino, setDestino,
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

  // ---------- Ya tiene un viaje activo: se muestra su estado ----------
  // ---------- Ya tiene un viaje activo: se muestra su estado ----------
  if (viaje) {
    const libres = viaje.capacidad - viaje.pasajeros;
    const buscandoEstado =
      viaje.estado === 'formando' || viaje.estado === 'cerrada_buscando_chofer';
    const colorEstado = buscandoEstado ? '#F58220' : '#16A34A';
    const fondoEstado = buscandoEstado ? '#FDE9D3' : '#DCFCE7';
    const textoColorEstado = buscandoEstado ? '#D9690B' : '#15803D';

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
                <Text style={styles.btnCancelarLinkTexto}>Cancelar viaje</Text>
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
    setDestino((actual) => ({ ...actual, lat, lng }));
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
        <Mapbox.MapView style={styles.mapa} onPress={manejarToque} onDidFinishRenderingMapFully={() => setMapaListo(true)}>
          <Mapbox.Camera
            ref={camaraRef}
            defaultSettings={{
              centerCoordinate: [origen.lng, origen.lat],
              zoomLevel: 13,
            }}
            animationDuration={0}
          />

          <Mapbox.PointAnnotation id="origen" coordinate={[origen.lng, origen.lat]}>
            <View style={styles.marcadorOrigen} />
          </Mapbox.PointAnnotation>

          {destino ? (
            <Mapbox.PointAnnotation
              id="destino"
              coordinate={[destino.lng, destino.lat]}
            >
              <View style={styles.marcadorDestino} />
            </Mapbox.PointAnnotation>
          ) : null}
        </Mapbox.MapView>
      </View>

      {/* Buscador y panel: solo cuando el mapa ya está listo */}
      {mapaListo ? (
        <>
          <View style={styles.buscador}>
            <TextInput
              style={styles.buscadorInput}
              placeholder="Busca tu destino: calle, lugar, distrito…"
              placeholderTextColor="#888"
              value={consulta}
              onChangeText={setConsulta}
            />
            {buscando ? <ActivityIndicator style={styles.buscadorCargando} color="#1E1E1E" /> : null}
            {sugerencias && sugerencias.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={styles.sugerencia}
                onPress={() => elegir(s)}
                activeOpacity={0.7}
              >
                <Text style={styles.sugerenciaNombre}>{s.nombre}</Text>
                <Text style={styles.sugerenciaDetalle}>{s.detalle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.panelInferior}>
            <Text style={styles.panelTitulo}>
              {destino ? '📍 Destino elegido' : '🎯 Toca el mapa para elegir tu destino'}
            </Text>

            {destino ? (
              <TextInput
                style={styles.input}
                placeholder="Referencia (opcional): ej. frente al parque"
                placeholderTextColor="#888"
                onChangeText={cambiarReferencia}
              />
            ) : null}

            {error ? <Text style={styles.textoError}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.boton, (!destino || cargando) && styles.botonDeshabilitado]}
              onPress={pedirViaje}
              disabled={!destino || cargando}
              activeOpacity={0.8}
            >
              {cargando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botonTexto}>Pedir viaje</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {!mapaListo ? (
        <View style={styles.cargandoMapa}>
          <ActivityIndicator size="large" color="#1E1E1E" />
          <Text style={styles.cargandoMapaTexto}>Te estamos ubicando…</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.botonVolverFlotante} onPress={onVolver} activeOpacity={0.8}>
        <Text style={styles.volverTextoFlotante}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}