import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Boton from '../components/Boton';
import Encabezado from '../components/Encabezado';
import Pantalla from '../components/Pantalla';
import { useAppEstado } from '../estado/AppEstado';
import { useNav } from '../navegacion';
import { colores, radios } from '../theme';
import { mostrarToast } from '../utils/toast';

const MAX_MOTIVO = 150;

/** Pantalla 9: Formulario de adopción. */
export default function FormAdopcionScreen({ id }: { id: string }) {
  const { obtenerMascota, usuario, crearSolicitud } = useAppEstado();
  const { reemplazar } = useNav();
  const [motivo, setMotivo] = useState('');
  const [enfocado, setEnfocado] = useState(false);
  const mascota = obtenerMascota(id);

  if (!mascota) {
    return (
      <Pantalla encabezado={<Encabezado titulo="Adoptar" />}>
        <Text style={styles.noExiste}>Esta mascota ya no existe.</Text>
      </Pantalla>
    );
  }

  const pronombre = mascota.sexo === 'Hembra' ? 'adoptarla' : 'adoptarlo';

  const enviar = () => {
    if (!motivo.trim()) {
      mostrarToast('Cuéntanos por qué quieres adoptar');
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
            const s = crearSolicitud(mascota.id, motivo.trim());
            mostrarToast(`Solicitud #${s.numero} enviada con éxito`);
            reemplazar({ nombre: 'solicitudes' });
          },
        },
      ],
    );
  };

  const datos = [
    { etiqueta: 'Nombre completo', valor: usuario.nombre },
    { etiqueta: 'Correo electrónico', valor: usuario.correo },
    { etiqueta: 'Edad', valor: String(usuario.edad) },
    { etiqueta: 'Celular', valor: usuario.celular },
    { etiqueta: 'Dirección', valor: usuario.direccion },
  ];

  return (
    <Pantalla
      scroll
      encabezado={
        <Encabezado
          titulo={`Adoptar a ${mascota.nombre}`}
          derecha={
            mascota.imagen ? (
              <Image
                source={mascota.imagen}
                style={styles.miniatura}
                accessibilityLabel={`Foto de ${mascota.nombre}`}
              />
            ) : (
              <View style={[styles.miniatura, styles.sinFoto]}>
                <Text>🐾</Text>
              </View>
            )
          }
        />
      }
      contenidoStyle={styles.contenido}
      pie={<Boton titulo="Enviar solicitud" icono="➤" onPress={enviar} />}>
      <Text style={styles.seccion}>Datos del solicitante</Text>
      <Text style={styles.nota}>🔒 Tomados de tu perfil, no se pueden editar aquí</Text>
      <View style={styles.datos}>
        {datos.map(d => (
          <Text key={d.etiqueta} style={styles.dato}>
            <Text style={styles.datoEtiqueta}>{d.etiqueta}: </Text>
            {d.valor}
          </Text>
        ))}
      </View>

      <Text style={[styles.seccion, styles.seccionMotivo]}>
        Motivo de adopción
      </Text>
      <Text style={styles.pregunta}>Cuéntanos, ¿por qué quieres {pronombre}?</Text>
      <TextInput
        value={motivo}
        onChangeText={setMotivo}
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
        {motivo.length}/{MAX_MOTIVO}
      </Text>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { paddingTop: 4 },
  noExiste: {
    textAlign: 'center',
    marginTop: 40,
    color: colores.textoSecundario,
  },
  miniatura: { width: 40, height: 40, borderRadius: 20 },
  sinFoto: {
    backgroundColor: colores.acentoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seccion: { fontSize: 16, fontWeight: '800', color: colores.primario },
  seccionMotivo: { marginTop: 26 },
  nota: { fontSize: 12.5, color: colores.textoSecundario, marginTop: 4 },
  datos: { gap: 10, marginTop: 14 },
  dato: { fontSize: 15, color: colores.texto },
  datoEtiqueta: { fontWeight: '800' },
  pregunta: {
    fontSize: 14,
    fontWeight: '700',
    color: colores.texto,
    marginTop: 10,
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
