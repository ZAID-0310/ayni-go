import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSalasChofer } from '../../hooks/useSalasChofer';
import styles from './SalasChoferScreen.styles';

const TEXTO_ESTADO = {
  abierta_con_chofer: 'Sala abierta, sumando pasajeros',
  en_curso: 'Viaje en curso',
};

const km = (m) => (Number(m ?? 0) / 1000).toFixed(1);

const mmss = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

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
    aceptarSala,
    rechazarSala,
    aprobarCandidato,
    descartarCandidato,
  } = useSalasChofer();

  if (cargandoInicial) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const mensajeError = errorAccion ?? errorLista;

  // ---------- Con sala: candidatos para sumar ----------
  if (viaje) {
    const libres = viaje.capacidad - viaje.pasajeros;
    const ventanaAbierta = segundosRestantes != null && segundosRestantes > 0;

    return (
      <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
        <TouchableOpacity onPress={onVolver}>
          <Text style={styles.volver}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Tu viaje</Text>
        <Text style={styles.estado}>{TEXTO_ESTADO[viaje.estado] ?? viaje.estado}</Text>
        <Text style={styles.dato}>
          Cupos: {viaje.pasajeros} ocupados, {libres} libres
        </Text>

        {viaje.estado === 'abierta_con_chofer' && segundosRestantes != null ? (
          <Text style={styles.dato}>
            {ventanaAbierta
              ? `Tiempo para sumar pasajeros: ${mmss(segundosRestantes)}`
              : 'La ventana para sumar pasajeros terminó'}
          </Text>
        ) : null}

        <Text style={styles.subtitulo}>Paradas</Text>
        {(viaje.paradas ?? []).map((p, i) => (
          <View key={i} style={styles.tarjeta}>
            <Text style={styles.tarjetaTitulo}>{p.direccion || 'Sin referencia'}</Text>
            <Text style={styles.dato}>{p.nombre}</Text>
          </View>
        ))}

        {mensajeError ? <Text style={styles.textoError}>{mensajeError}</Text> : null}

        {ventanaAbierta && libres > 0 ? (
          <>
            <Text style={styles.subtitulo}>Pasajeros en tu ruta</Text>
            {candidatos.length === 0 ? (
              <Text style={styles.dato}>Buscando pasajeros cerca de tu ruta…</Text>
            ) : null}
            {candidatos.map((c) => (
              <View key={c.solicitud_id} style={styles.tarjeta}>
                <Text style={styles.tarjetaTitulo}>{c.direccion || 'Sin referencia'}</Text>
                <Text style={styles.dato}>
                  A {km(c.distancia_al_origen_m)} km del punto de partida
                </Text>
                <View style={styles.filaBotones}>
                  <TouchableOpacity
                    style={[styles.botonMitad, styles.botonNeutro]}
                    onPress={() => descartarCandidato(c.solicitud_id)}
                    disabled={procesando}
                  >
                    <Text style={styles.botonNeutroTexto}>Descartar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.botonMitad, styles.boton]}
                    onPress={() => aprobarCandidato(c.solicitud_id)}
                    disabled={procesando}
                  >
                    <Text style={styles.botonTexto}>Aprobar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : null}
      </ScrollView>
    );
  }

  // ---------- Sin sala: solicitudes que puede aceptar ----------
  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <TouchableOpacity onPress={onVolver}>
        <Text style={styles.volver}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Solicitudes</Text>

      {mensajeError ? <Text style={styles.textoError}>{mensajeError}</Text> : null}

      {!mensajeError && solicitudes.length === 0 ? (
        <Text style={styles.dato}>No hay solicitudes por ahora. Se actualiza solo.</Text>
      ) : null}

      {solicitudes.map((s) => {
        const destino = s.destinos?.[0];
        return (
          <View key={s.sala_id} style={styles.tarjeta}>
            <Text style={styles.tarjetaTitulo}>{destino?.direccion || 'Sin referencia'}</Text>
            <Text style={styles.dato}>A {km(s.distancia_max_m)} km del punto de partida</Text>
            <View style={styles.filaBotones}>
              <TouchableOpacity
                style={[styles.botonMitad, styles.botonNeutro]}
                onPress={() => rechazarSala(s.sala_id)}
                disabled={procesando}
              >
                <Text style={styles.botonNeutroTexto}>Descartar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botonMitad, styles.boton]}
                onPress={() => aceptarSala(s.sala_id)}
                disabled={procesando}
              >
                <Text style={styles.botonTexto}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}