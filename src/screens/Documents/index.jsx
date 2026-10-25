import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriverDocuments } from '../../hooks/useDriverDocuments';
import styles, { colors } from './DocumentsScreen.styles';

const STATUS_BAR = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;


// Apariencia de cada estado del documento
const ESTADOS = {
  aprobado: { label: 'Aprobado', icono: 'checkmark-circle', color: colors.verde, fondo: colors.menta },
  pendiente: { label: 'En revisión', icono: 'time', color: colors.doradoTexto, fondo: colors.doradoSuave },
  rechazado: { label: 'Rechazado', icono: 'alert-circle', color: colors.error, fondo: colors.errorSuave },
};

const NO_SUBIDO = {
  label: 'No subido',
  icono: 'cloud-upload-outline',
  color: colors.suave,
  fondo: colors.neutroSuave,
};

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

export default function DocumentsScreen({ usuario, onVolver }) {
  const { TIPOS, documentos, subiendo, cargandoInicial, subirDocumento } = useDriverDocuments(usuario);
  
  const [conScroll, setConScroll] = useState(false);

  if (cargandoInicial) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.verde} />
        </View>
      </SafeAreaView>
    );
  }

  const tipos = TIPOS ?? [];
  const total = tipos.length;
  const aprobados = tipos.filter(({ key }) => documentos?.[key]?.estado === 'aprobado').length;
  const rechazados = tipos.filter(({ key }) => documentos?.[key]?.estado === 'rechazado').length;
  const porcentaje = total > 0 ? Math.round((aprobados / total) * 100) : 0;

  const aviso =
    rechazados > 0
      ? `${rechazados} ${rechazados === 1 ? 'documento necesita' : 'documentos necesitan'} corrección`
      : aprobados === total && total > 0
        ? 'Tu documentación está completa'
        : 'Sube todos los documentos para poder manejar';

  // Sombra bajo el encabezado solo cuando ya se hizo scroll
  const alScrollear = (e) => {
    const bajo = e.nativeEvent.contentOffset.y > 4;
    if (bajo !== conScroll) setConScroll(bajo);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Encabezado fijo: menú y logo centrado */}
      <View
        style={[
          styles.header,
          { paddingTop: STATUS_BAR + 8 },
          conScroll && styles.headerConScroll,
        ]}
      >
        <View style={styles.headerLado}>
          <TouchableOpacity
            style={styles.btnMenu}
            onPress={onVolver}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={26} color={colors.verde} />
          </TouchableOpacity>
        </View>

        <Logo />

        {/* Espacio equivalente para que el logo quede centrado y libre el engranaje */}
        <View style={styles.headerLado} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={alScrollear}
        scrollEventThrottle={16}
      >
        <Text style={styles.titulo}>Mis documentos</Text>
        <Text style={styles.subtitulo}>
          Sube y gestiona la documentación de tu vehículo y licencia.
        </Text>

        {/* Progreso */}
        {total > 0 ? (
          <View style={styles.card}>
            <View style={styles.progresoFila}>
              <Text style={styles.progresoTitulo}>Documentación</Text>
              <Text style={styles.progresoCuenta}>
                {aprobados} de {total} aprobados
              </Text>
            </View>
            <View style={styles.barraFondo}>
              <View style={[styles.barraRelleno, { width: `${porcentaje}%` }]} />
            </View>
            <Text style={[styles.progresoAviso, rechazados > 0 && styles.progresoAvisoError]}>
              {aviso}
            </Text>
          </View>
        ) : null}

        {/* Un card por documento */}
        {tipos.map(({ key, label }) => {
          const doc = documentos ? documentos[key] : null;
          const estado = doc?.estado;
          const isUploading = subiendo === key;
          const cfg = doc
            ? ESTADOS[estado] ?? { ...ESTADOS.pendiente, label: estado }
            : NO_SUBIDO;
          const necesitaSubir = !doc || estado === 'rechazado';
          const textoBoton = !doc
            ? 'Subir documento'
            : estado === 'rechazado'
              ? 'Volver a subir'
              : 'Reemplazar documento';

          return (
            <View key={key} style={styles.card}>
              <View style={styles.docFila}>
                <View style={[styles.docIcono, { backgroundColor: cfg.fondo }]}>
                  <Ionicons name={cfg.icono} size={22} color={cfg.color} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.itemNombre}>{label}</Text>
                  <View style={[styles.badge, { backgroundColor: cfg.fondo }]}>
                    <Text style={[styles.badgeTexto, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              </View>

              {estado === 'rechazado' && doc?.motivo_rechazo ? (
                <View style={styles.motivo}>
                  <Text style={styles.motivoTexto}>Motivo: {doc.motivo_rechazo}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.btn,
                  necesitaSubir ? styles.btnPrimario : styles.btnContorno,
                  isUploading && styles.btnDisabled,
                ]}
                onPress={() => {
                  if (!isUploading) subirDocumento(key);
                }}
                disabled={isUploading}
                activeOpacity={0.8}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color={necesitaSubir ? colors.blanco : colors.verde} />
                ) : (
                  <Text style={necesitaSubir ? styles.btnTextoPrimario : styles.btnTextoContorno}>
                    {textoBoton}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}