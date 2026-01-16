
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
    description: 'A deep journey through the analog and digital sounds of Milan and Rimini. Curated selection focused on early 80s synth-pop and rare grooves.',
    category: 'Disco',
    imageUrl: 'https://images.unsplash.com/photo-1563841930606-67e2b645b7bb?q=80&w=800&auto=format&fit=crop',
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
    description: 'Fresh shipment of Japanese Jazz and City Pop. Coffee on the house while we explore new arrivals in physical formats.',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop',
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
    title: 'Deep House Hub',
    date: getFutureDate(9),
    time: '23:00',
    location: 'Mat32 Club Room',
    description: 'Immersive textures and driving rhythms. An all-night session dedicated to the deeper shades of house music in high fidelity.',
    category: 'House',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=800&auto=format&fit=crop',
    attendees: 110,
    capacity: 120,
    price: 20,
    ticketLink: 'https://ra.co',
    lineup: [
      { name: 'Resident Head', role: 'All Night Long' }
    ],
    vibe: ['Deep', 'Soulful', 'Dark']
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: '101',
    author: 'MusicHunter',
    avatar: 'https://i.pravatar.cc/150?u=101',
    content: 'Just grabbed that original press of "Casiopea" from the shop. The condition is immaculate!',
    likes: 24,
    comments: 3,
    timestamp: '2 hours ago',
    tags: ['#records', '#jazzfusion', '#mat32']
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
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop',
    genre: 'Disco',
    format: '12"',
    discogsLink: 'https://www.discogs.com/master/85309-Donna-Summer-I-Feel-Love',
    description: 'The original Moroder masterpiece. Essential for any collection.',
    isFeatured: true
  }
];

export const MOCK_SELECTORS: SelectorSubmission[] = [
  {
    id: 's1',
    artistName: 'DJ LUNA',
    genres: ['Disco', 'Italo', '80s Synth'],
    format: 'Physical & Digital',
    bio: 'Based in Valencia, Luna has been digging for rare Italo cuts for over a decade.',
    mixUrl: 'https://soundcloud.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=luna'
  }
];

export const BAR_MENU: MenuCategory[] = [
  {
    title: 'Signatures',
    items: [
      { name: 'Mat32 Spritz', description: 'Aperol, Cava, Soda, Orange Twist', price: '9.00', highlight: true },
      { name: 'B-Side Old Fashioned', description: 'Bourbon, Maple, Angostura, Orange Peel', price: '12.00', highlight: true }
    ]
  }
];
