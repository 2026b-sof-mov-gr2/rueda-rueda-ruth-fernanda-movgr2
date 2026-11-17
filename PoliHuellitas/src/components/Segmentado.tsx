import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, radios } from '../theme';

type Props<T extends string> = {
  etiqueta: string;
  opciones: readonly T[];
  valor: T;
  onCambio: (valor: T) => void;
};

/** Botones segmentados (Material 3): una sola opción activa. */
export default function Segmentado<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: Props<T>) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={styles.grupo} accessibilityRole="radiogroup">
        {opciones.map((op, i) => {
          const activa = op === valor;
          return (
            <Pressable
              key={op}
              onPress={() => onCambio(op)}
              style={[
                styles.segmento,
                i > 0 && styles.separador,
                activa && styles.segmentoActivo,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={`${etiqueta}: ${op}`}>
              <Text style={[styles.texto, activa && styles.textoActivo]}>
                {activa ? '✓ ' : ''}
                {op}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: '700', color: colores.texto },
  grupo: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1.5,
    borderColor: colores.borde,
    borderRadius: radios.campo,
    overflow: 'hidden',
    backgroundColor: colores.superficie,
  },
  segmento: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  separador: { borderLeftWidth: 1.5, borderLeftColor: colores.borde },
  segmentoActivo: { backgroundColor: colores.primarioClaro },
  texto: { fontSize: 14, fontWeight: '600', color: colores.textoSecundario },
  textoActivo: { color: colores.primario, fontWeight: '800' },
});
