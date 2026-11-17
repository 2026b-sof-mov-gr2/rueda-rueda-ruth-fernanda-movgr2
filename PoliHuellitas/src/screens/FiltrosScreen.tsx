import React, { ReactNode, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import Casilla from '../components/Casilla';
import Encabezado from '../components/Encabezado';
import Pantalla from '../components/Pantalla';
import Selector from '../components/Selector';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores, radios } from '../theme';
import {
  Filtros,
  filtrosVacios,
  RANGOS_EDAD,
  RangoEdad,
  SEXOS,
  TAMANOS,
} from '../utils/filtros';
import { mostrarToast } from '../utils/toast';

/** Agrega o quita un valor de una lista (para las casillas). */
function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor)
    ? lista.filter(v => v !== valor)
    : [...lista, valor];
}

/** Pantalla 11: Filtros de búsqueda. */
export default function FiltrosScreen() {
  const { mascotas, filtros, setFiltros } = useAppEstado();
  const { volver } = useNav();
  // Borrador: los cambios solo se aplican al tocar "Aplicar filtros".
  const [borrador, setBorrador] = useState<Filtros>(filtros);

  const opcionesRaza = useMemo(() => {
    const razas = Array.from(new Set(mascotas.map(m => m.raza))).sort();
    return [
      { valor: 'Todas', etiqueta: 'Todas' },
      ...razas.map(r => ({ valor: r, etiqueta: r })),
    ];
  }, [mascotas]);

  const aplicar = () => {
    setFiltros(borrador);
    mostrarToast('Filtros aplicados');
    volver();
  };

  return (
    <Pantalla
      scroll
      encabezado={
        <Encabezado
          titulo="Filtros de búsqueda"
          derecha={
            <Pressable
              onPress={() => setBorrador(filtrosVacios)}
              style={styles.limpiar}
              accessibilityRole="button"
              accessibilityLabel="Limpiar filtros">
              <Text style={styles.limpiarTexto}>Limpiar</Text>
            </Pressable>
          }
        />
      }
      contenidoStyle={styles.contenido}
      pie={<Boton titulo="Aplicar filtros" icono="✓" onPress={aplicar} />}>
      <Tarjeta titulo="Tamaño">
        {TAMANOS.map(t => (
          <Casilla
            key={t}
            etiqueta={t}
            marcada={borrador.tamanos.includes(t)}
            onPress={() =>
              setBorrador(b => ({ ...b, tamanos: alternar(b.tamanos, t) }))
            }
          />
        ))}
      </Tarjeta>

      <Tarjeta titulo="Sexo">
        {SEXOS.map(s => (
          <Casilla
            key={s}
            etiqueta={s}
            marcada={borrador.sexos.includes(s)}
            onPress={() =>
              setBorrador(b => ({ ...b, sexos: alternar(b.sexos, s) }))
            }
          />
        ))}
      </Tarjeta>

      <Tarjeta titulo="Edad">
        <Selector
          etiqueta="Edad"
          mostrarEtiqueta={false}
          placeholder="Todas"
          valor={borrador.edad}
          opciones={[...RANGOS_EDAD]}
          onElegir={v => setBorrador(b => ({ ...b, edad: v as RangoEdad }))}
        />
      </Tarjeta>

      <Tarjeta titulo="Raza">
        <Selector
          etiqueta="Raza"
          mostrarEtiqueta={false}
          placeholder="Todas"
          valor={borrador.raza}
          opciones={opcionesRaza}
          onElegir={v => setBorrador(b => ({ ...b, raza: v }))}
        />
      </Tarjeta>
    </Pantalla>
  );
}

function Tarjeta({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.tituloTarjeta} accessibilityRole="header">
        {titulo}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: 14, paddingTop: 4 },
  limpiar: { minHeight: 44, paddingHorizontal: 8, justifyContent: 'center' },
  limpiarTexto: { fontSize: 14, fontWeight: '800', color: colores.primario },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 2,
    gap: 4,
  },
  tituloTarjeta: {
    fontSize: 15,
    fontWeight: '800',
    color: colores.primario,
    marginBottom: 4,
  },
});
