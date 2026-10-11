import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
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
              lineColor: '#1a73e8',
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

  // Respaldo: si Mapbox nunca avisa (mala red), no dejamos la pantalla en blanco para siempre
  useEffect(() => {
    const id = setTimeout(() => setMapaListo(true), 6000);
    return () => clearTimeout(id);
  }, []);

  if (cargandoInicial) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ---------- Ya tiene un viaje activo: se muestra su estado ----------
  if (viaje) {
    const libres = viaje.capacidad - viaje.pasajeros;
    return (
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={onVolver}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Tu viaje</Text>
                {origen && destinoViaje?.lat != null ? (
          <MapaRuta
            style={styles.mapaViaje}
            origen={origen}
            destino={destinoViaje}
            ruta={ruta}
          />
        ) : null}

        {ruta ? (
          <Text style={styles.dato}>
            {(ruta.distancia_m / 1000).toFixed(1)} km ·{' '}
            {Math.round(ruta.duracion_s / 60)} min
          </Text>
        ) : null}
        <Text style={styles.estado}>{TEXTO_ESTADO[viaje.estado] ?? viaje.estado}</Text>

        

        <Text style={styles.dato}>
          Cupos: {viaje.pasajeros} ocupados, {libres} libres
        </Text>

        {viaje.mi_destino?.direccion ? (
          <Text style={styles.dato}>Tu destino: {viaje.mi_destino.direccion}</Text>
        ) : null}

        {viaje.chofer ? (
          <View style={styles.tarjeta}>
            <Text style={styles.tarjetaTitulo}>Tu chofer</Text>
            <Text style={styles.dato}>{viaje.chofer.nombre}</Text>
            <Text style={styles.dato}>
              {viaje.chofer.modelo} · {viaje.chofer.placa}
            </Text>
          </View>
        ) : null}

        {error ? <Text style={styles.textoError}>{error}</Text> : null}

        {puedeCancelar && !confirmandoCancelar ? (
          <TouchableOpacity
            style={styles.botonSecundario}
            onPress={pedirCancelar}
            disabled={cargando}
          >
            <Text style={styles.botonSecundarioTexto}>Cancelar viaje</Text>
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
              >
                <Text style={styles.botonNeutroTexto}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botonMitad, styles.botonPeligro]}
                onPress={confirmarCancelar}
                disabled={cargando}
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
      </View>
    );
  }

  // ---------- Sin viaje: se elige el destino en el mapa ----------
  if (!origen) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.dato}>
          No se pudo cargar el punto de partida. Revisa config_salas.
        </Text>
        <TouchableOpacity onPress={onVolver}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>
      </View>
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
          value={consulta}
          onChangeText={setConsulta}
        />
        {buscando ? <ActivityIndicator style={styles.buscadorCargando} /> : null}
        {sugerencias.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.sugerencia}
            onPress={() => elegir(s)}
          >
            <Text style={styles.sugerenciaNombre}>{s.nombre}</Text>
            <Text style={styles.sugerenciaDetalle}>{s.detalle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <View style={styles.panelInferior}>
        <Text style={styles.panelTitulo}>
          {destino ? 'Destino elegido' : 'Toca el mapa para elegir tu destino'}
        </Text>

        {destino ? (
          <TextInput
            style={styles.input}
            placeholder="Referencia (opcional): ej. frente al parque"
            onChangeText={cambiarReferencia}
          />
        ) : null}

        {error ? <Text style={styles.textoError}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.boton, (!destino || cargando) && styles.botonDeshabilitado]}
          onPress={pedirViaje}
          disabled={!destino || cargando}
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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            elevation: 10,
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={styles.cargandoMapaTexto}>Te estamos ubicando…</Text>
        </View>
      ) : null}
      <TouchableOpacity style={styles.botonVolverFlotante} onPress={onVolver}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>

    </View>
    
  );
}