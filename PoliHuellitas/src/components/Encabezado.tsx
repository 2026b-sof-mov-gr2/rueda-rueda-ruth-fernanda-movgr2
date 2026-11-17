import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNav } from '../navegacion';
import { colores } from '../theme';

type Props = {
  titulo: string;
  onVolver?: () => void; // por defecto, regresa a la pantalla anterior
  mostrarVolver?: boolean;
  derecha?: ReactNode; // acción a la derecha ("Limpiar", foto, etc.)
  insignia?: number; // contador junto al título (ej.: Favoritos 2)
};

/** Barra superior con flecha ← y título, como en el prototipo. */
export default function Encabezado({
  titulo,
  onVolver,
  mostrarVolver = true,
  derecha,
  insignia,
}: Props) {
  const { volver } = useNav();
  return (
    <View style={styles.barra}>
      {mostrarVolver ? (
        <Pressable
          onPress={onVolver ?? volver}
          style={styles.botonVolver}
          android_ripple={{ color: colores.primarioClaro, borderless: true }}
          accessibilityRole="button"
          accessibilityLabel="Volver">
          <Text style={styles.flecha}>←</Text>
        </Pressable>
      ) : null}
      <View style={styles.centro}>
        <Text
          style={styles.titulo}
          numberOfLines={1}
          accessibilityRole="header">
          {titulo}
        </Text>
        {insignia !== undefined ? (
          <View style={styles.insignia}>
            <Text style={styles.insigniaTexto}>{insignia}</Text>
          </View>
        ) : null}
      </View>
      {derecha ? <View style={styles.derecha}>{derecha}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  botonVolver: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flecha: { fontSize: 24, color: colores.texto, marginTop: -2 },
  centro: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4,
  },
  titulo: {
    flexShrink: 1,
    fontSize: 19,
    fontWeight: '800',
    color: colores.texto,
  },
  insignia: {
    minWidth: 24,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 7,
    backgroundColor: colores.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insigniaTexto: { fontSize: 12.5, fontWeight: '800', color: '#B5560E' },
  derecha: { marginRight: 8 },
});
