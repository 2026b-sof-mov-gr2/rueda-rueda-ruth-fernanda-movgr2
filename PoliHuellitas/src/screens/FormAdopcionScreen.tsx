import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import Encabezado from '../components/Encabezado';
import FilaSwitch from '../components/FilaSwitch';
import Pantalla from '../components/Pantalla';
import Selector from '../components/Selector';
import { DatosSolicitud } from '../data/solicitudes';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores, radios } from '../theme';
import { aplicarMascaraFecha, esHoyOFutura, parsearFecha } from '../utils/fecha';
import { mostrarToast } from '../utils/toast';

const MAX_MOTIVO = 150;

type Props = { mascotaId?: string; solicitudId?: string };

/**
 * Pantalla 9: Formulario de adopción (Create y Update del Mock-CRUD).
 *  - solicitudId → "Editar solicitud"
 *  - mascotaId   → nueva solicitud con la mascota ya elegida (desde el Detalle)
 *  - nada        → nueva solicitud; la mascota se elige en un Modal (desde el FAB)
 */
export default function FormAdopcionScreen({ mascotaId, solicitudId }: Props) {
  const {
    mascotas,
    obtenerMascota,
    obtenerSolicitud,
    usuario,
    crearSolicitud,
    editarSolicitud,
  } = useAppEstado();
  const { pila, volver, reemplazar } = useNav();

  const original = solicitudId ? obtenerSolicitud(solicitudId) : undefined;
  const esEdicion = original !== undefined;
  const elegirMascota = !esEdicion && !mascotaId; // viene del FAB

  // Se inicializa una sola vez: lo escrito sobrevive a rotaciones.
  const [datos, setDatos] = useState<DatosSolicitud>(() =>
    original
      ? {
          mascotaId: original.mascotaId,
          fechaVisita: original.fechaVisita,
          tienePatio: original.tienePatio,
          otrasMascotas: original.otrasMascotas,
          aceptaSeguimiento: original.aceptaSeguimiento,
          motivo: original.motivo,
        }
      : {
          mascotaId: mascotaId ?? '',
          fechaVisita: '',
          tienePatio: false,
          otrasMascotas: false,
          aceptaSeguimiento: false,
          motivo: '',
        },
  );
  const [enfocado, setEnfocado] = useState(false);
  const [intentado, setIntentado] = useState(false);

  const cambiar = <K extends keyof DatosSolicitud>(
    campo: K,
    valor: DatosSolicitud[K],
  ) => setDatos(d => ({ ...d, [campo]: valor }));

  if (solicitudId && !original) {
    return (
      <Pantalla encabezado={<Encabezado titulo="Editar solicitud" />}>
        <Text style={styles.noExiste}>Esta solicitud ya no existe.</Text>
      </Pantalla>
    );
  }

  const mascota = datos.mascotaId ? obtenerMascota(datos.mascotaId) : undefined;
  const pronombre = mascota?.sexo === 'Hembra' ? 'adoptarla' : 'adoptarlo';
  const titulo = esEdicion
    ? 'Editar solicitud'
    : mascota && !elegirMascota
    ? `Adoptar a ${mascota.nombre}`
    : 'Nueva solicitud';

  // Al editar se acepta la fecha que ya tenía, aunque haya pasado.
  const fechaSinCambios = esEdicion && datos.fechaVisita === original.fechaVisita;
  const errorFecha = !parsearFecha(datos.fechaVisita)
    ? 'Usa una fecha válida (DD/MM/AAAA)'
    : !fechaSinCambios && !esHoyOFutura(datos.fechaVisita)
    ? 'Elige una fecha desde hoy en adelante'
    : undefined;

  const completo =
    !!mascota && datos.fechaVisita.length === 10 && !!datos.motivo.trim();

  const limpio = (): DatosSolicitud => ({ ...datos, motivo: datos.motivo.trim() });

  const guardar = () => {
    setIntentado(true);
    if (!completo || errorFecha || !mascota) {
      mostrarToast('Revisa la fecha de visita');
      return;
    }

    if (original) {
      editarSolicitud(original.id, limpio());
      mostrarToast('Solicitud actualizada');
      volver();
      return;
    }

    // Diálogo nativo de Android (AlertDialog)
    Alert.alert(
      'Enviar solicitud',
      `¿Deseas enviar tu solicitud para adoptar a ${mascota.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => {
            crearSolicitud(limpio());
            mostrarToast('Solicitud enviada');
            // Si venimos de Mis solicitudes (FAB) basta con volver;
            // si venimos del Detalle, cambiamos esta pantalla por Mis solicitudes.
            const anterior = pila[pila.length - 2];
            if (anterior?.nombre === 'solicitudes') {
              volver();
            } else {
              reemplazar({ nombre: 'solicitudes' });
            }
          },
        },
      ],
    );
  };

  const solicitante = [
    { etiqueta: 'Nombre completo', valor: usuario.nombre },
    { etiqueta: 'Correo electrónico', valor: usuario.correo },
    { etiqueta: 'Edad', valor: String(usuario.edad) },
    { etiqueta: 'Celular', valor: usuario.celular },
    { etiqueta: 'Dirección', valor: usuario.direccion },
  ];

  const opcionesMascota = mascotas
    .filter(m => m.disponible)
    .map(m => ({
      valor: m.id,
      etiqueta: m.nombre,
      detalle: `${m.raza} · ${m.edad}`,
      imagen: m.imagen,
    }));

  return (
    <Pantalla
      scroll
      encabezado={
        <Encabezado
          titulo={titulo}
          derecha={
            mascota?.imagen ? (
              <Image
                source={mascota.imagen}
                style={styles.miniatura}
                accessibilityLabel={`Foto de ${mascota.nombre}`}
              />
            ) : undefined
          }
        />
      }
      contenidoStyle={styles.contenido}
      pie={
        <Boton
          titulo={esEdicion ? 'Guardar cambios' : 'Enviar solicitud'}
          icono={esEdicion ? '✓' : '➤'}
          onPress={guardar}
          deshabilitado={!completo}
        />
      }>
      {elegirMascota ? (
        <Selector
          etiqueta="Mascota"
          placeholder="Elige una mascota"
          icono="🐾"
          valor={datos.mascotaId || undefined}
          opciones={opcionesMascota}
          onElegir={v => cambiar('mascotaId', v)}
        />
      ) : null}

      <View>
        <Text style={styles.seccion}>Datos del solicitante</Text>
        <Text style={styles.nota}>
          🔒 Tomados de tu perfil, no se pueden editar aquí
        </Text>
        <View style={styles.datos}>
          {solicitante.map(d => (
            <Text key={d.etiqueta} style={styles.dato}>
              <Text style={styles.datoEtiqueta}>{d.etiqueta}: </Text>
              {d.valor}
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.seccion}>Sobre la adopción</Text>

      <CampoTexto
        etiqueta="Fecha preferida de visita"
        icono="📅"
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        maxLength={10}
        value={datos.fechaVisita}
        onChangeText={t => cambiar('fechaVisita', aplicarMascaraFecha(t))}
        error={
          (intentado || datos.fechaVisita.length === 10) && errorFecha
            ? errorFecha
            : undefined
        }
      />

      <View style={styles.tarjetaSwitches}>
        <FilaSwitch
          etiqueta="¿Tienes patio o espacio para un perrito?"
          valor={datos.tienePatio}
          onCambio={v => cambiar('tienePatio', v)}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          etiqueta="¿Vives con otras mascotas?"
          valor={datos.otrasMascotas}
          onCambio={v => cambiar('otrasMascotas', v)}
        />
        <View style={styles.divisor} />
        <FilaSwitch
          etiqueta="Acepto el seguimiento del club PoliPerros"
          valor={datos.aceptaSeguimiento}
          onCambio={v => cambiar('aceptaSeguimiento', v)}
        />
      </View>

      <View>
        <Text style={styles.pregunta}>
          Cuéntanos, ¿por qué quieres {pronombre}?
        </Text>
        <TextInput
          value={datos.motivo}
          onChangeText={t => cambiar('motivo', t)}
          placeholder="Tengo espacio en casa y tiempo para sacarlo a pasear..."
          placeholderTextColor={colores.textoSecundario + '99'}
          multiline
          maxLength={MAX_MOTIVO}
          textAlignVertical="top"
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          style={[styles.multi, enfocado && styles.multiEnfocado]}
          accessibilityLabel={`¿Por qué quieres ${pronombre}?`}
        />
        <Text style={styles.contador}>
          {datos.motivo.length}/{MAX_MOTIVO}
        </Text>
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingTop: 4, gap: 18 },
  noExiste: {
    textAlign: 'center',
    marginTop: 40,
    color: colores.textoSecundario,
  },
  miniatura: { width: 40, height: 40, borderRadius: 20 },
  seccion: { fontSize: 16, fontWeight: '800', color: colores.primario },
  nota: { fontSize: 12.5, color: colores.textoSecundario, marginTop: 4 },
  datos: { gap: 10, marginTop: 14 },
  dato: { fontSize: 15, color: colores.texto },
  datoEtiqueta: { fontWeight: '800' },
  tarjetaSwitches: {
    backgroundColor: colores.superficie,
    borderRadius: radios.tarjeta,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 2,
  },
  divisor: { height: 1, backgroundColor: colores.divisor },
  pregunta: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.texto,
    marginBottom: 8,
  },
  multi: {
    minHeight: 110,
    borderWidth: 1.5,
    borderColor: colores.borde,
    borderRadius: radios.campo,
    backgroundColor: colores.superficie,
    padding: 14,
    fontSize: 15,
    color: colores.texto,
  },
  multiEnfocado: { borderColor: colores.primario },
  contador: {
    alignSelf: 'flex-end',
    fontSize: 12.5,
    color: colores.textoSecundario,
    marginTop: 6,
  },
});
