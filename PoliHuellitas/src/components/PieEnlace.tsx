import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colores } from '../theme';

type Props = {
  pregunta: string; // "¿No tienes cuenta?"
  enlace: string; // "Regístrate"
  onPress: () => void;
};

/** Pie de pantalla tipo "¿No tienes cuenta? Regístrate" (toda la fila es tocable). */
export default function PieEnlace({ pregunta, enlace, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.fila}
      accessibilityRole="link"
      accessibilityLabel={`${pregunta} ${enlace}`}>
      <Text style={styles.pregunta}>
        {pregunta} <Text style={styles.enlace}>{enlace}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  pregunta: { fontSize: 14, color: colores.textoSecundario },
  enlace: {
    fontWeight: '800',
    color: colores.primario,
    textDecorationLine: 'underline',
  },
});
