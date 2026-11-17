export type EstadoSolicitud = 'revision' | 'aprobada' | 'rechazada';

export type Solicitud = {
  id: string;
  numero: string; // "001"
  mascotaId: string;
  estado: EstadoSolicitud;
  fechaVisita: string; // DD/MM/AAAA
  tienePatio: boolean;
  otrasMascotas: boolean;
  aceptaSeguimiento: boolean;
  motivo: string; // máximo 150 caracteres
};

// Lo que el usuario llena en el formulario (el resto lo pone la app).
export type DatosSolicitud = Omit<Solicitud, 'id' | 'numero' | 'estado'>;

/** Las solicitudes en revisión o aprobadas no se pueden eliminar; solo las rechazadas. */
export function sePuedeEliminar(s: Solicitud): boolean {
  return s.estado === 'rechazada';
}

export const solicitudesIniciales: Solicitud[] = [
  {
    id: 's1',
    numero: '001',
    mascotaId: '1', // Max
    estado: 'revision',
    fechaVisita: '20/11/2026',
    tienePatio: true,
    otrasMascotas: false,
    aceptaSeguimiento: true,
    motivo: 'Tengo espacio en casa y tiempo para sacarlo a pasear todos los días.',
  },
  {
    id: 's2',
    numero: '002',
    mascotaId: '2', // Pelusita
    estado: 'aprobada',
    fechaVisita: '18/11/2026',
    tienePatio: true,
    otrasMascotas: true,
    aceptaSeguimiento: true,
    motivo: 'Lo veo siempre en el campus y ya nos conocemos. Quiero darle un hogar.',
  },
  {
    id: 's3',
    numero: '003',
    mascotaId: '5', // Luzu
    estado: 'rechazada',
    fechaVisita: '15/11/2026',
    tienePatio: false,
    otrasMascotas: false,
    aceptaSeguimiento: true,
    motivo: 'Me encantan los cachorros y quiero acompañarlo mientras crece.',
  },
];

// Tony y Max, como en el prototipo
export const favoritosIniciales: string[] = ['3', '1'];
