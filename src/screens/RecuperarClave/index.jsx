import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecuperarClave } from '../../hooks/useRecuperarClave';
import styles from './RecuperarClaveScreen.styles';

const TITULOS = {
  correo: 'Recupera tu contraseña',
  codigo: 'Revisa tu correo',
  clave: 'Nueva contraseña',
};

const SUBTITULOS = {
  correo: 'Escribe el correo con el que te registraste.',
  codigo: 'Escribe el código que te enviamos.',
  clave: 'Elige una contraseña nueva.',
};

export default function RecuperarClaveScreen({ onVolver, onTerminado }) {
  const insets = useSafeAreaInsets();
  const r = useRecuperarClave({ onTerminado });

  const accion =
    r.paso === 'correo' ? r.enviarCodigo : r.paso === 'codigo' ? r.verificarCodigo : r.guardarClave;
  const textoBoton =
    r.paso === 'correo' ? 'Enviar código' : r.paso === 'codigo' ? 'Verificar código' : 'Guardar contraseña';

  return (
    <View style={[styles.contenedor, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => r.cancelar(onVolver)}
            style={styles.btnVolver}
            activeOpacity={0.7}
          >
            <Text style={styles.btnVolverText}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titulo}>{TITULOS[r.paso]}</Text>
          <Text style={styles.subtitulo}>{SUBTITULOS[r.paso]}</Text>

          <View style={styles.card}>
            {r.paso === 'correo' ? (
              <View>
                <Text style={styles.label}>CORREO</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tucorreo@utp.edu.pe"
                  placeholderTextColor="#999999"
                  value={r.correo}
                  onChangeText={r.setCorreo}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            ) : null}

            {r.paso === 'codigo' ? (
              <View>
                <Text style={styles.label}>CÓDIGO</Text>
                <TextInput
                  style={[styles.input, styles.inputCodigo]}
                  placeholder="000000"
                  placeholderTextColor="#999999"
                  value={r.codigo}
                  onChangeText={r.setCodigo}
                  keyboardType="number-pad"
                  maxLength={8}
                />
              </View>
            ) : null}

            {r.paso === 'clave' ? (
              <View>
                <Text style={styles.label}>NUEVA CONTRASEÑA</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999999"
                  value={r.clave}
                  onChangeText={r.setClave}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Text style={styles.label}>REPITE LA CONTRASEÑA</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="#999999"
                  value={r.clave2}
                  onChangeText={r.setClave2}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            ) : null}

            {r.error ? <Text style={styles.textoError}>{r.error}</Text> : null}
            {r.info ? <Text style={styles.textoInfo}>{r.info}</Text> : null}

            <TouchableOpacity
              style={[styles.btnPrimary, r.cargando && styles.btnDeshabilitado]}
              onPress={accion}
              disabled={r.cargando}
              activeOpacity={0.8}
            >
              {r.cargando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>{textoBoton}</Text>
              )}
            </TouchableOpacity>

            {r.paso === 'codigo' ? (
              <TouchableOpacity onPress={r.enviarCodigo} style={styles.linkReenviar} activeOpacity={0.6}>
                <Text style={styles.linkReenviarText}>Reenviar código</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}