import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Boton from '../components/Boton';
import Encabezado from '../components/Encabezado';
import Pantalla from '../components/Pantalla';
import { useAppEstado } from '../estado/AppEstado';
import { useAlternarFavorito } from '../estado/useFavorito';
import { useNav } from '../navegacion';
import { colores, radios } from '../theme';
import { haceCuanto } from '../utils/fecha';

/** Pantalla 8: Detalle de mascota. */
export default function DetalleScreen({ id }: { id: string }) {
  const { obtenerMascota, esFavorito, solicitudes } = useAppEstado();
  const alternarFavorito = useAlternarFavorito();
  const { ir, volver } = useNav();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const mascota = obtenerMascota(id);

  if (!mascota) {
    return (
      <Pantalla encabezado={<Encabezado titulo="Detalle" />}>
        <Text style={styles.noExiste}>Esta mascota ya no existe.</Text>
      </Pantalla>
    );
  }

  const favorito = esFavorito(mascota.id);
  const yaSolicitada = solicitudes.some(s => s.mascotaId === mascota.id);
  const altoFoto = Math.max(height * 0.42, 220);

  const datos = [
    { icono: '🐾', etiqueta: 'Raza', valor: mascota.raza },
    { icono: '📏', etiqueta: 'Tamaño', valor: mascota.tamano },
    {
      icono: '📅',
      etiqueta: 'En adopción',
      valor: haceCuanto(mascota.fechaIngreso),
    },
  ];

  return (
    // Sin borde superior: la foto llega hasta arriba, detrás de la barra de estado.
    <Pantalla
      edges={['bottom', 'left', 'right']}
      pie={
        yaSolicitada ? (
          <Boton
            titulo="Ver mi solicitud"
            variante="secundario"
            icono="📋"
            onPress={() => ir({ nombre: 'solicitudes' })}
          />
        ) : (
          <Boton
            titulo={mascota.disponible ? 'Quiero adoptarlo' : 'No disponible'}
            icono="♡"
            deshabilitado={!mascota.disponible}
            onPress={() =>
              ir({ nombre: 'formAdopcion', mascotaId: mascota.id })
            }
          />
        )
      }>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ height: altoFoto }}>
          {mascota.imagen ? (
            <Image source={mascota.imagen} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.sinFoto]}>
              <Text style={styles.sinFotoIcono}>🐾</Text>
            </View>
          )}
          <View style={[styles.botonesFoto, { top: insets.top + 8 }]}>
            <BotonRedondo texto="←" etiqueta="Volver" onPress={volver} />
            <BotonRedondo
              texto={favorito ? '♥' : '♡'}
              etiqueta={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              onPress={() => alternarFavorito(mascota)}
              naranja
            />
          </View>
        </View>

        <View style={styles.hoja}>
          <View style={styles.filaNombre}>
            <Text style={styles.nombre} accessibilityRole="header">
              {mascota.nombre}
            </Text>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{mascota.edad}</Text>
            </View>
          </View>

          <View style={styles.datos}>
            {datos.map(d => (
              <View key={d.etiqueta} style={styles.dato}>
                <Text style={styles.datoIcono}>{d.icono}</Text>
                <Text style={styles.datoEtiqueta}>{d.etiqueta}</Text>
                <Text style={styles.datoValor} numberOfLines={1}>
                  {d.valor}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.subtitulo}>Descripción</Text>
          <Text style={styles.descripcion}>
            {mascota.descripcion || 'Aún no hay una descripción para esta mascota.'}
          </Text>
        </View>
      </ScrollView>
    </Pantalla>
  );
}

function BotonRedondo({
  texto,
  etiqueta,
  onPress,
  naranja = false,
}: {
  texto: string;
  etiqueta: string;
  onPress: () => void;
  naranja?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.botonRedondo}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}>
      <Text style={[styles.botonRedondoTexto, naranja && styles.naranja]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  noExiste: {
    textAlign: 'center',
    marginTop: 40,
    color: colores.textoSecundario,
  },
  foto: { width: '100%', height: '100%' },
  sinFoto: {
    backgroundColor: colores.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinFotoIcono: { fontSize: 72 },
  botonesFoto: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botonRedondo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  botonRedondoTexto: { fontSize: 20, color: colores.texto, marginTop: -2 },
  naranja: { color: colores.acento, fontSize: 22 },
  hoja: {
    marginTop: -28,
    borderTopLeftRadius: radios.dialogo,
    borderTopRightRadius: radios.dialogo,
    backgroundColor: colores.fondo,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  filaNombre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  nombre: {
    flexShrink: 1,
    fontSize: 28,
    fontWeight: '800',
    color: colores.texto,
  },
  chip: {
    backgroundColor: colores.primarioClaro,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipTexto: { fontSize: 14, fontWeight: '800', color: colores.primario },
  datos: { flexDirection: 'row', gap: 10, marginTop: 18 },
  dato: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 3,
    elevation: 1,
  },
  datoIcono: { fontSize: 18 },
  datoEtiqueta: { fontSize: 12, color: colores.textoSecundario },
  datoValor: { fontSize: 14, fontWeight: '800', color: colores.texto },
  subtitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: colores.texto,
    marginTop: 22,
    marginBottom: 6,
  },
  descripcion: { fontSize: 15, lineHeight: 23, color: colores.textoSecundario },
});
