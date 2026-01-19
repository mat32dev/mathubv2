
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Heart, X, Loader2, Camera, Send, 
  AtSign, Share2, Disc, Handshake,
  AlertCircle, Activity
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { Post, TradeMetadata } from '../types';
import { CachedImage } from '../components/CachedImage';
import { TagLink } from '../components/TagLink';

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<{alias: string, color: string} | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Create Post States
  const [isTradeMode, setIsTradeMode] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tradeDetails, setTradeDetails] = useState<TradeMetadata>({ artist: '', title: '', genre: 'House', condition: 'VG+' });
  
  // Trade Modal States
  const [showTradeModal, setShowTradeModal] = useState<Post | null>(null);
  const [tradeOffer, setTradeOffer] = useState('');
  const [tradeStatus, setTradeStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const allPosts = await dataService.getCommunityPosts();
      setPosts(allPosts);
      setUser(dataService.getUserProfile());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('mat32_data_changed', loadData);
    return () => window.removeEventListener('mat32_data_changed', loadData);
  }, []);

  const handleInteraction = (action: () => void) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      action();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (aliasInput.trim().length < 3) return;
    dataService.setUserProfile(aliasInput);
    setAliasInput('');
    setShowLoginModal(false);
    loadData();
  };

  const handlePostSubmit = async () => {
    if (!content.trim() && !previewImage && !isTradeMode) return;
    setLoading(true);
    await dataService.createPost({
      author: user!.alias,
      avatar: user!.color,
      content: content,
      imageUrl: previewImage || undefined,
      isTrade: isTradeMode,
      tradeMetadata: isTradeMode ? tradeDetails : undefined
    });
    setContent('');
    setPreviewImage(null);
    setIsTradeMode(false);
    setTradeDetails({ artist: '', title: '', genre: 'House', condition: 'VG+' });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(false);
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim()) return;
    await dataService.addComment(postId, {
      author: user!.alias,
      content: commentText
    });
    setCommentText('');
    setActiveCommentBox(null);
    loadData();
  };

  const handleSendTradeProposal = async () => {
    if (!tradeOffer.trim() || !showTradeModal) return;
    setTradeStatus('sending');
    await dataService.createInboxMessage({
      type: 'trade_proposal',
      sender: user!.alias,
      email: `${user!.alias}@community.mat32.com`,
      content: `Propuesta de intercambio para ${showTradeModal.tradeMetadata?.artist} - ${showTradeModal.tradeMetadata?.title}. Oferta: ${tradeOffer}`,
      metadata: { postId: showTradeModal.id, offer: tradeOffer }
    });
    setTradeStatus('sent');
    setTimeout(() => {
      setShowTradeModal(null);
      setTradeOffer('');
      setTradeStatus('idle');
    }, 2000);
  };

  const isMarketLive = true; // Simulado para el Live Marketplace status

  return (
    <div className="min-h-screen bg-mat-900 pb-20">
      <SEO titleKey="nav.community" descriptionKey="seo.community.description" />

      {/* Hero Section Immersive */}
      <div className="relative bg-mat-800 py-24 md:py-48 border-b border-mat-700 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col items-center gap-4 mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl animate-fade-in">
                <Disc className="w-4 h-4" /> LOCAL MARKETPLACE
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-mat-800/80 border border-mat-700 rounded-full animate-fade-in">
                 <div className={`w-2 h-2 rounded-full ${isMarketLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {isMarketLive ? t('community.status.live') : t('community.status.offline')}
                 </span>
              </div>
           </div>
           <h1 className="text-5xl md:text-[10rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow animate-fade-in">
            COLLECTORS<br/><span className="text-mat-500">HUB.</span>
           </h1>
           <p className="text-gray-400 text-xl md:text-3xl mt-8 font-light italic max-w-4xl mx-auto animate-fade-in opacity-80 leading-relaxed">
             {t('community.header.subtitle')}
           </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        
        {/* Post Creation Box */}
        <div className="bg-mat-800 border-2 border-mat-700 p-6 md:p-12 rounded-[2.5rem] shadow-2xl mb-20 relative group transition-all hover:border-mat-500/30">
          <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
          
          {/* Trade Toggle */}
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-2 text-mat-500 font-black text-[10px] uppercase tracking-widest">
                <Activity size={16} /> WHAT'S ON YOUR PLATE?
             </div>
             <button 
                onClick={() => handleInteraction(() => setIsTradeMode(!isTradeMode))}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${isTradeMode ? 'bg-mat-500 text-white border-mat-500 shadow-lg' : 'bg-mat-900 border-mat-700 text-gray-500 hover:text-white'}`}
             >
                <Handshake size={14} /> {isTradeMode ? 'LISTING FOR TRADE' : 'POST FOR TRADE'}
             </button>
          </div>

          <div className="flex gap-4 md:gap-8 items-start">
             <div className="w-14 h-14 rounded-full bg-mat-900 border-2 border-mat-700 flex items-center justify-center text-mat-500 flex-shrink-0 shadow-xl">
                {user ? user.alias[0].toUpperCase() : <Disc className="w-8 h-8 animate-spin-slow opacity-30" />}
             </div>
             <div className="flex-1 space-y-6">
                {isTradeMode && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in bg-mat-900/60 p-8 rounded-3xl border-2 border-mat-700/50 mb-6">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest">ARTIST</label>
                         <input value={tradeDetails.artist} onChange={e => setTradeDetails({...tradeDetails, artist: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black uppercase rounded-2xl focus:border-mat-500 outline-none" placeholder="ARTIST NAME" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest">TITLE</label>
                         <input value={tradeDetails.title} onChange={e => setTradeDetails({...tradeDetails, title: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black uppercase rounded-2xl focus:border-mat-500 outline-none" placeholder="ALBUM TITLE" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest">GENRE</label>
                         <input value={tradeDetails.genre} onChange={e => setTradeDetails({...tradeDetails, genre: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black uppercase rounded-2xl focus:border-mat-500 outline-none" placeholder="HOUSE, DISCO, JAZZ..." />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black text-mat-500 uppercase tracking-widest">CONDITION</label>
                         <select value={tradeDetails.condition} onChange={e => setTradeDetails({...tradeDetails, condition: e.target.value})} className="w-full bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black uppercase rounded-2xl focus:border-mat-500 outline-none appearance-none cursor-pointer">
                            <option>Mint</option><option>NM</option><option>VG+</option><option>VG</option>
                         </select>
                      </div>
                   </div>
                )}

                <textarea 
                  value={content}
                  onClick={() => !user && setShowLoginModal(true)}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isTradeMode ? "Describe your trade or what you're looking for..." : "Share your latest digging find, setup or session vibe..."}
                  className="w-full bg-transparent text-white text-xl md:text-2xl font-light italic outline-none resize-none min-h-[120px] placeholder:text-gray-700 leading-relaxed"
                />
                
                {previewImage && (
                  <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-mat-500 group animate-in zoom-in duration-300 shadow-2xl">
                    <img src={previewImage} className="w-full max-h-96 object-cover" />
                    <button onClick={() => setPreviewImage(null)} className="absolute top-6 right-6 p-4 bg-red-600 text-white rounded-full shadow-2xl hover:bg-red-500 transition-all z-10">
                      <X size={20} />
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-mat-700/50">
                   <button onClick={() => handleInteraction(() => fileInputRef.current?.click())} className="text-gray-500 hover:text-mat-500 transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                      <Camera size={20} /> {isTradeMode ? 'UPLOAD PHOTO' : 'ADD MEDIA'}
                   </button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const r = new FileReader();
                        r.onload = () => setPreviewImage(r.result as string);
                        r.readAsDataURL(file);
                      }
                   }} />
                   <button 
                    onClick={() => handleInteraction(handlePostSubmit)}
                    className="px-12 py-5 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-mat-400 shadow-[0_10px_40px_rgba(234,88,12,0.3)] transition-all disabled:opacity-20 flex items-center gap-4 group"
                    disabled={(!content.trim() && !previewImage && !isTradeMode) || (isTradeMode && (!tradeDetails.artist || !tradeDetails.title))}
                   >
                     {isTradeMode && <Handshake size={18} />} {isTradeMode ? 'LIST FOR TRADE' : 'PUBLISH TO HUB'}
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-16">
          {loading ? (
            <div className="flex flex-col items-center py-24">
               <Loader2 className="animate-spin text-mat-500 w-16 h-16 mb-6" />
               <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-700">SYNCHRONIZING HUB...</p>
            </div>
          ) : posts.map(post => (
            <article key={post.id} className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden shadow-2xl hover:border-mat-500/30 transition-all group animate-fade-in">
               <div className="p-10 md:p-16">
                  <div className="flex justify-between items-center mb-10">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg shadow-2xl border border-white/10" style={{backgroundColor: post.avatar || '#ea580c'}}>{post.author[0].toUpperCase()}</div>
                        <div>
                           <h4 className="text-white font-black uppercase text-base md:text-lg tracking-tighter leading-none mb-1">@{post.author}</h4>
                           <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{post.timestamp}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        {post.isTrade && (
                           <span className="px-5 py-2 bg-mat-500 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-xl border border-white/20 flex items-center gap-2">
                              <Handshake size={14} /> TRADING
                           </span>
                        )}
                        <button className="p-3 bg-mat-900 rounded-2xl text-gray-700 hover:text-mat-500 transition-colors shadow-lg"><Share2 size={18} /></button>
                     </div>
                  </div>

                  {/* Trade Details Display Enhanced */}
                  {post.isTrade && post.tradeMetadata && (
                     <div className="mb-10 p-10 bg-mat-900 border-2 border-mat-500/30 rounded-[2.5rem] relative overflow-hidden group/trade shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/trade:opacity-10 transition-opacity">
                           <Disc size={200} className="animate-spin-slow" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                           <div className="flex-1">
                              <p className="text-[10px] font-black text-mat-500 uppercase tracking-widest mb-2">HUB TRADE PROPOSAL</p>
                              <h3 className="text-4xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-3">{post.tradeMetadata.title}</h3>
                              <p className="text-2xl font-black text-gray-400 uppercase tracking-widest font-exo opacity-80">{post.tradeMetadata.artist}</p>
                           </div>
                           <div className="flex flex-wrap md:flex-col gap-4 items-end">
                              <div className="flex gap-2">
                                <span className="px-4 py-1.5 bg-mat-800 border border-mat-700 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-xl">{post.tradeMetadata.genre}</span>
                                <span className="px-4 py-1.5 bg-mat-800 border border-mat-700 text-mat-500 text-[9px] font-black uppercase tracking-widest rounded-xl">{post.tradeMetadata.condition}</span>
                              </div>
                              <button 
                                 onClick={() => handleInteraction(() => setShowTradeModal(post))}
                                 className="px-8 py-3 bg-mat-500 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl hover:bg-mat-400 transition-all"
                              >
                                 NEGOTIATE
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  <p className="text-gray-200 text-2xl md:text-3xl font-light italic leading-relaxed mb-10">
                    {post.content}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-12">
                     {post.tags?.map(tag => (
                        <TagLink key={tag} label={tag} type="tag" className="bg-mat-900/50" />
                     ))}
                  </div>

                  {post.imageUrl && (
                    <div className="rounded-[3rem] overflow-hidden border-2 border-mat-700 mb-12 bg-black shadow-2xl relative group">
                       <CachedImage src={post.imageUrl} alt="Hub Context" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                       <div className="absolute inset-0 bg-gradient-to-t from-mat-900/40 to-transparent pointer-events-none"></div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-mat-700/50">
                     <div className="flex items-center gap-10">
                        <button onClick={() => handleInteraction(() => {})} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-mat-500 hover:text-white transition-colors group">
                           <Heart className={`w-6 h-6 group-hover:fill-current transition-all`} /> {post.likes} <span className="hidden md:inline">LIKES</span>
                        </button>
                        <button 
                         onClick={() => setActiveCommentBox(activeCommentBox === post.id ? null : post.id)}
                         className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                        >
                           <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" /> {post.comments?.length || 0} <span className="hidden md:inline">COMMENTS</span>
                        </button>
                     </div>
                     {post.isTrade && (
                        <button 
                           onClick={() => handleInteraction(() => setShowTradeModal(post))}
                           className="w-full sm:w-auto px-10 py-5 bg-mat-800 hover:bg-mat-500 text-gray-400 hover:text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-4 group/btn border border-mat-700"
                        >
                           <Handshake className="group-hover/btn:rotate-12 transition-transform" /> {t('records.btn.trade')}
                        </button>
                     )}
                  </div>
               </div>

               {/* Comments Section */}
               <div className="bg-mat-900/50 p-10 md:p-16 border-t border-mat-700/50 space-y-10">
                  {post.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-6 animate-fade-in group/comm">
                       <div className="w-12 h-12 rounded-full bg-mat-800 border-2 border-mat-700 flex items-center justify-center text-xs text-gray-500 font-black flex-shrink-0 shadow-lg group-hover/comm:border-mat-500 transition-colors">{comment.author[0]}</div>
                       <div className="flex-1">
                          <span className="block text-[10px] font-black text-mat-500 uppercase tracking-[0.2em] mb-2">@{comment.author}</span>
                          <p className="text-gray-300 text-lg font-light italic leading-relaxed">"{comment.content}"</p>
                       </div>
                    </div>
                  ))}

                  {/* Input de Comentario */}
                  <div className="mt-10 flex gap-4">
                     <div className="flex-1 relative">
                        <input 
                          value={activeCommentBox === post.id ? commentText : ''}
                          onClick={() => !user && setShowLoginModal(true)}
                          onChange={(e) => {
                            setActiveCommentBox(post.id);
                            setCommentText(e.target.value);
                          }}
                          placeholder="Drop a line to this thread..."
                          className="w-full bg-mat-800 border-2 border-mat-700 p-5 px-8 rounded-3xl text-white text-base outline-none focus:border-mat-500 transition-all italic shadow-inner placeholder:text-gray-700"
                        />
                     </div>
                     <button 
                       onClick={() => handleInteraction(() => handleCommentSubmit(post.id))}
                       className="p-5 bg-mat-500 text-white rounded-[1.5rem] shadow-xl hover:bg-mat-400 transition-all flex items-center justify-center disabled:opacity-20"
                       disabled={!commentText.trim()}
                     >
                        <Send size={24} />
                     </button>
                  </div>
               </div>
            </article>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
           <div className="w-full max-w-md bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
              <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={32} /></button>
              <div className="w-24 h-24 bg-mat-900 border-2 border-mat-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(234,88,12,0.3)]"><AtSign className="w-12 h-12 text-mat-500" /></div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-exo mb-6 leading-none">JOIN THE HUB.</h2>
              <p className="text-gray-500 text-base italic mb-12 leading-relaxed px-4">Identify your signal. Enter your collector alias to interact with the local scene.</p>
              <form onSubmit={handleRegister} className="space-y-8">
                 <input 
                   required 
                   autoFocus 
                   value={aliasInput} 
                   onChange={(e) => setAliasInput(e.target.value)} 
                   className="w-full bg-mat-900 border-2 border-mat-700 p-6 text-white uppercase text-center text-lg font-black rounded-3xl outline-none focus:border-mat-500 shadow-inner" 
                   placeholder="YOUR ALIAS" 
                 />
                 <button type="submit" className="w-full py-6 bg-mat-500 text-white font-black uppercase text-xs tracking-[0.5em] rounded-[2rem] hover:bg-mat-400 transition-all shadow-2xl">ACTIVATE PROTOCOL</button>
              </form>
           </div>
        </div>
      )}

      {/* Trade Proposal Modal */}
      {showTradeModal && (
         <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
            <div className="w-full max-w-2xl bg-mat-900 border-2 border-mat-500 rounded-[3.5rem] p-12 md:p-16 relative shadow-2xl overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
               <button onClick={() => setShowTradeModal(null)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all"><X size={32} /></button>
               
               {tradeStatus === 'sent' ? (
                  <div className="py-24 text-center animate-zoom-in">
                     <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-10 shadow-2xl" />
                     <h2 className="text-5xl font-black text-white uppercase tracking-tighter font-exo mb-6">SIGNAL SENT.</h2>
                     <p className="text-gray-500 text-xl italic max-w-sm mx-auto leading-relaxed">Your proposal has been logged. The collector will review your offer shortly.</p>
                  </div>
               ) : (
                  <>
                     <div className="mb-14">
                        <div className="flex items-center gap-4 text-mat-500 font-black text-[11px] uppercase tracking-[0.5em] mb-6">
                           <Handshake size={24} /> NEGOTIATION PROTOCOL
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter font-exo leading-tight">
                           OFFER TO <span className="text-mat-500">@{showTradeModal.author}</span>
                        </h2>
                        <div className="mt-8 p-6 bg-mat-800 border border-mat-700 rounded-3xl flex items-center gap-6">
                           <div className="w-16 h-16 bg-black rounded-xl overflow-hidden flex-shrink-0">
                              <img src={showTradeModal.tradeMetadata?.condition === 'Mint' ? 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=200' : showTradeModal.imageUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200'} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-white font-black uppercase text-lg tracking-tight leading-none mb-1">{showTradeModal.tradeMetadata?.title}</p>
                              <p className="text-mat-500 font-black uppercase text-[10px] tracking-widest">{showTradeModal.tradeMetadata?.artist}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-10">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-mat-500 uppercase tracking-widest ml-1">YOUR TRADE PROPOSAL</label>
                           <textarea 
                              value={tradeOffer}
                              onChange={e => setTradeOffer(e.target.value)}
                              className="w-full bg-mat-800 border-2 border-mat-700 p-8 h-48 text-white text-lg font-bold rounded-[2.5rem] outline-none focus:border-mat-500 transition-all resize-none italic shadow-inner placeholder:text-gray-700"
                              placeholder="What are you offering? Cash, records or a mix..."
                           />
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-mat-800/50 rounded-3xl border border-mat-700">
                           <AlertCircle className="text-mat-500 flex-shrink-0" size={24} />
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">By sending this offer, your alias will be shared with the collector to initiate direct encrypted communication.</p>
                        </div>

                        <button 
                           onClick={handleSendTradeProposal}
                           disabled={!tradeOffer.trim() || tradeStatus === 'sending'}
                           className="w-full py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.5em] rounded-[2.5rem] shadow-[0_20px_60px_rgba(234,88,12,0.4)] flex items-center justify-center gap-5 transition-all disabled:opacity-20 group text-sm"
                        >
                           {tradeStatus === 'sending' ? <Loader2 className="animate-spin" /> : <Send className="group-hover:translate-x-3 transition-transform" />} SUBMIT PROPOSAL
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
