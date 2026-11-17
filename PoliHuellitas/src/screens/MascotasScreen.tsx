import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Encabezado from '../components/Encabezado';
import MascotaCard from '../components/MascotaCard';
import Pantalla from '../components/Pantalla';
import { useAppEstado } from '../estado/AppEstado';
import { useAlternarFavorito } from '../estado/useFavorito';
import { useNav } from '../navegacion';
import { colores } from '../theme';

/** Pantalla 6: Mascotas – Ver todas (catálogo de solo lectura). */
export default function MascotasScreen() {
  const { mascotas, esFavorito } = useAppEstado();
  const alternarFavorito = useAlternarFavorito();
  const { ir } = useNav();
  const disponibles = mascotas.filter(m => m.disponible);

  return (
    <Pantalla
      tabActiva="mascotas"
      encabezado={<Encabezado titulo="Mascotas en adopción" />}>
      <FlatList
        data={disponibles}
        keyExtractor={m => m.id}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}
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
            <Text style={styles.vacioIcono}>🐾</Text>
            <Text style={styles.vacioTexto}>
              Por ahora no hay mascotas en adopción
            </Text>
          </View>
        }
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: { justifyContent: 'space-between', marginBottom: 14 },
  lista: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  vacio: { alignItems: 'center', marginTop: 60, gap: 6 },
  vacioIcono: { fontSize: 48 },
  vacioTexto: { fontSize: 16, fontWeight: '700', color: colores.texto },
});
