
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS, MOCK_SELECTORS } from '../constants';
import { Event, VinylRecord, Post, SelectorSubmission, Comment, Merch, Order, TradeMetadata } from '../types';

export interface InboxMessage {
  id: string;
  type: string;
  sender: string;
  email: string;
  phone?: string;
  content: string;
  date: string;
  status: 'pending' | 'read';
  metadata?: any;
}

export interface AnalyticsData {
  totalRevenue: number;
  ticketSales: number;
  instagramStatus: { followers: number };
  communityActiveUsers: number;
}

export interface ConnectorStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  latency: string;
}

export interface GuestEntry {
  name: string;
  checkedIn: boolean;
  timestamp?: string;
}

class DataService {
  private localKey = 'mat32_core_database_v22';

  private getLocalDB() {
    try {
      const data = localStorage.getItem(this.localKey);
      if (!data) return this.initializeDefaultDB();
      return JSON.parse(data);
    } catch (e) {
      return this.initializeDefaultDB();
    }
  }

  private initializeDefaultDB() {
    const defaultDB = { 
      posts: MOCK_POSTS.map(p => ({ ...p, likes: p.likes || 0, comments: p.comments || [] })), 
      records: [...MOCK_RECORDS], 
      events: [...MOCK_EVENTS],
      selectors: [...MOCK_SELECTORS],
      inbox: [],
      rsvps: {},
      initialized: true,
      sales: []
    };
    this.saveLocalDB(defaultDB);
    return defaultDB;
  }

  private saveLocalDB(data: any) {
    localStorage.setItem(this.localKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  async authenticate(pin: string): Promise<boolean> {
    if (pin === '3232') {
      localStorage.setItem('mat32_admin_auth', 'true');
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('mat32_admin_auth') === 'true';
  }

  logout() {
    localStorage.removeItem('mat32_admin_auth');
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  async getCommunityPosts(): Promise<Post[]> { return this.getLocalDB().posts || []; }
  async getPostById(id: string): Promise<Post | undefined> {
    return this.getLocalDB().posts.find((p: Post) => p.id === id);
  }

  async deletePost(id: string) {
    const db = this.getLocalDB();
    db.posts = db.posts.filter((p: Post) => p.id !== id);
    this.saveLocalDB(db);
  }

  async createPost(post: Omit<Post, 'id' | 'likes' | 'comments' | 'timestamp' | 'tags'> & { isTrade?: boolean, tradeMetadata?: TradeMetadata }) {
    const db = this.getLocalDB();
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      likes: 0,
      comments: [],
      timestamp: 'Ahora',
      tags: post.isTrade ? ['#trade', '#cambalache'] : []
    };
    db.posts = [newPost, ...db.posts];
    this.saveLocalDB(db);
  }

  async addComment(postId: string, comment: { author: string; content: string }) {
    const db = this.getLocalDB();
    const posts = db.posts;
    const postIndex = posts.findIndex((p: Post) => p.id === postId);
    if (postIndex !== -1) {
      if (!posts[postIndex].comments) posts[postIndex].comments = [];
      posts[postIndex].comments.push({
        id: `c_${Date.now()}`,
        author: comment.author,
        content: comment.content,
        timestamp: 'Ahora'
      });
      this.saveLocalDB(db);
    }
  }

  async getRecords(): Promise<VinylRecord[]> { return this.getLocalDB().records || []; }
  async getRecordById(id: string): Promise<VinylRecord | undefined> {
    return this.getLocalDB().records.find((r: VinylRecord) => r.id === id);
  }
  async createRecord(record: Omit<VinylRecord, 'id'>) {
    const db = this.getLocalDB();
    const newRecord = { ...record, id: `r_${Date.now()}` };
    db.records.push(newRecord);
    this.saveLocalDB(db);
  }
  async updateRecord(record: VinylRecord) {
    const db = this.getLocalDB();
    const idx = db.records.findIndex((r: VinylRecord) => r.id === record.id);
    if (idx !== -1) {
      db.records[idx] = record;
      this.saveLocalDB(db);
    }
  }
  async deleteRecord(id: string) {
    const db = this.getLocalDB();
    db.records = db.records.filter((r: VinylRecord) => r.id !== id);
    this.saveLocalDB(db);
  }

  async getEvents(): Promise<Event[]> { return this.getLocalDB().events || []; }
  async getEventById(id: string): Promise<Event | undefined> {
    return this.getLocalDB().events.find((e: Event) => e.id === id);
  }
  async createEvent(event: Omit<Event, 'id'>) {
    const db = this.getLocalDB();
    const newEvent = { ...event, id: `e_${Date.now()}` };
    db.events.push(newEvent);
    this.saveLocalDB(db);
  }
  async updateEvent(event: Event) {
    const db = this.getLocalDB();
    const idx = db.events.findIndex((e: Event) => e.id === event.id);
    if (idx !== -1) {
      db.events[idx] = event;
      this.saveLocalDB(db);
    }
  }
  async deleteEvent(id: string) {
    const db = this.getLocalDB();
    db.events = db.events.filter((e: Event) => e.id !== id);
    this.saveLocalDB(db);
  }

  async getSelectors(): Promise<SelectorSubmission[]> { return this.getLocalDB().selectors || []; }
  async createSelector(selector: Omit<SelectorSubmission, 'id'>) {
    const db = this.getLocalDB();
    const newSelector = { ...selector, id: `s_${Date.now()}` };
    db.selectors.push(newSelector);
    this.saveLocalDB(db);
  }

  async getInbox(): Promise<InboxMessage[]> { return this.getLocalDB().inbox || []; }
  async createInboxMessage(msg: Omit<InboxMessage, 'id' | 'date' | 'status'>) {
    const db = this.getLocalDB();
    const newMsg: InboxMessage = {
      ...msg,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      status: 'pending'
    };
    db.inbox = [newMsg, ...db.inbox];
    this.saveLocalDB(db);
  }
  async deleteMessage(id: string) {
    const db = this.getLocalDB();
    db.inbox = db.inbox.filter((m: InboxMessage) => m.id !== id);
    this.saveLocalDB(db);
  }
  async updateMessageStatus(id: string, status: 'pending' | 'read') {
    const db = this.getLocalDB();
    const idx = db.inbox.findIndex((m: InboxMessage) => m.id === id);
    if (idx !== -1) {
      db.inbox[idx].status = status;
      this.saveLocalDB(db);
    }
  }

  async createBooking(booking: any) {
    return this.createInboxMessage({
      type: 'booking',
      sender: booking.name,
      email: booking.email,
      content: `Reserva para ${booking.guests} personas el ${booking.date} a las ${booking.time}.`,
      metadata: booking
    });
  }

  async recordSale(sale: any) {
    const db = this.getLocalDB();
    if (!db.sales) db.sales = [];
    db.sales = [sale, ...db.sales];
    this.saveLocalDB(db);
  }

  async getAdvancedAnalytics(): Promise<AnalyticsData> {
    const db = this.getLocalDB();
    const totalRev = (db.sales || []).reduce((acc: number, s: any) => acc + s.total, 0);
    const ticketSales = (db.sales || []).filter((s: any) => s.type === 'ticket').length;
    return {
      totalRevenue: totalRev,
      ticketSales: ticketSales,
      instagramStatus: { followers: 1240 },
      communityActiveUsers: db.posts.length * 3
    };
  }

  getConnectors(): ConnectorStatus[] {
    return [
      { id: '1', name: 'Stripe API', status: 'online', latency: '45ms' },
      { id: '2', name: 'Supabase Engine', status: 'online', latency: '12ms' },
      { id: '3', name: 'Instagram Graph', status: 'warning', latency: '240ms' },
      { id: '4', name: 'Gemini LLM', status: 'online', latency: '150ms' }
    ];
  }

  async getUserRSVPs(): Promise<string[]> {
    const name = localStorage.getItem('mat32_user_name');
    if (!name) return [];
    const db = this.getLocalDB();
    const rsvps: string[] = [];
    Object.keys(db.rsvps || {}).forEach(eventId => {
      if (db.rsvps[eventId].some((g: GuestEntry) => g.name === name)) {
        rsvps.push(eventId);
      }
    });
    return rsvps;
  }

  async getEventGuestList(eventId: string): Promise<GuestEntry[]> {
    const db = this.getLocalDB();
    return (db.rsvps && db.rsvps[eventId]) ? db.rsvps[eventId] : [];
  }

  async toggleRSVP(eventId: string, name: string, attending: boolean) {
    const db = this.getLocalDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    
    if (attending) {
      if (!db.rsvps[eventId].some((g: GuestEntry) => g.name === name)) {
        db.rsvps[eventId].push({ name, checkedIn: false });
      }
    } else {
      db.rsvps[eventId] = db.rsvps[eventId].filter((g: GuestEntry) => g.name !== name);
    }
    this.saveLocalDB(db);
  }

  async toggleCheckIn(eventId: string, guestName: string) {
    const db = this.getLocalDB();
    const list = (db.rsvps && db.rsvps[eventId]) ? db.rsvps[eventId] : [];
    const idx = list.findIndex((g: GuestEntry) => g.name === guestName);
    if (idx !== -1) {
      list[idx].checkedIn = !list[idx].checkedIn;
      list[idx].timestamp = list[idx].checkedIn ? new Date().toLocaleTimeString() : undefined;
      db.rsvps[eventId] = list;
      this.saveLocalDB(db);
    }
  }

  async addManualGuest(eventId: string, name: string) {
    const db = this.getLocalDB();
    if (!db.rsvps) db.rsvps = {};
    if (!db.rsvps[eventId]) db.rsvps[eventId] = [];
    db.rsvps[eventId].push({ name, checkedIn: true, timestamp: new Date().toLocaleTimeString() });
    this.saveLocalDB(db);
  }

  getUserProfile() {
    const alias = localStorage.getItem('mat32_user_name');
    return alias ? { alias, color: '#ea580c' } : null;
  }
  setUserProfile(alias: string) {
    localStorage.setItem('mat32_user_name', alias);
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }

  clearDatabase() {
    localStorage.removeItem(this.localKey);
    localStorage.removeItem('mat32_admin_auth');
    window.dispatchEvent(new CustomEvent('mat32_data_changed'));
  }
}

export const dataService = new DataService();

