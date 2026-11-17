import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tab, useNav } from '../navegacion';
import { colores } from '../theme';

const pestanas: { tab: Tab; icono: string; etiqueta: string }[] = [
  { tab: 'principal', icono: '🏠', etiqueta: 'Inicio' },
  { tab: 'mascotas', icono: '🐾', etiqueta: 'Mascotas' },
  { tab: 'adoptar', icono: '❤️', etiqueta: 'Adopta' },
  { tab: 'perfil', icono: '👤', etiqueta: 'Perfil' },
];

/** Barra de navegación inferior (pantallas 5, 6, 10 y 14). */
export default function BarraInferior({ activa }: { activa: Tab }) {
  const { irATab } = useNav();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.barra, { paddingBottom: Math.max(insets.bottom, 8) }]}
      accessibilityRole="tablist">
      {pestanas.map(p => {
        const esActiva = p.tab === activa;
        return (
          <Pressable
            key={p.tab}
            onPress={() => !esActiva && irATab(p.tab)}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: esActiva }}
            accessibilityLabel={p.etiqueta}>
            <View style={[styles.pastilla, esActiva && styles.pastillaActiva]}>
              <Text style={[styles.icono, !esActiva && styles.iconoInactivo]}>
                {p.icono}
              </Text>
            </View>
            <Text
              style={[styles.etiqueta, esActiva && styles.etiquetaActiva]}>
              {p.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: colores.superficie,
    borderTopWidth: 1,
    borderTopColor: colores.divisor,
    paddingTop: 8,
    elevation: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 4, minHeight: 56 },
  pastilla: {
    width: 60,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastillaActiva: { backgroundColor: colores.primarioClaro },
  icono: { fontSize: 18 },
  iconoInactivo: { opacity: 0.6 },
  etiqueta: {
    fontSize: 12,
    fontWeight: '600',
    color: colores.textoSecundario,
  },
  etiquetaActiva: { color: colores.primario, fontWeight: '800' },
});
