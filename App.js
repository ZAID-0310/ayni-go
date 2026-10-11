import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HomeScreen from './src/screens/Home';
import VehicleScreen from './src/screens/Vehicle';
import DocumentsScreen from './src/screens/Documents';
import PedirViajeScreen from './src/screens/PedirViaje'
import SalasChoferScreen from './src/screens/SalasChofer';

export default function App() {
  const [pantalla, setPantalla] = useState('login'); // 'login' | 'registro' | 'home'
  const [perfil, setPerfil] = useState(null);

  const manejarLoginExitoso = async (usuario) => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', usuario.id)
      .maybeSingle();

    if (error) {
      console.error('Error al obtener perfil:', error.message);
    }

    setPerfil(data);
    setPantalla('home');
  };

  const manejarCerrarSesion = () => {
    setPerfil(null);
    setPantalla('login');
  };
  
    if (pantalla === 'vehiculo') {
    return (
      <VehicleScreen
        usuario={perfil}
        onVolver={() => setPantalla('home')}
      />
    );
  }


    if (pantalla === 'documentos') {
    return (
      <DocumentsScreen
        usuario={perfil}
        onVolver={() => setPantalla('home')}
      />
    );
  }
    if (pantalla === 'salasChofer') {
    return <SalasChoferScreen onVolver={() => setPantalla('home')} />;
  }

    if (pantalla === 'home') {
    return (
      <HomeScreen
        perfil={perfil}
        onCerrarSesion={manejarCerrarSesion}
        onIrAVehiculo={() => setPantalla('vehiculo')}
        onIrADocumentos={() => setPantalla('documentos')}
        onIrAPedirViaje={() => setPantalla('pedirViaje')}
        onIrASalasChofer={() => setPantalla('salasChofer')}

      />
    );
  }

  if (pantalla === 'registro') {
    return (
      <RegisterScreen
        onRegistroExitoso={() => setPantalla('login')}
        onIrALogin={() => setPantalla('login')}
      />
    );
  }

  if (pantalla === 'pedirViaje') {
  return <PedirViajeScreen 
  onVolver={() => setPantalla('home')} />;
}

  return (
    <LoginScreen
      onLoginExitoso={manejarLoginExitoso}
      onIrARegistro={() => setPantalla('registro')}
    />
  );
}