import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VERDE = '#0F5C3F';
const CREMA = '#FAF8F0';

const TIPOS = {
  exito: { icono: 'checkmark', color: VERDE, fondo: '#E4F1E8' },
  error: { icono: 'close', color: '#B42318', fondo: '#FDECEA' },
  aviso: { icono: 'alert', color: '#7A4E00', fondo: '#FDF3D6' },
  info: { icono: 'information', color: VERDE, fondo: '#E4F1E8' },
};

// Si no se indica el tipo, se deduce del título
const inferirTipo = (titulo = '') => {
  const t = titulo.toLowerCase();
  if (/listo|éxito|exito|correcto|enviado|guardado|bienvenid/.test(t)) return 'exito';
  if (/error|no se pudo|falló|fallo|inválido|invalido|incorrecto/.test(t)) return 'error';
  if (/permiso|atención|atencion|aviso|seguro|cancelar|eliminar|cerrar/.test(t)) return 'aviso';
  return 'info';
};

// API global: se puede llamar desde cualquier archivo, incluso desde hooks
let mostrarGlobal = null;

export const Alerta = {
  /**
   * Misma firma que Alert.alert(titulo, mensaje, botones)
   * Extra: opciones = { tipo: 'exito' | 'error' | 'aviso' | 'info' }
   */
  mostrar(titulo, mensaje, botones, opciones) {
    if (mostrarGlobal) mostrarGlobal({ titulo, mensaje, botones, opciones });
    else Alert.alert(titulo, mensaje, botones); // respaldo si aún no hay Provider
  },
};

export function AlertaProvider({ children }) {
  const [actual, setActual] = useState(null);
  const cola = useRef([]);
  const escala = useRef(new Animated.Value(0.9)).current;
  const opacidad = useRef(new Animated.Value(0)).current;

  const abrir = (item) => {
    setActual(item);
    escala.setValue(0.9);
    opacidad.setValue(0);
    Animated.parallel([
      Animated.timing(opacidad, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(escala, { toValue: 1, friction: 8, tension: 120, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    mostrarGlobal = (item) => {
      setActual((en) => {
        if (en) {
          cola.current.push(item);
          return en;
        }
        abrir(item);
        return item;
      });
    };
    return () => {
      mostrarGlobal = null;
    };
  }, []);

  const cerrar = (despues) => {
    Animated.timing(opacidad, {
      toValue: 0,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setActual(null);
      if (despues) despues();
      const siguiente = cola.current.shift();
      if (siguiente) setTimeout(() => abrir(siguiente), 60);
    });
  };

  const botones =
    actual?.botones && actual.botones.length > 0 ? actual.botones : [{ text: 'Entendido' }];
  const cancelable = actual?.opciones?.cancelable ?? botones.length === 1;
  const tipo = TIPOS[actual?.opciones?.tipo ?? inferirTipo(actual?.titulo)];
  const apilados = botones.length > 2;

  return (
    <>
      {children}
      <Modal
        visible={!!actual}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => cancelable && cerrar()}
      >
        <TouchableWithoutFeedback onPress={() => cancelable && cerrar()}>
          <Animated.View style={[estilos.fondo, { opacity: opacidad }]}>
            <TouchableWithoutFeedback>
              <Animated.View style={[estilos.tarjeta, { transform: [{ scale: escala }] }]}>
                <View style={[estilos.icono, { backgroundColor: tipo.fondo }]}>
                  <Ionicons name={tipo.icono} size={34} color={tipo.color} />
                </View>

                <Text style={estilos.titulo}>{actual?.titulo}</Text>
                {actual?.mensaje ? <Text style={estilos.mensaje}>{actual.mensaje}</Text> : null}

                <View style={[estilos.botones, apilados && { flexDirection: 'column' }]}>
                  {botones.map((b, i) => {
                    const cancel = b.style === 'cancel';
                    const peligro = b.style === 'destructive';
                    const principal = !cancel && (botones.length === 1 || i === botones.length - 1);
                    return (
                      <TouchableOpacity
                        key={`${b.text}-${i}`}
                        style={[
                          estilos.boton,
                          !apilados && { flex: 1 },
                          apilados && { alignSelf: 'stretch' },
                          principal && { backgroundColor: peligro ? '#B42318' : VERDE },
                          !principal && estilos.botonSecundario,
                          peligro && !principal && { borderColor: '#B42318' },
                        ]}
                        activeOpacity={0.85}
                        onPress={() => cerrar(b.onPress)}
                      >
                        <Text
                          style={[
                            estilos.botonTexto,
                            { color: principal ? '#FFFFFF' : peligro ? '#B42318' : VERDE },
                          ]}
                        >
                          {b.text}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(10,30,22,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: CREMA,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  icono: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A3D2B',
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 15,
    color: '#66756D',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    width: '100%',
  },
  boton: {
    minHeight: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  botonSecundario: { backgroundColor: 'transparent', borderColor: '#0F5C3F' },
  botonTexto: { fontSize: 15, fontWeight: '700' },
});