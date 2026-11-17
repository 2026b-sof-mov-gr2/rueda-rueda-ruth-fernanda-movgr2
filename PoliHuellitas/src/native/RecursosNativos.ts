import { useEffect, useState } from 'react';
import { AppState, Dimensions, NativeModules } from 'react-native';

/** Lo que devuelve el Native Module (lo decide Android, no JavaScript). */
export type RecursosDesafio = {
  texto: string;
  subtitulo: string;
  carpeta: string; // carpeta de recursos que Android eligió (para evidenciar)
  colorFuente: string; // "#RRGGBB"
  colorFondo: string; // "#RRGGBB"
};

type RecursosModule = {
  obtenerRecursos: () => Promise<RecursosDesafio>;
};

const Recursos: RecursosModule | undefined = NativeModules.Recursos;

/** Pide al Native Module en Kotlin los recursos de la configuración actual. */
export function obtenerRecursos(): Promise<RecursosDesafio> {
  if (!Recursos) {
    return Promise.reject(
      new Error(
        'El módulo nativo "Recursos" no está disponible. Recompila con npm run android.',
      ),
    );
  }
  return Recursos.obtenerRecursos();
}

/**
 * Hook: devuelve los recursos actuales y los vuelve a pedir cuando
 *  - cambia la orientación (Dimensions → 'change'), y
 *  - la app vuelve a primer plano (AppState → 'active'), por ejemplo
 *    después de cambiar el idioma en Ajustes.
 * No hay ningún "if idioma" ni "if ancho > alto": Android decide.
 */
export function useRecursosNativos() {
  const [recursos, setRecursos] = useState<RecursosDesafio | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true; // evita actualizar el estado si la pantalla ya se cerró

    const consultar = () => {
      obtenerRecursos()
        .then(r => {
          if (activo) {
            setRecursos(r);
            setError(null);
          }
        })
        .catch((e: unknown) => {
          if (activo) {
            setError(e instanceof Error ? e.message : String(e));
          }
        });
    };

    consultar();
    const subDimensiones = Dimensions.addEventListener('change', consultar);
    const subApp = AppState.addEventListener('change', estado => {
      if (estado === 'active') {
        consultar();
      }
    });

    return () => {
      activo = false;
      subDimensiones.remove();
      subApp.remove();
    };
  }, []);

  return { recursos, error };
}
