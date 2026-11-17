export type Usuario = {
  nombre: string;
  correo: string;
  edad: number;
  celular: string;
  direccion: string;
};

export const usuarioInicial: Usuario = {
  nombre: 'Jorge Eduardo Díaz Ortíz',
  correo: 'jorgeediaz@gmail.com',
  edad: 28,
  celular: '0987654321',
  direccion: 'La Vicentina',
};
