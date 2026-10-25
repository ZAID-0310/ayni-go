import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { supabase } from '../../lib/supabase';

// Sube la foto a avatares/<usuarioId>/avatar.jpg y guarda la URL con actualizar_foto_perfil.
// expo-image-manipulator se carga solo al subir: si el build no lo incluye, la foto
// se sube sin reducir y la app no se cae.
export function useFotoPerfil(usuarioId, fotoInicial) {
  const [fotoUrl, setFotoUrl] = useState(fotoInicial ?? null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const subir = async (uriOriginal) => {
    let uriFinal = uriOriginal;
    // Solo se carga el manipulador si el build lo trae (comprobarlo no lanza error)
    if (requireOptionalNativeModule('ExpoImageManipulator')) {
      try {
        const ImageManipulator = require('expo-image-manipulator');
        const ctx = ImageManipulator.manipulate(uriOriginal);
        ctx.resize({ width: 512 });
        const imagen = await ctx.renderAsync();
        const final = await imagen.saveAsync({
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        uriFinal = final.uri;
      } catch (e) {
        console.log('FOTO sin reducir:', e.message);
      }
    } else {
      console.log('FOTO sin reducir: este build no incluye ExpoImageManipulator');
    }

    const buffer = await (await fetch(uriFinal)).arrayBuffer();
    const ruta = `${usuarioId}/avatar.jpg`;

    const { error: eSubida } = await supabase.storage
      .from('avatares')
      .upload(ruta, buffer, { contentType: 'image/jpeg', upsert: true });
    if (eSubida) throw eSubida;

    const { data } = supabase.storage.from('avatares').getPublicUrl(ruta);
    const url = `${data.publicUrl}?v=${Date.now()}`; // evita la foto anterior en caché

    const { error: eBd } = await supabase.rpc('actualizar_foto_perfil', { p_url: url });
    if (eBd) throw eBd;

    setFotoUrl(url);
  };

  // origen: 'galeria' | 'camara'
  const elegir = async (origen) => {
    setError(null);
    try {
      let resultado;
      if (origen === 'camara') {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (perm.status !== 'granted') {
          setError('Permite el acceso a la cámara para tomar la foto.');
          return;
        }
        resultado = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      } else {
        resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      }
      if (resultado.canceled || !resultado.assets?.length) return;

      setSubiendo(true);
      await subir(resultado.assets[0].uri);
    } catch (e) {
      console.log('FOTO error', e.message);
      setError('No se pudo subir la foto. Inténtalo de nuevo.');
    } finally {
      setSubiendo(false);
    }
  };

  const quitar = async () => {
    setError(null);
    setSubiendo(true);
    try {
      await supabase.storage.from('avatares').remove([`${usuarioId}/avatar.jpg`]);
      const { error: eBd } = await supabase.rpc('actualizar_foto_perfil', { p_url: null });
      if (eBd) throw eBd;
      setFotoUrl(null);
    } catch (e) {
      console.log('FOTO quitar error', e.message);
      setError('No se pudo quitar la foto.');
    } finally {
      setSubiendo(false);
    }
  };

  return { fotoUrl, subiendo, error, elegir, quitar };
}