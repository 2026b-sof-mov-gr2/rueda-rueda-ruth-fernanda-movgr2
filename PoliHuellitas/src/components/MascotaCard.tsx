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
  onPress: () => void;
  onLongPress?: () => void;
  // Botón redondo arriba a la derecha: 🗑 (CRUD) o corazón (favoritos)
  accion: 'eliminar' | 'favorito';
  onAccion: () => void;
  esFavorito?: boolean;
  alturaFoto?: DimensionValue;
  style?: StyleProp<ViewStyle>;
};

export default function MascotaCard({
  mascota,
  onPress,
  onLongPress,
  accion,
  onAccion,
  esFavorito = false,
  alturaFoto = 112,
  style,
}: Props) {
  const etiquetaAccion =
    accion === 'eliminar'
      ? `Eliminar a ${mascota.nombre}`
      : esFavorito
      ? `Quitar a ${mascota.nombre} de favoritos`
      : `Agregar a ${mascota.nombre} a favoritos`;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
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
          onPress={onAccion}
          hitSlop={6}
          style={styles.botonAccion}
          accessibilityRole="button"
          accessibilityLabel={etiquetaAccion}>
          {accion === 'eliminar' ? (
            <Text style={styles.iconoEliminar}>🗑</Text>
          ) : (
            <Text style={styles.corazon}>{esFavorito ? '♥' : '♡'}</Text>
          )}
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
  botonAccion: {
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
  iconoEliminar: { fontSize: 16 },
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
