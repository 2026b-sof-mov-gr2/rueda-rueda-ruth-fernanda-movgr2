import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Mascota, mascotasIniciales } from '../data/mascotas';
import {
  favoritosIniciales,
  Solicitud,
  solicitudesIniciales,
} from '../data/solicitudes';
import { Usuario, usuarioInicial } from '../data/usuario';

export type DatosMascota = Omit<Mascota, 'id'>;

type AppEstado = {
  usuario: Usuario;

  // CRUD de mascotas
  mascotas: Mascota[];
  obtenerMascota: (id: string) => Mascota | undefined;
  crearMascota: (datos: DatosMascota) => Mascota;
  actualizarMascota: (mascota: Mascota) => void;
  eliminarMascota: (id: string) => void;

  // Favoritos
  favoritos: string[];
  esFavorito: (id: string) => boolean;
  alternarFavorito: (id: string) => void;

  // Solicitudes de adopción
  solicitudes: Solicitud[];
  crearSolicitud: (mascotaId: string, motivo: string) => Solicitud;
};

const AppEstadoContext = createContext<AppEstado | null>(null);

let contadorId = 100; // ids para las mascotas nuevas

export function AppEstadoProvider({ children }: { children: ReactNode }) {
  const [usuario] = useState<Usuario>(usuarioInicial);
  const [mascotas, setMascotas] = useState<Mascota[]>(mascotasIniciales);
  const [favoritos, setFavoritos] = useState<string[]>(favoritosIniciales);
  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>(solicitudesIniciales);

  const obtenerMascota = useCallback(
    (id: string) => mascotas.find(m => m.id === id),
    [mascotas],
  );

  const crearMascota = useCallback((datos: DatosMascota) => {
    contadorId += 1;
    const nueva: Mascota = { ...datos, id: String(contadorId) };
    setMascotas(lista => [nueva, ...lista]);
    return nueva;
  }, []);

  const actualizarMascota = useCallback((mascota: Mascota) => {
    setMascotas(lista => lista.map(m => (m.id === mascota.id ? mascota : m)));
  }, []);

  const eliminarMascota = useCallback((id: string) => {
    setMascotas(lista => lista.filter(m => m.id !== id));
    setFavoritos(lista => lista.filter(f => f !== id));
  }, []);

  const esFavorito = useCallback(
    (id: string) => favoritos.includes(id),
    [favoritos],
  );

  const alternarFavorito = useCallback((id: string) => {
    setFavoritos(lista =>
      lista.includes(id) ? lista.filter(f => f !== id) : [...lista, id],
    );
  }, []);

  const crearSolicitud = useCallback(
    (mascotaId: string, motivo: string) => {
      const numero = String(solicitudes.length + 1).padStart(3, '0');
      const nueva: Solicitud = {
        id: `s${Date.now()}`,
        numero,
        mascotaId,
        estado: 'revision',
        motivo,
      };
      setSolicitudes(lista => [...lista, nueva]);
      return nueva;
    },
    [solicitudes.length],
  );

  const valor = useMemo<AppEstado>(
    () => ({
      usuario,
      mascotas,
      obtenerMascota,
      crearMascota,
      actualizarMascota,
      eliminarMascota,
      favoritos,
      esFavorito,
      alternarFavorito,
      solicitudes,
      crearSolicitud,
    }),
    [
      usuario,
      mascotas,
      obtenerMascota,
      crearMascota,
      actualizarMascota,
      eliminarMascota,
      favoritos,
      esFavorito,
      alternarFavorito,
      solicitudes,
      crearSolicitud,
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
