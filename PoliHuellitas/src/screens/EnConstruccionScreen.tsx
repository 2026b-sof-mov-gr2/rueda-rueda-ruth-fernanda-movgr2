// PANTALLA TEMPORAL (bloque 1): ocupa el lugar de las pantallas que aún no
// existen y sirve para probar los componentes compartidos. Se elimina cuando
// todas las pantallas estén hechas.
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Boton from '../components/Boton';
import CampoTexto from '../components/CampoTexto';
import Casilla from '../components/Casilla';
import ConfirmarModal from '../components/ConfirmarModal';
import Encabezado from '../components/Encabezado';
import { Logo, TextoMarca } from '../components/Marca';
import Pantalla from '../components/Pantalla';
import { Ruta, Tab, useNav } from '../navegacion';
import { colores } from '../theme';
import { aplicarMascaraFecha, esFechaValida } from '../utils/fecha';
import { mostrarToast } from '../utils/toast';

const tabs: string[] = ['principal', 'mascotas', 'adoptar', 'perfil'];

export default function EnConstruccionScreen({ ruta }: { ruta: Ruta }) {
  const { pila, ir } = useNav();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [fecha, setFecha] = useState('');
  const [casilla, setCasilla] = useState(true);
  const [modal, setModal] = useState(false);

  const esTab = tabs.includes(ruta.nombre);
  const errorFecha =
    fecha.length === 10 && !esFechaValida(fecha) ? 'Fecha no válida' : undefined;

  return (
    <Pantalla
      scroll
      tabActiva={esTab ? (ruta.nombre as Tab) : undefined}
      encabezado={
        <Encabezado
          titulo={`«${ruta.nombre}» en construcción`}
          mostrarVolver={pila.length > 1}
        />
      }
      contenidoStyle={styles.contenido}>
      <View style={styles.marca}>
        <Logo tamano={64} />
        <TextoMarca tamano={28} />
        <Text style={styles.nota}>Bloque 1 · prueba de componentes</Text>
      </View>

      <CampoTexto
        etiqueta="Correo electrónico"
        icono="✉️"
        placeholder="Ingresa tu correo"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />
      <CampoTexto
        etiqueta="Contraseña"
        icono="🔒"
        placeholder="Mínimo 8 caracteres"
        secureTextEntry
        value={clave}
        onChangeText={setClave}
      />
      <CampoTexto
        etiqueta="Fecha (máscara DD/MM/AAAA)"
        icono="📅"
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        value={fecha}
        onChangeText={t => setFecha(aplicarMascaraFecha(t))}
        error={errorFecha}
      />
      <Casilla
        etiqueta="Casilla de ejemplo"
        marcada={casilla}
        onPress={() => setCasilla(c => !c)}
      />

      <Boton titulo="Abrir Modal de confirmación" onPress={() => setModal(true)} />
      <Boton
        titulo="Abrir pantalla encima (probar ← y atrás)"
        variante="contorno"
        onPress={() => ir({ nombre: 'configuracion' })}
      />

      <ConfirmarModal
        visible={modal}
        peligro
        titulo="¿Eliminar elemento?"
        mensaje="Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        onCancelar={() => setModal(false)}
        onConfirmar={() => {
          setModal(false);
          mostrarToast('Eliminado con éxito');
        }}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: 16, paddingTop: 8 },
  marca: { alignItems: 'center', gap: 6, marginBottom: 4 },
  nota: { color: colores.textoSecundario, fontSize: 13 },
});
