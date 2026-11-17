import React from 'react';
import {
  DimensionValue,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Mascota } from '../data/mascotas';
import { colores, radios } from '../theme';
import { haceCuanto } from '../utils/fecha';

type Props = {
  mascota: Mascota;
  onPress: () => void; // abre el Detalle
  esFavorito: boolean;
  onFavorito: () => void; // corazón de la esquina
  alturaFoto?: DimensionValue;
  style?: StyleProp<ViewStyle>;
};

/** Tarjeta de mascota del catálogo (solo lectura), como en el prototipo. */
export default function MascotaCard({
  mascota,
  onPress,
  esFavorito,
  onFavorito,
  alturaFoto = 112,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colores.primarioClaro }}
      style={[styles.tarjeta, style]}
      accessibilityRole="button"
      accessibilityLabel={`${mascota.nombre}, ${mascota.edad}, ${mascota.raza}`}>
      <View style={{ height: alturaFoto }}>
        {mascota.imagen ? (
          <Image source={mascota.imagen} style={styles.foto} />
        ) : (
          <View style={[styles.foto, styles.sinFoto]}>
            <Text style={styles.sinFotoTexto}>🐾</Text>
          </View>
        )}
        <Pressable
          onPress={onFavorito}
          hitSlop={6}
          style={styles.botonFavorito}
          accessibilityRole="button"
          accessibilityState={{ selected: esFavorito }}
          accessibilityLabel={
            esFavorito
              ? `Quitar a ${mascota.nombre} de favoritos`
              : `Agregar a ${mascota.nombre} a favoritos`
          }>
          <Text style={styles.corazon}>{esFavorito ? '♥' : '♡'}</Text>
        </Pressable>
      </View>

      <View style={styles.info}>
        <View style={styles.filaNombre}>
          <Text style={styles.nombre} numberOfLines={1}>
            {mascota.nombre}
          </Text>
          <Text style={styles.edad}>{mascota.edad}</Text>
        </View>
        <Text style={styles.detalle} numberOfLines={1}>
          🐾 {mascota.raza}
        </Text>
        <Text style={styles.detalle}>🕒 {haceCuanto(mascota.fechaIngreso)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '48%',
    borderRadius: radios.tarjeta,
    backgroundColor: colores.superficie,
    elevation: 2,
    overflow: 'hidden',
  },
  foto: { width: '100%', height: '100%' },
  sinFoto: {
    backgroundColor: colores.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinFotoTexto: { fontSize: 36 },
  botonFavorito: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  corazon: { fontSize: 20, color: colores.acento, marginTop: -2 },
  info: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 12, gap: 3 },
  filaNombre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 6,
  },
  nombre: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colores.texto,
  },
  edad: { fontSize: 13, fontWeight: '700', color: colores.textoSecundario },
  detalle: { fontSize: 13, color: colores.textoSecundario },
});
