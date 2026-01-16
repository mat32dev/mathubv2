
import React, { useState, useEffect } from 'react';
import { 
  Disc, Calendar as CalendarIcon, Loader2, Trash2, CheckCircle2, 
  Activity, Instagram, BarChart3, Globe, ShieldCheck, 
  LogOut, Terminal, RefreshCw, Plus, Users, Upload, Database, 
  X, Mail, Check, Calendar, XCircle, ChevronRight, LayoutDashboard, Share2,
  ShoppingBag, TrendingUp, CreditCard, Star, ExternalLink, MapPin, Clock, Search, Sliders, Lock, Zap, HardDrive, Download,
  Cloud, Cpu
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService, AnalyticsData } from '../services/dataService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { VinylRecord, Event, TableBooking, Customer } from '../types';

type AdminTab = 'analytics' | 'inventory' | 'agenda' | 'guest-list' | 'integrations';

export const Admin: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [config, setConfig] = useState<any>(null);
  
  // Modals
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  // Data State
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [venueBookings, setVenueBookings] = useState<TableBooking[]>([]);
  const [guests, setGuests] = useState<Customer[]>([]);

  useEffect(() => {
    if (dataService.isAuthenticated()) setIsAuth(true);
  }, []);

  useEffect(() => {
    if (isAuth) loadData();
  }, [activeTab, isAuth]);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await dataService.getAdvancedAnalytics();
      const currentConfig = await dataService.getConfig();
      setAnalytics(stats);
      setConfig(currentConfig);
      setRecords(await dataService.getRecords());
      setEvents(await dataService.getEvents());
      setVenueBookings(await dataService.getBookings());
      setGuests(await dataService.getCustomers());
    } catch (err) {
      console.error("Admin Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = () => {
    dataService.exportBackup();
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && window.confirm('¿Restaurar copia de seguridad? Esto reemplazará todos los datos actuales.')) {
      setLoading(true);
      const success = await dataService.importBackup(file);
      if (success) {
        alert('Copia de seguridad restaurada correctamente.');
        window.location.reload();
      } else {
        alert('Error al procesar el archivo.');
      }
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent<HTMLFormElement>, service: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates: any = {};
    formData.forEach((value, key) => { updates[key] = value; });
    
    await dataService.updateConfig(updates);
    alert(`${service} Configuration Updated`);
    loadData();
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Delete this record?')) {
      await dataService.deleteRecord(id);
      loadData();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Delete this event?')) {
      await dataService.deleteEvent(id);
      loadData();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await dataService.authenticate(pin);
    if (token) { setIsAuth(true); setAuthError(false); }
    else { setAuthError(true); setPin(''); }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-mat-900 border-2 border-mat-800 p-10 rounded-[2.5rem] shadow-2xl relative">
           <div className="text-center mb-10">
              <Terminal className="w-12 h-12 text-mat-500 mx-auto mb-4" />
              <h1 className="text-white text-xl font-black uppercase tracking-[0.3em]">MAT32 CORE AUTH</h1>
           </div>
           <form onSubmit={handleLogin} className="space-y-6">
              <input 
                type="password" value={pin} onChange={(e) => setPin(e.target.value)}
                className="w-full bg-mat-800 border-2 border-mat-700 text-white text-center p-5 text-xl tracking-[0.5em] rounded-2xl outline-none focus:border-mat-500"
                placeholder="PIN" autoFocus
              />
              <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-mat-400 transition-all">
                Access Protocol
              </button>
           </form>
           {authError && <p className="text-red-500 text-center mt-4 text-[10px] uppercase tracking-widest">Unauthorized Access</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] text-mat-cream pb-24 font-sans relative">
      <SEO titleKey="Admin Hub" descriptionKey="Mat32 Back Office" />
      
      <header className="bg-mat-900/80 backdrop-blur-xl border-b border-mat-800 p-6 sticky top-0 z-50">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Activity className="text-mat-500 w-8 h-8" />
            <h1 className="text-lg font-black uppercase tracking-tighter">MAT32 <span className="text-mat-500">SYSTEM</span></h1>
          </div>
          <nav className="flex bg-mat-800 p-1 rounded-2xl border border-mat-700 overflow-x-auto max-w-full">
             {[
               { id: 'analytics', label: 'Dashboard' },
               { id: 'inventory', label: 'Inventory' },
               { id: 'agenda', label: 'Agenda' },
               { id: 'guest-list', label: 'Guest List' },
               { id: 'integrations', label: 'Integrations' }
             ].map(tab => (
               <button 
                 key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)}
                 className={`p-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
               >
                 {tab.label}
               </button>
             ))}
          </nav>
          <button onClick={() => { dataService.logout(); setIsAuth(false); }} className="p-3 bg-mat-800 text-gray-500 hover:text-red-500 rounded-xl transition-all"><LogOut className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center py-40"><Loader2 className="w-16 h-16 text-mat-500 animate-spin" /></div>
        ) : (
          <div className="animate-fade-in space-y-12">
            
            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && analytics && (
               <div className="space-y-12">
                 {/* System Health Section */}
                 <div className="bg-mat-900 border-2 border-mat-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                    <div className="flex items-center gap-4 mb-8">
                       <ShieldCheck className="w-6 h-6 text-mat-500" />
                       <h3 className="text-xl font-black text-white uppercase tracking-tighter">System Health Status</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="flex items-center gap-4 p-5 bg-mat-800 rounded-2xl border border-mat-700">
                          <div className={`p-3 rounded-full ${isSupabaseConfigured ? 'bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse' : 'bg-amber-500/10 text-amber-500'}`}>
                             <Cloud className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Database Mode</p>
                             <p className="text-sm font-black text-white uppercase">{isSupabaseConfigured ? 'Cloud Sync (Supabase)' : 'Local Storage Mode'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-5 bg-mat-800 rounded-2xl border border-mat-700">
                          <div className={`p-3 rounded-full ${process.env.API_KEY ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                             <Cpu className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">AI Engine</p>
                             <p className="text-sm font-black text-white uppercase">{process.env.API_KEY ? 'Gemini 3 Flash Active' : 'AI Offline (No Key)'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 p-5 bg-mat-800 rounded-2xl border border-mat-700">
                          <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                             <Globe className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">SEO Indexing</p>
                             <p className="text-sm font-black text-white uppercase">Sitemap Ready v1.4</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] hover:border-mat-500 transition-all group">
                       <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Total Revenue</h4>
                       <p className="text-3xl font-black text-white leading-none mb-2">€{analytics.totalRevenue.toFixed(0)}</p>
                       <span className="text-[9px] text-green-500 font-bold uppercase flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Growth Tracking</span>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] hover:border-mat-500 transition-all">
                       <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Ticketing</h4>
                       <p className="text-3xl font-black text-white leading-none mb-2">{analytics.ticketSales}</p>
                       <span className="text-[9px] text-mat-500 font-bold uppercase">Orders Processed</span>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] hover:border-mat-500 transition-all">
                       <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Audience</h4>
                       <p className="text-3xl font-black text-white leading-none mb-2">{analytics.instagramStatus.followers}</p>
                       <span className="text-[9px] text-blue-400 font-bold uppercase flex items-center gap-1"><Instagram className="w-3 h-3" /> Social Reach</span>
                    </div>
                    <div className="bg-mat-900 border border-mat-800 p-8 rounded-[2rem] hover:border-mat-500 transition-all">
                       <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Stock level</h4>
                       <p className="text-3xl font-black text-white leading-none mb-2">{records.length}</p>
                       <span className="text-[9px] text-gray-500 font-bold uppercase">Vinyl in Crate</span>
                    </div>
                 </div>
               </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="bg-mat-900 border border-mat-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <div className="p-8 border-b border-mat-800 flex justify-between items-center bg-mat-800/20">
                    <div className="flex items-center gap-4">
                       <Disc className="w-8 h-8 text-mat-500" />
                       <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Stock Inventory</h2>
                    </div>
                    <button onClick={() => setShowAddRecord(true)} className="px-8 py-4 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl">
                       <Plus className="w-4 h-4" /> New Arrival
                    </button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-mat-800 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-mat-700">
                          <tr><th className="p-6">Cover</th><th className="p-6">Artist / Title</th><th className="p-6">Price</th><th className="p-6">Format</th><th className="p-6">Actions</th></tr>
                       </thead>
                       <tbody className="divide-y divide-mat-800">
                          {records.map(r => (
                             <tr key={r.id} className="hover:bg-mat-800/30 transition-colors">
                                <td className="p-6"><img src={r.coverUrl} className="w-12 h-12 object-cover rounded border border-mat-700" alt="Cover" /></td>
                                <td className="p-6">
                                   <p className="text-xs font-black text-white uppercase">{r.title}</p>
                                   <p className="text-[10px] text-gray-500 uppercase">{r.artist}</p>
                                </td>
                                <td className="p-6 text-sm font-black">€{r.price}</td>
                                <td className="p-6 text-[9px] font-black text-gray-500 uppercase">{r.format}</td>
                                <td className="p-6">
                                   <button onClick={() => handleDeleteRecord(r.id)} className="p-2 bg-mat-800 text-gray-500 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}

            {/* AGENDA TAB */}
            {activeTab === 'agenda' && (
               <div className="bg-mat-900 border border-mat-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-mat-800 flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <CalendarIcon className="w-8 h-8 text-mat-500" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Agenda Session Control</h2>
                     </div>
                     <button onClick={() => setShowAddEvent(true)} className="px-8 py-4 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl">
                        <Plus className="w-4 h-4" /> Add Session
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-mat-800 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-mat-700">
                           <tr><th className="p-6">Session</th><th className="p-6">Timeline</th><th className="p-6">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-mat-800">
                           {events.map(e => (
                              <tr key={e.id}>
                                 <td className="p-6 text-xs font-black text-white uppercase">{e.title}</td>
                                 <td className="p-6 text-xs font-bold text-gray-400">{e.date} @ {e.time}</td>
                                 <td className="p-6"><button onClick={() => handleDeleteEvent(e.id)} className="p-2 bg-mat-800 text-gray-500 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* GUEST LIST TAB */}
            {activeTab === 'guest-list' && (
               <div className="bg-mat-900 border border-mat-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-mat-800">
                     <div className="flex items-center gap-4">
                        <Users className="w-8 h-8 text-mat-500" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Venue Hire Bookings</h2>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-mat-800 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-mat-700">
                           <tr><th className="p-6">Guest</th><th className="p-6">Timeline</th><th className="p-6">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-mat-800">
                           {venueBookings.map(b => (
                              <tr key={b.id}>
                                 <td className="p-6 text-xs font-black text-white uppercase">{b.name}</td>
                                 <td className="p-6 text-xs font-bold text-gray-400">{b.date} @ {b.time}</td>
                                 <td className="p-6"><span className="px-2 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase rounded border border-green-500/20">{b.status}</span></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                  
                  {/* System Backup & Recovery */}
                  <div className="bg-mat-900 border border-mat-800 rounded-[2.5rem] p-8 flex flex-col group border-mat-500/30 hover:border-mat-500 transition-all shadow-xl">
                     <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-mat-800 rounded-2xl border border-mat-700 group-hover:border-mat-500 transition-colors">
                           <HardDrive className="w-8 h-8 text-mat-500" />
                        </div>
                        <div className="px-3 py-1 bg-mat-500/10 border border-mat-500 text-mat-500 rounded-full text-[8px] font-black uppercase tracking-widest">
                           SYSTEM VAULT
                        </div>
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">System Recovery</h3>
                     <p className="text-gray-500 text-xs mb-8 flex-1">Export your entire hub data (records, events, configurations) to a secure local file.</p>
                     
                     <div className="space-y-4">
                        <button 
                           onClick={handleExportBackup}
                           className="w-full py-4 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-mat-400 transition-all flex items-center justify-center gap-2"
                        >
                           <Download className="w-4 h-4" /> Download Full Backup
                        </button>
                        
                        <div className="relative">
                           <input 
                              type="file" 
                              accept=".json"
                              onChange={handleImportBackup}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                           />
                           <button className="w-full py-4 bg-mat-800 border border-mat-700 text-mat-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-mat-500 transition-all flex items-center justify-center gap-2">
                              <Upload className="w-4 h-4" /> Restore from JSON
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Instagram Module */}
                  <div className="bg-mat-900 border border-mat-800 rounded-[2.5rem] p-8 flex flex-col group hover:border-mat-500 transition-all">
                     <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-mat-800 rounded-2xl border border-mat-700 group-hover:border-mat-500 transition-colors">
                           <Instagram className="w-8 h-8 text-mat-500" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${analytics?.instagramStatus.connected ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                           {analytics?.instagramStatus.connected ? 'ACTIVE FEED' : 'DISCONNECTED'}
                        </div>
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Instagram Hub</h3>
                     <p className="text-gray-500 text-xs mb-8 flex-1">Control the community wall synchronization and real-time follower count.</p>
                     <form onSubmit={(e) => handleUpdateConfig(e, 'Instagram')} className="space-y-4">
                        <input name="instagramUsername" defaultValue={config?.instagramUsername} placeholder="@username" className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-[10px] font-black uppercase outline-none focus:border-mat-500 rounded-xl" />
                        <input name="instagramToken" type="password" defaultValue={config?.instagramToken} placeholder="Access Token" className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-[10px] font-black uppercase outline-none focus:border-mat-500 rounded-xl" />
                        <button type="submit" className="w-full py-4 bg-mat-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-mat-400 transition-all flex items-center justify-center gap-2">
                           <RefreshCw className="w-4 h-4" /> Link Feed Protocol
                        </button>
                     </form>
                  </div>

                  {/* Discogs Module */}
                  <div className="bg-mat-900 border border-mat-800 rounded-[2.5rem] p-8 flex flex-col group hover:border-mat-500 transition-all">
                     <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-mat-800 rounded-2xl border border-mat-700 group-hover:border-mat-500 transition-colors">
                           <Disc className="w-8 h-8 text-mat-500" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${analytics?.discogsStatus.connected ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                           {analytics?.discogsStatus.connected ? 'SYNC ACTIVE' : 'NO BRIDGE'}
                        </div>
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Discogs Bridge</h3>
                     <p className="text-gray-500 text-xs mb-8 flex-1">Sync your record store inventory with your local shop database.</p>
                     <form onSubmit={(e) => handleUpdateConfig(e, 'Discogs')} className="space-y-4">
                        <input name="discogsUsername" defaultValue={config?.discogsUsername} placeholder="Discogs Username" className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-[10px] font-black uppercase outline-none focus:border-mat-500 rounded-xl" />
                        <input name="discogsToken" type="password" defaultValue={config?.discogsToken} placeholder="API Personal Token" className="w-full bg-mat-800 border border-mat-700 p-3 text-white text-[10px] font-black uppercase outline-none focus:border-mat-500 rounded-xl" />
                        <button type="submit" className="w-full py-4 bg-mat-800 border border-mat-700 text-mat-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-mat-500 hover:text-white transition-all flex items-center justify-center gap-2">
                           <Database className="w-4 h-4" /> Marketplace Sync
                        </button>
                     </form>
                  </div>
               </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: ADD RECORD */}
      {showAddRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-800 rounded-[3rem] p-10 relative animate-fade-in">
              <button onClick={() => setShowAddRecord(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
              <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-4">
                 <Disc className="text-mat-500" /> New Record
              </h2>
              <form onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const newRecord: any = {
                    artist: formData.get('artist'),
                    title: formData.get('title'),
                    price: Number(formData.get('price')),
                    genre: formData.get('genre'),
                    format: formData.get('format'),
                    condition: 'NM',
                    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
                    year: '2025',
                    label: 'MAT32',
                    discogsLink: '#',
                    description: 'Direct Import.'
                 };
                 await dataService.createRecord(newRecord);
                 setShowAddRecord(false);
                 loadData();
              }} className="space-y-6">
                 <input name="artist" required placeholder="ARTIST" className="w-full bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl" />
                 <input name="title" required placeholder="TITLE" className="w-full bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl" />
                 <div className="grid grid-cols-2 gap-4">
                    <input name="price" required type="number" placeholder="PRICE" className="bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl" />
                    <select name="format" className="bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl appearance-none">
                       <option>LP</option><option>12"</option><option>7"</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase rounded-xl">Add to Crate</button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL: ADD EVENT */}
      {showAddEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-800 rounded-[3rem] p-10 relative animate-fade-in">
              <button onClick={() => setShowAddEvent(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
              <h2 className="text-3xl font-black text-white uppercase mb-8 flex items-center gap-4">
                 <CalendarIcon className="text-mat-500" /> New Session
              </h2>
              <form onSubmit={async (e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const newEvent: any = {
                    title: formData.get('title'),
                    date: formData.get('date'),
                    time: formData.get('time'),
                    category: 'Disco',
                    price: Number(formData.get('price')),
                    location: 'Main Room',
                    description: 'Live Session.',
                    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=600'
                 };
                 await dataService.createEvent(newEvent);
                 setShowAddEvent(false);
                 loadData();
              }} className="space-y-6">
                 <input name="title" required placeholder="SESSION TITLE" className="w-full bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl" />
                 <div className="grid grid-cols-2 gap-4">
                    <input name="date" required type="date" className="bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl" />
                    <input name="time" required type="time" className="bg-mat-800 border border-mat-700 p-4 text-white uppercase text-xs font-black rounded-xl" />
                 </div>
                 <button type="submit" className="w-full py-5 bg-mat-500 text-white font-black uppercase rounded-xl">Publish Session</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
