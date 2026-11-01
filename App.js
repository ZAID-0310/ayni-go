import React, { useState, useEffect, useRef } from 'react';
import { Appearance, View, StatusBar, ActivityIndicator, BackHandler, ToastAndroid } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from './lib/supabase';
import BienvenidaScreen from './src/screens/Bienvenida';
import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import HomeScreen from './src/screens/Home';
import VehicleScreen from './src/screens/Vehicle';
import DocumentsScreen from './src/screens/Documents';
import PedirViajeScreen from './src/screens/PedirViaje';
import SalasChoferScreen from './src/screens/SalasChofer';
import ProgramadosScreen from './src/screens/Programados';
import ProgramadoNuevoScreen from './src/screens/ProgramadoNuevo';
import ProgramadosChoferScreen from './src/screens/ProgramadosChofer';
import HistorialScreen from './src/screens/Historial';
import CuentaScreen from './src/screens/Cuenta';
import RecuperarClaveScreen from './src/screens/RecuperarClave';
import BarraInferior from './src/components/BarraInferior';
import { detenerUbicacionSegundoPlano } from './src/tasks/ubicacionSegundoPlano';

const TABS_PASAJERO = [
  { id: 'inicio', label: 'Inicio', icono: 'home' },
  { id: 'programados', label: 'Programados', icono: 'calendar' },
  { id: 'historial', label: 'Historial', icono: 'time' },
  { id: 'cuenta', label: 'Mi cuenta', icono: 'person' },
];

const TABS_CHOFER = [
  { id: 'inicio', label: 'Solicitudes', icono: 'list' },
  { id: 'programados', label: 'Programados', icono: 'calendar' },
  { id: 'historial', label: 'Historial', icono: 'time' },
  { id: 'cuenta', label: 'Mi cuenta', icono: 'person' },
];

const TAB_DE_PANTALLA = {
  home: 'inicio',
  programados: 'programados',
  programadosChofer: 'programados',
  historial: 'historial',
  cuenta: 'cuenta',
};

// Fuerza el tema claro: en modo oscuro algunos teléfonos pintaban los inputs con texto blanco
Appearance.setColorScheme('light');


export default function App() {
  return (
    <SafeAreaProvider>
      <Marco>
        <AppContenido />
      </Marco>
    </SafeAreaProvider>
  );
}

// Deja libre el espacio de la barra de navegación del sistema en todas las pantallas
function Marco({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom, backgroundColor: '#FAF7EE' }}>
      <StatusBar barStyle="dark-content" />
      {children}
    </View>
  );
}

function AppContenido() {
  // 'bienvenida' | 'login' | 'registro' | 'home' | 'vehiculo' | 'documentos'
  // | 'pedirViaje' | 'salasChofer'
  const [pantalla, setPantalla] = useState('bienvenida');
  const [rolElegido, setRolElegido] = useState(null); // 'pasajero' | 'chofer'
  const [perfil, setPerfil] = useState(null);

  const [restaurando, setRestaurando] = useState(true);

  const ultimoAtras = useRef(0);

  // Botón atrás del celular: retrocede una pantalla; en Inicio/Bienvenida pide pulsar dos veces para salir
  useEffect(() => {
    const ATRAS = {
      vehiculo: 'cuenta',
      documentos: 'home',
      salasChofer: 'home',
      pedirViaje: 'home',
      programados: 'home',
      programadosChofer: 'home',
      historial: 'home',
      cuenta: 'home',
      programadoNuevo: 'programados',
      registro: 'bienvenida',
      login: 'bienvenida',
      recuperar: 'login',
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const destino = ATRAS[pantalla];
      if (destino) {
        setPantalla(destino);
        return true;
      }
      const ahora = Date.now();
      if (ahora - ultimoAtras.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      ultimoAtras.current = ahora;
      ToastAndroid.show('Pulsa de nuevo atrás para salir', ToastAndroid.SHORT);
      return true;
    });

    return () => sub.remove();
  }, [pantalla]);

  // Al abrir: si hay sesión guardada, entrar directo; si la sesión termina, volver a Bienvenida
  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (activo && data) {
            setPerfil(data);
            setPantalla('home');
          }
        }
      } catch (e) {
        console.log('SESION restaurar falló', e.message);
      } finally {
        if (activo) setRestaurando(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT') {
        detenerUbicacionSegundoPlano();
        setPerfil(null);
        setPantalla((p) =>
          ['bienvenida', 'login', 'registro', 'recuperar'].includes(p) ? p : 'bienvenida'
        );
      }
    });
    return () => {
      activo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

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

    const esChofer = perfil?.rol === 'chofer';

  const irATab = (id) => {
    if (id === 'inicio') setPantalla('home');
    else if (id === 'programados') setPantalla(esChofer ? 'programadosChofer' : 'programados');
    else setPantalla(id); // 'historial' | 'cuenta'
  };

  // Envuelve una pantalla principal con la barra inferior
  const conBarra = (pantallaJsx) => (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{pantallaJsx}</View>
      <BarraInferior
        activa={TAB_DE_PANTALLA[pantalla]}
        onCambiar={irATab}
        tabs={esChofer ? TABS_CHOFER : TABS_PASAJERO}
      />
    </View>
  );


  const manejarCerrarSesion = () => {
    detenerUbicacionSegundoPlano();
    setPerfil(null);
    setRolElegido(null);
    setPantalla('bienvenida');
  };

    if (restaurando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF7EE' }}>
        <ActivityIndicator color="#0F5132" />
      </View>
    );
  }

  if (pantalla === 'vehiculo') {
    return (
      <VehicleScreen
        usuario={perfil}
        onVolver={() => setPantalla('cuenta')}
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

    if (pantalla === 'pedirViaje') {
        return <PedirViajeScreen perfil={perfil} onVolver={() => setPantalla('home')} />;
  }

  if (pantalla === 'programados') {
        return conBarra(
      <ProgramadosScreen
        onVolver={() => setPantalla('home')}
        onIrAlViaje={() => setPantalla('pedirViaje')}
        onNuevo={() => setPantalla('programadoNuevo')}
      />
    );
  }

  if (pantalla === 'programadosChofer') {
        return conBarra(
      <ProgramadosChoferScreen
        onVolver={() => setPantalla('home')}
        onIrAlViaje={() => setPantalla('salasChofer')}
      />
    );
  }

    if (pantalla === 'historial') {
    return conBarra(<HistorialScreen onVolver={() => setPantalla('home')} />);
  }

  if (pantalla === 'programadoNuevo') {
    return (
      <ProgramadoNuevoScreen
        onVolver={() => setPantalla('programados')}
        onGuardado={() => setPantalla('programados')}
      />
    );
  }

    if (pantalla === 'cuenta') {
    return conBarra(
      <CuentaScreen
        perfil={perfil}
        onIrAVehiculo={() => setPantalla('vehiculo')}
        onCerrarSesion={manejarCerrarSesion}
        onFotoActualizada={(url) => setPerfil((p) => (p ? { ...p, foto_url: url } : p))}
      />
    );
  }

  if (pantalla === 'home') {
    return conBarra(
      <HomeScreen
        perfil={perfil}
        onCerrarSesion={manejarCerrarSesion}
        onIrAVehiculo={() => setPantalla('vehiculo')}
        onIrADocumentos={() => setPantalla('documentos')}
        onIrAPedirViaje={() => setPantalla('pedirViaje')}
        onIrASalasChofer={() => setPantalla('salasChofer')}
        onIrAProgramados={() => setPantalla('programados')}
        onIrAProgramadosChofer={() => setPantalla('programadosChofer')}
        onIrAHistorial={() => setPantalla('historial')}
      />
    );
  }

  if (pantalla === 'registro') {
    return (
      <RegisterScreen
        rol={rolElegido}
        onRegistroExitoso={() => setPantalla('login')}
        onIrALogin={() => setPantalla('login')}
        onVolver={() => setPantalla('bienvenida')}
      />
    );
  }

    if (pantalla === 'recuperar') {
    return (
      <RecuperarClaveScreen
        onVolver={() => setPantalla('login')}
        onTerminado={() => setPantalla('login')}
      />
    );
  }

  if (pantalla === 'login') {
    return (
      <LoginScreen
        rol={rolElegido}
        onLoginExitoso={manejarLoginExitoso}
        onIrARegistro={() => setPantalla('registro')}
        onIrARecuperar={() => setPantalla('recuperar')}
        onVolver={() => setPantalla('bienvenida')}
      />
    );
  }

  // Pantalla inicial
  return (
    <BienvenidaScreen
      onElegirRol={(rol) => {
        setRolElegido(rol);
        setPantalla('login');
      }}
    />
  );
}