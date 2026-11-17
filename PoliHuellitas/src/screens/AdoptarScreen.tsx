import React, { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Boton from '../components/Boton';
import MascotaCard from '../components/MascotaCard';
import Pantalla from '../components/Pantalla';
import { useAppEstado } from '../estado/AppEstado';
import { useAlternarFavorito } from '../estado/useFavorito';
import { Ruta, useNav } from '../navegacion';
import { colores } from '../theme';
import { contarFiltros, filtrarMascotas, filtrosVacios } from '../utils/filtros';

const pestanas: { etiqueta: string; ruta?: Ruta }[] = [
  { etiqueta: 'Explorar' },
  { etiqueta: 'Mis solicitudes', ruta: { nombre: 'solicitudes' } },
  { etiqueta: 'Favoritos', ruta: { nombre: 'favoritos' } },
];

/** Pantalla 10: Adoptar (búsqueda, filtros y accesos a solicitudes y favoritos). */
export default function AdoptarScreen() {
  const {
    mascotas,
    esFavorito,
    busqueda,
    setBusqueda,
    filtros,
    setFiltros,
  } = useAppEstado();
  const alternarFavorito = useAlternarFavorito();
  const { ir } = useNav();

  const resultados = useMemo(
    () => filtrarMascotas(mascotas, filtros, busqueda),
    [mascotas, filtros, busqueda],
  );
  const activos = contarFiltros(filtros);

  const limpiarTodo = () => {
    setBusqueda('');
    setFiltros(filtrosVacios);
  };

  const cabecera = (
    <View style={styles.cabecera}>
      <Text style={styles.titulo} accessibilityRole="header">
        Adoptar
      </Text>

      <View style={styles.filaBusqueda}>
        <View style={styles.busqueda}>
          <Text style={styles.lupa}>🔍</Text>
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar mascota"
            placeholderTextColor={colores.textoSecundario + '99'}
            returnKeyType="search"
            style={styles.inputBusqueda}
            accessibilityLabel="Buscar mascota por nombre o raza"
          />
          {busqueda ? (
            <Pressable
              onPress={() => setBusqueda('')}
              style={styles.borrar}
              accessibilityRole="button"
              accessibilityLabel="Borrar búsqueda">
              <Text style={styles.borrarTexto}>✕</Text>
            </Pressable>
          ) : null}
        </View>
        <Pressable
          onPress={() => ir({ nombre: 'filtros' })}
          style={styles.botonFiltros}
          android_ripple={{ color: '#FFFFFF55', borderless: true }}
          accessibilityRole="button"
          accessibilityLabel={
            activos > 0 ? `Filtros, ${activos} activos` : 'Filtros'
          }>
          <Text style={styles.iconoFiltros}>☰</Text>
          {activos > 0 ? (
            <View style={styles.insignia}>
              <Text style={styles.insigniaTexto}>{activos}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.pestanas} accessibilityRole="tablist">
        {pestanas.map(p => {
          const activa = !p.ruta;
          return (
            <Pressable
              key={p.etiqueta}
              onPress={() => p.ruta && ir(p.ruta)}
              style={[styles.pestana, activa && styles.pestanaActiva]}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}>
              <Text
                style={[styles.pestanaTexto, activa && styles.pestanaTextoActiva]}>
                {p.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <Pantalla tabActiva="adoptar" encabezado={cabecera}>
      <FlatList
        data={resultados}
        keyExtractor={m => m.id}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <MascotaCard
            mascota={item}
            esFavorito={esFavorito(item.id)}
            onPress={() => ir({ nombre: 'detalle', id: item.id })}
            onFavorito={() => alternarFavorito(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>🔍</Text>
            <Text style={styles.vacioTexto}>
              No encontramos mascotas con esa búsqueda
            </Text>
            <Boton
              titulo="Limpiar búsqueda y filtros"
              variante="secundario"
              onPress={limpiarTodo}
              style={styles.vacioBoton}
            />
          </View>
        }
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  cabecera: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },
  titulo: { fontSize: 26, fontWeight: '800', color: colores.primario },
  filaBusqueda: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  busqueda: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  lupa: { fontSize: 15, marginRight: 8 },
  inputBusqueda: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colores.texto,
    paddingVertical: 0,
  },
  borrar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  borrarTexto: { fontSize: 14, color: colores.textoSecundario },
  botonFiltros: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  iconoFiltros: { fontSize: 20, color: '#FFFFFF', fontWeight: '800' },
  insignia: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: colores.primario,
    borderWidth: 2,
    borderColor: colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insigniaTexto: { fontSize: 10.5, fontWeight: '900', color: '#FFFFFF' },
  pestanas: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  pestana: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    justifyContent: 'center',
  },
  pestanaActiva: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  pestanaTexto: { fontSize: 13.5, fontWeight: '700', color: colores.texto },
  pestanaTextoActiva: { color: '#FFFFFF' },
  fila: { justifyContent: 'space-between', marginBottom: 14 },
  lista: { paddingHorizontal: 16, paddingBottom: 16, flexGrow: 1 },
  vacio: { alignItems: 'center', marginTop: 48, gap: 10, paddingHorizontal: 16 },
  vacioIcono: { fontSize: 44 },
  vacioTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: colores.texto,
    textAlign: 'center',
  },
  vacioBoton: { alignSelf: 'stretch', marginTop: 6 },
});
