import { Mascota, Sexo, Tamano } from '../data/mascotas';

export const TAMANOS: readonly Tamano[] = ['Pequeño', 'Mediano', 'Grande'];
export const SEXOS: readonly Sexo[] = ['Macho', 'Hembra'];

export const RANGOS_EDAD = [
  { valor: 'Todas', etiqueta: 'Todas' },
  { valor: 'Cachorro', etiqueta: 'Cachorro', detalle: 'Menos de 1 año' },
  { valor: 'Joven', etiqueta: 'Joven', detalle: 'De 1 a 3 años' },
  { valor: 'Adulto', etiqueta: 'Adulto', detalle: 'Más de 3 años' },
] as const;

export type RangoEdad = (typeof RANGOS_EDAD)[number]['valor'];

export type Filtros = {
  tamanos: Tamano[]; // vacío = todos
  sexos: Sexo[]; // vacío = todos
  edad: RangoEdad;
  raza: string; // 'Todas' o una raza
};

export const filtrosVacios: Filtros = {
  tamanos: [],
  sexos: [],
  edad: 'Todas',
  raza: 'Todas',
};

/** "7 meses" → 7, "3 años" → 36. Si no se entiende, devuelve null. */
export function edadEnMeses(texto: string): number | null {
  const m = /(\d+)\s*(mes|año|ano)/i.exec(texto);
  if (!m) {
    return null;
  }
  const n = Number(m[1]);
  return m[2].toLowerCase() === 'mes' ? n : n * 12;
}

function cumpleEdad(m: Mascota, rango: RangoEdad): boolean {
  if (rango === 'Todas') {
    return true;
  }
  const meses = edadEnMeses(m.edad);
  if (meses === null) {
    return false;
  }
  if (rango === 'Cachorro') {
    return meses < 12;
  }
  if (rango === 'Joven') {
    return meses >= 12 && meses <= 36;
  }
  return meses > 36;
}

/** Aplica la búsqueda por texto (nombre o raza) y los filtros elegidos. */
export function filtrarMascotas(
  mascotas: Mascota[],
  filtros: Filtros,
  busqueda: string,
): Mascota[] {
  const texto = busqueda.trim().toLowerCase();
  return mascotas.filter(
    m =>
      m.disponible &&
      (!texto ||
        m.nombre.toLowerCase().includes(texto) ||
        m.raza.toLowerCase().includes(texto)) &&
      (filtros.tamanos.length === 0 || filtros.tamanos.includes(m.tamano)) &&
      (filtros.sexos.length === 0 || filtros.sexos.includes(m.sexo)) &&
      cumpleEdad(m, filtros.edad) &&
      (filtros.raza === 'Todas' || m.raza === filtros.raza),
  );
}

/** Cuántos filtros están activos (para la insignia del botón). */
export function contarFiltros(f: Filtros): number {
  return (
    f.tamanos.length +
    f.sexos.length +
    (f.edad !== 'Todas' ? 1 : 0) +
    (f.raza !== 'Todas' ? 1 : 0)
  );
}
