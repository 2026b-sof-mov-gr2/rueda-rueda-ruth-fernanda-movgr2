import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { colores } from '../theme';

type Props = {
  etiqueta: string;
  icono?: string;
  valor: boolean;
  onCambio: (valor: boolean) => void;
};

/** Fila con texto a la izquierda y un Switch nativo a la derecha. */
export default function FilaSwitch({ etiqueta, icono, valor, onCambio }: Props) {
  return (
    <View style={styles.fila}>
      {icono ? <Text style={styles.icono}>{icono}</Text> : null}
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Switch
        value={valor}
        onValueChange={onCambio}
        trackColor={{ false: colores.borde, true: colores.primario }}
        thumbColor={colores.superficie}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', minHeight: 52, gap: 12 },
  icono: { fontSize: 18 },
  etiqueta: { flex: 1, fontSize: 15, color: colores.texto },
});
