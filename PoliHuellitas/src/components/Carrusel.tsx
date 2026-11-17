import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Mascota } from '../data/mascotas';
import { colores } from '../theme';
import MascotaCard from './MascotaCard';

const POR_PAGINA = 2;
const MARGEN = 24; // espacio a los lados de cada página
const ESPACIO = 12; // espacio entre tarjetas
const ALTURA_FOTO = 112;

type Props = {
  mascotas: Mascota[];
  esFavorito: (id: string) => boolean;
  onAbrir: (m: Mascota) => void;
  onFavorito: (m: Mascota) => void;
};

/** Carrusel horizontal (FlatList horizontal + pagingEnabled) con flechas y puntos. */
export default function Carrusel({
  mascotas,
  esFavorito,
  onAbrir,
  onFavorito,
}: Props) {
  const ref = useRef<FlatList<Mascota[]>>(null);
  const [ancho, setAncho] = useState(0);
  const [pagina, setPagina] = useState(0);
  const paginaRef = useRef(0);

  // Agrupa las mascotas de 2 en 2: cada grupo es una página.
  const paginas = useMemo(() => {
    const grupos: Mascota[][] = [];
    for (let i = 0; i < mascotas.length; i += POR_PAGINA) {
      grupos.push(mascotas.slice(i, i + POR_PAGINA));
    }
    return grupos;
  }, [mascotas]);

  const ultima = Math.max(paginas.length - 1, 0);
  const actual = Math.min(pagina, ultima); // por si se eliminaron mascotas

  // Al rotar cambia el ancho: volvemos a colocar la página que se veía.
  useEffect(() => {
    if (ancho > 0) {
      ref.current?.scrollToOffset({
        offset: paginaRef.current * ancho,
        animated: false,
      });
    }
  }, [ancho]);

  const cambiarPagina = (p: number) => {
    paginaRef.current = p;
    setPagina(p);
  };

  const irA = (p: number) => {
    const destino = Math.max(0, Math.min(p, ultima));
    cambiarPagina(destino);
    ref.current?.scrollToOffset({ offset: destino * ancho, animated: true });
  };

  const alTerminarDesplazamiento = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (ancho > 0) {
      cambiarPagina(Math.round(e.nativeEvent.contentOffset.x / ancho));
    }
  };

  const anchoTarjeta = (ancho - MARGEN * 2 - ESPACIO) / POR_PAGINA;

  return (
    <View onLayout={(e: LayoutChangeEvent) => setAncho(e.nativeEvent.layout.width)}>
      {ancho > 0 ? (
        <FlatList
          ref={ref}
          data={paginas}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={grupo => grupo.map(m => m.id).join('-')}
          onMomentumScrollEnd={alTerminarDesplazamiento}
          getItemLayout={(_, index) => ({
            length: ancho,
            offset: ancho * index,
            index,
          })}
          renderItem={({ item: grupo }) => (
            <View style={[styles.pagina, { width: ancho }]}>
              {grupo.map(m => (
                <MascotaCard
                  key={m.id}
                  mascota={m}
                  accion="favorito"
                  esFavorito={esFavorito(m.id)}
                  onPress={() => onAbrir(m)}
                  onAccion={() => onFavorito(m)}
                  alturaFoto={ALTURA_FOTO}
                  style={{ width: anchoTarjeta }}
                />
              ))}
            </View>
          )}
        />
      ) : null}

      {actual > 0 ? (
        <Flecha lado="izquierda" onPress={() => irA(actual - 1)} />
      ) : null}
      {actual < ultima ? (
        <Flecha lado="derecha" onPress={() => irA(actual + 1)} />
      ) : null}

      <View style={styles.puntos}>
        {paginas.map((g, i) => (
          <View
            key={g[0].id}
            style={[styles.punto, i === actual && styles.puntoActivo]}
          />
        ))}
      </View>
    </View>
  );
}

function Flecha({
  lado,
  onPress,
}: {
  lado: 'izquierda' | 'derecha';
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.flecha,
        lado === 'izquierda' ? styles.flechaIzq : styles.flechaDer,
      ]}
      accessibilityRole="button"
      accessibilityLabel={lado === 'izquierda' ? 'Anteriores' : 'Siguientes'}>
      <Text style={styles.flechaTexto}>{lado === 'izquierda' ? '‹' : '›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pagina: {
    flexDirection: 'row',
    gap: ESPACIO,
    paddingHorizontal: MARGEN,
    paddingVertical: 6, // deja ver la sombra de las tarjetas
  },
  flecha: {
    position: 'absolute',
    top: 6 + ALTURA_FOTO / 2 - 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  flechaIzq: { left: 6 },
  flechaDer: { right: 6 },
  flechaTexto: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '700',
    color: colores.primario,
    marginTop: -2,
  },
  puntos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colores.borde,
  },
  puntoActivo: { width: 20, backgroundColor: colores.primario },
});
