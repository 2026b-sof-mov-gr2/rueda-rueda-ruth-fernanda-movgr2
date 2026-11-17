import { useCallback } from 'react';
import { Mascota } from '../data/mascotas';
import { mostrarToast } from '../utils/toast';
import { useAppEstado } from './AppEstado';

/** Agrega o quita una mascota de favoritos y avisa con un Toast. */
export function useAlternarFavorito() {
  const { esFavorito, alternarFavorito } = useAppEstado();
  return useCallback(
    (m: Mascota) => {
      mostrarToast(
        esFavorito(m.id)
          ? `${m.nombre} quitado de favoritos`
          : `${m.nombre} agregado a favoritos`,
      );
      alternarFavorito(m.id);
    },
    [esFavorito, alternarFavorito],
  );
}
