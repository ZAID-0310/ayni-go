import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Animated
} from 'react-native';
import { useSalasChofer } from '../../hooks/useSalasChofer';
import styles from './SalasChoferScreen.styles';

const TEXTO_ESTADO = {
  abierta_con_chofer: 'Sala abierta, sumando pasajeros',
  en_curso: 'Viaje en curso',
};

const km = (m) => (Number(m ?? 0) / 1000).toFixed(1);

const mmss = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

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

  // ---------- Con sala: candidatos para sumar ----------
  if (viaje) {
    const libres = viaje.capacidad - viaje.pasajeros;
    const ventanaAbierta = segundosRestantes != null && segundosRestantes > 0;
    const paradas = viaje.paradas ?? [];

    return (
      <SafeAreaView style={styles.safeArea}>
        <Decoraciones />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contenido}
          showsVerticalScrollIndicator={false}
        >
          <Cabecera onVolver={onVolver} titulo="Tu viaje" />

          {/* Estado */}
          <View style={styles.estadoPildora}>
            <PuntoEstado color="#16A34A" pulsar={viaje.estado === 'abierta_con_chofer'} />
            <Text style={styles.estadoPildoraTexto}>
              {TEXTO_ESTADO[viaje.estado] ?? viaje.estado}
            </Text>
          </View>

          {/* Cupos y tiempo */}
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
          </View>

          {/* Paradas */}
          {paradas.length > 0 ? (
            <>
              <Text style={styles.subtitulo}>Paradas</Text>
              <View style={styles.card}>
                {paradas.map((p, i) => (
                  <View key={i} style={styles.paradaFila}>
                    <View style={styles.paradaIzquierda}>
                      <View style={styles.paradaNumero}>
                        <Text style={styles.paradaNumeroTexto}>{i + 1}</Text>
                      </View>
                      {i < paradas.length - 1 ? <View style={styles.paradaLinea} /> : null}
                    </View>
                    <View style={styles.paradaInfo}>
                      <Text style={styles.paradaTitulo}>{p.direccion || 'Sin referencia'}</Text>
                      <Text style={styles.paradaNombre}>{p.nombre}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {mensajeError ? <Text style={styles.textoError}>{mensajeError}</Text> : null}
                    {avisoUbicacion ? <Text style={styles.textoError}>{avisoUbicacion}</Text> : null}
          {/* Candidatos */}
          {ventanaAbierta && libres > 0 ? (
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