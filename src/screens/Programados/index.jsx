import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgramados, formatearHora, formatearHoraInput } from '../../hooks/useProgramados';
import { styles } from './ProgramadosScreen.styles';

const ETIQUETA_ESTADO = {
  pendiente: 'Buscando chofer',
  aceptado: 'Chofer asignado',
  en_curso: 'En viaje',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
};

export default function ProgramadosScreen({ onVolver, onIrAlViaje, onNuevo }) {
    const { lista, cargando, trabajando, activar, cambiarHora, cancelar, eliminar } = useProgramados();

  // Qué tarjeta tiene el campo de hora abierto, y para qué
    const insets = useSafeAreaInsets();
  const [editando, setEditando] = useState(null); // { id, modo: 'activar' | 'cambiar' }
  const [horaTxt, setHoraTxt] = useState('');

  const confirmarEliminar = (p) => {
    Alert.alert('Eliminar', `¿Eliminar "${p.etiqueta}"? No se puede deshacer.`, [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, eliminar', style: 'destructive', onPress: () => eliminar(p.id) },
    ]);
  };

  const abrirHora = (id, modo) => {
    setEditando({ id, modo });
    setHoraTxt('');
  };

  const confirmarHora = async () => {
    if (!editando) return;
    const ok =
      editando.modo === 'activar'
        ? await activar(editando.id, horaTxt)
        : await cambiarHora(editando.id, horaTxt);
    if (ok) setEditando(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
                <TouchableOpacity onPress={onVolver} style={styles.btnVolver} hitSlop={{ top: 10, bottom: 10, left: 10, right: 20 }}>
          <Text style={styles.btnVolverText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Viajes programados</Text>
      </View>

            <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}>
        {onNuevo && (
          <TouchableOpacity style={styles.btnPrincipal} onPress={onNuevo} activeOpacity={0.8}>
            <Text style={styles.btnPrincipalText}>+ Nuevo destino programado</Text>
          </TouchableOpacity>
        )}

                {cargando && <ActivityIndicator style={styles.cargando} color="#0F5132" />}

        {!cargando && lista.length === 0 && (
          <Text style={styles.vacio}>Aún no tienes viajes programados.</Text>
        )}

        {lista.map((p) => {
          const activo = ['pendiente', 'aceptado', 'en_curso'].includes(p.estado);
          const abierto = editando?.id === p.id;

          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.etiqueta}>{p.etiqueta}</Text>
                <View style={[styles.badge, styles['badge_' + p.estado]]}>
                  <Text style={[styles.badgeText, p.estado === 'en_curso' && { color: '#FFFFFF' }]}>
                    {ETIQUETA_ESTADO[p.estado] || p.estado}
                  </Text>
                </View>
              </View>

              <Text style={styles.direccion} numberOfLines={2}>
                {p.destino?.direccion || 'Destino sin nombre'}
              </Text>
              <Text style={styles.hora}>Sale: {formatearHora(p.hora_salida)}</Text>

              {p.chofer && (
                <Text style={styles.chofer}>
                  {p.chofer.nombre} · {p.chofer.placa} · {p.chofer.modelo}
                </Text>
              )}
              {p.estado === 'aceptado' && p.capacidad != null && (
                <Text style={styles.asientos}>
                  Asientos en esa franja: {p.ocupados} de {p.capacidad}
                </Text>
              )}

              {abierto && (
                <View style={styles.horaBox}>
                  <TextInput
                    style={styles.input}
                    value={horaTxt}
                    onChangeText={(t) => setHoraTxt(formatearHoraInput(t))}
                    placeholder="HH:MM (ej. 07:30)"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                  <TouchableOpacity
                    style={styles.btnPrincipalChico}
                    onPress={confirmarHora}
                    disabled={trabajando}
                  >
                    <Text style={styles.btnPrincipalText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnTexto} onPress={() => setEditando(null)}>
                    <Text style={styles.btnTextoText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!abierto && (
                <View style={styles.acciones}>
                  {p.estado === 'en_curso' && (
                    <TouchableOpacity style={styles.btnPrincipalChico} onPress={onIrAlViaje}>
                      <Text style={styles.btnPrincipalText}>Ver mi viaje</Text>
                    </TouchableOpacity>
                  )}
                  {p.estado === 'pendiente' && (
                    <TouchableOpacity
                      style={styles.btnOutline}
                      onPress={() => abrirHora(p.id, 'cambiar')}
                    >
                      <Text style={styles.btnOutlineText}>Cambiar hora</Text>
                    </TouchableOpacity>
                  )}
                  {(p.estado === 'vencido' || p.estado === 'cancelado') && (
                    <TouchableOpacity
                      style={styles.btnPrincipalChico}
                      onPress={() => abrirHora(p.id, 'activar')}
                    >
                      <Text style={styles.btnPrincipalText}>Activar</Text>
                    </TouchableOpacity>
                  )}

                    {(p.estado === 'vencido' || p.estado === 'cancelado') && (
                    <TouchableOpacity
                      style={styles.btnOutline}
                      onPress={() => confirmarEliminar(p)}
                      disabled={trabajando}
                    >
                      <Text style={styles.btnOutlineText}>Eliminar</Text>
                    </TouchableOpacity>
                  )}
                  {activo && p.estado !== 'en_curso' && (
                    <TouchableOpacity
                      style={styles.btnOutline}
                      onPress={() => cancelar(p.id)}
                      disabled={trabajando}
                    >
                      <Text style={styles.btnOutlineText}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}