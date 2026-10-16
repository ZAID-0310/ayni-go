import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '../../hooks/useLogin';
import { styles } from './LoginScreen.styles';

export default function LoginScreen({ rol, onLoginExitoso, onIrARegistro, onVolver }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    iniciarSesion
  } = useLogin({ rol, onLoginExitoso });

  const [verPassword, setVerPassword] = useState(false);
  const esChofer = rol === 'chofer';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Decoración superior */}
          <View style={styles.topDecoration} />

          {/* Encabezado y Logo */}
          <View style={styles.headerContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../../assets/logo-texto.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.titulo}>Ayni Go</Text>
            <Text style={styles.subtitulo}>
              {esChofer ? 'Ingreso de chofer' : 'Ingreso de pasajero'}
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
              style={styles.input}
              placeholder={esChofer ? 'tu.correo@gmail.com' : 'tu.correo@edu.pe'}
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="........"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!verPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setVerPassword(!verPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={verPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={iniciarSesion}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Opciones del Footer */}
          <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => Alert.alert('Recuperar contraseña', 'Función en desarrollo')}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={onIrARegistro}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ marginTop: 15 }} onPress={onVolver}>
              <Text style={styles.homeLink}>Cambiar tipo de cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* Decoración inferior */}
          <View style={styles.bottomDecorationContainer}>
            <View style={styles.bottomYellow} />
            <View style={styles.bottomOrange} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}