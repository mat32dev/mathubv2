
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Heart, X, Loader2, Camera, Send, 
  AtSign, Share2, Disc, Handshake,
  AlertCircle, Activity, TrendingUp, ShoppingBag, ArrowRight
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { Post, TradeMetadata } from '../types';
import { TagLink } from '../components/TagLink';
import { Link } from 'react-router-dom';

  const { t } = useLanguage();
  const [user, setUser] = useState<{alias: string, color: string} | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [isTradeMode, setIsTradeMode] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [content, setContent] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tradeDetails, setTradeDetails] = useState<TradeMetadata>({ artist: '', title: '', genre: 'House', condition: 'VG+' });
  
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

  return (
    <div className="min-h-screen bg-mat-900 pb-20">
      <SEO titleKey="nav.community" descriptionKey="seo.community.description" />

      <div className="relative bg-mat-800 py-24 md:py-48 border-b border-mat-700 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col items-center gap-4 mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-2xl">
                <Disc className="w-4 h-4" /> LOCAL MARKETPLACE
              </div>
           </div>
           <h1 className="text-5xl md:text-[10rem] font-black uppercase tracking-tighter text-white leading-none font-exo text-glow">
            COLLECTORS<br/><span className="text-mat-500">HUB.</span>
           </h1>
           <p className="text-gray-400 text-xl md:text-3xl mt-8 font-light italic max-w-4xl mx-auto opacity-80 leading-relaxed">
             {t('community.header.subtitle')}
           </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="bg-mat-800 border-2 border-mat-700 p-6 md:p-12 rounded-[2.5rem] shadow-2xl mb-20 relative group transition-all hover:border-mat-500/30">
              <div className="absolute top-0 left-0 w-full h-2 bg-mat-500"></div>
              
              <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-2 text-mat-500 font-black text-[10px] uppercase tracking-widest">
                    <Activity size={16} /> COMMUNITY FEED
                 </div>
                 <button 
                    onClick={() => handleInteraction(() => setIsTradeMode(!isTradeMode))}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${isTradeMode ? 'bg-mat-500 text-white border-mat-500 shadow-lg' : 'bg-mat-900 border-mat-700 text-gray-500 hover:text-white'}`}
                 >
                    <Handshake size={14} /> {isTradeMode ? 'CANCEL LISTING' : 'POST FOR TRADE'}
                 </button>
              </div>

              <div className="flex gap-4 md:gap-8 items-start">
                 <div className="w-14 h-14 rounded-full bg-mat-900 border-2 border-mat-700 flex items-center justify-center text-mat-500 flex-shrink-0 shadow-xl">
                    {user ? user.alias[0].toUpperCase() : <Disc className="w-8 h-8 opacity-30" />}
                 </div>
                 <div className="flex-1 space-y-6">
                    {isTradeMode && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in bg-mat-900/60 p-8 rounded-3xl border-2 border-mat-700/50 mb-6">
                          <input value={tradeDetails.artist} onChange={e => setTradeDetails({...tradeDetails, artist: e.target.value})} className="bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black uppercase rounded-2xl outline-none" placeholder="ARTIST" />
                          <input value={tradeDetails.title} onChange={e => setTradeDetails({...tradeDetails, title: e.target.value})} className="bg-mat-800 border border-mat-700 p-4 text-white text-xs font-black uppercase rounded-2xl outline-none" placeholder="TITLE" />
                       </div>
                    )}
                    <textarea 
                      value={content}
                      onClick={() => !user && setShowLoginModal(true)}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="What's spinning today?"
                      className="w-full bg-transparent text-white text-xl md:text-2xl font-light italic outline-none resize-none min-h-[120px] placeholder:text-gray-700"
                    />
                    <div className="flex justify-between items-center pt-8 border-t border-mat-700/50">
                       <button onClick={() => handleInteraction(() => fileInputRef.current?.click())} className="text-gray-500 hover:text-mat-500 transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                          <Camera size={20} /> MEDIA
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
                        className="px-12 py-5 bg-mat-500 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl hover:bg-mat-400 shadow-xl transition-all disabled:opacity-20"
                        disabled={!content.trim() && !previewImage && !isTradeMode}
                       >
                         {isTradeMode ? 'LIST FOR TRADE' : 'PUBLISH'}
                       </button>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-16">
              {loading ? (
                <div className="flex flex-col items-center py-24"><Loader2 className="animate-spin text-mat-500 w-16 h-16" /></div>
              ) : posts.map(post => (
                <article key={post.id} className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden shadow-2xl hover:border-mat-500/30 transition-all">
                   <div className="p-10 md:p-16">
                      <div className="flex justify-between items-center mb-10">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg bg-mat-500">{post.author[0].toUpperCase()}</div>
                            <div>
                               <h4 className="text-white font-black uppercase text-base md:text-lg tracking-tighter">@{post.author}</h4>
                               <span className="text-[10px] text-gray-600 font-bold uppercase">{post.timestamp}</spanimg
                            </div>
                         </div>
                      </div>
                      <p className="text-gray-200 text-2xl md:text-3xl font-light italic leading-relaxed mb-10">{post.content}</p>
                      {post.imageUrl && <div className="rounded-[3rem] overflow-hidden border-2 border-mat-700 mb-12"><img src={post.imageUrl} alt="Post image" className="w-full h-full object-cover" /></div>}
                      <div className="flex items-center gap-10 pt-10 border-t border-mat-700/50">
                         <button className="flex items-center gap-3 text-[11px] font-black uppercase text-mat-500"><Heart className="w-6 h-6" /> {post.likes}</button>
                         <button className="flex items-center gap-3 text-[11px] font-black uppercase text-gray-500"><MessageCircle className="w-6 h-6" /> {post.comments?.length || 0}</button>
                      </divimg
                   </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-mat-800 border-2 border-mat-700 p-10 rounded-[3rem] shadow-2xl">
               <div className="flex items-center gap-3 text-mat-500 font-black text-[10px] uppercase tracking-widest mb-10">
                  <TrendingUp size={18} /> TRENDING HUB
               </div>
               <div className="space-y-6">
                  {['#italodisco', '#rarevinyls', '#ruzafasessions', '#hifiaddicts'].map((tag, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer text-white font-black uppercase text-sm">
                       <span>{tag}</span>
                       <span className="text-gray-600 text-[10px]">+{12 + i*5}</span>
                    </div>
                  ))}
               </div>
            </div>
          </aside>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
           <div className="w-full max-w-md bg-mat-800 border-2 border-mat-700 p-12 rounded-[3.5rem] text-center relative">
              <button onClick={() => setShowLoginModal(false)} className="absolute top-8 right-8 text-gray-500"><X size={32} /></button>
              <AtSign className="w-12 h-12 text-mat-500 mx-auto mb-10" />
              <h2 className="text-4xl font-black text-white uppercase font-exo mb-6">JOIN THE HUB.</h2>
              <form onSubmit={handleRegister} className="space-y-8">
                 <input required value={aliasInput} onChange={(e) => setAliasInput(e.target.value)} className="w-full bg-mat-900 border-2 border-mat-700 p-6 text-white uppercase text-center font-black rounded-3xl outline-none" placeholder="YOUR ALIAS" />
                 <button type="submit" className="w-full py-6 bg-mat-500 text-white font-black uppercase rounded-[2rem] hover:bg-mat-400">ACTIVATE</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
