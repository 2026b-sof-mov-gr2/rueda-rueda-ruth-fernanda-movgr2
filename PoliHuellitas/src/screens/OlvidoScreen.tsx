import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import Encabezado from '../components/Encabezado';
import Pantalla from '../components/Pantalla';
import PieEnlace from '../components/PieEnlace';
import { useNav } from '../navegacion';
import { colores } from '../theme';
import { mostrarToast } from '../utils/toast';
import { esCorreoValido } from '../utils/validacion';

/** Pantalla 3: Olvidaste tu contraseña. */
export default function OlvidoScreen() {
  const { volver } = useNav();
  const [correo, setCorreo] = useState('');
  const [intentado, setIntentado] = useState(false);

  const error = !correo.trim()
    ? 'Ingresa tu correo'
    : !esCorreoValido(correo)
    ? 'El correo no tiene un formato válido'
    : undefined;

  const enviar = () => {
    setIntentado(true);
    if (error) {
      return;
    }
    mostrarToast(`Te enviamos un enlace a ${correo.trim()}`);
    volver();
  };

  return (
    <Pantalla
      scroll
      encabezado={<Encabezado titulo="Olvidaste tu contraseña" />}
      contenidoStyle={styles.contenido}>
      {/* Ilustración: sobre con "rayitos" naranjas */}
      <View style={styles.ilustracion} accessibilityElementsHidden>
        <View style={styles.rayos}>
          <View style={[styles.rayo, styles.rayoArriba]} />
          <View style={styles.rayo} />
          <View style={[styles.rayo, styles.rayoAbajo]} />
        </View>
        <Text style={styles.sobre}>✉️</Text>
        <View style={styles.rayos}>
          <View style={[styles.rayo, styles.rayoAbajo]} />
          <View style={styles.rayo} />
          <View style={[styles.rayo, styles.rayoArriba]} />
        </View>
      </View>

      <Text style={styles.titulo} accessibilityRole="header">
        ¿No recuerdas tu clave?
      </Text>
      <Text style={styles.texto}>
        Ingresa tu correo electrónico y te enviaremos un enlace para
        restablecer tu contraseña.
      </Text>

      <CampoTexto
        etiqueta="Correo electrónico"
        icono="✉️"
        placeholder="Ingresa tu correo"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={correo}
        onChangeText={setCorreo}
        onSubmitEditing={enviar}
        error={intentado ? error : undefined}
        style={styles.campo}
      />

      <Boton titulo="Enviar enlace" icono="➤" onPress={enviar} />

      <View style={styles.espaciador} />
      <PieEnlace
        pregunta="¿Ya la recordaste?"
        enlace="Inicia sesión"
        onPress={volver}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 24, paddingTop: 8 },
  ilustracion: {
    height: 180,
    borderRadius: 24,
    backgroundColor: colores.acentoClaro,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 28,
  },
  sobre: { fontSize: 72 },
  rayos: { gap: 12 },
  rayo: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colores.acento,
  },
  rayoArriba: { transform: [{ rotate: '-20deg' }] },
  rayoAbajo: { transform: [{ rotate: '20deg' }] },
  titulo: { fontSize: 22, fontWeight: '800', color: colores.primario },
  texto: {
    fontSize: 15,
    lineHeight: 22,
    color: colores.textoSecundario,
    marginTop: 6,
  },
  campo: { marginTop: 22, marginBottom: 20 },
  espaciador: { flex: 1, minHeight: 24 },
});
