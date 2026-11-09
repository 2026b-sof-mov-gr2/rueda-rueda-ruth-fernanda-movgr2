
/**
 * Mi primera aplicación React Native
 * Hola Mundo
 *
 * @format
 */

import React from 'react';

import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
    >
      <Text style={styles.titulo}>
        ¡Hola Mundo! 🌎
      </Text>

      <Text style={styles.subtitulo}>
        Mi primera aplicación con React Native
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginTop: 15,
  },
  mensaje: {
    fontSize: 16,
    color: '#00897B',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default App;
