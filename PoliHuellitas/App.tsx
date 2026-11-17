import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppEstadoProvider } from './src/estado/AppEstado';
import { NavProvider, useNav } from './src/navegacion';
import EnConstruccionScreen from './src/screens/EnConstruccionScreen';
import ListadoScreen from './src/screens/ListadoScreen';
import LoginScreen from './src/screens/LoginScreen';
import OlvidoScreen from './src/screens/OlvidoScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {/* El estado vive en la raíz: sobrevive a rotaciones y cambios de pantalla */}
      <AppEstadoProvider>
        <NavProvider inicial={{ nombre: 'splash' }}>
          <Navegador />
        </NavProvider>
      </AppEstadoProvider>
    </SafeAreaProvider>
  );
}

/** Elige qué pantalla dibujar según la ruta que está arriba de la pila. */
function Navegador() {
  const { ruta, pila } = useNav();
  // La key obliga a montar de nuevo la pantalla al navegar entre rutas
  // que usan el mismo componente.
  const key = `${pila.length}-${ruta.nombre}`;

  switch (ruta.nombre) {
    case 'splash':
      return <SplashScreen key={key} />;
    case 'login':
      return <LoginScreen key={key} />;
    case 'olvido':
      return <OlvidoScreen key={key} />;
    case 'registro':
      return <RegistroScreen key={key} />;
    case 'mascotas':
      return <ListadoScreen key={key} />;
    default:
      return <EnConstruccionScreen key={key} ruta={ruta} />;
  }
}
