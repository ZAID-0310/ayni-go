import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useDriverDocuments } from '../../hooks/useDriverDocuments';
import styles from './DocumentsScreen.styles';

const ESTADO_LABEL = { 
  pendiente: 'En revisión', 
  aprobado: 'Aprobado', 
  rechazado: 'Rechazado' 
};

export default function DocumentsScreen({ usuario, onVolver }) {
  const { TIPOS, documentos, subiendo, cargandoInicial, subirDocumento } = useDriverDocuments(usuario);

  if (cargandoInicial) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1E1E1E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Decoración superior */}
        <View style={styles.topDecoration} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.titulo}>Mis documentos</Text>
            <Text style={styles.subtitulo}>Sube y gestiona la documentación de tu vehículo y licencia.</Text>

            <View style={styles.docsContainer}>
              {TIPOS && TIPOS.map(({ key, label }) => {
                const doc = documentos ? documentos[key] : null;
                const estado = doc?.estado; 
                const isUploading = subiendo === key;
                
                return (
                  <View key={key} style={styles.itemDoc}>
                    <View style={styles.docHeader}>
                      <Text style={styles.itemNombre}>{label}</Text>
                      {doc ? (
                        <View style={[
                          styles.badge, 
                          estado === 'aprobado' && styles.badgeAprobado,
                          estado === 'pendiente' && styles.badgePendiente,
                          estado === 'rechazado' && styles.badgeRechazado,
                        ]}>
                          <Text style={styles.badgeText}>{ESTADO_LABEL[estado] || estado}</Text>
                        </View>
                      ) : (
                        <View style={styles.badgeNoSubido}>
                          <Text style={styles.badgeNoSubidoText}>No subido</Text>
                        </View>
                      )}
                    </View>

                    {estado === 'rechazado' && doc.motivo_rechazo ? (
                      <Text style={styles.motivoText}>Motivo: {doc.motivo_rechazo}</Text>
                    ) : null}

                    <TouchableOpacity 
                      style={[
                        styles.btnUpload, 
                        isUploading && styles.btnDisabled
                      ]} 
                      onPress={() => {
                        if (!isUploading) {
                          subirDocumento(key);
                        }
                      }} 
                      disabled={isUploading}
                      activeOpacity={0.8}
                    >
                      {isUploading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.btnUploadText}>
                          {doc ? 'Reemplazar documento' : 'Subir documento'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity 
              style={styles.btnSecondary} 
              onPress={onVolver}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Decoración inferior */}
        <View style={styles.bottomDecorationContainer}>
          <View style={styles.bottomYellow} />
          <View style={styles.bottomOrange} />
        </View>
      </View>
    </SafeAreaView>
  );
}