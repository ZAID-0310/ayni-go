import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, Image, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';

const VERDE = '#0F5132';

export default function ModalCalificar({ visible, pendientes, error, onCalificar, onCerrar }) {
  const [indice, setIndice] = useState(0);
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [hechos, setHechos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (visible) {
      setIndice(0);
      setEstrellas(0);
      setComentario('');
      setHechos([]);
    }
  }, [visible]);

  const persona = pendientes[indice];
  if (!persona) return null;

  const total = pendientes.length;
  const yaCalificado = hechos.includes(persona.usuario_id);

  const irA = (i) => {
    setIndice(i);
    setEstrellas(0);
    setComentario('');
  };

    const omitir = () => {
    if (indice < total - 1) irA(indice + 1);
    else onCerrar();
  };

  const confirmar = async () => {
    if (estrellas === 0 || enviando) return;
    setEnviando(true);
    const ok = await onCalificar(persona.usuario_id, estrellas, comentario.trim());
    setEnviando(false);
    if (!ok) return;
    setHechos((h) => [...h, persona.usuario_id]);
    if (indice < total - 1) irA(indice + 1);
    else onCerrar();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCerrar}>
      <View style={s.fondo}>
        <View style={s.panel}>
          <TouchableOpacity style={s.cerrar} onPress={onCerrar} hitSlop={12}>
            <Text style={s.cerrarTexto}>✕</Text>
          </TouchableOpacity>

          {total > 1 ? <Text style={s.contador}>{indice + 1} de {total}</Text> : null}

          <View style={s.filaPersona}>
            <TouchableOpacity
              onPress={() => irA(indice - 1)}
              disabled={indice === 0}
              style={[s.flecha, indice === 0 && s.flechaOff]}
            >
              <Text style={s.flechaTexto}>‹</Text>
            </TouchableOpacity>

            <View style={s.persona}>
              {persona.foto_url ? (
                <Image source={{ uri: persona.foto_url }} style={s.foto} />
              ) : (
                <View style={[s.foto, s.fotoVacia]}>
                  <Text style={s.inicial}>{(persona.nombre ?? '?').charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <Text style={s.nombre} numberOfLines={1}>{persona.nombre}</Text>
            </View>

            <TouchableOpacity
              onPress={() => irA(indice + 1)}
              disabled={indice >= total - 1}
              style={[s.flecha, indice >= total - 1 && s.flechaOff]}
            >
              <Text style={s.flechaTexto}>›</Text>
            </TouchableOpacity>
          </View>

          {yaCalificado ? (
            <Text style={s.hecho}>Ya calificaste a esta persona ✓</Text>
          ) : (
            <>
              <View style={s.estrellas}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setEstrellas(n)} hitSlop={6}>
                    <Text style={[s.estrella, n <= estrellas && s.estrellaOn]}>
                      {n <= estrellas ? '★' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={s.comentario}
                placeholder="Comentario (opcional)"
                value={comentario}
                onChangeText={setComentario}
                maxLength={200}
                multiline
              />

              {error ? <Text style={s.error}>{error}</Text> : null}

              <TouchableOpacity
                style={[s.boton, (estrellas === 0 || enviando) && s.botonOff]}
                onPress={confirmar}
                disabled={estrellas === 0 || enviando}
                activeOpacity={0.8}
              >
                <Text style={s.botonTexto}>Confirmar</Text>
              </TouchableOpacity>
                        </>
          )}

          <TouchableOpacity style={s.omitir} onPress={omitir} activeOpacity={0.7}>
            <Text style={s.omitirTexto}>
              {indice < total - 1 ? 'Omitir' : 'Omitir y cerrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  panel: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20 },
  cerrar: { position: 'absolute', top: 12, right: 14, zIndex: 2 },
  cerrarTexto: { fontSize: 20, color: '#555' },
  contador: { textAlign: 'center', color: '#777', fontSize: 13, marginBottom: 6 },
  filaPersona: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  persona: { flex: 1, alignItems: 'center' },
  foto: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E5E7EB' },
  fotoVacia: { alignItems: 'center', justifyContent: 'center' },
  inicial: { fontSize: 36, fontWeight: '800', color: '#6B7280' },
  nombre: { marginTop: 10, fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  flecha: { padding: 10 },
  flechaOff: { opacity: 0.2 },
  flechaTexto: { fontSize: 36, color: VERDE },
  estrellas: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
  estrella: { fontSize: 40, color: '#9CA3AF', marginHorizontal: 4 },
  estrellaOn: { color: '#F59E0B' },
  comentario: {
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12,
    padding: 10, minHeight: 64, textAlignVertical: 'top',
  },
  error: { color: '#B91C1C', marginTop: 8, textAlign: 'center' },
  boton: { backgroundColor: VERDE, borderRadius: 14, paddingVertical: 14, marginTop: 14, alignItems: 'center' },
  botonOff: { opacity: 0.4 },
  botonTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
omitir: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  omitirTexto: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
  hecho: { textAlign: 'center', color: VERDE, fontWeight: '700', marginVertical: 24 },
});