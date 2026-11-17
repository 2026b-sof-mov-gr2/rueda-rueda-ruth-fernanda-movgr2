import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import { Logo } from '../components/Marca';
import Pantalla from '../components/Pantalla';
import PieEnlace from '../components/PieEnlace';
import { useNav } from '../navegacion';
import { colores } from '../theme';
import { aplicarMascaraFecha, esFechaValida } from '../utils/fecha';
import { mostrarToast } from '../utils/toast';
import { esCorreoValido, MIN_CLAVE } from '../utils/validacion';

/** Pantalla 4: Regístrate. */
export default function RegistroScreen() {
  const { volver, reiniciar } = useNav();
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [intentado, setIntentado] = useState(false);

  const errores = {
    nombre: !nombre.trim() ? 'Ingresa tu nombre completo' : undefined,
    fecha: !fecha
      ? 'Ingresa tu fecha de nacimiento'
      : !esFechaValida(fecha)
      ? 'Usa una fecha válida (DD/MM/AAAA)'
      : undefined,
    correo: !correo.trim()
      ? 'Ingresa tu correo'
      : !esCorreoValido(correo)
      ? 'El correo no tiene un formato válido'
      : undefined,
    clave:
      clave.length < MIN_CLAVE
        ? `La contraseña debe tener al menos ${MIN_CLAVE} caracteres`
        : undefined,
    confirmar:
      !confirmar || confirmar !== clave
        ? 'Las contraseñas no coinciden'
        : undefined,
  };
  const hayErrores = Object.values(errores).some(Boolean);
  const mostrar = (e?: string) => (intentado ? e : undefined);

  const registrarme = () => {
    setIntentado(true);
    if (hayErrores) {
      mostrarToast('Revisa los campos marcados');
      return;
    }
    mostrarToast('¡Cuenta creada! Bienvenido a PoliHuellitas');
    reiniciar({ nombre: 'principal' });
  };

  return (
    <Pantalla scroll contenidoStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo} accessibilityRole="header">
          Regístrate
        </Text>
        <Logo tamano={48} />
        <Text style={styles.subtitulo}>Crea tu cuenta en PoliHuellitas</Text>
      </View>

      <View style={styles.campos}>
        <CampoTexto
          etiqueta="Nombre completo"
          icono="👤"
          placeholder="Nombres y Apellidos"
          autoCapitalize="words"
          autoComplete="name"
          value={nombre}
          onChangeText={setNombre}
          error={mostrar(errores.nombre)}
        />
        <CampoTexto
          etiqueta="Fecha de nacimiento"
          icono="📅"
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          maxLength={10}
          value={fecha}
          onChangeText={t => setFecha(aplicarMascaraFecha(t))}
          error={mostrar(errores.fecha)}
        />
        <CampoTexto
          etiqueta="Correo electrónico"
          icono="✉️"
          placeholder="Ingresa tu correo"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={correo}
          onChangeText={setCorreo}
          error={mostrar(errores.correo)}
        />
        <CampoTexto
          etiqueta="Contraseña"
          icono="🔒"
          placeholder={`Mínimo ${MIN_CLAVE} caracteres`}
          secureTextEntry
          autoComplete="new-password"
          value={clave}
          onChangeText={setClave}
          error={mostrar(errores.clave)}
        />
        <CampoTexto
          etiqueta="Confirmar contraseña"
          icono="🔒"
          placeholder="Repite tu contraseña"
          secureTextEntry
          autoComplete="new-password"
          value={confirmar}
          onChangeText={setConfirmar}
          onSubmitEditing={registrarme}
          error={mostrar(errores.confirmar)}
        />
      </View>

      <Boton titulo="Registrarme" onPress={registrarme} />

      <View style={styles.espaciador} />
      <PieEnlace
        pregunta="¿Ya tienes cuenta?"
        enlace="Inicia sesión"
        onPress={volver}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 24, paddingTop: 28 },
  cabecera: { alignItems: 'center', gap: 8, marginBottom: 22 },
  titulo: { fontSize: 26, fontWeight: '800', color: colores.primario },
  subtitulo: { fontSize: 15, color: colores.textoSecundario },
  campos: { gap: 14, marginBottom: 24 },
  espaciador: { flex: 1, minHeight: 24 },
});
