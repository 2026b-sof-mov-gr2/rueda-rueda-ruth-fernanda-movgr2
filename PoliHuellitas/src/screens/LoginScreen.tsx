import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import { Logo, TextoMarca } from '../components/Marca';
import Pantalla from '../components/Pantalla';
import PieEnlace from '../components/PieEnlace';
import { useNav } from '../navegacion';
import { colores } from '../theme';
import { mostrarToast } from '../utils/toast';
import { esCorreoValido } from '../utils/validacion';

/** Pantalla 2: Iniciar sesión. */
export default function LoginScreen() {
  const { ir, reiniciar } = useNav();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [intentado, setIntentado] = useState(false); // mostrar errores tras el primer intento

  const errorCorreo = !correo.trim()
    ? 'Ingresa tu correo'
    : !esCorreoValido(correo)
    ? 'El correo no tiene un formato válido'
    : undefined;
  const errorClave = !clave ? 'Ingresa tu contraseña' : undefined;

  const ingresar = () => {
    setIntentado(true);
    if (errorCorreo || errorClave) {
      return;
    }
    mostrarToast('¡Bienvenido a PoliHuellitas!');
    reiniciar({ nombre: 'principal' });
  };

  const conGoogle = () => {
    mostrarToast('Sesión iniciada con Google');
    reiniciar({ nombre: 'principal' });
  };

  return (
    <Pantalla scroll contenidoStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <Logo tamano={68} />
        <TextoMarca tamano={26} />
        <Text style={styles.titulo} accessibilityRole="header">
          Iniciar sesión
        </Text>
      </View>

      <View style={styles.campos}>
        <CampoTexto
          etiqueta="Correo electrónico"
          icono="✉️"
          placeholder="Ingresa tu correo"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
          error={intentado ? errorCorreo : undefined}
        />
        <CampoTexto
          etiqueta="Contraseña"
          icono="🔒"
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          autoComplete="password"
          value={clave}
          onChangeText={setClave}
          onSubmitEditing={ingresar}
          error={intentado ? errorClave : undefined}
        />
      </View>

      <Boton titulo="Ingresar" onPress={ingresar} />

      <Pressable
        onPress={() => ir({ nombre: 'olvido' })}
        style={styles.enlaceOlvido}
        accessibilityRole="link">
        <Text style={styles.enlaceOlvidoTexto}>¿Olvidaste tu contraseña?</Text>
      </Pressable>

      <View style={styles.divisor}>
        <View style={styles.linea} />
        <Text style={styles.divisorTexto}>o</Text>
        <View style={styles.linea} />
      </View>

      <Boton
        titulo="Continuar con Google"
        variante="contorno"
        icono={<Text style={styles.g}>G</Text>}
        onPress={conGoogle}
      />

      <View style={styles.espaciador} />
      <PieEnlace
        pregunta="¿No tienes cuenta?"
        enlace="Regístrate"
        onPress={() => ir({ nombre: 'registro' })}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 24, paddingTop: 40 },
  cabecera: { alignItems: 'center', gap: 8, marginBottom: 28 },
  titulo: { fontSize: 18, fontWeight: '800', color: colores.texto },
  campos: { gap: 16, marginBottom: 24 },
  enlaceOlvido: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  enlaceOlvidoTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.primario,
    textDecorationLine: 'underline',
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  linea: { flex: 1, height: 1, backgroundColor: colores.divisor },
  divisorTexto: { fontSize: 13, color: colores.textoSecundario },
  g: { fontSize: 18, fontWeight: '900', color: '#4285F4' },
  espaciador: { flex: 1, minHeight: 24 },
});
