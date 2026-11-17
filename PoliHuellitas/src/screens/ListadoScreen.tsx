// Listado provisional conectado al contexto. En el bloque 3 se convierte en
// la pantalla 6 "Mascotas – Ver todas" con el CRUD completo.
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import ConfirmarModal from '../components/ConfirmarModal';
import Encabezado from '../components/Encabezado';
import MascotaCard from '../components/MascotaCard';
import Pantalla from '../components/Pantalla';
import { Mascota } from '../data/mascotas';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores } from '../theme';
import { mostrarToast } from '../utils/toast';

export default function ListadoScreen() {
  const { mascotas, eliminarMascota } = useAppEstado();
  const { ir } = useNav();
  const [aEliminar, setAEliminar] = useState<Mascota | null>(null);

  const confirmarEliminar = () => {
    if (aEliminar) {
      eliminarMascota(aEliminar.id);
      mostrarToast(`${aEliminar.nombre} fue eliminado`);
    }
    setAEliminar(null);
  };

  return (
    <Pantalla
      tabActiva="mascotas"
      encabezado={<Encabezado titulo="Mascotas en adopción" />}>
      <FlatList
        data={mascotas}
        keyExtractor={m => m.id}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <MascotaCard
            mascota={item}
            accion="eliminar"
            onPress={() => ir({ nombre: 'formMascota', id: item.id })}
            onLongPress={() => setAEliminar(item)}
            onAccion={() => setAEliminar(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay mascotas registradas</Text>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => ir({ nombre: 'formMascota' })}
        android_ripple={{ color: '#FFFFFF55' }}
        accessibilityRole="button"
        accessibilityLabel="Agregar mascota">
        <Text style={styles.fabTexto}>+</Text>
      </Pressable>

      <ConfirmarModal
        visible={aEliminar !== null}
        peligro
        titulo={`¿Eliminar a ${aEliminar?.nombre ?? ''}?`}
        mensaje="Se quitará de la lista de mascotas en adopción."
        textoConfirmar="Eliminar"
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: { justifyContent: 'space-between', marginBottom: 12 },
  lista: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 100 },
  vacio: { textAlign: 'center', color: colores.textoSecundario, marginTop: 40 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    overflow: 'hidden',
  },
  fabTexto: { fontSize: 32, color: '#FFFFFF', marginTop: -2 },
});
