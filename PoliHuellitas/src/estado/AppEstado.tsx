import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Mascota, mascotasIniciales } from '../data/mascotas';
import {
  DatosSolicitud,
  favoritosIniciales,
  Solicitud,
  solicitudesIniciales,
} from '../data/solicitudes';
import { Usuario, usuarioInicial } from '../data/usuario';
import { Filtros, filtrosVacios } from '../utils/filtros';

type AppEstado = {
  usuario: Usuario;

  // Catálogo de mascotas (solo lectura: el estudiante no las administra)
  mascotas: Mascota[];
  obtenerMascota: (id: string) => Mascota | undefined;

  // Búsqueda y filtros de la pantalla Adoptar (aquí para no perderlos al
  // abrir la pantalla de Filtros y volver)
  busqueda: string;
  setBusqueda: (texto: string) => void;
  filtros: Filtros;
  setFiltros: (filtros: Filtros) => void;

  // Favoritos
  favoritos: string[];
  esFavorito: (id: string) => boolean;
  alternarFavorito: (id: string) => void;

  // Mock-CRUD: solicitudes de adopción del usuario
  solicitudes: Solicitud[];
  obtenerSolicitud: (id: string) => Solicitud | undefined;
  crearSolicitud: (datos: DatosSolicitud) => Solicitud;
  editarSolicitud: (id: string, datos: DatosSolicitud) => void;
  eliminarSolicitud: (id: string) => void;
};

const AppEstadoContext = createContext<AppEstado | null>(null);

export function AppEstadoProvider({ children }: { children: ReactNode }) {
  const [usuario] = useState<Usuario>(usuarioInicial);
  const [mascotas] = useState<Mascota[]>(mascotasIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);
  const [favoritos, setFavoritos] = useState<string[]>(favoritosIniciales);
  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>(solicitudesIniciales);
  // Último número usado: no se repite aunque se eliminen solicitudes.
  const ultimoNumero = useRef(solicitudesIniciales.length);

  const obtenerMascota = useCallback(
    (id: string) => mascotas.find(m => m.id === id),
    [mascotas],
  );

  const esFavorito = useCallback(
    (id: string) => favoritos.includes(id),
    [favoritos],
  );

  const alternarFavorito = useCallback((id: string) => {
    setFavoritos(lista =>
      lista.includes(id) ? lista.filter(f => f !== id) : [...lista, id],
    );
  }, []);

  const obtenerSolicitud = useCallback(
    (id: string) => solicitudes.find(s => s.id === id),
    [solicitudes],
  );

  const crearSolicitud = useCallback((datos: DatosSolicitud) => {
    ultimoNumero.current += 1;
    const nueva: Solicitud = {
      ...datos,
      id: `s${Date.now()}`,
      numero: String(ultimoNumero.current).padStart(3, '0'),
      estado: 'revision', // toda solicitud nueva empieza "En revisión"
    };
    setSolicitudes(lista => [...lista, nueva]);
    return nueva;
  }, []);

  const editarSolicitud = useCallback((id: string, datos: DatosSolicitud) => {
    setSolicitudes(lista =>
      lista.map(s => (s.id === id ? { ...s, ...datos } : s)),
    );
  }, []);

  const eliminarSolicitud = useCallback((id: string) => {
    setSolicitudes(lista => lista.filter(s => s.id !== id));
  }, []);

  const valor = useMemo<AppEstado>(
    () => ({
      usuario,
      mascotas,
      obtenerMascota,
      busqueda,
      setBusqueda,
      filtros,
      setFiltros,
      favoritos,
      esFavorito,
      alternarFavorito,
      solicitudes,
      obtenerSolicitud,
      crearSolicitud,
      editarSolicitud,
      eliminarSolicitud,
    }),
    [
      usuario,
      mascotas,
      obtenerMascota,
      busqueda,
      filtros,
      favoritos,
      esFavorito,
      alternarFavorito,
      solicitudes,
      obtenerSolicitud,
      crearSolicitud,
      editarSolicitud,
      eliminarSolicitud,
    ],
  );

  return (
    <AppEstadoContext.Provider value={valor}>
      {children}
    </AppEstadoContext.Provider>
  );
}

export function useAppEstado(): AppEstado {
  const estado = useContext(AppEstadoContext);
  if (!estado) {
    throw new Error('useAppEstado debe usarse dentro de <AppEstadoProvider>');
  }
  return estado;
}
