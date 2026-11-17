import { ImageSourcePropType } from 'react-native';

export type Sexo = 'Macho' | 'Hembra';
export type Tamano = 'Pequeño' | 'Mediano' | 'Grande';

export type Mascota = {
  id: string;
  nombre: string;
  raza: string;
  edad: string; // texto libre: "3 años", "7 meses"
  sexo: Sexo;
  tamano: Tamano;
  fechaIngreso: string; // DD/MM/AAAA
  vacunado: boolean;
  esterilizado: boolean;
  disponible: boolean; // disponible para adopción
  descripcion: string;
  imagen?: ImageSourcePropType; // las nuevas pueden no tener foto
};

export const mascotasIniciales: Mascota[] = [
  {
    id: '6',
    nombre: 'Milo',
    raza: 'Mestizo',
    edad: '4 meses',
    sexo: 'Macho',
    tamano: 'Pequeño',
    fechaIngreso: '14/11/2026',
    vacunado: true,
    esterilizado: false,
    disponible: true,
    descripcion:
      'El más pequeño del grupo. Es tímido al principio, pero en cuanto te conoce no se separa de ti.',
    imagen: require('../assets/milo.jpg'),
  },
  {
    id: '2',
    nombre: 'Pelusita',
    raza: 'Mestizo',
    edad: '5 años',
    sexo: 'Macho',
    tamano: 'Pequeño',
    fechaIngreso: '13/11/2026',
    vacunado: true,
    esterilizado: false,
    disponible: true,
    descripcion:
      'Perrito con mucha personalidad que busca un hogar. Siempre parece sonreír mostrando sus dientitos y es muy cariñoso con quien lo cuida en el campus.',
    imagen: require('../assets/pelusita.jpg'),
  },
  {
    id: '3',
    nombre: 'Tony',
    raza: 'Mestizo',
    edad: '2 años',
    sexo: 'Macho',
    tamano: 'Mediano',
    fechaIngreso: '16/11/2026',
    vacunado: false,
    esterilizado: false,
    disponible: true,
    descripcion:
      'Tranquilo y observador. Le gusta descansar al sol cerca de la biblioteca y se lleva bien con otros perritos.',
    imagen: require('../assets/tony.jpg'),
  },
  {
    id: '4',
    nombre: 'Lucy',
    raza: 'Shih Tzu',
    edad: '3 años',
    sexo: 'Hembra',
    tamano: 'Pequeño',
    fechaIngreso: '15/11/2026',
    vacunado: true,
    esterilizado: true,
    disponible: true,
    descripcion:
      'Juguetona y muy dulce. Busca una familia que la consienta y la saque a pasear todos los días.',
    imagen: require('../assets/lucy.jpg'),
  },
  {
    id: '5',
    nombre: 'Luzu',
    raza: 'Mestizo',
    edad: '7 meses',
    sexo: 'Macho',
    tamano: 'Mediano',
    fechaIngreso: '15/11/2026',
    vacunado: false,
    esterilizado: false,
    disponible: true,
    descripcion:
      'Cachorro curioso y lleno de energía. Está aprendiendo a caminar con correa y le encantan las caricias.',
    imagen: require('../assets/luzu.jpg'),
  },
  {
    id: '1',
    nombre: 'Max',
    raza: 'Mestizo',
    edad: '3 años',
    sexo: 'Macho',
    tamano: 'Mediano',
    fechaIngreso: '16/11/2026',
    vacunado: true,
    esterilizado: true,
    disponible: true,
    descripcion:
      'Siempre está feliz y moviendo la cola. Le encanta acompañar a los estudiantes entre clases y jugar con pelotas.',
    imagen: require('../assets/max.jpg'),
  },
];
