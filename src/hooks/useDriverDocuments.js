import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../lib/supabase';

const TIPOS = [
  { key: 'dni', label: 'DNI' },
  { key: 'licencia_conducir', label: 'Licencia de conducir' },
  { key: 'soat', label: 'SOAT' },
  { key: 'tarjeta_propiedad', label: 'Tarjeta de propiedad' },
];

export function useDriverDocuments(usuario) {
  const [documentos, setDocumentos] = useState({});
  const [subiendo, setSubiendo] = useState(null); // qué tipo se está subiendo ahora
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const cargarDocumentos = async () => {
    setCargandoInicial(true);
    const { data, error } = await supabase
      .from('documentos_chofer')
      .select('*')
      .eq('chofer_id', usuario.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      const mapa = {};
      data.forEach((doc) => {
        mapa[doc.tipo] = doc;
      });
      setDocumentos(mapa);
    }
    setCargandoInicial(false);
  };

  const subirDocumento = async (tipo) => {
        const resultado = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
            copyToCacheDirectory: true,
        });

        if (resultado.canceled) return;

        setSubiendo(tipo);

        const archivo = resultado.assets[0];
        const extension = archivo.name.split('.').pop();
        const nombreArchivo = `${usuario.id}/${tipo}.${extension}`;

        const respuesta = await fetch(archivo.uri);
        const blob = await respuesta.blob();

        const { error: errorUpload } = await supabase.storage
            .from('documentos-choferes')
            .upload(nombreArchivo, blob, {
            upsert: true,
            contentType: archivo.mimeType,
            });

        if (errorUpload) {
            setSubiendo(null);
            Alert.alert('Error subiendo archivo', errorUpload.message);
            return;
        }

        const { error: errorInsert } = await supabase
            .from('documentos_chofer')
            .upsert({
            chofer_id: usuario.id,
            tipo,
            archivo_path: nombreArchivo,
            estado: 'pendiente',
            }, { onConflict: 'chofer_id,tipo' });

        setSubiendo(null);

        if (errorInsert) {
            Alert.alert('Error guardando registro', errorInsert.message);
            return;
        }

        Alert.alert('Listo', 'Documento subido, quedará en revisión.');
        cargarDocumentos();
    };

  return {
    TIPOS,
    documentos,
    subiendo,
    cargandoInicial,
    subirDocumento,
  };
}