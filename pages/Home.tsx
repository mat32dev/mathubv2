
import React, { useMemo } from 'react';
import { ArrowRight, Disc, Music2, Zap, Users, Star, Clock, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { SEO } from '../components/SEO';
import { MOCK_EVENTS, MOCK_RECORDS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  
  const todayStr = new Date().toISOString().split('T')[0];
  const featuredEvents = MOCK_EVENTS
    .filter(e => e.date >= todayStr)
    .slice(0, 3);

  const currentTrack = MOCK_RECORDS[0]; 

  const isVenueOpen = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    // Jueves a Domingo, 18:00 a 02:00
    if (hour >= 0 && hour < 2) return day === 5 || day === 6 || day === 0;
    if (hour >= 18) return day >= 4 && day <= 6;
    return false;
  }, []);

  return (
    <div className="bg-mat-900 overflow-x-hidden">
      <SEO titleKey="seo.home.title" descriptionKey="seo.home.description" />
      
      {/* Hero Section - Optimized with fetchpriority for SEO/Speed */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2000" 
            className="w-full h-full object-cover opacity-50 scale-105"
            alt="Interior del bar Mat32 Valencia"
            fetchpriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-mat-900/70 via-mat-900/40 to-mat-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-mat-500/30 bg-mat-900/60 backdrop-blur-md text-mat-500 px-6 py-2 uppercase tracking-[0.4em] text-[10px] font-black shadow-2xl rounded-full animate-fade-in">
            <TrendingUp className="w-3 h-3" /> {t('home.est')}
          </div>
          
          <div className="mb-8 flex items-start justify-center leading-none animate-fade-in">
            <h1 className="font-exo text-8xl md:text-[16rem] font-black text-mat-cream uppercase tracking-tighter text-glow transition-all hover:tracking-tight duration-700">
              MAT
            </h1>
            <span className="font-exo text-4xl md:text-8xl font-black text-mat-500 mt-4 md:mt-12 ml-2 md:ml-4 drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]">32</span>
          </div>

          <h2 className="text-xl md:text-3xl font-black text-white/90 mb-16 tracking-[0.3em] uppercase max-w-3xl mx-auto leading-relaxed">
            {t('home.hero.subtitle')}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link to="/events" className="w-full md:w-auto px-16 py-6 bg-mat-500 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-mat-400 transition-all clip-path-slant shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
              {t('home.cta.agenda')}
            </Link>
            <Link to="/community" className="w-full md:w-auto px-16 py-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-mat-900 transition-all clip-path-slant">
              {t('home.cta.grid')}
            </Link>
          </div>
        </div>
      </section>

      {/* Community Status Bar */}
      <section className="bg-mat-800/80 backdrop-blur-md border-y border-mat-700/50 sticky top-20 z-30 shadow-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0 group">
                <div className="w-14 h-14 md:w-20 md:h-20 relative z-10 shadow-2xl border border-mat-700 overflow-hidden rounded-lg bg-black">
                  <img 
                    src={currentTrack.coverUrl} 
                    alt={`Sonando ahora en Mat32: ${currentTrack.title}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
                <div className="absolute top-1 -right-4 w-12 h-12 md:w-18 md:h-18 rounded-full bg-black animate-spin-slow border-2 border-mat-700 -z-0"></div>
              </div>

              <div className="flex flex-col">
                <span className="text-[9px] text-mat-500 font-black uppercase tracking-[0.4em] mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-mat-500 rounded-full animate-pulse"></span> {t('home.now_spinning')}
                </span>
                <span className="text-white font-black uppercase text-sm md:text-xl tracking-wider font-exo">
                  {currentTrack.title}
                </span>
                <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest font-bold">
                  {currentTrack.artist}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-6 py-2 bg-mat-900/50 border border-mat-700 rounded-full">
                <div className={`w-2.5 h-2.5 rounded-full ${isVenueOpen ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {isVenueOpen ? t('home.status.open') : t('home.status.closed')}
                </span>
              </div>
              <Link to="/community" className="hidden lg:flex items-center gap-3 px-6 py-2 bg-mat-500/10 border border-mat-500/30 rounded-full text-mat-500 font-black text-[10px] uppercase tracking-widest hover:bg-mat-500 hover:text-white transition-all">
                <Users className="w-4 h-4" /> Comunidad Activa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Engagement Section */}
      <section className="py-32 bg-mat-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px]">
                <Star className="w-5 h-5 fill-current" /> COMMUNITY FIRST
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] font-exo">
                Uniendo al<br/><span className="text-mat-500">Barrio.</span>
              </h2>
              <p className="text-gray-400 text-xl font-light leading-relaxed italic max-w-xl">
                Mat32 no es solo un bar; es el punto de encuentro en Ruzafa para quienes aman el sonido analógico y la cultura del vinilo.
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <Link to="/community" className="px-12 py-5 bg-white text-mat-900 font-black uppercase tracking-widest text-xs hover:bg-mat-500 hover:text-white transition-all clip-path-slant shadow-2xl">
                  {t('home.cta.grid')}
                </Link>
                <Link to="/opendecks" className="px-12 py-5 bg-transparent border-2 border-mat-700 text-white font-black uppercase tracking-widest text-xs hover:border-mat-500 transition-all clip-path-slant">
                  {t('home.cta.opendecks')}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 relative">
               <div className="space-y-6 pt-12">
                  <div className="bg-mat-800 p-2 border border-mat-700 rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600" className="w-full aspect-square object-cover rounded-2xl grayscale hover:grayscale-0 transition-all" loading="lazy" alt="Cultura de club Valencia" />
                    <div className="absolute top-4 left-4 bg-mat-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Heart className="w-4 h-4 fill-current" /></div>
                  </div>
                  <div className="bg-mat-800 p-6 border border-mat-700 rounded-3xl shadow-2xl transform rotate-2">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-mat-500 flex items-center justify-center text-[10px] font-black">L</div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">DJ LUNA</span>
                    </div>
                    <p className="text-[10px] text-gray-500 italic leading-relaxed">"El sonido Altec de Mat32 es de otro planeta. Valencia necesitaba un sitio así."</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="bg-mat-800 p-6 border border-mat-700 rounded-3xl shadow-2xl transform rotate-1 border-l-4 border-l-mat-500">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">+2.4k</h4>
                    <p className="text-[9px] text-mat-500 font-black uppercase tracking-[0.3em]">Crate Diggers</p>
                  </div>
                  <div className="bg-mat-800 p-2 border border-mat-700 rounded-3xl shadow-2xl transform rotate-6 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=600" className="w-full aspect-[3/4] object-cover rounded-2xl grayscale hover:grayscale-0 transition-all" loading="lazy" alt="Evento musical Valencia" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-32 bg-mat-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                <Zap className="w-4 h-4" /> LIVE SESSIONS
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none font-exo">Próximos<br/>Ritmos.</h2>
            </div>
            <Link to="/events" className="group flex text-mat-500 hover:text-white items-center font-black uppercase tracking-[0.3em] text-[11px] transition-all border-b-2 border-mat-500 pb-2">
              {t('home.gigs.view_all')} <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </Link>
          </div>
          
          <div className="grid gap-12">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
