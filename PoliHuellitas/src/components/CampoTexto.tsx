import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colores, radios } from '../theme';

type Props = Omit<TextInputProps, 'style'> & {
  etiqueta: string;
  icono?: string; // emoji a la izquierda
  error?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Campo con etiqueta arriba, ícono a la izquierda y, si es contraseña,
 * un botón de "ojo" para mostrar u ocultar el texto.
 */
export default function CampoTexto({
  etiqueta,
  icono,
  error,
  secureTextEntry,
  style,
  onFocus,
  onBlur,
  ...resto
}: Props) {
  const [enfocado, setEnfocado] = useState(false);
  const [oculto, setOculto] = useState(true);
  const esClave = !!secureTextEntry;

  const colorBorde = error
    ? colores.peligro
    : enfocado
    ? colores.primario
    : colores.borde;

  return (
    <View style={[styles.contenedor, style]}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View style={[styles.caja, { borderColor: colorBorde }]}>
        {icono ? <Text style={styles.icono}>{icono}</Text> : null}
        <TextInput
          {...resto}
          accessibilityLabel={resto.accessibilityLabel ?? etiqueta}
          secureTextEntry={esClave && oculto}
          placeholderTextColor={colores.textoSecundario + '99'}
          selectionColor={colores.primario}
          cursorColor={colores.primario}
          style={styles.input}
          onFocus={e => {
            setEnfocado(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setEnfocado(false);
            onBlur?.(e);
          }}
        />
        {esClave ? (
          <Pressable
            onPress={() => setOculto(o => !o)}
            style={styles.ojo}
            accessibilityRole="button"
            accessibilityLabel={
              oculto ? 'Mostrar contraseña' : 'Ocultar contraseña'
            }>
            <Text style={styles.ojoTexto}>{oculto ? '👁' : '🙈'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: '700', color: colores.texto },
  caja: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: radios.campo,
    backgroundColor: colores.superficie,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
  },
  icono: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colores.texto,
    paddingVertical: 0,
    paddingRight: 14,
  },
  ojo: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ojoTexto: { fontSize: 18 },
  error: { fontSize: 12.5, color: colores.peligro, marginLeft: 4 },
});
