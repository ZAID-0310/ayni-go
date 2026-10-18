import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { styles } from './BienvenidaScreen.styles';

const SKYLINE = [28, 46, 34, 62, 40, 54, 30, 48, 36];
const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

export default function BienvenidaScreen({ onElegirRol }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Decoraciones superiores */}
        <View style={styles.topBlobA} />
        <View style={styles.topBlobB} />

        {/* Decoración inferior: ciudad y colinas */}
        <View style={styles.bottomDecorationContainer} pointerEvents="none">
          <View style={styles.skyline}>
            {SKYLINE.map((h, i) => (
              <View key={i} style={[styles.building, { height: h }]} />
            ))}
          </View>
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
        </View>

        {/* Logo y eslogan */}
        <View style={[styles.header, { paddingTop: STATUS_BAR + 28 }]}>
          <Image
            source={require('../../../assets/logo-texto.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
        </View>

        {/* Ilustración central */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../../assets/EstudiantePortada.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Botones de selección */}
        <View style={styles.actions}>
          <Text style={styles.subtitulo}>¿Cómo quieres usar la app?</Text>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => onElegirRol('pasajero')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>Soy pasajero</Text>
            <Text style={styles.btnHintLight}>Estudiante con correo institucional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => onElegirRol('chofer')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>Soy chofer</Text>
            <Text style={styles.btnHintDark}>Requiere vehículo y documentos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}