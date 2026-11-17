import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { Tab } from '../navegacion';
import { colores } from '../theme';
import BarraInferior from './BarraInferior';

type Props = {
  children: ReactNode;
  encabezado?: ReactNode; // fijo arriba, no se desplaza
  scroll?: boolean; // envuelve el contenido en un ScrollView
  tabActiva?: Tab; // si se indica, muestra la barra inferior
  pie?: ReactNode; // fijo abajo (por ejemplo, el botón principal)
  edges?: Edge[];
  fondo?: string;
  contenidoStyle?: StyleProp<ViewStyle>;
};

/** Contenedor base de todas las pantallas (respeta las zonas seguras). */
export default function Pantalla({
  children,
  encabezado,
  scroll = false,
  tabActiva,
  pie,
  edges,
  fondo = colores.fondo,
  contenidoStyle,
}: Props) {
  // Si hay barra inferior, ella misma deja el espacio de abajo.
  const bordes: Edge[] =
    edges ??
    (tabActiva ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right']);

  return (
    <SafeAreaView
      style={[styles.raiz, { backgroundColor: fondo }]}
      edges={bordes}>
      {encabezado}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scroll, contenidoStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contenidoStyle]}>{children}</View>
      )}
      {pie ? <View style={styles.pie}>{pie}</View> : null}
      {tabActiva ? <BarraInferior activa={tabActiva} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
  pie: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
});
