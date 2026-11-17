/** Formato básico de correo: algo@algo.algo */
export function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}

export const MIN_CLAVE = 8;
