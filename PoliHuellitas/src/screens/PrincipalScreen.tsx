import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Carrusel from '../components/Carrusel';
import { Logo, TextoMarca } from '../components/Marca';
import Pantalla from '../components/Pantalla';
import { Mascota } from '../data/mascotas';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores } from '../theme';
import { mostrarToast } from '../utils/toast';

// TODO bloque 6: el texto y los colores del banner vendrán del Native Module
// (recursos values / values-en / values-land / values-en-land).
const banner = {
  texto: 'Adopta, no compres',
  colorFuente: '#FFFFFF',
  colorFondo: colores.primario,
};

// Reemplaza estos enlaces por las cuentas reales del club PoliPerros.
const redes = [
  { nombre: 'Instagram', icono: '📷', url: 'https://www.instagram.com/' },
  { nombre: 'Facebook', icono: '👍', url: 'https://www.facebook.com/' },
  { nombre: 'TikTok', icono: '🎵', url: 'https://www.tiktok.com/' },
  { nombre: 'WhatsApp', icono: '💬', url: 'https://wa.me/' },
];

/** Pantalla 5: Principal. */
export default function PrincipalScreen() {
  const { ir, irATab } = useNav();
  const { mascotas, esFavorito, alternarFavorito } = useAppEstado();
  const disponibles = mascotas.filter(m => m.disponible);

  const favorito = (m: Mascota) => {
    mostrarToast(
      esFavorito(m.id)
        ? `${m.nombre} quitado de favoritos`
        : `${m.nombre} agregado a favoritos`,
    );
    alternarFavorito(m.id);
  };

  const abrirRed = (url: string, nombre: string) => {
    Linking.openURL(url).catch(() =>
      mostrarToast(`No se pudo abrir ${nombre}`),
    );
  };

  return (
    <Pantalla scroll tabActiva="principal" contenidoStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <Logo tamano={40} />
        <TextoMarca tamano={24} />
      </View>

      {/* Banner del desafío de recursos nativos */}
      <View style={[styles.banner, { backgroundColor: banner.colorFondo }]}>
        <View style={styles.bannerTextos}>
          <Text style={[styles.bannerTitulo, { color: banner.colorFuente }]}>
            {banner.texto}
          </Text>
          <Text style={[styles.bannerSub, { color: banner.colorFuente }]}>
            Conoce a los poliperros que buscan hogar
          </Text>
        </View>
        <LogoPoliPerros />
      </View>

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo} accessibilityRole="header">
          Mascotas en adopción
        </Text>
        <Pressable
          onPress={() => irATab('mascotas')}
          style={styles.verTodas}
          accessibilityRole="link">
          <Text style={styles.verTodasTexto}>Ver todas ›</Text>
        </Pressable>
      </View>

      {disponibles.length > 0 ? (
        <Carrusel
          mascotas={disponibles}
          esFavorito={esFavorito}
          onAbrir={m => ir({ nombre: 'detalle', id: m.id })}
          onFavorito={favorito}
        />
      ) : (
        <Text style={styles.vacio}>Por ahora no hay mascotas en adopción 🐾</Text>
      )}

      <Text style={styles.contactanos} accessibilityRole="header">
        Contáctanos
      </Text>
      <View style={styles.redes}>
        {redes.map(r => (
          <Pressable
            key={r.nombre}
            onPress={() => abrirRed(r.url, r.nombre)}
            style={styles.red}
            android_ripple={{ color: colores.borde, borderless: true }}
            accessibilityRole="link"
            accessibilityLabel={r.nombre}>
            <Text style={styles.redIcono}>{r.icono}</Text>
          </Pressable>
        ))}
      </View>
    </Pantalla>
  );
}

/**
 * Marcador del logo de PoliPerros. Cuando exista src/assets/logo_poliperros.png
 * se reemplaza por <Image source={require('../assets/logo_poliperros.png')} />.
 */
function LogoPoliPerros() {
  return (
    <View style={styles.logoPP} accessibilityLabel="Logo de PoliPerros">
      <Text style={styles.logoPPPoli}>POLI</Text>
      <Text style={styles.logoPPPerros}>PERROS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingHorizontal: 0, paddingTop: 8 },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  banner: {
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  bannerTextos: { flex: 1, gap: 6 },
  bannerTitulo: { fontSize: 24, lineHeight: 29, fontWeight: '800' },
  bannerSub: { fontSize: 13.5, lineHeight: 19, opacity: 0.9 },
  logoPP: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colores.acento,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPPPoli: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  logoPPPerros: {
    fontSize: 17,
    fontWeight: '900',
    color: colores.primario,
    marginTop: -4,
  },
  seccion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 8,
    marginTop: 22,
    marginBottom: 4,
  },
  seccionTitulo: { fontSize: 18, fontWeight: '800', color: colores.texto },
  verTodas: { minHeight: 48, paddingHorizontal: 12, justifyContent: 'center' },
  verTodasTexto: { fontSize: 14, fontWeight: '800', color: colores.primario },
  vacio: {
    textAlign: 'center',
    color: colores.textoSecundario,
    marginVertical: 24,
  },
  contactanos: {
    fontSize: 18,
    fontWeight: '800',
    color: colores.texto,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  redes: { flexDirection: 'row', justifyContent: 'center', gap: 14 },
  red: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colores.primarioClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redIcono: { fontSize: 22 },
});
