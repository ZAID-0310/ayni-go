import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { styles } from './BienvenidaScreen.styles';

export default function BienvenidaScreen({ onElegirRol }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topDecoration} />

        <Image
            source={require('../../../assets/logo-texto.png')}
            style={styles.logo}
            resizeMode="contain"
            />
        <Text style={styles.subtitulo}>¿Cómo quieres usar la app?</Text>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => onElegirRol('pasajero')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrimaryText}>Soy pasajero</Text>
          <Text style={styles.btnHint}>Estudiante con correo institucional</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => onElegirRol('chofer')}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>Soy chofer</Text>
          <Text style={styles.btnHint}>Requiere vehículo y documentos</Text>
        </TouchableOpacity>

        <View style={styles.bottomDecorationContainer}>
          <View style={styles.bottomYellow} />
          <View style={styles.bottomOrange} />
        </View>
      </View>
    </SafeAreaView>
  );
}