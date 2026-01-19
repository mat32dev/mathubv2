import { Event, Post, VinylRecord, MenuCategory, SelectorSubmission } from './types';

const getFutureDate = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Saturday Night Fever: Italo Disco',
    date: getFutureDate(2),
    time: '22:00',
    location: 'Mat32 Main Bar',
    description: 'Un viaje profundo a los sonidos italo-disco de los 80. Selección curada con enfoque en sintes raros y ritmos de baile hipnóticos.',
    category: 'Disco',
    imageUrl: 'https://images.unsplash.com/photo-1563841930606-67e2b645b7bb?q=80&w=800',
    attendees: 85,
    capacity: 100,
    price: 15,
    ticketLink: 'https://ra.co',
    lineup: [
      { name: 'Marco V', role: 'Main Selector', profileUrl: '/selector/marco-v' },
      { name: 'Luna', role: 'Warm up', profileUrl: '/selector/luna' }
    ],
    vibe: ['Italo', '80s', 'Neon']
  },
  {
    id: '2',
    title: 'Sunday Digging Sessions',
    date: getFutureDate(3),
    time: '11:00',
    location: 'Mat32 Record Store',
    description: 'Lanzamiento de stock de Jazz Japonés y City Pop. Café cortesía de la casa mientras exploramos las nuevas llegadas.',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
    attendees: 42,
    capacity: 60,
    price: 0,
    lineup: [
      { name: 'The Crate Digger', role: 'Resident Selector' }
    ],
    vibe: ['Chill', 'Jazz', 'Coffee']
  },
  {
    id: '4',
    title: 'Deep House Hub: Analogue Soul',
    date: getFutureDate(9),
    time: '23:00',
    location: 'Mat32 Club Room',
    description: 'Texturas inmersivas y ritmos profundos. Una sesión nocturna dedicada a los matices del house en alta fidelidad.',
    category: 'House',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800',
    attendees: 110,
    capacity: 120,
    price: 20,
    ticketLink: 'https://ra.co',
    lineup: [
      { name: 'Alex Black', role: 'All Night Long' }
    ],
    vibe: ['Deep', 'Soulful', 'Dark']
  },
  {
    id: '5',
    title: 'Open Decks: Community Voices',
    date: getFutureDate(7),
    time: '19:00',
    location: 'Mat32 Lounge',
    description: 'Nuestra plataforma para talentos emergentes. 4 slots de 45 minutos para selectores locales.',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800',
    attendees: 25,
    capacity: 50,
    price: 0,
    lineup: [
      { name: 'Comunidad', role: 'Various Artists' }
    ],
    vibe: ['New Talent', 'Ruzafa', 'Support']
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: '101',
    author: 'VinylAddict_VLC',
    avatar: 'https://i.pravatar.cc/150?u=101',
    content: 'Acabo de encontrar una primera edición de "Casiopea" en la tienda. ¡Estado impecable! No durará mucho en la caja.',
    likes: 32,
    comments: [
      { id: 'c1', author: 'CrateDigger', content: '¡Increíble hallazgo! Esa edición suena de lujo.', timestamp: 'Hace 1 hora' }
    ],
    timestamp: 'Hace 2 horas',
    tags: ['#vinyl', '#jazzfusion', '#mat32']
  },
  {
    id: '102',
    author: 'SelectorLuna',
    avatar: 'https://i.pravatar.cc/150?u=102',
    content: 'Preparando la maleta para el sábado. Mucho Italo y alguna que otra sorpresa de Chicago. ¡Nos vemos en la cabina!',
    likes: 45,
    comments: [],
    timestamp: 'Hace 5 horas',
    tags: ['#italodisco', '#djlife', '#ruzafa']
  },
  {
    id: '103',
    author: 'RuzafaLover',
    avatar: 'https://i.pravatar.cc/150?u=103',
    content: '¿Alguien sabe si el sistema Klipsch estará activo este domingo para la sesión de jazz? El sonido es increíble.',
    likes: 12,
    comments: [],
    timestamp: 'Hace 1 día',
    tags: ['#hifi', '#valencia', '#ruzafa']
  }
];

export const MOCK_RECORDS: VinylRecord[] = [
  {
    id: 'r1',
    artist: 'Donna Summer',
    title: 'I Feel Love',
    label: 'Casablanca',
    year: '1977',
    condition: 'VG+',
    price: 25.00,
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800',
    genre: 'Disco',
    format: '12"',
    discogsLink: 'https://www.discogs.com/master/85309-Donna-Summer-I-Feel-Love',
    description: 'La obra maestra de Moroder. Esencial para cualquier coleccionista.',
    isFeatured: true
  },
  {
    id: 'r2',
    artist: 'Mr. Fingers',
    title: 'Can You Feel It',
    label: 'Trax Records',
    year: '1986',
    condition: 'NM',
    price: 45.00,
    coverUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
    genre: 'House',
    format: '12"',
    discogsLink: '#',
    description: 'El himno del house profundo. Reedición de alta calidad.',
    isFeatured: true
  },
  {
    id: 'r3',
    artist: 'Kraftwerk',
    title: 'The Model',
    label: 'EMI',
    year: '1978',
    condition: 'VG+',
    price: 30.00,
    coverUrl: 'https://images.unsplash.com/photo-1621360841013-c768371e93cf?q=80&w=800',
    genre: 'Ambient',
    format: 'LP',
    discogsLink: '#',
    description: 'Pioneros de la electrónica. Edición alemana original.',
    isTradeable: true,
    ownerName: 'Admin_Crate'
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [
  {
    id: 's1',
    artistName: 'DJ LUNA',
    genres: ['Disco', 'Italo', '80s Synth'],
    format: 'Physical & Digital',
    bio: 'Residente en Valencia, Luna ha estado buscando joyas de Italo durante más de una década.',
    mixUrl: 'https://soundcloud.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=luna'
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'Signatures',
    items: [
      { name: 'Mat32 Spritz', description: 'Aperol, Cava, Soda, Twist de Naranja', price: '9.00', highlight: true },
      { name: 'B-Side Old Fashioned', description: 'Bourbon, Arce, Angostura, Piel de Naranja', price: '12.00', highlight: true }
    ]
  },
  {
    title: 'Liquid Selection',
    items: [
      { name: 'Vino de la Casa', description: 'Tinto o Blanco regional', price: '4.50' },
      { name: 'Craft Beer', description: 'IPA local de Ruzafa', price: '6.00' }
    ]
  }
];
