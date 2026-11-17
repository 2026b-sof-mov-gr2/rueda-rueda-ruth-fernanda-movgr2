export type EstadoSolicitud = 'revision' | 'aprobada' | 'rechazada';

export type Solicitud = {
  id: string;
  numero: string; // "001"
  mascotaId: string;
  estado: EstadoSolicitud;
  motivo: string;
};

export const solicitudesIniciales: Solicitud[] = [
  { id: 's1', numero: '001', mascotaId: '1', estado: 'revision', motivo: '' },
  { id: 's2', numero: '002', mascotaId: '2', estado: 'aprobada', motivo: '' },
  { id: 's3', numero: '003', mascotaId: '5', estado: 'rechazada', motivo: '' },
];

// Tony y Max, como en el prototipo
export const favoritosIniciales: string[] = ['3', '1'];
