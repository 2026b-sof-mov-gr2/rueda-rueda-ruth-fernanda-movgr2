import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRecursosNativos } from '../native/RecursosNativos';
import { colores } from '../theme';

/**
 * Banner "Adopta, no compres" de la pantalla Principal.
 * El texto, el color de fuente y el color de fondo vienen de los recursos
 * nativos de Android (values / values-en / values-land / values-en-land).
 */
export default function BannerDesafio() {
  const { recursos, error } = useRecursosNativos();

  if (!recursos) {
    return (
      <View style={[styles.banner, styles.cargando]}>
        {error ? (
          <Text style={styles.error}>⚠️ {error}</Text>
        ) : (
          <ActivityIndicator color={colores.primario} />
        )}
      </View>
    );
  }

  const { texto, subtitulo, carpeta, colorFuente, colorFondo } = recursos;
  // Estilos dinámicos: los colores llegan desde Android.
  const fondo = { backgroundColor: colorFondo, borderColor: colorFuente + '33' };
  const fuente = { color: colorFuente };

  return (
    <View
      style={[styles.banner, fondo]}
      accessibilityLabel={`${texto}. ${subtitulo}`}>
      <View style={styles.textos}>
        <Text style={[styles.titulo, fuente]}>{texto}</Text>
        <Text style={[styles.subtitulo, fuente]}>{subtitulo}</Text>
        {/* Evidencia para las capturas: qué carpeta eligió Android */}
        <View style={[styles.chip, { borderColor: colorFuente + '66' }]}>
          <Text style={[styles.chipTexto, fuente]}>📁 {carpeta}</Text>
        </View>
      </View>
      <LogoPoliPerros />
    </View>
  );
}

/**
 * Marcador del logo de PoliPerros. Cuando exista src/assets/logo_poliperros.png
 * se reemplaza por <Image source={require('../assets/logo_poliperros.png')} />.
 */
function LogoPoliPerros() {
  return (
    <View style={styles.logo} accessibilityLabel="Logo de PoliPerros">
      <Text style={styles.logoPoli}>POLI</Text>
      <Text style={styles.logoPerros}>PERROS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    minHeight: 136,
  },
  cargando: {
    backgroundColor: colores.superficie,
    borderColor: colores.borde,
    justifyContent: 'center',
  },
  error: { flex: 1, fontSize: 13.5, color: colores.peligro, textAlign: 'center' },
  textos: { flex: 1, gap: 6, alignItems: 'flex-start' },
  titulo: { fontSize: 24, lineHeight: 29, fontWeight: '800' },
  subtitulo: { fontSize: 13.5, lineHeight: 19, opacity: 0.9 },
  chip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  chipTexto: { fontSize: 11, fontWeight: '700' },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colores.acento,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPoli: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  logoPerros: {
    fontSize: 17,
    fontWeight: '900',
    color: colores.primario,
    marginTop: -4,
  },
});
