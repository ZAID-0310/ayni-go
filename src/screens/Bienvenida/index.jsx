import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './BienvenidaScreen.styles';

const SKYLINE = [28, 46, 34, 62, 40, 54, 30, 48, 36];
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const PERILLA = 40; // diámetro de la perilla
const VERDE = '#0F5132';

function BotonRol({ titulo, hint, textoCarga, icono, activo, cargando, progreso, onPress }) {
  const [ancho, setAncho] = useState(0);
  const corriendo = activo && cargando;

  // Relleno claro que entra desde la izquierda
  const rellenoX = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: [-ancho, 0],
  });

  // Perilla que viaja en la punta del relleno
  const perillaX = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: [6, Math.max(ancho - PERILLA - 6, 6)],
  });

  const opacidadNormal = progreso.interpolate({
    inputRange: [0, 0.12],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const opacidadCarga = progreso.interpolate({
    inputRange: [0.08, 0.2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <TouchableOpacity
      style={[
        styles.btnBase,
        activo ? styles.btnActivo : styles.btnInactivo,
        cargando && !activo && { opacity: 0.4 },
      ]}
      onPress={onPress}
      disabled={cargando}
      activeOpacity={0.85}
      onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
    >
      {/* Relleno de progreso */}
      {corriendo ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.relleno, { width: ancho, transform: [{ translateX: rellenoX }] }]}
        />
      ) : null}

      {/* Texto normal */}
      <Animated.View style={{ alignItems: 'center', opacity: corriendo ? opacidadNormal : 1 }}>
        <Text style={[styles.btnTexto, activo ? styles.textoActivo : styles.textoInactivo]}>
          {titulo}
        </Text>
        <Text style={activo ? styles.hintActivo : styles.hintInactivo}>{hint}</Text>
      </Animated.View>

      {/* Texto de carga */}
      {corriendo ? (
        <Animated.View style={[styles.capaCentro, { opacity: opacidadCarga }]} pointerEvents="none">
          <Text style={styles.textoCarga}>{textoCarga}</Text>
        </Animated.View>
      ) : null}

      {/* Perilla con ícono */}
      {corriendo ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.perilla, { opacity: opacidadCarga, transform: [{ translateX: perillaX }] }]}
        >
          <Ionicons name={icono} size={22} color={VERDE} />
        </Animated.View>
      ) : null}
    </TouchableOpacity>
  );
}

export default function BienvenidaScreen({ onElegirRol }) {
  const [rolActivo, setRolActivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => () => progreso.stopAnimation(), [progreso]);

  const elegir = (rol) => {
    if (cargando) return;
    setRolActivo(rol);
    setCargando(true);
    progreso.setValue(0);

    Animated.timing(progreso, {
      toValue: 1,
      duration: 1400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onElegirRol(rol);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBlobA} />
        <View style={styles.topBlobB} />

        <View style={styles.bottomDecorationContainer} pointerEvents="none">
          <View style={styles.skyline}>
            {SKYLINE.map((h, i) => (
              <View key={i} style={[styles.building, { height: h }]} />
            ))}
          </View>
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
        </View>

        <View style={[styles.header, { paddingTop: STATUS_BAR + 28 }]}>
          <Image
            source={require('../../../assets/logo-texto.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../assets/EstudiantePortada.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.actions}>
          <Text style={styles.subtitulo}>¿Cómo quieres usar la app?</Text>

          <BotonRol
            titulo="Soy pasajero"
            hint="Estudiante con correo institucional"
            textoCarga="Ingresando como pasajero…"
            icono="walk"
            activo={rolActivo === 'pasajero'}
            cargando={cargando}
            progreso={progreso}
            onPress={() => elegir('pasajero')}
          />

          <BotonRol
            titulo="Soy chofer"
            hint="Requiere vehículo y documentos"
            textoCarga="Ingresando como chofer…"
            icono="car-sport"
            activo={rolActivo === 'chofer'}
            cargando={cargando}
            progreso={progreso}
            onPress={() => elegir('chofer')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}