import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

// "7:30" o "07:30" -> "07:30:00". Devuelve null si no es válida.
export function parseHora(txt) {
  const m = /^(\d{1,2}):(\d{2})$/.exec((txt || '').trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${m[2]}:00`;
}

// Mientras se escribe: deja solo dígitos y arma "HH:MM" (7 3 0 -> "73:0" se rechaza al guardar)
export function formatearHoraInput(txt) {
  const d = (txt || '').replace(/\D/g, '').slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
}

// Lima es UTC-5 todo el año (sin horario de verano): se evita depender de Intl.
function limaDate(ts) {
  return new Date(new Date(ts).getTime() - 5 * 3600 * 1000);
}

export function formatearHora(ts) {
  const d = limaDate(ts);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const hoy = limaDate(Date.now()).toISOString().slice(0, 10);
  const dia = d.toISOString().slice(0, 10);
  const manana = limaDate(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);
  const cuando = dia === hoy ? 'hoy' : dia === manana ? 'mañana' : dia;
  return `${hh}:${mm} · ${cuando}`;
}

export function useProgramados() {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [trabajando, setTrabajando] = useState(false);

  const cargar = useCallback(async () => {
    const { data, error } = await supabase.rpc('mis_programados');
    if (error) {
      console.log('mis_programados error:', error.message);
    } else {
      setLista(data || []);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
    // Se refresca solo para ver cuando un chofer acepta
    const t = setInterval(cargar, 10000);
    return () => clearInterval(t);
  }, [cargar]);

  // Ejecuta una RPC, muestra el error si falla y recarga la lista
  const ejecutar = async (nombre, params) => {
    setTrabajando(true);
    const { error } = await supabase.rpc(nombre, params);
    setTrabajando(false);
    if (error) {
      Alert.alert('No se pudo', error.message);
      return false;
    }
    await cargar();
    return true;
  };

  const activar = (id, horaTxt) => {
    const hora = parseHora(horaTxt);
    if (!hora) {
      Alert.alert('Hora inválida', 'Escribe la hora como HH:MM, por ejemplo 07:30');
      return Promise.resolve(false);
    }
    return ejecutar('activar_programado', { p_id: id, p_hora: hora });
  };

  const cambiarHora = (id, horaTxt) => {
    const hora = parseHora(horaTxt);
    if (!hora) {
      Alert.alert('Hora inválida', 'Escribe la hora como HH:MM, por ejemplo 07:30');
      return Promise.resolve(false);
    }
    return ejecutar('editar_programado', { p_id: id, p_hora: hora });
  };

    const cancelar = (id) => ejecutar('cancelar_programado', { p_id: id });

  const eliminar = (id) => ejecutar('eliminar_programado', { p_id: id });

  const guardar = ({ lat, lng, direccion, etiqueta, horaTxt }) => {
    const hora = parseHora(horaTxt);
    if (!hora) {
      Alert.alert('Hora inválida', 'Escribe la hora como HH:MM, por ejemplo 07:30');
      return Promise.resolve(false);
    }
    return ejecutar('guardar_programado', {
      p_lat: lat,
      p_lng: lng,
      p_direccion: direccion,
      p_etiqueta: etiqueta,
      p_hora: hora,
    });
  };

    return { lista, cargando, trabajando, cargar, activar, cambiarHora, cancelar, eliminar, guardar };
}