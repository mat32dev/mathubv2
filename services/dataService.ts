
import { MOCK_EVENTS, MOCK_RECORDS, MOCK_POSTS } from '../constants';
import { Event, VinylRecord, Post, TableBooking, Customer } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface AnalyticsData {
  totalRevenue: number;
  ticketSales: number;
  instagramStatus: { connected: boolean; followers: number };
  discogsStatus: { connected: boolean };
}

class DataService {
  private localKey = 'mat32_local_db_v2';

  private getLocalDB() {
    const data = localStorage.getItem(this.localKey);
    return data ? JSON.parse(data) : { posts: [], communityRecords: [], rsvps: [] };
  }

  private saveLocalDB(data: any) {
    localStorage.setItem(this.localKey, JSON.stringify(data));
  }

  // --- COMMUNITY HUB ---

  async getCommunityPosts(): Promise<Post[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data.map((p: any) => ({
          ...p,
          id: p.id,
          avatar: `https://i.pravatar.cc/150?u=${p.id}`,
          timestamp: new Date(p.created_at).toLocaleDateString(),
          tags: ['#comunidad', '#mat32']
        }));
      }
    }
    // Fallback local
    const local = this.getLocalDB();
    return local.posts.length > 0 ? local.posts : MOCK_POSTS;
  }

  async createPost(post: { content: string; author: string }) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('community_posts')
        .insert([{ author: post.author, content: post.content, likes: 0 }]);
      if (!error) return true;
    }
    
    // Fallback local
    const local = this.getLocalDB();
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: post.author,
      avatar: `https://i.pravatar.cc/150?u=${post.author}`,
      content: post.content,
      likes: 0,
      comments: 0,
      timestamp: 'Justo ahora',
      tags: ['#local']
    };
    local.posts = [newPost, ...local.posts];
    this.saveLocalDB(local);
    return true;
  }

  async getCommunityRecords(): Promise<VinylRecord[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('community_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data.map((r: any) => ({
          ...r,
          coverUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400',
          format: 'LP',
          discogsLink: '#'
        }));
      }
    }
    return this.getLocalDB().communityRecords;
  }

  async addCommunityRecords(records: any[], owner: string) {
    if (isSupabaseConfigured && supabase) {
      const toInsert = records.map(r => ({
        artist: r.artist,
        title: r.title,
        price: r.price,
        genre: r.genre,
        owner_name: owner
      }));
      const { error } = await supabase.from('community_records').insert(toInsert);
      if (!error) return true;
    }

    const local = this.getLocalDB();
    const formatted = records.map(r => ({
      ...r,
      id: `local-${Date.now()}-${Math.random()}`,
      ownerName: owner,
      coverUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400',
    }));
    local.communityRecords = [...local.communityRecords, ...formatted];
    this.saveLocalDB(local);
    return true;
  }

  // --- CORE SYSTEM ---

  async getRecords(): Promise<VinylRecord[]> {
    const comm = await this.getCommunityRecords();
    return [...MOCK_RECORDS, ...comm];
  }

  async getEvents(): Promise<Event[]> {
    return MOCK_EVENTS;
  }

  async getUserRSVPs(): Promise<string[]> {
    return this.getLocalDB().rsvps;
  }

  async toggleRSVP(eventId: string, attending: boolean) {
    const local = this.getLocalDB();
    if (attending) {
      if (!local.rsvps.includes(eventId)) local.rsvps.push(eventId);
    } else {
      local.rsvps = local.rsvps.filter((id: string) => id !== eventId);
    }
    this.saveLocalDB(local);
    return true;
  }

  // --- ADMIN & ANALYTICS ---

  async getAdvancedAnalytics(): Promise<AnalyticsData> {
    return {
      totalRevenue: 2840,
      ticketSales: 112,
      instagramStatus: { connected: isSupabaseConfigured, followers: 2450 },
      discogsStatus: { connected: false }
    };
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('mat32_auth') === 'true';
  }

  async authenticate(pin: string) {
    if (pin === '1234') {
      sessionStorage.setItem('mat32_auth', 'true');
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem('mat32_auth');
  }

  async toggleRecordTradeable(id: string) { return true; }
  async getConfig() { return {}; }
  async updateConfig(updates: any) { return true; }
  async getBookings() { return []; }
  async getCustomers() { return []; }
  async createBooking(b: any) { return true; }
  async recordSale(s: any) { return true; }
  async deleteRecord(id: string) { return true; }
  async deleteEvent(id: string) { return true; }
  async createRecord(r: any) { return true; }
  async createEvent(e: any) { return true; }
  exportBackup() {}
  async importBackup(f: File) { return true; }
}

export const dataService = new DataService();
