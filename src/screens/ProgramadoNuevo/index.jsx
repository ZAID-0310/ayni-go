import React, { useEffect, useRef, useState } from 'react';import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useElegirDestino } from '../../hooks/useElegirDestino';
import { useProgramados, formatearHoraInput, parseHora } from '../../hooks/useProgramados';
import { styles } from './ProgramadoNuevoScreen.styles';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

function Marcador({ icono, estiloPunto }) {
  return (
    <View style={{ alignItems: 'center', width: 40 }}>
      <Text style={{ fontSize: 22, lineHeight: 28 }}>{icono}</Text>
      <View style={estiloPunto} />
    </View>
  );
}

export default function ProgramadoNuevoScreen({ onVolver, onGuardado }) {
  const {
    origen,
    destino,
    buscandoDireccion,
    consulta,
    setConsulta,
    sugerencias,
    buscando,
    error,
    setError,
    moverDestino,
    elegirSugerencia,
    cambiarReferencia,
    direccionFinal,
  } = useElegirDestino();

  const { guardar, trabajando } = useProgramados();

    const insets = useSafeAreaInsets();
  const camaraRef = useRef(null);
  const [etiqueta, setEtiqueta] = useState('');
  const [horaTxt, setHoraTxt] = useState('');
  const [tecladoAlto, setTecladoAlto] = useState(0);

  // Sube el panel justo encima del teclado
  useEffect(() => {
    const abre = Keyboard.addListener('keyboardDidShow', (e) =>
      setTecladoAlto(e.endCoordinates?.height ?? 0)
    );
    const cierra = Keyboard.addListener('keyboardDidHide', () => setTecladoAlto(0));
    return () => {
      abre.remove();
      cierra.remove();
    };
  }, []);

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

  const puedeGuardar =
        !!destino && etiqueta.trim().length > 0 && !!parseHora(horaTxt) &&
    !buscandoDireccion && !trabajando;

  const manejarGuardar = async () => {
    setError(null);
    if (!destino) {
      setError('Toca el mapa para elegir el destino.');
      return;
    }
    if (!etiqueta.trim()) {
      setError('Ponle un nombre al viaje (ej. Casa, Universidad).');
      return;
    }
    const ok = await guardar({
      lat: destino.lat,
      lng: destino.lng,
      direccion: direccionFinal,
      etiqueta: etiqueta.trim(),
      horaTxt,
    });
    if (ok) onGuardado();
  };

  if (!origen) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#0F5132" />
        <Text style={styles.textoCentrado}>Cargando mapa…</Text>
        <TouchableOpacity onPress={onVolver} style={styles.btnTexto}>
          <Text style={styles.btnTextoText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Mapbox.MapView style={styles.mapa} onPress={manejarToque}>
        <Mapbox.Camera
          ref={camaraRef}
          defaultSettings={{
            centerCoordinate: [origen.lng, origen.lat],
            zoomLevel: 13,
          }}
          animationDuration={0}
        />

        <Mapbox.PointAnnotation
          id="origenProg"
          coordinate={[origen.lng, origen.lat]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <Marcador icono="🚏" estiloPunto={styles.marcadorOrigen} />
        </Mapbox.PointAnnotation>

        {destino ? (
          <Mapbox.PointAnnotation
            id="destinoProg"
            coordinate={[destino.lng, destino.lat]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <Marcador icono="🏁" estiloPunto={styles.marcadorDestino} />
          </Mapbox.PointAnnotation>
        ) : null}
      </Mapbox.MapView>

      {/* Buscador */}
      <View style={styles.buscador}>
        <TextInput
          style={styles.buscadorInput}
          placeholder="Busca tu destino: calle, lugar, distrito…"
          placeholderTextColor="#888"
          value={consulta}
          onChangeText={setConsulta}
        />
        {buscando ? <ActivityIndicator style={styles.buscadorCargando} color="#0F5132" /> : null}
        {sugerencias.map((s) => (
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

      {/* Panel inferior */}
                <View style={[styles.panel, { bottom: tecladoAlto, paddingBottom: 18 + (tecladoAlto ? 0 : insets.bottom) }]}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.panelTitulo}>
            {destino ? '📍 Destino elegido' : '🎯 Toca el mapa para elegir el destino'}
          </Text>
          {destino ? (
            <Text style={styles.dato} numberOfLines={2}>
              {buscandoDireccion
                ? 'Buscando dirección…'
                : (destino.lugar ?? 'Punto elegido en el mapa')}
            </Text>
          ) : null}

          {destino ? (
            <TextInput
              style={styles.input}
              placeholder="Detalle extra (opcional): ej. frente al parque"
              placeholderTextColor="#888"
              onChangeText={cambiarReferencia}
            />
          ) : null}

          <View style={styles.fila}>
            <TextInput
              style={[styles.input, styles.inputEtiqueta]}
              placeholder="Nombre (Casa, Universidad…)"
              placeholderTextColor="#888"
              value={etiqueta}
              onChangeText={setEtiqueta}
              maxLength={30}
            />
            <TextInput
              style={[styles.input, styles.inputHora]}
              placeholder="HH:MM"
              placeholderTextColor="#888"
              value={horaTxt}
              onChangeText={(t) => setHoraTxt(formatearHoraInput(t))}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>

            {horaTxt.length === 5 && !parseHora(horaTxt) ? (
            <Text style={styles.textoError}>Hora inválida: usa de 00:00 a 23:59</Text>
          ) : null}

          {error ? <Text style={styles.textoError}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.boton, !puedeGuardar && styles.botonDeshabilitado]}
            onPress={manejarGuardar}
            disabled={!puedeGuardar}
            activeOpacity={0.8}
          >
            {trabajando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botonTexto}>Guardar viaje programado</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.botonVolver} onPress={onVolver} activeOpacity={0.8}>
        <Text style={styles.botonVolverTexto}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}