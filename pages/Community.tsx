import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, Heart, X, Loader2, Users, 
  RefreshCw, Disc, Database, CheckCircle2, Mail, Zap, Trophy, TrendingUp, Star
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { curateCommunityListings } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { Post, VinylRecord } from '../types';

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'feed' | 'trade'>('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [communityRecords, setCommunityRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'parsing' | 'success'>('idle');
  const [csvInput, setCsvInput] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const loadCommunityData = useCallback(async () => {
    setLoading(true);
    try {
      const [postData, recordData] = await Promise.all([
        dataService.getCommunityPosts(),
        dataService.getCommunityRecords()
      ]);
      setPosts(postData);
      setCommunityRecords(recordData);
    } catch (e) {
      console.error("Community Hub Error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommunityData();
  }, [loadCommunityData]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    const success = await dataService.createPost({ content: newPostContent, author: 'Selector' });
    if (success) {
      setNewPostContent('');
      loadCommunityData();
    }
  };

  const handleSyncProtocol = async () => {
    if (!csvInput.trim() || !ownerName.trim()) return;
    setSyncStatus('parsing');
    try {
      const curatedList = await curateCommunityListings(csvInput);
      if (curatedList && curatedList.length > 0) {
        const markedList = curatedList.map((r: any) => ({ ...r, isTradeable: true }));
        await dataService.addCommunityRecords(markedList, ownerName);
        setSyncStatus('success');
        setTimeout(() => {
          setShowSyncModal(false);
          setSyncStatus('idle');
          setCsvInput('');
          setOwnerName('');
          loadCommunityData();
        }, 2000);
      }
    } catch (e) {
      setSyncStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-mat-900">
      <SEO titleKey="nav.community" descriptionKey="seo.community.description" schemaType="CollectionPage" />

      {/* Hero Hub */}
      <div className="bg-mat-800 py-16 md:py-24 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-mat-500/10 text-mat-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-mat-500/20">
               <TrendingUp className="w-3 h-3" /> HUB SIGNAL
            </div>
            <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none font-exo text-glow">
              THE<br/><span className="text-mat-500">HUB.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mt-4 font-light italic leading-relaxed max-w-md">Conectando a los coleccionistas de vinilo de Valencia.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:w-auto">
             {/* Mini Leaderboard */}
             <div className="bg-mat-900/60 border border-mat-700 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                   <Trophy className="text-mat-500 w-6 h-6" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Top Diggers</h3>
                </div>
                <div className="space-y-4">
                   {[
                     { name: 'CrateHunter', points: 1420 },
                     { name: 'Ruzafa_Wax', points: 980 }
                   ].map((d, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-mat-800 pb-2">
                        <span className="text-[10px] font-bold text-gray-400">#{i+1} {d.name}</span>
                        <span className="text-[10px] font-black text-mat-500">{d.points} XP</span>
                     </div>
                   ))}
                </div>
             </div>

             <button 
                onClick={() => setShowSyncModal(true)}
                className="bg-mat-500 hover:bg-mat-400 text-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center gap-5 transition-all shadow-xl group border-b-4 border-mat-700 active:translate-y-1 active:border-b-0"
             >
                <div className="text-center">
                   <p className="text-white font-black text-2xl md:text-3xl leading-none mb-1">Crate Sync</p>
                   <p className="text-[10px] text-mat-900 font-black uppercase tracking-widest">Protocolo de Intercambio</p>
                </div>
             </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center mb-16">
          <div className="bg-mat-800 p-2 rounded-[2.5rem] border-2 border-mat-700 flex shadow-2xl sticky top-28 z-40 backdrop-blur-xl">
             <button 
                onClick={() => setActiveTab('feed')}
                className={`px-8 md:px-12 py-3 md:py-4 rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'feed' ? 'bg-mat-500 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
             >
                MURO
             </button>
             <button 
                onClick={() => setActiveTab('trade')}
                className={`px-8 md:px-12 py-3 md:py-4 rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'trade' ? 'bg-mat-500 text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
             >
                TRADE HUB
             </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'feed' ? (
            <div className="animate-fade-in space-y-12">
              <div className="bg-mat-800 p-6 md:p-8 border-2 border-mat-700 shadow-2xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group">
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Comparte un hallazgo, una sesión o el vibe del día..."
                  className="w-full bg-mat-900 text-white placeholder-gray-600 focus:outline-none p-4 md:p-6 border-2 border-mat-700 min-h-[140px] resize-none mb-6 rounded-2xl text-lg font-light italic transition-all focus:border-mat-500"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 px-4 py-2 bg-mat-900 border border-mat-700 rounded-xl">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Selector Activo</span>
                  </div>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="px-8 md:px-12 py-3 md:py-4 bg-mat-500 hover:bg-mat-400 disabled:opacity-30 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl clip-path-slant"
                  >
                    Transmitir Post
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center py-20"><Loader2 className="w-16 h-16 text-mat-500 animate-spin" /></div>
              ) : (
                <div className="space-y-10">
                  {posts.map(post => (
                    <article key={post.id} className="bg-mat-800 p-8 md:p-10 border-2 border-mat-700 hover:border-mat-500 transition-all group rounded-[2rem] md:rounded-[2.5rem] shadow-xl relative overflow-hidden">
                      <div className="flex items-center gap-6 mb-8">
                        <img src={post.avatar} alt={post.author} className="w-12 h-12 md:w-14 md:h-14 grayscale object-cover border-2 border-mat-700 rounded-full group-hover:grayscale-0 transition-all duration-500" loading="lazy" />
                        <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-black text-white uppercase text-base tracking-tighter font-exo">{post.author}</h3>
                             <span className="text-[8px] bg-mat-500/10 text-mat-500 px-2 py-0.5 rounded uppercase font-black border border-mat-500/20">Digger</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{post.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-8 font-light text-lg md:text-xl leading-relaxed italic">"{post.content}"</p>
                      <div className="flex justify-between items-center pt-8 border-t border-mat-700">
                        <div className="flex gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="text-[8px] font-black uppercase px-2 py-1 bg-mat-900 border border-mat-700 text-gray-500 rounded-md">{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-6">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-mat-500 transition-colors font-black text-[10px]">
                            <Heart className="w-5 h-5" /> {post.likes}
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-black text-[10px]">
                            <MessageCircle className="w-5 h-5" /> {post.comments}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-in space-y-12">
               <div className="bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter font-exo mb-4">Muro de Intercambio</h2>
                  <p className="text-gray-400 text-base md:text-lg font-light italic">Explora las colecciones del barrio y propone cambios directos.</p>
               </div>

               {communityRecords.length === 0 ? (
                 <div className="text-center py-20 md:py-32 bg-mat-800/10 border-4 border-dashed border-mat-800 rounded-[2.5rem] md:rounded-[3rem] group">
                    <Disc className="w-16 h-16 md:w-20 md:h-20 text-mat-800 mx-auto mb-6 opacity-30 group-hover:rotate-180 transition-transform duration-1000" />
                    <p className="text-gray-600 font-black uppercase text-[10px] md:text-sm tracking-widest">Sin intercambios activos</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {communityRecords.map(record => (
                      <div key={record.id} className="bg-mat-800 border-2 border-mat-700 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:border-green-500/50 transition-all group shadow-xl">
                        <div className="flex gap-6">
                           <div className="w-20 h-20 md:w-24 md:h-24 bg-mat-900 rounded-2xl overflow-hidden border-2 border-mat-700 flex-shrink-0">
                              <img src={record.coverUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Cover vinilo Mat32" loading="lazy" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h3 className="text-white font-black uppercase text-lg md:text-xl truncate font-exo leading-tight mb-1">{record.title}</h3>
                              <p className="text-mat-500 font-bold uppercase text-[9px] md:text-[10px] tracking-widest mb-4 truncate">{record.artist}</p>
                              <div className="flex items-center gap-2">
                                 <Star className="w-3 h-3 text-mat-500 fill-current" />
                                 <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">DUEÑO: {record.ownerName}</span>
                              </div>
                           </div>
                        </div>
                        <button className="w-full mt-6 py-3 md:py-4 bg-mat-900 hover:bg-green-600 text-green-500 hover:text-white border border-green-500/20 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                           <RefreshCw className="w-4 h-4" /> Proponer Cambio
                        </button>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* SYNC MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-700 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 relative shadow-2xl overflow-hidden">
              <button onClick={() => setShowSyncModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X className="w-8 h-8" /></button>
              <div className="mb-8 md:mb-10 text-center">
                 <div className="inline-flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4"><Database className="w-4 h-4" /> CRATE SYNC</div>
                 <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2 font-exo">Crate-to-Crate</h2>
                 <p className="text-gray-400 text-sm font-light italic leading-relaxed">Pega tu lista de vinilos para que otros coleccionistas puedan verla.</p>
              </div>

              {syncStatus === 'parsing' ? (
                <div className="py-16 md:py-20 flex flex-col items-center">
                   <Loader2 className="w-16 h-16 text-mat-500 animate-spin mb-6" />
                   <p className="text-white font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Sincronizando caja...</p>
                </div>
              ) : syncStatus === 'success' ? (
                <div className="py-16 md:py-20 text-center animate-fade-in">
                   <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                   <h4 className="text-xl md:text-2xl font-black text-white uppercase mb-2">Caja Sincronizada</h4>
                   <p className="text-gray-500 text-[10px] font-black uppercase">Tus discos ya son visibles en el Hub.</p>
                </div>
              ) : (
                <div className="space-y-6">
                   <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Alias del Coleccionista" className="w-full bg-mat-800 border-2 border-mat-700 p-4 md:p-5 text-white outline-none uppercase text-xs font-black rounded-xl shadow-inner focus:border-mat-500 transition-all" />
                   <textarea value={csvInput} onChange={(e) => setCsvInput(e.target.value)} placeholder="Donna Summer, I Feel Love, VG+, 25€..." className="w-full bg-mat-800 border-2 border-mat-700 p-4 md:p-6 h-32 md:h-40 text-white outline-none uppercase text-xs font-black rounded-2xl resize-none leading-relaxed shadow-inner focus:border-mat-500 transition-all" />
                   <button onClick={handleSyncProtocol} disabled={!csvInput.trim() || !ownerName.trim()} className="w-full py-5 md:py-6 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.4em] text-xs shadow-xl clip-path-slant flex items-center justify-center gap-4 group">
                      <Zap className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> Iniciar Protocolo
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
