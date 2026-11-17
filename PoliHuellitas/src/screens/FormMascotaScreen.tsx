import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import Encabezado from '../components/Encabezado';
import FilaSwitch from '../components/FilaSwitch';
import Pantalla from '../components/Pantalla';
import Segmentado from '../components/Segmentado';
import { Mascota, Sexo, Tamano } from '../data/mascotas';
import { DatosMascota, useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores, radios } from '../theme';
import { aplicarMascaraFecha, esFechaValida, hoyComoTexto } from '../utils/fecha';
import { mostrarToast } from '../utils/toast';

const SEXOS = ['Macho', 'Hembra'] as const;
const TAMANOS = ['Pequeño', 'Mediano', 'Grande'] as const;

const vacia: DatosMascota = {
  nombre: '',
  raza: '',
  edad: '',
  sexo: 'Macho',
  tamano: 'Mediano',
  fechaIngreso: hoyComoTexto(),
  vacunado: false,
  esterilizado: false,
  disponible: true,
  descripcion: '',
};

/** Pantalla 7: Formulario de mascota. Sin id = Create; con id = Update. */
export default function FormMascotaScreen({ id }: { id?: string }) {
  const { obtenerMascota, crearMascota, actualizarMascota } = useAppEstado();
  const { volver } = useNav();
  const original = id ? obtenerMascota(id) : undefined;
  const esEdicion = original !== undefined;

  // Se inicializa una sola vez: lo escrito sobrevive a rotaciones.
  const [datos, setDatos] = useState<DatosMascota>(() => {
    if (!original) {
      return { ...vacia, fechaIngreso: hoyComoTexto() };
    }
    const copia: DatosMascota & { id?: string } = { ...original };
    delete copia.id; // el formulario solo maneja los datos, no el id
    return copia;
  });
  const [intentado, setIntentado] = useState(false);

  const cambiar = <K extends keyof DatosMascota>(
    campo: K,
    valor: DatosMascota[K],
  ) => setDatos(d => ({ ...d, [campo]: valor }));

  if (id && !original) {
    return (
      <Pantalla encabezado={<Encabezado titulo="Editar mascota" />}>
        <Text style={styles.noExiste}>Esta mascota ya no existe.</Text>
      </Pantalla>
    );
  }

  const errorFecha = !esFechaValida(datos.fechaIngreso)
    ? 'Usa una fecha válida (DD/MM/AAAA)'
    : undefined;

  const guardar = () => {
    setIntentado(true);
    if (errorFecha) {
      mostrarToast('Revisa la fecha de ingreso');
      return;
    }
    const limpio: DatosMascota = {
      ...datos,
      nombre: datos.nombre.trim(),
      raza: datos.raza.trim() || 'Mestizo',
      edad: datos.edad.trim() || 'Sin dato',
      descripcion: datos.descripcion.trim(),
    };
    if (original) {
      const actualizada: Mascota = { ...limpio, id: original.id };
      actualizarMascota(actualizada);
      mostrarToast(`${limpio.nombre} se actualizó con éxito`);
    } else {
      crearMascota(limpio);
      mostrarToast(`${limpio.nombre} se agregó con éxito`);
    }
    volver();
  };

  return (
    <Pantalla
      scroll
      encabezado={
        <Encabezado titulo={esEdicion ? 'Editar mascota' : 'Nueva mascota'} />
      }
      contenidoStyle={styles.contenido}
      pie={
        <View style={styles.botones}>
          <Boton
            titulo="Cancelar"
            variante="secundario"
            onPress={volver}
            style={styles.boton}
          />
          <Boton
            titulo="Guardar"
            onPress={guardar}
            deshabilitado={!datos.nombre.trim()}
            style={styles.boton}
          />
        </View>
      }>
      <View style={styles.fotoContenedor}>
        {datos.imagen ? (
          <Image source={datos.imagen} style={styles.foto} />
        ) : (
          <View style={[styles.foto, styles.sinFoto]}>
            <Text style={styles.sinFotoIcono}>🐾</Text>
          </View>
        )}
        <Text style={styles.fotoNota}>
          {datos.imagen ? 'Foto de la mascota' : 'Sin foto'}
        </Text>
      </View>

      <CampoTexto
        etiqueta="Nombre *"
        icono="🐶"
        placeholder="Nombre de la mascota"
        autoCapitalize="words"
        value={datos.nombre}
        onChangeText={t => cambiar('nombre', t)}
        error={intentado && !datos.nombre.trim() ? 'El nombre es obligatorio' : undefined}
      />
      <CampoTexto
        etiqueta="Raza"
        icono="🐾"
        placeholder="Ej.: Mestizo"
        autoCapitalize="words"
        value={datos.raza}
        onChangeText={t => cambiar('raza', t)}
      />
      <CampoTexto
        etiqueta="Edad"
        icono="🎂"
        placeholder="Ej.: 3 años, 7 meses"
        value={datos.edad}
        onChangeText={t => cambiar('edad', t)}
      />
      <Segmentado<Sexo>
        etiqueta="Sexo"
        opciones={SEXOS}
        valor={datos.sexo}
        onCambio={v => cambiar('sexo', v)}
      />
      <Segmentado<Tamano>
        etiqueta="Tamaño"
        opciones={TAMANOS}
        valor={datos.tamano}
        onCambio={v => cambiar('tamano', v)}
      />
      <CampoTexto
        etiqueta="Fecha de ingreso"
        icono="📅"
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        maxLength={10}
        value={datos.fechaIngreso}
        onChangeText={t => cambiar('fechaIngreso', aplicarMascaraFecha(t))}
        error={intentado ? errorFecha : undefined}
      />

      <View style={styles.campoMulti}>
        <Text style={styles.etiqueta}>Descripción</Text>
        <TextInput
          value={datos.descripcion}
          onChangeText={t => cambiar('descripcion', t)}
          placeholder="Cuéntanos sobre su personalidad…"
          placeholderTextColor={colores.textoSecundario + '99'}
          multiline
          maxLength={250}
          textAlignVertical="top"
          style={styles.multi}
          accessibilityLabel="Descripción"
        />
      </View>

      <View style={styles.tarjetaSwitches}>
        <FilaSwitch
          etiqueta="Vacunado"
          icono="💉"
          valor={datos.vacunado}
          onCambio={v => cambiar('vacunado', v)}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          etiqueta="Esterilizado"
          icono="🩺"
          valor={datos.esterilizado}
          onCambio={v => cambiar('esterilizado', v)}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          etiqueta="Disponible para adopción"
          icono="🏡"
          valor={datos.disponible}
          onCambio={v => cambiar('disponible', v)}
        />
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: 16, paddingTop: 4 },
  noExiste: {
    textAlign: 'center',
    marginTop: 40,
    color: colores.textoSecundario,
  },
  fotoContenedor: { alignItems: 'center', gap: 8, marginBottom: 4 },
  foto: { width: 120, height: 120, borderRadius: 60 },
  sinFoto: {
    backgroundColor: colores.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sinFotoIcono: { fontSize: 48 },
  fotoNota: { fontSize: 13, color: colores.textoSecundario },
  campoMulti: { gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: '700', color: colores.texto },
  multi: {
    minHeight: 96,
    borderWidth: 1.5,
    borderColor: colores.borde,
    borderRadius: radios.campo,
    backgroundColor: colores.superficie,
    padding: 14,
    fontSize: 15,
    color: colores.texto,
  },
  tarjetaSwitches: {
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 2,
  },
  divisor: { height: 1, backgroundColor: colores.divisor },
  botones: { flexDirection: 'row', gap: 12 },
  boton: { flex: 1 },
});
