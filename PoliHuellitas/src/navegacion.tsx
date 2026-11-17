import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BackHandler } from 'react-native';

// Pestañas de la barra inferior
export type Tab = 'principal' | 'mascotas' | 'adoptar' | 'perfil';

// Todas las pantallas de la app. Las que necesitan datos llevan un id.
export type Ruta =
  | { nombre: 'splash' }
  | { nombre: 'login' }
  | { nombre: 'olvido' }
  | { nombre: 'registro' }
  | { nombre: 'principal' }
  | { nombre: 'mascotas' }
  | { nombre: 'formMascota'; id?: string } // sin id = Create, con id = Update
  | { nombre: 'detalle'; id: string }
  | { nombre: 'formAdopcion'; id: string }
  | { nombre: 'adoptar' }
  | { nombre: 'filtros' }
  | { nombre: 'solicitudes' }
  | { nombre: 'favoritos' }
  | { nombre: 'perfil' }
  | { nombre: 'configuracion' };

type Nav = {
  pila: Ruta[];
  ruta: Ruta; // pantalla visible (la última de la pila)
  ir: (ruta: Ruta) => void; // abre una pantalla encima
  volver: () => void; // regresa a la anterior
  reemplazar: (ruta: Ruta) => void; // cambia la pantalla actual por otra
  irATab: (tab: Tab) => void; // salta a una pestaña de la barra inferior
  reiniciar: (ruta: Ruta) => void; // borra la pila (login, cerrar sesión)
};

const NavContext = createContext<Nav | null>(null);

export function NavProvider({
  inicial,
  children,
}: {
  inicial: Ruta;
  children: ReactNode;
}) {
  const [pila, setPila] = useState<Ruta[]>([inicial]);

  const ir = useCallback((ruta: Ruta) => setPila(p => [...p, ruta]), []);
  const volver = useCallback(
    () => setPila(p => (p.length > 1 ? p.slice(0, -1) : p)),
    [],
  );
  const reemplazar = useCallback(
    (ruta: Ruta) => setPila(p => [...p.slice(0, -1), ruta]),
    [],
  );
  const reiniciar = useCallback((ruta: Ruta) => setPila([ruta]), []);
  // Desde cualquier pestaña, "atrás" regresa a Principal y luego sale de la app.
  const irATab = useCallback(
    (tab: Tab) =>
      setPila(
        tab === 'principal'
          ? [{ nombre: 'principal' }]
          : [{ nombre: 'principal' }, { nombre: tab }],
      ),
    [],
  );

  // Botón "atrás" físico de Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (pila.length > 1) {
        volver();
        return true; // lo manejamos nosotros
      }
      return false; // en la primera pantalla, Android cierra la app
    });
    return () => sub.remove();
  }, [pila.length, volver]);

  const valor = useMemo<Nav>(
    () => ({
      pila,
      ruta: pila[pila.length - 1],
      ir,
      volver,
      reemplazar,
      irATab,
      reiniciar,
    }),
    [pila, ir, volver, reemplazar, irATab, reiniciar],
  );

  return <NavContext.Provider value={valor}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const nav = useContext(NavContext);
  if (!nav) {
    throw new Error('useNav debe usarse dentro de <NavProvider>');
  }
  return nav;
}
