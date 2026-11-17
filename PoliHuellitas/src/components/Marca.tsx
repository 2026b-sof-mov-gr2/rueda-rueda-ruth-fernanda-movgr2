import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colores, marca } from '../theme';

/** Círculo naranja con la huella 🐾. */
export function Logo({ tamano = 56 }: { tamano?: number }) {
  return (
    <View
      style={[
        styles.logo,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
      ]}
      accessibilityLabel="Logo de PoliHuellitas">
      <Text style={{ fontSize: tamano * 0.48 }}>🐾</Text>
    </View>
  );
}

/** Texto "PoliHuellitas" con los dos colores de la marca. */
export function TextoMarca({
  tamano = 26,
  sobreAzul = false,
}: {
  tamano?: number;
  sobreAzul?: boolean;
}) {
  return (
    <Text style={[styles.texto, { fontSize: tamano }]}>
      <Text style={{ color: sobreAzul ? marca.poliSobreAzul : marca.poli }}>
        Poli
      </Text>
      <Text
        style={{
          color: sobreAzul ? marca.huellitasSobreAzul : marca.huellitas,
        }}>
        Huellitas
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontWeight: '800', letterSpacing: -0.3 },
});
