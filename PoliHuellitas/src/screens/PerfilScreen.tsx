import React from 'react';
import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Pantalla from '../components/Pantalla';
import { useAppEstado } from '../estado/AppEstado';
import { Ruta, useNav } from '../navegacion';
import { colores, radios } from '../theme';
import { mostrarToast } from '../utils/toast';

type Opcion = {
  icono: string;
  etiqueta: string;
  fondoIcono: string;
  ruta?: Ruta;
  peligro?: boolean;
};

const opciones: Opcion[] = [
  {
    icono: '🐾',
    etiqueta: 'Mis solicitudes',
    fondoIcono: colores.primarioClaro,
    ruta: { nombre: 'solicitudes' },
  },
  {
    icono: '🧡',
    etiqueta: 'Mascotas favoritas',
    fondoIcono: colores.acentoClaro,
    ruta: { nombre: 'favoritos' },
  },
  {
    icono: '⚙️',
    etiqueta: 'Configuración',
    fondoIcono: colores.primarioClaro,
    ruta: { nombre: 'configuracion' },
  },
  {
    icono: '↪️',
    etiqueta: 'Cerrar sesión',
    fondoIcono: colores.peligroClaro,
    peligro: true,
  },
];

/** Pantalla 14: Mi perfil. */
export default function PerfilScreen() {
  const { usuario } = useAppEstado();
  const { ir, reiniciar } = useNav();
  const insets = useSafeAreaInsets();

  const cerrarSesion = () => {
    // Diálogo nativo de Android (AlertDialog)
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          mostrarToast('Sesión cerrada');
          reiniciar({ nombre: 'login' });
        },
      },
    ]);
  };

  return (
    // Sin borde superior: el encabezado azul llega hasta arriba.
    <Pantalla
      scroll
      tabActiva="perfil"
      edges={['left', 'right']}
      contenidoStyle={styles.contenido}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.encabezado, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.titulo} accessibilityRole="header">
          Mi perfil
        </Text>
        <View style={styles.avatar} accessibilityLabel="Foto de perfil">
          <Text style={styles.avatarIcono}>👤</Text>
        </View>
        <Text style={styles.nombre}>{usuario.nombre}</Text>
      </View>

      <View style={styles.menu}>
        {opciones.map(o => (
          <Pressable
            key={o.etiqueta}
            onPress={() => (o.ruta ? ir(o.ruta) : cerrarSesion())}
            android_ripple={{ color: colores.primarioClaro }}
            style={styles.opcion}
            accessibilityRole="button">
            <View style={[styles.cajaIcono, { backgroundColor: o.fondoIcono }]}>
              <Text style={styles.icono}>{o.icono}</Text>
            </View>
            <Text style={[styles.etiqueta, o.peligro && styles.etiquetaPeligro]}>
              {o.etiqueta}
            </Text>
            {o.ruta ? <Text style={styles.chevron}>›</Text> : null}
          </Pressable>
        ))}
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 0 },
  encabezado: {
    backgroundColor: colores.primario,
    alignItems: 'center',
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 12,
  },
  titulo: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colores.acento,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcono: { fontSize: 42 },
  nombre: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  menu: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 60,
    paddingHorizontal: 14,
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    elevation: 2,
    overflow: 'hidden',
  },
  cajaIcono: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icono: { fontSize: 18 },
  etiqueta: { flex: 1, fontSize: 15.5, fontWeight: '700', color: colores.texto },
  etiquetaPeligro: { color: colores.peligro },
  chevron: { fontSize: 24, color: colores.textoSecundario, marginTop: -2 },
});
