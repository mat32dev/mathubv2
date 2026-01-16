
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Disc, ShoppingBag, Plus, Star, X, ExternalLink, Loader2, Heart, RefreshCw, Handshake, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { dataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { VinylRecord } from '../types';

export const Records: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [records, setRecords] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Trade Modal State
  const [tradeRecord, setTradeRecord] = useState<VinylRecord | null>(null);
  const [tradeMessage, setTradeMessage] = useState('');
  const [isSendingTrade, setIsSendingTrade] = useState(false);

  const { addToCart, cart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setIsFiltersVisible(false);
        } else {
          setIsFiltersVisible(true);
        }
      } else {
        setIsFiltersVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await dataService.getRecords();
        setRecords(data);
      } catch (error) {
        console.error("Error loading records", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleTrade = async (id: string) => {
    const success = await dataService.toggleRecordTradeable(id);
    if (success) {
      setRecords(prev => prev.map(r => 
        r.id === id ? { ...r, isTradeable: !r.isTradeable } : r
      ));
    }
  };

  const handleBuyNow = (record: VinylRecord) => {
    addToCart(record);
    navigate('/checkout');
  };

  const handleSendTradeRequest = async () => {
    if (!tradeRecord || !tradeMessage.trim()) return;
    setIsSendingTrade(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSendingTrade(false);
    setTradeRecord(null);
    setTradeMessage('');
    alert(t('opendecks.success.msg'));
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = r.artist.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGenre = selectedGenre === 'All' || r.genre === selectedGenre;
      const matchFavorites = !showOnlyFavorites || isFavorite(r.id);
      return matchSearch && matchGenre && matchFavorites;
    });
  }, [searchTerm, selectedGenre, showOnlyFavorites, records, isFavorite]);

  return (
    <div className="min-h-screen bg-mat-900">
      <SEO titleKey="nav.records" descriptionKey="seo.home.description" />
      
      <div className="bg-mat-800 py-12 md:py-20 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="relative group">
            <Disc className="w-16 h-16 md:w-24 md:h-24 text-mat-500 animate-spin-slow group-hover:text-white transition-colors" />
          </div>
          <div className="w-full">
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none font-exo text-glow">
              {t('records.title')}
            </h1>
            <p className="text-gray-400 max-w-xl text-base md:text-xl mt-2 md:mt-4 italic font-light">
              {t('records.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 md:py-12">
        {/* Filters Bar Responsivo con Ocultamiento Inteligente */}
        <div 
          className={`flex flex-col lg:flex-row gap-4 md:gap-5 mb-8 md:mb-16 sticky top-[88px] md:top-24 z-30 bg-mat-900/95 backdrop-blur-xl py-4 md:py-8 border-b border-mat-800 transition-all duration-300 ${isFiltersVisible ? 'translate-y-0 opacity-100' : 'md:translate-y-0 -translate-y-10 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 md:w-6 md:h-6" />
            <input 
              type="text" 
              placeholder={t('records.search_placeholder')} 
              value={searchTerm}
              className="w-full bg-mat-800 border-2 border-mat-700 p-3 md:p-5 pl-11 md:pl-14 text-white outline-none focus:border-mat-500 uppercase text-[10px] md:text-xs font-black transition-all rounded-xl md:rounded-2xl"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-8 py-3 md:py-5 border-2 transition-all text-[9px] md:text-[11px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl ${showOnlyFavorites ? 'bg-mat-500 border-mat-500 text-white shadow-xl' : 'bg-mat-800 border-mat-700 text-gray-500'}`}
            >
              <Heart className={`w-4 h-4 md:w-5 md:h-5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{showOnlyFavorites ? 'FAVORITES ACTIVE' : 'FILTER FAVORITES'}</span>
              <span className="sm:hidden">{t('records.filter.favorites')}</span>
            </button>
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="flex-1 sm:flex-none bg-mat-800 border-2 border-mat-700 px-4 md:px-8 py-3 md:py-5 text-white text-[9px] md:text-[11px] font-black uppercase outline-none focus:border-mat-500 cursor-pointer rounded-xl md:rounded-2xl appearance-none"
            >
              <option value="All">GENRE: ALL</option>
              <option value="Disco">Disco</option>
              <option value="House">House</option>
              <option value="Funk">Funk</option>
              <option value="Jazz">Jazz</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40">
            <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-mat-500 animate-spin mb-4 md:mb-6" />
            <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-500">Accediendo a la Caja...</span>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-fade-in">
            {filteredRecords.map(record => {
              const inCart = cart.find(item => item.id === record.id);
              const favorited = isFavorite(record.id);
              return (
                <div key={record.id} className="bg-mat-800 border-2 border-mat-700 group flex flex-col h-full overflow-hidden shadow-2xl relative rounded-[2rem] md:rounded-[3rem]">
                  {/* Action Icons Overlay Adaptable */}
                  <div className="absolute top-4 md:top-8 right-4 md:right-8 z-20 flex flex-col gap-2 md:gap-3">
                    <button 
                      onClick={() => toggleFavorite(record.id)}
                      className={`p-3 md:p-4 rounded-full backdrop-blur-md transition-all shadow-xl ${favorited ? 'bg-mat-500 text-white' : 'bg-mat-900/60 text-gray-400 hover:text-white'}`}
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 ${favorited ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleToggleTrade(record.id)}
                      className={`p-3 md:p-4 rounded-full backdrop-blur-md transition-all shadow-xl ${record.isTradeable ? 'bg-green-600 text-white' : 'bg-mat-900/60 text-gray-400'}`}
                    >
                      <Handshake className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>

                  <div className="relative aspect-square overflow-hidden bg-black">
                    <img src={record.coverUrl} alt={record.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                  </div>

                  <div className="p-6 md:p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-xl md:text-3xl font-black text-white uppercase leading-none mb-1 md:mb-2 truncate font-exo tracking-tighter">{record.title}</h3>
                        <p className="text-gray-500 text-[8px] md:text-[10px] uppercase font-black tracking-[0.2em] truncate">{record.artist}</p>
                      </div>
                      <div className="text-xl md:text-3xl font-black text-mat-cream leading-none font-exo">€{record.price.toFixed(0)}</div>
                    </div>

                    <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-10 line-clamp-2 italic font-light leading-relaxed">"{record.description}"</p>

                    <div className="mt-auto flex flex-col gap-3">
                      {record.isTradeable ? (
                        <div className="flex gap-2 w-full">
                           <button 
                            onClick={() => handleBuyNow(record)} 
                            className="flex-1 py-4 md:py-6 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-xl flex items-center justify-center gap-3 rounded-xl md:rounded-[1.5rem] clip-path-slant"
                          >
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                            {t('records.btn.buy')}
                          </button>
                          <button 
                            onClick={() => setTradeRecord(record)} 
                            className="flex-1 py-4 md:py-6 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-xl flex items-center justify-center gap-3 rounded-xl md:rounded-[1.5rem] clip-path-slant"
                          >
                            <Handshake className="w-4 h-4 md:w-5 md:h-5" />
                            {t('records.btn.trade')}
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(record)} 
                          className={`w-full py-4 md:py-6 font-black uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-xl flex items-center justify-center gap-3 md:gap-4 rounded-xl md:rounded-[1.5rem] clip-path-slant ${
                            inCart ? 'bg-white text-mat-900' : 'bg-mat-500 text-white hover:bg-mat-400'
                          }`}
                        >
                          {inCart ? <ShoppingBag className="w-4 h-4 md:w-6 md:h-6" /> : <Plus className="w-4 h-4 md:w-6 md:h-6" />}
                          {inCart ? `${t('records.btn.in_crate')} (${inCart.quantity})` : t('records.btn.add')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 md:py-40 border-2 md:border-4 border-dashed border-mat-800 rounded-[2rem] md:rounded-[4rem] bg-mat-800/10">
            <Disc className="w-20 h-20 md:w-32 md:h-32 text-mat-800 mx-auto mb-8 md:mb-10 animate-pulse" />
            <h3 className="text-3xl md:text-5xl font-black text-gray-700 uppercase tracking-tighter mb-4">{t('records.empty')}</h3>
            <button onClick={() => {setSearchTerm(''); setSelectedGenre('All'); setShowOnlyFavorites(false);}} className="px-10 md:px-16 py-4 md:py-5 bg-mat-900 border-2 border-mat-700 text-mat-500 font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl md:rounded-2xl hover:bg-mat-500 hover:text-white transition-all shadow-2xl">
              REINICIAR BÚSQUEDA
            </button>
          </div>
        )}
      </div>

      {/* Trade Modal */}
      {tradeRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="w-full max-w-xl bg-mat-900 border-2 border-mat-800 rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-green-600"></div>
              <button 
                onClick={() => setTradeRecord(null)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="mb-10 flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-mat-700 shadow-xl">
                   <img src={tradeRecord.coverUrl} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter font-exo leading-none mb-2">{t('records.trade_modal.title')}</h2>
                   <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">{tradeRecord.artist} - {tradeRecord.title}</p>
                </div>
              </div>

              <div className="space-y-6">
                 <p className="text-gray-400 text-sm md:text-base font-light italic leading-relaxed">
                   {t('records.trade_modal.desc')}
                 </p>
                 <textarea 
                    value={tradeMessage}
                    onChange={(e) => setTradeMessage(e.target.value)}
                    placeholder={t('records.trade_modal.placeholder')}
                    className="w-full bg-mat-800 border-2 border-mat-700 p-6 h-40 text-white focus:border-green-600 outline-none uppercase text-[10px] md:text-xs font-black rounded-[2rem] resize-none leading-relaxed shadow-inner transition-all"
                 />
                 <button 
                   onClick={handleSendTradeRequest}
                   disabled={isSendingTrade || !tradeMessage.trim()}
                   className="w-full py-6 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl flex items-center justify-center gap-4 clip-path-slant disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    {isSendingTrade ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSendingTrade ? 'Sending Protocol...' : t('records.trade_modal.send')}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
