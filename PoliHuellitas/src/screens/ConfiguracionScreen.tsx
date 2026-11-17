import React, { Fragment, ReactNode } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Encabezado from '../components/Encabezado';
import FilaSwitch from '../components/FilaSwitch';
import Pantalla from '../components/Pantalla';
import { useAppEstado } from '../estado/AppEstado';
import { colores, radios } from '../theme';
import { mostrarToast } from '../utils/toast';

const VERSION = '1.0';

/** Pantalla 15: Configuración. */
export default function ConfiguracionScreen() {
  const { preferencias, cambiarPreferencia } = useAppEstado();

  const proximamente = (que: string) =>
    mostrarToast(`${que}: disponible próximamente`);

  const acercaDe = () =>
    Alert.alert(
      'Acerca de PoliHuellitas',
      `Versión ${VERSION}\n\nApp de adopción de los perritos comunitarios del campus de la Escuela Politécnica Nacional, junto al club PoliPerros – Club de Bienestar Animal.`,
      [{ text: 'Entendido' }],
    );

  return (
    <Pantalla
      scroll
      encabezado={<Encabezado titulo="Configuración" />}
      contenidoStyle={styles.contenido}>
      <Seccion titulo="Cuenta">
        <FilaEnlace
          icono="✏️"
          etiqueta="Editar perfil"
          onPress={() => proximamente('Editar perfil')}
        />
        <FilaEnlace
          icono="🔒"
          etiqueta="Cambiar contraseña"
          onPress={() => proximamente('Cambiar contraseña')}
        />
      </Seccion>

      <Seccion titulo="Preferencias">
        <FilaSwitch
          icono="🔔"
          etiqueta="Notificaciones"
          valor={preferencias.notificaciones}
          onCambio={v => {
            cambiarPreferencia('notificaciones', v);
            mostrarToast(
              v ? 'Notificaciones activadas' : 'Notificaciones desactivadas',
            );
          }}
        />
        <FilaSwitch
          icono="🌙"
          etiqueta="Modo oscuro"
          valor={preferencias.modoOscuro}
          onCambio={v => {
            cambiarPreferencia('modoOscuro', v);
            if (v) {
              mostrarToast('El modo oscuro estará disponible pronto');
            }
          }}
        />
      </Seccion>

      <Seccion titulo="Información">
        <FilaEnlace
          icono="📄"
          etiqueta="Términos y condiciones"
          onPress={() => proximamente('Términos y condiciones')}
        />
        <FilaEnlace
          icono="🛡️"
          etiqueta="Política de privacidad"
          onPress={() => proximamente('Política de privacidad')}
        />
        <FilaEnlace icono="ℹ️" etiqueta="Acerca de la app" onPress={acercaDe} />
      </Seccion>

      <Text style={styles.version}>PoliHuellitas · versión {VERSION}</Text>
    </Pantalla>
  );
}

/** Título de sección + tarjeta blanca con filas separadas por líneas. */
function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  const filas = React.Children.toArray(children);
  return (
    <View style={styles.seccion}>
      <Text style={styles.tituloSeccion} accessibilityRole="header">
        {titulo}
      </Text>
      <View style={styles.tarjeta}>
        {filas.map((fila, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={styles.divisor} /> : null}
            {fila}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

function FilaEnlace({
  icono,
  etiqueta,
  onPress,
}: {
  icono: string;
  etiqueta: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colores.primarioClaro }}
      style={styles.fila}
      accessibilityRole="button">
      <Text style={styles.icono}>{icono}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingTop: 4, gap: 18 },
  seccion: { gap: 8 },
  tituloSeccion: {
    fontSize: 14,
    fontWeight: '800',
    color: colores.primario,
    marginLeft: 4,
  },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    paddingHorizontal: 16,
    paddingVertical: 2,
    elevation: 2,
  },
  divisor: { height: 1, backgroundColor: colores.divisor },
  fila: { flexDirection: 'row', alignItems: 'center', minHeight: 52, gap: 12 },
  icono: { fontSize: 18 },
  etiqueta: { flex: 1, fontSize: 15, color: colores.texto },
  chevron: { fontSize: 24, color: colores.textoSecundario, marginTop: -2 },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: colores.textoSecundario,
    marginTop: 4,
  },
});
