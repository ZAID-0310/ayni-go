import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRegister } from '../../hooks/useRegister';
import { styles } from './RegisterScreen.styles';

export default function RegisterScreen({ onRegistroExitoso, onIrALogin }) {
  const {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    rol,
    setRol,
    otp,
    setOtp,
    etapa,
    loading,
    enviarCodigo,
    registrarse,
    reenviarCodigo
  } = useRegister({ onRegistroExitoso });

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

          {etapa === 'verificar' ? (
            /* ETAPA DE VERIFICACIÓN DE OTP */
            <View style={{ width: '100%', marginVertical: 'auto' }}>
              <View style={styles.headerContainer}>
                <Text style={styles.titulo}>Verifica tu correo</Text>
                <Text style={styles.subtitulo}>
                  Ingresa el código de 6 dígitos que enviamos a{"\n"}
                  <Text style={{ fontWeight: 'bold' }}>{email}</Text>
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.label}>CÓDIGO DE VERIFICACIÓN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000000"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <TouchableOpacity 
                  style={styles.btnPrimary} 
                  onPress={registrarse} 
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.btnPrimaryText}>Completar Registro</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={reenviarCodigo} 
                  disabled={loading} 
                  style={{ marginTop: 12 }}
                >
                  <Text style={{ textAlign: 'center', color: '#2563eb' }}>
                    Reenviar código
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* ETAPA DE FORMULARIO DE REGISTRO */
            <>
              <View style={styles.headerContainer}>
                <Text style={styles.titulo}>Crea tu cuenta</Text>
                <Text style={styles.subtitulo}>Únete a la comunidad de AYNIX</Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.label}>NOMBRE COMPLETO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Juan Pérez"
                  placeholderTextColor="#999"
                  value={nombre}
                  onChangeText={setNombre}
                />

                <Text style={styles.label}>CORREO INSTITUCIONAL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu.correo@edu.pe"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <Text style={styles.label}>TIPO DE USUARIO</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[styles.opcionRol, rol === 'pasajero' && styles.opcionRolSeleccionada]}
                    onPress={() => setRol('pasajero')}
                    activeOpacity={0.7}
                  >
                    <Text style={rol === 'pasajero' ? styles.textoSeleccionado : styles.textoNormal}>
                      Pasajero
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.opcionRol, rol === 'chofer' && styles.opcionRolSeleccionada]}
                    onPress={() => setRol('chofer')}
                    activeOpacity={0.7}
                  >
                    <Text style={rol === 'chofer' ? styles.textoSeleccionado : styles.textoNormal}>
                      Chofer
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.btnPrimary} 
                  onPress={enviarCodigo} 
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.btnPrimaryText}>Enviar código de verificación</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.footerContainer}>
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                  <TouchableOpacity onPress={onIrALogin}>
                    <Text style={styles.loginLink}>Inicia sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

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