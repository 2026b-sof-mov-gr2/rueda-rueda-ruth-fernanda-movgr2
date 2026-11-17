import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, radios } from '../theme';
import Boton from './Boton';

type Props = {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  icono?: string;
  peligro?: boolean; // botón rojo para acciones destructivas
  onConfirmar: () => void;
  onCancelar: () => void;
};

/** Diálogo de confirmación con el componente nativo Modal. */
export default function ConfirmarModal({
  visible,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  icono,
  peligro = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancelar}>
      <Pressable
        style={styles.velo}
        onPress={onCancelar}
        accessibilityLabel="Cerrar diálogo">
        {/* Pressable interno para que tocar la tarjeta no cierre el diálogo */}
        <Pressable style={styles.tarjeta} onPress={() => {}}>
          <View
            style={[
              styles.circulo,
              {
                backgroundColor: peligro
                  ? colores.peligroClaro
                  : colores.primarioClaro,
              },
            ]}>
            <Text style={styles.icono}>{icono ?? (peligro ? '🗑' : '❓')}</Text>
          </View>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.mensaje}>{mensaje}</Text>
          <View style={styles.botones}>
            <Boton
              titulo={textoCancelar}
              variante="texto"
              onPress={onCancelar}
              style={styles.boton}
            />
            <Boton
              titulo={textoConfirmar}
              variante={peligro ? 'peligro' : 'primario'}
              onPress={onConfirmar}
              style={styles.boton}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  velo: {
    flex: 1,
    backgroundColor: colores.velo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colores.superficie,
    borderRadius: radios.dialogo,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },
  circulo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  icono: { fontSize: 26 },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colores.texto,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 15,
    lineHeight: 21,
    color: colores.textoSecundario,
    textAlign: 'center',
    marginTop: 8,
  },
  botones: { flexDirection: 'row', gap: 10, marginTop: 22, width: '100%' },
  boton: { flex: 1, height: 48, borderRadius: 24, paddingHorizontal: 8 },
});
