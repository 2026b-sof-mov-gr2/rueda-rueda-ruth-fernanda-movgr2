import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores, radios } from '../theme';

export type OpcionSelector = {
  valor: string;
  etiqueta: string;
  detalle?: string;
  imagen?: ImageSourcePropType;
};

type Props = {
  etiqueta: string;
  placeholder: string;
  valor?: string;
  opciones: OpcionSelector[];
  onElegir: (valor: string) => void;
  icono?: string;
  mostrarEtiqueta?: boolean; // false si la tarjeta ya tiene su propio título
};

/**
 * Selector desplegable sin librerías: un Pressable con forma de campo que
 * abre un Modal con la lista de opciones (hoja inferior).
 */
export default function Selector({
  etiqueta,
  placeholder,
  valor,
  opciones,
  onElegir,
  icono,
  mostrarEtiqueta = true,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const insets = useSafeAreaInsets();
  const elegida = opciones.find(o => o.valor === valor);

  return (
    <View style={styles.contenedor}>
      {mostrarEtiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
      <Pressable
        onPress={() => setAbierto(true)}
        style={styles.caja}
        accessibilityRole="button"
        accessibilityLabel={`${etiqueta}: ${elegida?.etiqueta ?? placeholder}`}>
        {elegida?.imagen ? (
          <Image source={elegida.imagen} style={styles.miniatura} />
        ) : icono ? (
          <Text style={styles.icono}>{icono}</Text>
        ) : null}
        <Text
          style={[styles.valor, !elegida && styles.placeholder]}
          numberOfLines={1}>
          {elegida?.etiqueta ?? placeholder}
        </Text>
        <Text style={styles.flecha}>▾</Text>
      </Pressable>

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setAbierto(false)}>
        <Pressable
          style={styles.velo}
          onPress={() => setAbierto(false)}
          accessibilityLabel="Cerrar selector">
          <Pressable
            style={[styles.hoja, { paddingBottom: insets.bottom + 12 }]}
            onPress={() => {}}>
            <View style={styles.agarre} />
            <Text style={styles.tituloHoja}>{etiqueta}</Text>
            <ScrollView>
              {opciones.map(o => {
                const activa = o.valor === valor;
                return (
                  <Pressable
                    key={o.valor}
                    onPress={() => {
                      onElegir(o.valor);
                      setAbierto(false);
                    }}
                    android_ripple={{ color: colores.primarioClaro }}
                    style={[styles.opcion, activa && styles.opcionActiva]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: activa }}>
                    {o.imagen ? (
                      <Image source={o.imagen} style={styles.fotoOpcion} />
                    ) : null}
                    <View style={styles.textosOpcion}>
                      <Text style={styles.etiquetaOpcion}>{o.etiqueta}</Text>
                      {o.detalle ? (
                        <Text style={styles.detalleOpcion}>{o.detalle}</Text>
                      ) : null}
                    </View>
                    {activa ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: '700', color: colores.texto },
  caja: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colores.borde,
    borderRadius: radios.campo,
    backgroundColor: colores.superficie,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  icono: { fontSize: 16 },
  miniatura: { width: 30, height: 30, borderRadius: 15 },
  valor: { flex: 1, fontSize: 15, color: colores.texto },
  placeholder: { color: colores.textoSecundario + '99' },
  flecha: { fontSize: 16, color: colores.textoSecundario },
  velo: { flex: 1, backgroundColor: colores.velo, justifyContent: 'flex-end' },
  hoja: {
    maxHeight: '75%',
    backgroundColor: colores.fondo,
    borderTopLeftRadius: radios.dialogo,
    borderTopRightRadius: radios.dialogo,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  agarre: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.borde,
    marginBottom: 12,
  },
  tituloHoja: {
    fontSize: 18,
    fontWeight: '800',
    color: colores.texto,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  opcionActiva: { backgroundColor: colores.primarioClaro },
  fotoOpcion: { width: 44, height: 44, borderRadius: 22 },
  textosOpcion: { flex: 1 },
  etiquetaOpcion: { fontSize: 16, fontWeight: '700', color: colores.texto },
  detalleOpcion: { fontSize: 13, color: colores.textoSecundario },
  check: { fontSize: 18, fontWeight: '900', color: colores.primario },
});
