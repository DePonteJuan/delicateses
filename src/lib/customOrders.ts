export type CustomOrderExample = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

/** Referencias de encargos con precio orientativo y ficha propia. */
export const customOrderExamples: CustomOrderExample[] = [
  {
    id: 'sonic-arequipe',
    name: 'Torta Sonic de arequipe',
    price: 15,
    image:
      '/images/products/torta-personalizada-de-arequipe-de-cumpleanos-de-tematica-sonic.jpg',
    description:
      'Torta temática de Sonic con relleno o cobertura de arequipe. Ideal para cumpleaños infantiles. El precio es orientativo según tamaño y detalles de decoración.',
  },
  {
    id: 'minnie',
    name: 'Torta Minnie Mouse',
    price: 25,
    image:
      '/images/products/torta-personalizada-de-cumpleanos-de-tematica-minie-mouse.jpg',
    description:
      'Diseño de Minnie Mouse en tonos rosa y rojo, perfecta para celebraciones de niñas. Personalizamos nombre y edad en el pastel.',
  },
  {
    id: '15-doble-piso',
    name: 'Torta doble piso de 15 años',
    price: 50,
    image: '/images/products/torta-doble-piso-de-15-anos.jpg',
    description:
      'Torta de dos pisos para quinceaños, con decoración elegante. Pensada para mesas grandes; el precio orientativo varía con flores, toppers y porciones.',
  },
  {
    id: 'sonic',
    name: 'Torta cumpleaños Sonic',
    price: 15,
    image: '/images/products/torta-personaliza-de-cumpleanos-de-sonic.jpg',
    description:
      'Versión de cumpleaños con temática Sonic. Podemos ajustar colores, personaje y mensaje según tu referencia.',
  },
  {
    id: 'comunion-2-pisos',
    name: 'Torta 2 pisos primera comunión',
    price: 26,
    image:
      '/images/products/torta-personalizada-2-pisos-de-primera-comunion.jpg',
    description:
      'Torta de dos pisos para primera comunión, en tonos suaves y detalles religiosos. Incluye espacio para nombre del celebrante.',
  },
  {
    id: 'harry-potter',
    name: 'Torta Harry Potter',
    price: 26,
    image: '/images/products/torta-personalizada-de-harry-potter-nina.jpg',
    description:
      'Temática Harry Potter con detalles del mundo mágico. Ideal para fans; adaptable a casa, escudo o personaje favorito.',
  },
  {
    id: '15-tres-pisos',
    name: 'Torta 15 años 3 pisos',
    price: 60,
    image: '/images/products/torta-personaliza-de-15-anos-3-pisos.jpg',
    description:
      'Torta imponente de tres pisos para quinceaños. Recomendada con anticipación para definir sabores, colores y decoración.',
  },
  {
    id: 'revelacion',
    name: 'Torta revelación de sexo',
    price: 15,
    image: '/images/products/torta-personaliza-de-revelacion-de-sexo.jpg',
    description:
      'Torta para gender reveal: exterior neutro y sorpresa rosa o azul al cortar. Coordinamos el relleno secreto contigo.',
  },
  {
    id: 'beisbol',
    name: 'Torta cumpleaños béisbol',
    price: 15,
    image: '/images/products/torta-personaliza-de-cumpleanos-de-beisbol.jpg',
    description:
      'Diseño deportivo de béisbol con guante, pelota o equipo favorito. Perfecta para fans del diamante.',
  },
  {
    id: 'zulia',
    name: 'Torta cerveza Zulia',
    price: 15,
    image:
      '/images/products/torta-personaliza-de-cumpleanos-de-cervezas-zulia.jpg',
    description:
      'Torta temática de cerveza Zulia para cumpleaños adultos. Decoración divertida y lista para la mesa de celebración.',
  },
  {
    id: 'princesa',
    name: 'Torta princesa',
    price: 26,
    image: '/images/products/torta-personaliza-de-cumpleanos-de-princesa.jpg',
    description:
      'Estilo princesa con coronas, tul o personajes de cuento. Personalizamos color y nombre de la festejada.',
  },
  {
    id: 'ballenato',
    name: 'Torta ballenato',
    price: 26,
    image: '/images/products/torta-personalizada-de-ballenato.jpg',
    description:
      'Torta con temática de ballena / ballenato, suave y alegre para cumpleaños infantiles o baby shower.',
  },
  {
    id: 'comunion',
    name: 'Torta primera comunión',
    price: 26,
    image: '/images/products/torta-personalizada-de-primera-comunion.jpg',
    description:
      'Diseño clásico de primera comunión en blanco y dorado o plateado. Elegante y adecuada para la ceremonia.',
  },
  {
    id: 'bautizo',
    name: 'Torta bautizo',
    price: 26,
    image: '/images/products/torta-personalizada-de-bautizo.jpg',
    description:
      'Torta para bautizo con detalles delicados (cruz, ángeles o tonos pastel). Ideal para compartir después de la ceremonia.',
  },
  {
    id: 'cars',
    name: 'Torta Cars',
    price: 26,
    image: '/images/products/torta-personalizada-de-cumpleanos-de-cars.jpg',
    description:
      'Temática Cars / Rayo McQueen para pequeños fans de la velocidad. Colores vivos y personaje a elección.',
  },
  {
    id: 'kurumi',
    name: 'Torta Kurumi',
    price: 26,
    image: '/images/products/torta-personalizada-de-cumpleanos-de-kurumi.jpg',
    description:
      'Torta inspirada en Kurumi (anime). Enviamos o recibimos referencia para replicar colores y detalles del personaje.',
  },
  {
    id: 'ositos',
    name: 'Revelación Ositos Cariñositos',
    price: 60,
    image:
      '/images/products/torta-personalizada-de-revelacion-de-sexo-de-ositos-carinositos.jpg',
    description:
      'Gender reveal con temática Ositos Cariñositos. Formato grande y vistoso; el relleno secreto se acuerda al pedir.',
  },
  {
    id: 'cr7',
    name: 'Torta Cristiano Ronaldo',
    price: 26,
    image:
      '/images/products/torta-personalizada-de-cumpleanos-tematica-cristiano-ronaldo.jpg',
    description:
      'Torta futbolera de Cristiano Ronaldo / CR7. Ideal para fans; podemos incluir dorsal, escudo o frase favorita.',
  },
  {
    id: 'mario',
    name: 'Torta Mario',
    price: 26,
    image: '/images/products/torta-personaliza-de-cumpleanos-de-mario.jpg',
    description:
      'Temática Super Mario Bros con colores vivos y personajes del juego. Perfecta para cumpleaños gamer.',
  },
];

export function customOrderSlug(id: string) {
  return `encargo-${id}`;
}

export function getCustomOrderExample(slug: string) {
  if (!slug.startsWith('encargo-')) return null;
  const id = slug.slice('encargo-'.length);
  return customOrderExamples.find((ex) => ex.id === id) ?? null;
}

export function customOrderAsProduct(ex: CustomOrderExample) {
  return {
    slug: customOrderSlug(ex.id),
    name: ex.name,
    category: 'postres' as const,
    description: ex.description,
    price: ex.price,
    image: ex.image,
    available: true,
    featured: false,
    sizes: [] as { label: string; price: number }[],
    isCustomOrder: true as const,
  };
}
