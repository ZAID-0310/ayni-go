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
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '../../hooks/useLogin';
import { styles } from './LoginScreen.styles';

const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
const GREEN = '#0F5132';

export default function LoginScreen({ rol, onLoginExitoso, onIrARegistro, onIrARecuperar, onVolver }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    iniciarSesion,
  } = useLogin({ rol, onLoginExitoso });

  const [verPassword, setVerPassword] = useState(false);
  const esChofer = rol === 'chofer';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Decoración inferior (detrás del contenido) */}
        <View style={styles.bottomDecorationContainer} pointerEvents="none">
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR + 16 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Flecha de volver */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onVolver}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={GREEN} />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../../../assets/logo-texto.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.titulo}>Iniciar sesión</Text>
            <Text style={styles.subtitulo}>
              {esChofer ? 'Ingreso de chofer' : 'Ingreso de pasajero'} · Ingresa tus datos para continuar
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={GREEN} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={esChofer ? 'tu.correo@gmail.com' : 'tu.correo@edu.pe'}
                placeholderTextColor="#8A8A8A"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={GREEN} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingRight: 46 }]}
                placeholder="Contraseña"
                placeholderTextColor="#8A8A8A"
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
                  color={GREEN}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotWrapper}
                            onPress={onIrARecuperar}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

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

          {/* Footer */}
          <View style={styles.footerContainer}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}