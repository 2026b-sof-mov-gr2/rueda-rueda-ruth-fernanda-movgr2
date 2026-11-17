import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores } from '../theme';

type Props = {
  etiqueta: string;
  marcada: boolean;
  onPress: () => void;
};

/** Casilla de verificación simple (Pressable + View), sin librerías. */
export default function Casilla({ etiqueta, marcada, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.fila}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcada }}
      accessibilityLabel={etiqueta}>
      <View style={[styles.caja, marcada && styles.cajaMarcada]}>
        {marcada ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', minHeight: 48, gap: 14 },
  caja: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaMarcada: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  check: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', marginTop: -1 },
  etiqueta: { fontSize: 15, color: colores.texto },
});
