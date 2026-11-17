// Utilidades para fechas en formato DD/MM/AAAA (sin librerías externas).

/** Deja solo dígitos y coloca las barras: "15112026" → "15/11/2026". */
export function aplicarMascaraFecha(texto: string): string {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) {
    return d;
  }
  if (d.length <= 4) {
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  }
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Convierte "DD/MM/AAAA" en Date, o null si la fecha no existe. */
export function parsearFecha(texto: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) {
    return null;
  }
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const anio = Number(m[3]);
  const fecha = new Date(anio, mes - 1, dia);
  const existe =
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia;
  return existe ? fecha : null;
}

/** true si la fecha existe y no está en el futuro. */
export function esFechaValida(texto: string): boolean {
  const fecha = parsearFecha(texto);
  return fecha !== null && fecha.getTime() <= Date.now();
}

/** Fecha de hoy como "DD/MM/AAAA". */
export function hoyComoTexto(): string {
  const h = new Date();
  const dd = String(h.getDate()).padStart(2, '0');
  const mm = String(h.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${h.getFullYear()}`;
}

/** "Hoy", "Hace 1 día", "Hace 4 días", "Hace 2 meses"... */
export function haceCuanto(texto: string): string {
  const fecha = parsearFecha(texto);
  if (!fecha) {
    return texto;
  }
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = Math.round((hoy.getTime() - fecha.getTime()) / 86400000);
  if (dias <= 0) {
    return 'Hoy';
  }
  if (dias === 1) {
    return 'Hace 1 día';
  }
  if (dias < 30) {
    return `Hace ${dias} días`;
  }
  const meses = Math.floor(dias / 30);
  if (meses < 12) {
    return meses === 1 ? 'Hace 1 mes' : `Hace ${meses} meses`;
  }
  const anios = Math.floor(dias / 365);
  return anios === 1 ? 'Hace 1 año' : `Hace ${anios} años`;
}
