import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo, TextoMarca } from '../components/Marca';
import { useNav } from '../navegacion';
import { colores } from '../theme';

const DURACION = 2200; // ms que tarda en llenarse la barra

/** Pantalla 1: Inicio (splash). Pasa sola a Iniciar sesión. */
export default function SplashScreen() {
  const { reiniciar } = useNav();
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animacion = Animated.timing(progreso, {
      toValue: 1,
      duration: DURACION,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false, // "width" no se puede animar en el hilo nativo
    });
    animacion.start(({ finished }) => {
      if (finished) {
        reiniciar({ nombre: 'login' });
      }
    });
    return () => animacion.stop();
  }, [progreso, reiniciar]);

  const ancho = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.raiz}>
      <StatusBar barStyle="light-content" />
      <View style={styles.centro}>
        <View style={styles.aro}>
          <Logo tamano={120} />
        </View>
        <TextoMarca tamano={36} sobreAzul />
        <Text style={styles.slogan}>Conexiones que transforman vidas</Text>
      </View>

      <View style={styles.pie}>
        <View
          style={styles.pista}
          accessibilityRole="progressbar"
          accessibilityLabel="Cargando">
          <Animated.View style={[styles.relleno, { width: ancho }]} />
        </View>
        <Text style={styles.cargando}>Cargando…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: colores.primario },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 32,
  },
  aro: {
    padding: 8,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 10,
  },
  slogan: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  pie: { paddingHorizontal: 64, paddingBottom: 48, gap: 10 },
  pista: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  relleno: { height: '100%', borderRadius: 4, backgroundColor: colores.acento },
  cargando: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.75,
    textAlign: 'center',
  },
});
