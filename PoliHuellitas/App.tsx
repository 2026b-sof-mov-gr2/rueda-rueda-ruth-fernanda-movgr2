import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppEstadoProvider } from './src/estado/AppEstado';
import { NavProvider, useNav } from './src/navegacion';
import EnConstruccionScreen from './src/screens/EnConstruccionScreen';
import ListadoScreen from './src/screens/ListadoScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {/* El estado vive en la raíz: sobrevive a rotaciones y cambios de pantalla */}
      <AppEstadoProvider>
        {/* TODO bloque 2: la pantalla inicial será { nombre: 'splash' } */}
        <NavProvider inicial={{ nombre: 'principal' }}>
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
    case 'mascotas':
      return <ListadoScreen key={key} />;
    default:
      return <EnConstruccionScreen key={key} ruta={ruta} />;
  }
}
