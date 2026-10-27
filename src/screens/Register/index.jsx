import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRegister } from '../../hooks/useRegister';
import { styles, colors } from './RegisterScreen.styles';

function Logo() {
  return (
    <View style={styles.logoFila}>
      <Image
        source={require('../../../assets/logo-texto.png')}
        style={styles.logoImagen}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.logoTexto}>
          AYNI-<Text style={styles.logoGo}>GO</Text>
        </Text>
        <Text style={styles.logoLema}>Llegar lejos cuesta menos</Text>
      </View>
    </View>
  );
}

export default function RegisterScreen({ rol, onRegistroExitoso, onIrALogin, onVolver }) {
  const {
    nombre, setNombre,
    email, setEmail,
    password, setPassword,
    otp, setOtp,
    etapa,
    loading,
    enviarCodigo,
    registrarse,
    reenviarCodigo,
  } = useRegister({ rol, onRegistroExitoso });

  const esChofer = rol === 'chofer';
  const [foco, setFoco] = useState(null);
  const [verPassword, setVerPassword] = useState(false);

  const propsFoco = (campo) => ({
    onFocus: () => setFoco(campo),
    onBlur: () => setFoco(null),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Logo />

          {etapa === 'verificar' ? (
            <>
              <View style={styles.headerContainer}>
                <View style={styles.iconoCirculo}>
                  <Ionicons name="mail-outline" size={30} color={colors.verde} />
                </View>
                <Text style={styles.titulo}>Verifica tu correo</Text>
                <Text style={styles.subtitulo}>
                  Ingresa el código de 6 dígitos que enviamos a{'\n'}
                  <Text style={styles.subtituloNegrita}>{email}</Text>
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Código de verificación</Text>
                <TextInput
                  style={[styles.input, styles.inputCodigo, foco === 'otp' && styles.inputFoco]}
                  placeholder="000000"
                  placeholderTextColor={colors.placeholder}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  {...propsFoco('otp')}
                />

                <TouchableOpacity
                  style={[styles.btnPrimary, loading && styles.btnDisabled]}
                  onPress={registrarse}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.blanco} />
                  ) : (
                    <Text style={styles.btnPrimaryText}>Completar registro</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={reenviarCodigo}
                  disabled={loading}
                  style={styles.btnLink}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnLinkText}>Reenviar código</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.titulo}>
                  {esChofer ? 'Registro de chofer' : 'Registro de pasajero'}
                </Text>
                <Text style={styles.subtitulo}>
                  {esChofer
                    ? 'Maneja con Ayni Go y comparte tu ruta'
                    : 'Únete a la comunidad de Ayni Go'}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Nombre completo</Text>
                <TextInput
                  style={[styles.input, foco === 'nombre' && styles.inputFoco]}
                  placeholder="Juan Pérez"
                  placeholderTextColor={colors.placeholder}
                  value={nombre}
                  onChangeText={setNombre}
                  autoCapitalize="words"
                  {...propsFoco('nombre')}
                />

                <Text style={styles.label}>
                  {esChofer ? 'Correo' : 'Correo institucional'}
                </Text>
                <TextInput
                  style={[styles.input, foco === 'email' && styles.inputFoco]}
                  placeholder={esChofer ? 'tu.correo@gmail.com' : 'tu.correo@edu.pe'}
                  placeholderTextColor={colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  {...propsFoco('email')}
                />

                <Text style={styles.label}>Contraseña</Text>
                <View style={[styles.inputFila, foco === 'password' && styles.inputFoco]}>
                  <TextInput
                    style={styles.inputInterno}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={colors.placeholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!verPassword}
                    autoCapitalize="none"
                    {...propsFoco('password')}
                  />
                  <TouchableOpacity
                    onPress={() => setVerPassword(!verPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={verPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={colors.suave}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.btnPrimary, loading && styles.btnDisabled]}
                  onPress={enviarCodigo}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.blanco} />
                  ) : (
                    <Text style={styles.btnPrimaryText}>Enviar código de verificación</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.footerContainer}>
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                  <TouchableOpacity onPress={onIrALogin} activeOpacity={0.7}>
                    <Text style={styles.loginLink}>Inicia sesión</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.btnSecundario}
                  onPress={onVolver}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnSecundarioText}>Cambiar tipo de cuenta</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}