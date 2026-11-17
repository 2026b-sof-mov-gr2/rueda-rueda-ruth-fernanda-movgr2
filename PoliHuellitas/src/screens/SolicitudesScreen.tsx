import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ConfirmarModal from '../components/ConfirmarModal';
import Encabezado from '../components/Encabezado';
import Pantalla from '../components/Pantalla';
import { EstadoSolicitud, Solicitud } from '../data/solicitudes';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores, radios } from '../theme';
import { mostrarToast } from '../utils/toast';

const chips: Record<
  EstadoSolicitud,
  { texto: string; fondo: string; color: string }
> = {
  revision: { texto: '🕒 En revisión', fondo: colores.acentoClaro, color: '#B5560E' },
  aprobada: { texto: '✓ Aprobada', fondo: colores.exitoClaro, color: colores.exito },
  rechazada: { texto: '✕ Rechazada', fondo: colores.peligroClaro, color: colores.peligro },
};

/**
 * Pantalla 12: Mis solicitudes (Mock-CRUD).
 * Tap → editar (Update) · FAB → nueva (Create) · 🗑 o long press → cancelar (Delete).
 */
export default function SolicitudesScreen() {
  const { solicitudes, obtenerMascota, eliminarSolicitud } = useAppEstado();
  const { ir } = useNav();
  const [aCancelar, setACancelar] = useState<Solicitud | null>(null);
  const nombreACancelar = aCancelar
    ? obtenerMascota(aCancelar.mascotaId)?.nombre ?? 'esta mascota'
    : '';

  const confirmarCancelar = () => {
    if (aCancelar) {
      eliminarSolicitud(aCancelar.id);
      mostrarToast('Solicitud cancelada');
    }
    setACancelar(null);
  };

  return (
    <Pantalla encabezado={<Encabezado titulo="Mis solicitudes" />}>
      <FlatList
        data={solicitudes}
        keyExtractor={s => s.id}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          solicitudes.length > 0 ? (
            <Text style={styles.intro}>
              Revisa el estado de tus solicitudes de adopción.
            </Text>
          ) : undefined
        }
        renderItem={({ item }) => {
          const mascota = obtenerMascota(item.mascotaId);
          const chip = chips[item.estado];
          const nombre = mascota?.nombre ?? 'Mascota';
          return (
            <Pressable
              onPress={() =>
                ir({ nombre: 'formAdopcion', solicitudId: item.id })
              }
              onLongPress={() => setACancelar(item)}
              android_ripple={{ color: colores.primarioClaro }}
              style={styles.tarjeta}
              accessibilityRole="button"
              accessibilityLabel={`Solicitud ${item.numero}, ${nombre}, ${chip.texto}. Toca para editar, mantén presionado para cancelar.`}>
              {mascota?.imagen ? (
                <Image source={mascota.imagen} style={styles.foto} />
              ) : (
                <View style={[styles.foto, styles.sinFoto]}>
                  <Text style={styles.sinFotoIcono}>🐾</Text>
                </View>
              )}
              <View style={styles.textos}>
                <Text style={styles.numero}>Solicitud #{item.numero}</Text>
                <Text style={styles.nombre} numberOfLines={1}>
                  {nombre}
                </Text>
                <Text style={styles.visita}>📅 Visita: {item.fechaVisita}</Text>
                <View style={[styles.chip, { backgroundColor: chip.fondo }]}>
                  <Text style={[styles.chipTexto, { color: chip.color }]}>
                    {chip.texto}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setACancelar(item)}
                style={styles.botonEliminar}
                android_ripple={{ color: colores.peligroClaro, borderless: true }}
                accessibilityRole="button"
                accessibilityLabel={`Cancelar solicitud de ${nombre}`}>
                <Text style={styles.iconoEliminar}>🗑</Text>
              </Pressable>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>🐾</Text>
            <Text style={styles.vacioTexto}>Aún no tienes solicitudes</Text>
            <Text style={styles.vacioAyuda}>
              Toca + para solicitar la adopción de un poliperro
            </Text>
          </View>
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => ir({ nombre: 'formAdopcion' })}
        android_ripple={{ color: '#FFFFFF55' }}
        accessibilityRole="button"
        accessibilityLabel="Nueva solicitud">
        <Text style={styles.fabTexto}>+</Text>
      </Pressable>

      <ConfirmarModal
        visible={aCancelar !== null}
        peligro
        titulo={`¿Cancelar tu solicitud para adoptar a ${nombreACancelar}?`}
        mensaje="La solicitud se eliminará y el club dejará de revisarla."
        textoCancelar="Volver"
        textoConfirmar="Sí, cancelar"
        onCancelar={() => setACancelar(null)}
        onConfirmar={confirmarCancelar}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  lista: { paddingHorizontal: 16, paddingBottom: 100, gap: 12 },
  intro: { fontSize: 14, color: colores.textoSecundario, marginBottom: 2 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    padding: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  foto: { width: 68, height: 68, borderRadius: 14 },
  sinFoto: {
    backgroundColor: colores.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinFotoIcono: { fontSize: 28 },
  textos: { flex: 1, gap: 2, alignItems: 'flex-start' },
  numero: { fontSize: 12, fontWeight: '700', color: colores.textoSecundario },
  nombre: { fontSize: 17, fontWeight: '800', color: colores.texto },
  visita: { fontSize: 13, color: colores.textoSecundario },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  chipTexto: { fontSize: 12.5, fontWeight: '800' },
  botonEliminar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoEliminar: { fontSize: 20 },
  vacio: { alignItems: 'center', marginTop: 80, gap: 6, paddingHorizontal: 24 },
  vacioIcono: { fontSize: 52 },
  vacioTexto: { fontSize: 17, fontWeight: '800', color: colores.texto },
  vacioAyuda: {
    fontSize: 14,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
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
