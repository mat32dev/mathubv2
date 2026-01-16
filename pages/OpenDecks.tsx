
import React, { useState } from 'react';
import { Disc, Music, CheckCircle, ChevronDown, ChevronUp, ExternalLink, Headphones, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_SELECTORS } from '../constants';
import { SelectorSubmission } from '../types';

const SelectorCard: React.FC<{ selector: SelectorSubmission }> = ({ selector }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-mat-800 border-2 transition-all duration-500 overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] mb-4 md:mb-6 ${isExpanded ? 'border-mat-500 shadow-2xl shadow-mat-500/10' : 'border-mat-700'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 md:p-10 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4 md:gap-8">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-mat-900 border-2 border-mat-700 overflow-hidden grayscale group-hover:grayscale-0 transition-all rounded-xl md:rounded-2xl shadow-inner">
            <img src={selector.avatarUrl} alt={selector.artistName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter mb-1 md:mb-2 font-exo leading-none">{selector.artistName}</h3>
            <div className="flex flex-wrap gap-2">
              {selector.genres.slice(0, 2).map(genre => (
                <span key={genre} className="text-[8px] md:text-[10px] font-black text-mat-500 uppercase tracking-widest bg-mat-900 px-2 md:px-3 py-1 rounded-lg border border-mat-700">{genre}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-mat-500 text-white shadow-xl' : 'bg-mat-900 text-gray-500 border border-mat-700'}`}>
            {isExpanded ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />}
          </div>
        </div>
      </button>

      <div className={`transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-6 md:px-10 pb-8 md:pb-12 pt-4 border-t border-mat-700/50 bg-mat-900/30">
           <div className="space-y-8">
              <p className="text-[9px] md:text-[11px] font-black text-mat-500 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Zap className="w-4 h-4 md:w-5 md:h-5 animate-pulse" /> DETALLES DEL ARTISTA
              </p>
              <p className="text-gray-300 text-base md:text-xl font-light leading-relaxed italic border-l-4 border-mat-500 pl-4 md:pl-8">
                "{selector.bio}"
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                 <a 
                   href={selector.mixUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-8 md:px-10 py-4 md:py-5 bg-mat-500 text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-mat-400 transition-all shadow-xl rounded-xl md:rounded-2xl"
                 >
                   <ExternalLink className="w-4 h-4 md:w-5 md:h-5" /> ESCUCHAR SELECCIÓN
                 </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export const OpenDecks: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col">
      <SEO titleKey="nav.open_decks" descriptionKey="seo.opendecks.description" />
      
      {/* Hero Section */}
      <div className="bg-mat-800 py-12 md:py-28 border-b border-mat-700 relative overflow-hidden text-center">
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center gap-6 md:gap-10">
          <div className="relative group">
            <Disc className="w-16 h-16 md:w-24 md:h-24 text-mat-500 animate-spin-slow group-hover:text-white transition-colors shadow-2xl rounded-full" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-4 md:mb-6 leading-none font-exo text-glow animate-fade-in">
              {t('opendecks.title')}
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg md:text-2xl font-light italic leading-relaxed animate-fade-in">
              {t('opendecks.desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-start">
           
           {/* Application Form */}
           <div className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-32">
              {isSubmitted ? (
                <div className="bg-mat-800 p-8 md:p-16 border-4 border-mat-500 text-center shadow-2xl animate-fade-in rounded-[2rem] md:rounded-[3.5rem]">
                  <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-mat-500 mx-auto mb-6 md:mb-10" />
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-4 md:mb-6 tracking-tighter font-exo">{t('opendecks.success')}</h2>
                  <p className="text-gray-400 text-base md:text-xl mb-8 md:mb-12 leading-relaxed italic">
                    {t('opendecks.success.msg')}
                  </p>
                  <Link 
                    to="/community"
                    className="block w-full px-10 md:px-12 py-5 md:py-6 bg-mat-500 text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-mat-400 transition-all clip-path-slant shadow-2xl"
                  >
                    {t('opendecks.btn.back')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-8 md:space-y-12 animate-fade-in">
                   <div className="flex items-center gap-4 border-b border-mat-800 pb-4 md:pb-6">
                      <Zap className="text-mat-500 w-6 h-6 md:w-8 md:h-8" />
                      <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter font-exo">Detalles de Solicitud</h2>
                   </div>
                   <form onSubmit={handleSubmit} className="bg-mat-800 p-8 md:p-12 border-2 border-mat-700 shadow-2xl space-y-6 md:space-y-8 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-mat-500"></div>
                      
                      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-2">
                          <label className="block text-[9px] md:text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('opendecks.label.artist')}</label>
                          <input required type="text" className="w-full bg-mat-900 border-2 border-mat-700 text-white p-4 md:p-5 focus:border-mat-500 outline-none uppercase text-[10px] md:text-xs font-black rounded-xl shadow-inner transition-all" placeholder="ALIAS" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[9px] md:text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('opendecks.label.realname')}</label>
                          <input required type="text" className="w-full bg-mat-900 border-2 border-mat-700 text-white p-4 md:p-5 focus:border-mat-500 outline-none uppercase text-[10px] md:text-xs font-black rounded-xl shadow-inner transition-all" placeholder="NOMBRE REAL" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[9px] md:text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('opendecks.label.email')}</label>
                        <input required type="email" className="w-full bg-mat-900 border-2 border-mat-700 text-white p-4 md:p-5 focus:border-mat-500 outline-none uppercase text-[10px] md:text-xs font-black rounded-xl shadow-inner transition-all" placeholder="EMAIL" />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[9px] md:text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('opendecks.label.bio')}</label>
                        <textarea required className="w-full bg-mat-900 border-2 border-mat-700 text-white p-4 md:p-6 h-32 md:h-40 focus:border-mat-500 outline-none resize-none uppercase text-[10px] md:text-xs font-black leading-relaxed rounded-xl md:rounded-2xl shadow-inner transition-all" placeholder="BIO Y ESTILO..."></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-full bg-mat-500 hover:bg-mat-400 text-white font-black py-5 md:py-8 uppercase tracking-[0.3em] text-[11px] md:text-sm transition-all shadow-xl hover:shadow-mat-500/40 clip-path-slant flex items-center justify-center gap-4 group"
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                        {isProcessing ? 'Sincronizando...' : t('opendecks.btn.submit')}
                      </button>
                   </form>
                </div>
              )}
           </div>

           {/* Selectors List */}
           <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="space-y-8 md:space-y-12 animate-fade-in">
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-mat-800 pb-8 md:pb-10">
                    <div>
                       <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] mb-2 md:mb-4">
                          <Headphones className="w-5 h-5 md:w-6 md:h-6" /> Hub Selector Lineup
                       </div>
                       <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none font-exo">Próximos<br/>Selectores.</h2>
                    </div>
                 </div>

                 <div className="space-y-4 md:space-y-8">
                    {MOCK_SELECTORS.map(selector => (
                       <SelectorCard key={selector.id} selector={selector} />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
