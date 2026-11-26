import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useObjetosPerdidos } from '../../hooks/useObjetosPerdidos';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const formatoFecha = (valor) => {
  if (!valor) return '';
  const d = new Date(valor);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${mi}`;
};

export default function ObjetosPerdidosScreen({ onVolver }) {
  const { viajes, cargando, error, cargar, enviando, enviar } = useObjetosPerdidos();
  const [salaId, setSalaId] = useState(null);
  const [objeto, setObjeto] = useState('');
  const [detalles, setDetalles] = useState('');
  const [telefono, setTelefono] = useState('');
  const [autoriza, setAutoriza] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [paso, setPaso] = useState(1); // 1 = elegir viaje, 2 = formulario
  const viajeElegido = viajes.find((v) => v.sala_id === salaId);

  const digitos = telefono.replace(/[^0-9]/g, '');
  const puedeEnviar =
    !!salaId && objeto.trim().length > 0 && digitos.length >= 6 && autoriza && !enviando;

  const manejarEnviar = async () => {
    setErrorForm(null);
    const r = await enviar({
      salaId,
      objeto: objeto.trim(),
      detalles: detalles.trim() || null,
      telefono: telefono.trim(),
      autoriza,
    });
    if (r.ok) setEnviado(true);
    else setErrorForm(r.mensaje);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: STATUS_BAR + 8 }]}>
        <TouchableOpacity
            onPress={paso === 2 && !enviado ? () => setPaso(1) : onVolver}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color={VERDE} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Reportar objeto perdido</Text>
        <View style={{ width: 26 }} />
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={VERDE} />
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Text style={styles.vacio}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={cargar} activeOpacity={0.8}>
            <Text style={styles.btnTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : enviado ? (
        <View style={styles.centro}>
          <Ionicons name="checkmark-circle" size={64} color={VERDE} />
          <Text style={styles.exitoTitulo}>Reporte enviado</Text>
          <Text style={styles.exitoTexto}>
            El equipo de Ayni Go lo revisará y se pondrá en contacto con el chofer para que se
            comunique contigo.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={onVolver} activeOpacity={0.8}>
            <Text style={styles.btnTexto}>Listo</Text>
          </TouchableOpacity>
        </View>
      ) : viajes.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.vacio}>
            Aún no tienes viajes finalizados. Puedes reportar un objeto cuando termine un viaje.
          </Text>
        </View>
      ) : (
        <ScrollView
        key={paso}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {paso === 1 ? (
            <>
          <Text style={styles.seccion}>¿EN QUÉ VIAJE LO PERDISTE?</Text>
          {viajes.map((v) => {
            const activo = v.sala_id === salaId;
            return (
              <TouchableOpacity
                key={v.sala_id}
                style={[styles.viaje, activo && styles.viajeActivo]}
                onPress={() => setSalaId(v.sala_id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={activo ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={VERDE}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.viajeFecha}>{formatoFecha(v.fecha)}</Text>
                  <Text style={styles.viajeDestino} numberOfLines={2}>
                    {v.destino || 'Destino sin dirección'}
                  </Text>
                  {v.chofer_nombre ? (
                    <Text style={styles.viajeChofer}>Chofer: {v.chofer_nombre}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}

        </>
          ) : (
            <>
          {viajeElegido ? (
            <View style={[styles.viaje, styles.viajeActivo]}>
              <Ionicons name="car-outline" size={22} color={VERDE} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.viajeFecha}>{formatoFecha(viajeElegido.fecha)}</Text>
                <Text style={styles.viajeDestino} numberOfLines={2}>
                  {viajeElegido.destino || 'Destino sin dirección'}
                </Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.seccion}>¿QUÉ PERDISTE?</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. mochila negra, audífonos, billetera"
            placeholderTextColor="#888"
            value={objeto}
            onChangeText={setObjeto}
            maxLength={200}
          />

          <Text style={styles.seccion}>DETALLES PARA RECONOCERLO (OPCIONAL)</Text>
          <TextInput
            style={[styles.input, styles.inputGrande]}
            placeholder="Color, marca, dónde lo dejaste (asiento, maletera…)"
            placeholderTextColor="#888"
            value={detalles}
            onChangeText={setDetalles}
            maxLength={500}
            multiline
          />

          <Text style={styles.seccion}>TU TELÉFONO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 987654321"
            placeholderTextColor="#888"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            maxLength={20}
          />

          <TouchableOpacity
            style={styles.autoriza}
            onPress={() => setAutoriza((a) => !a)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={autoriza ? 'checkbox' : 'square-outline'}
              size={26}
              color={VERDE}
            />
            <Text style={styles.autorizaTexto}>
              Autorizo que Ayni Go entregue mi número de teléfono al chofer para que se
              comunique conmigo sobre este objeto.
            </Text>
          </TouchableOpacity>

          {errorForm ? <Text style={styles.error}>{errorForm}</Text> : null}

          <TouchableOpacity
            style={[styles.btn, styles.btnAncho, !puedeEnviar && styles.btnDeshabilitado]}
            onPress={manejarEnviar}
            disabled={!puedeEnviar}
            activeOpacity={0.8}
          >
            {enviando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnTexto}>Enviar reporte</Text>
            )}
          </TouchableOpacity>
        </>
          )}
        </ScrollView>
      )}
          {!cargando && !error && !enviado && paso === 1 && !!salaId ? (
        <View style={styles.flotante}>
          <TouchableOpacity
            style={[styles.btn, styles.btnAncho, { marginTop: 0 }]}
            onPress={() => setPaso(2)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTexto}>Continuar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREMA },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  headerTitulo: { fontSize: 18, fontWeight: '800', color: VERDE },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  contenido: { padding: 18, paddingBottom: 120 },
  seccion: { fontSize: 12, fontWeight: '700', color: VERDE, marginTop: 18, marginBottom: 8 },
  viaje: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  viajeActivo: { borderColor: VERDE, backgroundColor: VERDE_SUAVE },
  viajeFecha: { fontSize: 13, color: '#666' },
  viajeDestino: { fontSize: 15, fontWeight: '600', color: '#222', marginTop: 2 },
  viajeChofer: { fontSize: 13, color: VERDE, marginTop: 2 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },
  inputGrande: { minHeight: 90, textAlignVertical: 'top' },
  autoriza: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 20,
    backgroundColor: VERDE_SUAVE,
    borderRadius: 14,
    padding: 14,
  },
  autorizaTexto: { flex: 1, fontSize: 14, color: VERDE },
  error: { color: '#B91C1C', fontSize: 14, marginTop: 14 },
  vacio: { textAlign: 'center', color: '#666', fontSize: 15 },
  exitoTitulo: { fontSize: 22, fontWeight: '800', color: VERDE, marginTop: 12 },
  exitoTexto: { textAlign: 'center', color: '#444', fontSize: 15, marginTop: 8 },
  btn: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  btnAncho: { alignSelf: 'stretch' },
  btnDeshabilitado: { opacity: 0.45 },
    btnTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  flotante: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});