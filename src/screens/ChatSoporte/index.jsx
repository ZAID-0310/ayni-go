import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
FlatList,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useChatSoporte from '../../hooks/useChatSoporte';
import { FAQ } from '../../constants/faq';

const VERDE = '#0F5132';
const CREMA = '#FAF7EE';
const VERDE_SUAVE = '#DCEBDD';
const ROJO = '#B42318';
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

const hora = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};

export default function ChatSoporteScreen({ onVolver }) {
  const { mensajes, cargando, enviando, error, enviar } = useChatSoporte();
  const [texto, setTexto] = useState('');
  const lista = useRef(null);

  useEffect(() => {
    if (mensajes.length > 0) {
      setTimeout(() => lista.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [mensajes.length]);

    const manejarPregunta = async (pregunta, id) => {
    if (enviando) return;
    await enviar(pregunta, id);
  };

  const manejarEnviar = async () => {
    if (!texto.trim() || enviando) return;
    const copia = texto;
    setTexto('');
    const ok = await enviar(copia);
    if (!ok) setTexto(copia);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: STATUS_BAR + 8 }]}>
        <TouchableOpacity
          onPress={onVolver}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color={VERDE} />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Soporte Ayni Go</Text>
        <View style={{ width: 26 }} />
      </View>

            <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContenido}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={[styles.chip, styles.chipAsesor]}
          onPress={() => manejarPregunta('Quiero hablar con un asesor', 'asesor')}
          activeOpacity={0.8}
        >
          <Text style={[styles.chipTexto, { color: '#FFF' }]}>Hablar con un asesor</Text>
        </TouchableOpacity>
        {FAQ.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={styles.chip}
            onPress={() => manejarPregunta(f.pregunta, f.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.chipTexto}>{f.pregunta}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {cargando ? (
          <ActivityIndicator size="large" color={VERDE} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            ref={lista}
            data={mensajes}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.listaContenido}
            ListEmptyComponent={
              <Text style={styles.vacio}>
                Escríbenos tu consulta y el equipo de Ayni Go te responderá aquí.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={[styles.burbuja, item.de_admin ? styles.burbujaAdmin : styles.burbujaYo]}>
                {item.de_admin && <Text style={styles.quien}>Soporte</Text>}
                <Text style={[styles.mensaje, !item.de_admin && { color: '#FFF' }]}>{item.texto}</Text>
                <Text style={[styles.hora, !item.de_admin && { color: '#CFE3D6' }]}>
                  {hora(item.creado_en)}
                </Text>
              </View>
            )}
          />
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.barra}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje"
            placeholderTextColor="#999"
            value={texto}
            onChangeText={setTexto}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.enviar, (!texto.trim() || enviando) && { opacity: 0.5 }]}
            onPress={manejarEnviar}
            disabled={!texto.trim() || enviando}
            activeOpacity={0.8}
          >
            {enviando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    chips: { flexGrow: 0 },
  chipsContenido: { paddingHorizontal: 14, paddingBottom: 8 },
  chip: {
    backgroundColor: VERDE_SUAVE,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipAsesor: { backgroundColor: VERDE },
  chipTexto: { color: VERDE, fontSize: 13, fontWeight: '700' },
  listaContenido: { padding: 14, paddingBottom: 8, flexGrow: 1 },
  vacio: { textAlign: 'center', color: '#666', fontSize: 14, marginTop: 30, paddingHorizontal: 20 },
  burbuja: { maxWidth: '80%', borderRadius: 16, padding: 10, marginBottom: 8 },
  burbujaYo: { alignSelf: 'flex-end', backgroundColor: VERDE, borderBottomRightRadius: 4 },
  burbujaAdmin: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4 },
  quien: { fontSize: 11, fontWeight: '800', color: VERDE, marginBottom: 2 },
  mensaje: { fontSize: 15, color: '#222' },
  hora: { fontSize: 11, color: '#999', marginTop: 4, alignSelf: 'flex-end' },
  error: { color: ROJO, fontSize: 12, textAlign: 'center', paddingHorizontal: 14, paddingBottom: 4 },
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: CREMA,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 110,
    fontSize: 15,
    color: '#222',
  },
  enviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});