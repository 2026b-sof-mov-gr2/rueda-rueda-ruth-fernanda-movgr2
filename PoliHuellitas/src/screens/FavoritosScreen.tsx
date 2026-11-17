import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ConfirmarModal from '../components/ConfirmarModal';
import Encabezado from '../components/Encabezado';
import MascotaCard from '../components/MascotaCard';
import Pantalla from '../components/Pantalla';
import { Mascota } from '../data/mascotas';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores } from '../theme';
import { mostrarToast } from '../utils/toast';

/** Pantalla 13: Favoritos. */
export default function FavoritosScreen() {
  const { favoritos, obtenerMascota, alternarFavorito } = useAppEstado();
  const { ir } = useNav();
  const [aQuitar, setAQuitar] = useState<Mascota | null>(null);

  // En el orden en que se guardaron, el más reciente primero
  const lista = favoritos
    .map(id => obtenerMascota(id))
    .filter((m): m is Mascota => m !== undefined)
    .reverse();

  const confirmarQuitar = () => {
    if (aQuitar) {
      alternarFavorito(aQuitar.id);
      mostrarToast('Quitado de favoritos');
    }
    setAQuitar(null);
  };

  return (
    <Pantalla
      encabezado={<Encabezado titulo="Favoritos" insignia={lista.length} />}>
      <FlatList
        data={lista}
        keyExtractor={m => m.id}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          lista.length > 0 ? (
            <Text style={styles.intro}>
              Las mascotas que guardaste para conocer después.
            </Text>
          ) : undefined
        }
        renderItem={({ item }) => (
          <MascotaCard
            mascota={item}
            esFavorito
            onPress={() => ir({ nombre: 'detalle', id: item.id })}
            onFavorito={() => setAQuitar(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>♡</Text>
            <Text style={styles.vacioTexto}>Aún no tienes favoritos</Text>
            <Text style={styles.vacioAyuda}>
              Toca el corazón de una mascota para guardarla aquí
            </Text>
          </View>
        }
      />

      <ConfirmarModal
        visible={aQuitar !== null}
        icono="💔"
        titulo={`¿Quitar a ${aQuitar?.nombre ?? ''} de favoritos?`}
        mensaje="Podrás volver a agregarlo cuando quieras."
        textoCancelar="Volver"
        textoConfirmar="Quitar"
        onCancelar={() => setAQuitar(null)}
        onConfirmar={confirmarQuitar}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: { justifyContent: 'space-between', marginBottom: 14 },
  lista: { paddingHorizontal: 16, paddingBottom: 16 },
  intro: { fontSize: 14, color: colores.textoSecundario, marginBottom: 12 },
  vacio: { alignItems: 'center', marginTop: 80, gap: 6, paddingHorizontal: 24 },
  vacioIcono: { fontSize: 56, color: colores.acento },
  vacioTexto: { fontSize: 17, fontWeight: '800', color: colores.texto },
  vacioAyuda: {
    fontSize: 14,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
});
