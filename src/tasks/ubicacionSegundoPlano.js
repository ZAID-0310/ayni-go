import { requireOptionalNativeModule } from 'expo-modules-core';
import { PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';

export const TAREA_UBICACION = 'ayni-ubicacion-chofer';

// Con el APK viejo el módulo nativo no existe: se omite todo y no se cae la app.
// (Un try/catch alrededor de require NO sirve en Metro; por eso se pregunta antes.)
const TaskManager = requireOptionalNativeModule('ExpoTaskManager')
  ? require('expo-task-manager')
  : null;

if (TaskManager) {
  // Esta tarea sigue corriendo aunque el chofer abra Waze o Google Maps
  TaskManager.defineTask(TAREA_UBICACION, async ({ data, error }) => {
    if (error || !data?.locations?.length) return;
    const { latitude, longitude } = data.locations[data.locations.length - 1].coords;
    try {
      const { data: sesion } = await supabase.auth.getSession(); // refresca el token si hace falta
      if (!sesion?.session) return;
      await supabase.rpc('chofer_ping', { p_lat: latitude, p_lng: longitude });
    } catch (e) {
      // se reintenta en la siguiente lectura
    }
  });
}

// Devuelve: 'segundo_plano' | 'solo_primer_plano' | 'denegado'
export async function iniciarUbicacionSegundoPlano() {
  const primer = await Location.requestForegroundPermissionsAsync();
  if (primer.status !== 'granted') return 'denegado';

    if (!TaskManager) return 'solo_primer_plano'; // APK viejo

  // Android 13+: sin este permiso no se ve la notificación del servicio.
  // Si el chofer la rechaza, la ubicación sigue enviándose igual.
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    } catch (e) {
      // se sigue sin notificación visible
    }
  }

  try {
    const fondo = await Location.requestBackgroundPermissionsAsync();
    if (fondo.status !== 'granted') return 'solo_primer_plano';

    const yaCorre = await Location.hasStartedLocationUpdatesAsync(TAREA_UBICACION);
    if (!yaCorre) {
      await Location.startLocationUpdatesAsync(TAREA_UBICACION, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'Ayni Go',
          notificationBody: 'Compartiendo tu ubicación con los pasajeros',
          notificationColor: '#0F5132',
        },
      });
    }
    return 'segundo_plano';
  } catch (e) {
    return 'solo_primer_plano';
  }
}

export async function detenerUbicacionSegundoPlano() {
  if (!TaskManager) return;
  try {
    const corre = await Location.hasStartedLocationUpdatesAsync(TAREA_UBICACION);
    if (corre) await Location.stopLocationUpdatesAsync(TAREA_UBICACION);
  } catch (e) {
    // nada que detener
  }
}