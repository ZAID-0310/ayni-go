import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export function useVehicle(usuario) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [vehiculo, setVehiculo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  useEffect(() => {
    buscarVehiculo();
  }, []);

  const buscarVehiculo = async () => {
    setCargandoInicial(true);
    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('chofer_id', usuario.id)
      .maybeSingle();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setVehiculo(data);
    }
    setCargandoInicial(false);
  };

  const registrarVehiculo = async (onExito) => {
    if (!placa.trim() || !modelo.trim() || !capacidad.trim()) {
      Alert.alert('Faltan datos', 'Completa placa, modelo y capacidad.');
      return;
    }

    const capacidadNum = parseInt(capacidad, 10);
    if (isNaN(capacidadNum) || capacidadNum <= 0) {
      Alert.alert('Capacidad inválida', 'Ingresa un número mayor a 0.');
      return;
    }

    setCargando(true);
    const { data, error } = await supabase
      .from('vehiculos')
      .insert({
        chofer_id: usuario.id,
        placa: placa.trim().toUpperCase(),
        modelo: modelo.trim(),
        capacidad_pasajeros: capacidadNum,
      })
      .select()
      .single();
    setCargando(false);

    if (error) {
      if (error.code === '23505') {
        Alert.alert('Placa ya registrada', 'Esa placa ya está registrada en el sistema.');
      } else {
        Alert.alert('Error', error.message);
      }
      return;
    }

    setVehiculo(data);
    onExito();
  };

  return {
    placa, setPlaca,
    modelo, setModelo,
    capacidad, setCapacidad,
    vehiculo,
    cargando,
    cargandoInicial,
    registrarVehiculo,
  };
}