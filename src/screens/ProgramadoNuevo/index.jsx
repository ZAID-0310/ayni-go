import React, { useEffect, useRef, useState } from 'react';import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Modal,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useElegirDestino } from '../../hooks/useElegirDestino';
import { useProgramados, formatearHoraInput, parseHora } from '../../hooks/useProgramados';
import { styles } from './ProgramadoNuevoScreen.styles';
import PinInicio from '../../components/PinInicio';
import PinFin from '../../components/PinFin';
import SelectorFechaHora from '../../components/SelectorFechaHora';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN);

function Marcador({ icono, estiloPunto }) {
  return (
    <View style={{ alignItems: 'center', width: 40 }}>
      <Text style={{ fontSize: 22, lineHeight: 28 }}>{icono}</Text>
      <View style={estiloPunto} />
    </View>
  );
}

export default function ProgramadoNuevoScreen({ onVolver, onGuardado, viaje }) {
  // Modo editar: la dirección guardada es "calle — referencia", se separa en dos
  const partes = (viaje?.destino?.direccion ?? '').split(' — ');
  const destinoInicial = viaje
    ? {
        lat: viaje.destino.lat,
        lng: viaje.destino.lng,
        lugar: partes[0] || null,
        direccion: partes.slice(1).join(' — ') || null,
      }
    : null;
  // Fecha y hora guardadas, en hora de Lima
  const valorViaje = viaje
    ? (() => {
        const d = new Date(new Date(viaje.hora_salida).getTime() - 5 * 3600 * 1000);
        return {
          fecha: d.toISOString().slice(0, 10),
          horaTxt: `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`,
        };
      })()
    : null;
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
    } = useElegirDestino(destinoInicial);

  const { guardar, actualizar, trabajando } = useProgramados();

  const insets = useSafeAreaInsets();
  const camaraRef = useRef(null);
  const [etiqueta, setEtiqueta] = useState(viaje?.etiqueta ?? '');
  const [horaTxt, setHoraTxt] = useState(valorViaje?.horaTxt ?? '');
  const [fecha, setFecha] = useState(valorViaje?.fecha ?? null);
  const [comentario, setComentario] = useState(viaje?.comentario ?? '');
  const [tecladoAlto, setTecladoAlto] = useState(0);
  const [paso, setPaso] = useState(viaje ? 2 : 1);
  const [modalExtra, setModalExtra] = useState(false);
  const [referencia, setReferencia] = useState(destinoInicial?.direccion ?? '');

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
    if (paso !== 1) return;
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
        const datos = {
      lat: destino.lat,
      lng: destino.lng,
      direccion: direccionFinal,
      etiqueta: etiqueta.trim(),
      horaTxt,
      comentario,
      fecha,
    };
    const ok = viaje ? await actualizar({ id: viaje.id, ...datos }) : await guardar(datos);
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

  

    if (paso === 2) {
    const tarjeta = {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    };
    const tituloTarjeta = {
      fontSize: 13,
      fontWeight: '700',
      color: '#0F5132',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    };
    const etiquetaCampo = {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 6,
    };
    const inputLocal = {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      backgroundColor: '#FAFAFA',
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: '#222',
      marginBottom: 14,
    };

    return (
      <View style={{ flex: 1, backgroundColor: '#F4F6F5' }}>
        {/* Cabecera */}
        <View
          style={{
            paddingTop: insets.top + 12,
            paddingHorizontal: 20,
            paddingBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#EEE',
          }}
        >
          <TouchableOpacity onPress={() => setPaso(1)} activeOpacity={0.8} style={{ paddingRight: 12 }}>
            <Text style={{ fontSize: 22, color: '#0F5132' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F5132' }}>
            {viaje ? 'Editar viaje' : 'Viaje programado'}
          </Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        >
          {/* Ruta */}
          <View style={tarjeta}>
            <Text style={tituloTarjeta}>Ruta</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 24, alignItems: 'center' }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#0F5132' }} />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={etiquetaCampo}>Partida</Text>
                <Text style={{ fontSize: 15, color: '#222' }} numberOfLines={2}>
                  Mi ubicación actual
                </Text>
              </View>
            </View>

            <View style={{ marginLeft: 11, width: 2, height: 22, backgroundColor: '#D5DBD8', marginVertical: 6 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 24, alignItems: 'center' }}>
                <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#C62828' }} />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={etiquetaCampo}>Destino</Text>
                <Text style={{ fontSize: 15, color: '#222' }} numberOfLines={2}>
                  {buscandoDireccion
                    ? 'Buscando dirección…'
                    : (destino?.lugar ?? 'Punto elegido en el mapa')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPaso(1)}
                activeOpacity={0.8}
                style={{
                  marginLeft: 8,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#E7F1EC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20 }}>🗺️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Detalles */}
                    {/* Detalles */}
          <View style={tarjeta}>
            <Text style={tituloTarjeta}>Detalles</Text>

            <Text style={etiquetaCampo}>Nombre del viaje</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[inputLocal, { flex: 1, marginBottom: 0 }]}
                placeholder="Casa, Universidad…"
                placeholderTextColor="#999"
                value={etiqueta}
                onChangeText={setEtiqueta}
                maxLength={30}
              />
              <TouchableOpacity
                onPress={() => setModalExtra(true)}
                activeOpacity={0.8}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E7F1EC',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 22 }}>📝</Text>
                {referencia.trim() || comentario.trim() ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#C62828',
                    }}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>

          {/* Horario */}
          <View style={tarjeta}>
            <Text style={tituloTarjeta}>¿Cuándo sales?</Text>
            <SelectorFechaHora
              valorInicial={fecha && horaTxt ? { fecha, horaTxt } : valorViaje}
              onChange={({ fecha: f, horaTxt: h }) => {
                setFecha(f);
                setHoraTxt(h);
              }}
            />
          </View>
        </ScrollView>

        {/* Botón fijo abajo */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#EEE',
          }}
        >
          {error ? <Text style={[styles.textoError, { marginBottom: 8 }]}>{error}</Text> : null}
                    <TouchableOpacity
            style={[styles.boton, !puedeGuardar && styles.botonDeshabilitado]}
            onPress={manejarGuardar}
            disabled={!puedeGuardar}
            activeOpacity={0.8}
          >
            {trabajando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.botonTexto}>{viaje ? 'Guardar cambios' : 'Guardar viaje programado'}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Modal: referencia y comentario */}
        <Modal
          visible={modalExtra}
          transparent
          animationType="slide"
          onRequestClose={() => setModalExtra(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setModalExtra(false)} />
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                paddingBottom: insets.bottom + 20,
                marginBottom: tecladoAlto,
              }}
            >
              <Text style={tituloTarjeta}>Más detalles</Text>

              <Text style={etiquetaCampo}>Referencia (opcional)</Text>
              <TextInput
                style={inputLocal}
                placeholder="Ej. frente al parque"
                placeholderTextColor="#999"
                value={referencia}
                onChangeText={(t) => {
                  setReferencia(t);
                  cambiarReferencia(t);
                }}
              />

              <Text style={etiquetaCampo}>Comentario para el chofer (opcional)</Text>
              <TextInput
                style={inputLocal}
                placeholder="Ej. llevo equipaje"
                placeholderTextColor="#999"
                value={comentario}
                onChangeText={setComentario}
                maxLength={200}
              />

              <TouchableOpacity
                style={styles.boton}
                onPress={() => setModalExtra(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.botonTexto}>Listo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  return (
    <View style={styles.contenedor}>
      <Mapbox.MapView style={styles.mapa} onPress={manejarToque}>
        <Mapbox.Camera
          ref={camaraRef}
          defaultSettings={{
            centerCoordinate: destino ? [destino.lng, destino.lat] : [origen.lng, origen.lat],
            zoomLevel: destino ? 15 : 13,
          }}
          animationDuration={0}
        />

        <Mapbox.PointAnnotation
          id="origenProg"
          coordinate={[origen.lng, origen.lat]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <PinInicio />
        </Mapbox.PointAnnotation>

        {destino ? (
          <Mapbox.PointAnnotation
            id="destinoProg"
            coordinate={[destino.lng, destino.lat]}
            anchor={{ x: 0.5, y: 1 }}
          >
            <PinFin />
          </Mapbox.PointAnnotation>
        ) : null}
      </Mapbox.MapView>

      {/* Buscador */}
      {paso === 1 ? (
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
      ) : null}

      {/* Panel inferior */}
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
          <TouchableOpacity
            style={[styles.boton, (!destino || buscandoDireccion) && styles.botonDeshabilitado]}
            onPress={() => setPaso(2)}
            disabled={!destino || buscandoDireccion}
            activeOpacity={0.8}
          >
            <Text style={styles.botonTexto}>Confirmar ubicación</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.botonVolver} onPress={() => (paso === 2 ? setPaso(1) : onVolver())} activeOpacity={0.8}>
        <Text style={styles.botonVolverTexto}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}