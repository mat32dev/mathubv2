
export interface LineupMember {
  name: string;
  role: string;
  profileUrl?: string;
  avatarUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'Disco' | 'House' | 'Live' | 'Social' | 'Promoter Request';
  imageUrl: string;
  attendees: number;
  capacity?: number;
  price: number;
  ticketLink?: string;
  status?: 'published' | 'draft' | 'cancelled';
  lineup: LineupMember[];
  vibe?: string[];
}

export interface TableBooking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent: number;
  lastVisit: string;
  tags: string[];
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface VinylRecord {
  id: string;
  artist: string;
  title: string;
  label: string;
  year: string;
  condition: 'Mint' | 'NM' | 'VG+' | 'VG';
  price: number;
  coverUrl: string;
  genre: 'Disco' | 'House' | 'Funk' | 'Jazz' | 'Ambient';
  format: 'LP' | '12"' | '7"';
  discogsLink: string;
  listenLinks?: {
    bandcamp?: string;
    appleMusic?: string;
    bandcampEmbed?: string;
    appleEmbed?: string;
  };
  description: string;
  isStaffPick?: boolean;
  isFeatured?: boolean;
  isTradeable?: boolean;
  ownerName?: string;
}

export interface CartItem extends VinylRecord {
  quantity: number;
}

export interface MenuItem {
  name: string;
  description?: string;
  price: string;
  highlight?: boolean;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface SelectorSubmission {
  id: string;
  artistName: string;
  genres: string[];
  format: string;
  bio: string;
  mixUrl: string;
  avatarUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export enum NavItem {
  HOME = 'Home',
  BAR = 'Bar',
  EVENTS = 'Agenda',
  RECORDS = 'Shop',
  PRIVATE_EVENTS = 'Venue Hire',
  COMMUNITY = 'Community',
  OPEN_DECKS = 'Open Decks',
  CONTACT = 'Contact'
}
