import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colores, radios } from '../theme';

type Variante = 'primario' | 'secundario' | 'contorno' | 'peligro' | 'texto';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icono?: string; // emoji opcional antes del texto
  deshabilitado?: boolean;
  style?: StyleProp<ViewStyle>;
};

const estilosVariante: Record<
  Variante,
  { fondo: string; texto: string; borde?: string; elevacion: number }
> = {
  primario: { fondo: colores.primario, texto: '#FFFFFF', elevacion: 3 },
  secundario: {
    fondo: colores.primarioClaro,
    texto: colores.primario,
    elevacion: 0,
  },
  contorno: {
    fondo: colores.superficie,
    texto: colores.texto,
    borde: colores.borde,
    elevacion: 0,
  },
  peligro: { fondo: colores.peligro, texto: '#FFFFFF', elevacion: 3 },
  texto: { fondo: 'transparent', texto: colores.primario, elevacion: 0 },
};

export default function Boton({
  titulo,
  onPress,
  variante = 'primario',
  icono,
  deshabilitado = false,
  style,
}: Props) {
  const v = estilosVariante[variante];
  const estiloVariante: ViewStyle = {
    backgroundColor: v.fondo,
    elevation: deshabilitado ? 0 : v.elevacion,
    borderWidth: v.borde ? 1.5 : 0,
    borderColor: v.borde,
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
      android_ripple={{
        color: variante === 'primario' || variante === 'peligro'
          ? '#FFFFFF40'
          : colores.primarioClaro,
      }}
      style={[
        styles.boton,
        estiloVariante,
        deshabilitado && styles.deshabilitado,
        style,
      ]}>
      <Text style={[styles.texto, { color: v.texto }]} numberOfLines={1}>
        {icono ? `${icono}  ` : ''}
        {titulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    height: 54,
    borderRadius: radios.boton,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  texto: { fontSize: 16, fontWeight: '800' },
  deshabilitado: { opacity: 0.45 },
});
