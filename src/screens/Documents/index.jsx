import { View, Text, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { useDriverDocuments } from '../../hooks/useDriverDocuments';
import styles from './DocumentsScreen.styles';

const ESTADO_LABEL = { pendiente: 'En revisión', aprobado: 'Aprobado', rechazado: 'Rechazado' };
const ESTADO_STYLE = {
  pendiente: 'estadoPendiente',
  aprobado: 'estadoAprobado',
  rechazado: 'estadoRechazado',
};

export default function DocumentsScreen({ usuario, onVolver }) {
  const { TIPOS, documentos, subiendo, cargandoInicial, subirDocumento } = useDriverDocuments(usuario);

  if (cargandoInicial) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis documentos</Text>

      {TIPOS.map(({ key, label }) => {
        const doc = documentos[key];
        return (
          <View key={key} style={styles.itemDoc}>
            <Text style={styles.itemNombre}>{label}</Text>
            {doc ? (
              <Text style={styles[ESTADO_STYLE[doc.estado]]}>
                {ESTADO_LABEL[doc.estado]}
                {doc.estado === 'rechazado' && doc.motivo_rechazo ? ` — ${doc.motivo_rechazo}` : ''}
              </Text>
            ) : (
              <Text style={{ color: '#999' }}>No subido</Text>
            )}
            <TouchableOpacity onPress={() => subirDocumento(key)} disabled={subiendo === key}>
              <Text style={{ color: '#2563eb', marginTop: 6 }}>
                {subiendo === key ? 'Subiendo...' : doc ? 'Reemplazar' : 'Subir'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Button title="Volver" onPress={onVolver} />
    </View>
  );
}