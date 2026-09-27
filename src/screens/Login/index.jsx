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
import { useLogin } from '../../hooks/useLogin';
import { styles } from './LoginScreen.styles';

export default function LoginScreen({ onLoginExitoso, onIrARegistro }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    iniciarSesion
  } = useLogin({ onLoginExitoso });

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
                source={{ uri: 'https://via.placeholder.com/100' }} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
            </View>
            <Text style={styles.titulo}>AYNIX</Text>
            <Text style={styles.subtitulo}>
              Aplicación rápida de viaje{"\n"}para estudiantes
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput
              style={styles.input}
              placeholder="tu.correo@edu.pe / @gmail.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              placeholder="........"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

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

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>o continuar con</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.btnDriver}>
              <Text style={styles.btnDriverText}>Soy Conductor</Text>
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

            <TouchableOpacity style={{ marginTop: 15 }}>
              <Text style={styles.homeLink}>Ir a la página de inicio</Text>
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