
import React, { useState, useEffect } from 'react';
import { 
  Wine, Users, Clock, CheckCircle, Martini, Info, 
  Sparkles, FileText, Shield, Music2, Calculator, 
  Handshake, Mail, Layers, Settings, ChevronRight, 
  Zap, Headphones, Volume2, Receipt, Percent, ArrowRight, Loader2, Phone, User, Building, Landmark, BarChart, Camera, Disc, Star, Speaker, LayoutGrid
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

type EventType = 'private' | 'promoter';

export const PrivateEvents: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventType, setEventType] = useState<EventType>('private');
  const [riderRequested, setRiderRequested] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    date: new Date().toISOString().split('T')[0],
    duration: 4, 
    guests: 40, 
    ticketsPerGuest: 2,
    companyName: '',
    phone: '',
    eventCategory: '',
    attendance: ''
  });

  const [quote, setQuote] = useState({
    rentalBase: 0,
    consumableRevenue: 0,
    discount: 0,
    finalTotal: 0,
    pricePerPerson: 0,
    totalDrinks: 0,
    isWeekend: false,
    drinkPrice: 9.50
  });

  const venueImages = [
    {
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
      title: 'Altec + Klipsch Heritage',
      desc: 'Our bespoke analog sound system delivering unmatched warmth and clarity.'
    },
    {
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop',
      title: 'Precision Controls',
      desc: 'Professional rotary mixing and premium gear for authentic audio sessions.'
    },
    {
      url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=1200&auto=format&fit=crop',
      title: 'Industrial Lounge',
      desc: 'Raw concrete and warm wood textures creating the perfect listening atmosphere.'
    },
    {
      url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop',
      title: 'Curated Hub',
      desc: 'The center of our community where records and craft spirits meet.'
    }
  ];

  useEffect(() => {
    const calculateQuote = () => {
      const day = new Date(formData.date).getDay();
      const isWeekend = day === 5 || day === 6; 
      const DRINK_PRICE = 9.50; 
      
      const hourlyRate = isWeekend ? 140 : 80;
      const baseRental = formData.duration * hourlyRate;
      
      const totalDrinks = formData.guests * formData.ticketsPerGuest;
      const drinksRevenue = totalDrinks * DRINK_PRICE;
      
      const reductionFactor = 0.40;
      const rentalDiscount = Math.min(baseRental, drinksRevenue * reductionFactor);
      
      const totalEstimated = (baseRental - rentalDiscount) + drinksRevenue;

      setQuote({
        rentalBase: baseRental,
        consumableRevenue: drinksRevenue,
        discount: rentalDiscount,
        finalTotal: totalEstimated,
        pricePerPerson: totalEstimated / (formData.guests || 1),
        totalDrinks,
        isWeekend,
        drinkPrice: DRINK_PRICE
      });
    };
    calculateQuote();
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'duration' || name === 'guests' || name === 'ticketsPerGuest') ? Number(value) : value
    }));
  };

  const handleRequestRider = () => {
    setRiderRequested(true);
    setTimeout(() => setRiderRequested(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col font-sans">
      <SEO titleKey="nav.private_events" descriptionKey="private.hero.desc" schemaType="LocalBusiness" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-32 bg-mat-800 border-b border-mat-700 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 md:mb-10 px-4 py-1.5 md:px-5 md:py-2 bg-mat-900 border-2 border-mat-500 text-mat-500 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] shadow-lg rounded-full">
            <LayoutGrid className="w-3 h-3 md:w-4 md:h-4" /> {t('private.hero.title')}
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-white mb-6 md:mb-10 leading-none font-exo text-glow">
            {t('private.hero.title')}
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg md:text-2xl font-light italic leading-relaxed">
            {t('private.hero.desc')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-24 max-w-7xl">
        
        {/* Venue Gallery Section */}
        <section className="mb-24 md:mb-40 space-y-12 md:space-y-16 animate-fade-in" aria-labelledby="gallery-title">
           <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-b border-mat-800 pb-10 text-center md:text-left">
              <div>
                <div className="inline-flex items-center gap-3 text-mat-500 font-black uppercase tracking-[0.5em] text-[9px] md:text-[10px] mb-4">
                   <Camera className="w-4 h-4 md:w-5 md:h-5" /> {t('private.gallery.title')}
                </div>
                <h2 id="gallery-title" className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter font-exo leading-none">{t('private.gallery.title')}</h2>
              </div>
              <p className="text-gray-500 text-sm md:text-lg font-light italic max-w-md">
                {t('private.gallery.subtitle')}
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8" role="region" aria-label="Venue photo gallery">
              {/* Feature Large Image */}
              <figure className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-mat-800 border-2 border-mat-700 shadow-2xl">
                 <img 
                   src={venueImages[0].url} 
                   alt={venueImages[0].title}
                   className="w-full h-full min-h-[400px] object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                   loading="eager" 
                 />
                 <figcaption className="absolute inset-0 bg-gradient-to-t from-mat-900 via-mat-900/10 to-transparent p-8 md:p-12 flex flex-col justify-end transform transition-all duration-500 group-hover:bg-mat-900/60">
                    <div className="flex items-center gap-3 mb-3 text-mat-500">
                       <Speaker className="w-5 h-5 md:w-6 md:h-6" />
                       <span className="font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">Premium Audio</span>
                    </div>
                    <h4 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 md:mb-4 font-exo leading-tight">{venueImages[0].title}</h4>
                    <p className="text-gray-300 text-sm md:text-xl font-light italic leading-relaxed max-w-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                       {venueImages[0].desc}
                    </p>
                 </figcaption>
              </figure>

              {/* Smaller Grid Images */}
              {venueImages.slice(1).map((img, i) => (
                <figure key={i} className="md:col-span-4 aspect-square group relative overflow-hidden rounded-[2rem] bg-mat-800 border-2 border-mat-700 shadow-xl">
                  <img 
                    src={img.url} 
                    alt={img.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                  />
                  <figcaption className="absolute inset-0 bg-gradient-to-t from-mat-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 md:p-8 flex flex-col justify-end">
                      <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2 font-exo">{img.title}</h4>
                      <p className="text-gray-400 text-[10px] md:text-xs italic leading-relaxed uppercase tracking-widest font-bold">
                        {img.desc}
                      </p>
                  </figcaption>
                </figure>
              ))}
           </div>
        </section>

        {/* Info Content Section */}
        <section className="mb-24 md:mb-32 grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
           <div className="lg:col-span-8 space-y-10">
              <div className="inline-flex items-center gap-2 text-mat-500 font-black uppercase tracking-[0.5em] text-[10px]">
                <Star className="w-4 h-4 fill-current" /> COMUNIDAD MAT32
              </div>
              <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter font-exo leading-none">
                {t('private.seo_text.title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-10">
                 <p className="text-gray-400 text-base md:text-xl font-light leading-relaxed border-l-4 border-mat-500 pl-8 italic">
                   {t('private.seo_text.desc')}
                 </p>
                 <div className="bg-mat-800/40 p-8 border border-mat-700 rounded-[2.5rem] space-y-6">
                    <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.4em]">Configuración de Sonido</h4>
                    <ul className="space-y-4">
                       <li className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
                          <div className="w-1.5 h-1.5 bg-mat-500 rounded-full"></div> Altec + Klipsch La Scala
                       </li>
                       <li className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
                          <div className="w-1.5 h-1.5 bg-mat-500 rounded-full"></div> Rane MP2016 Mixer
                       </li>
                       <li className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
                          <div className="w-1.5 h-1.5 bg-mat-500 rounded-full"></div> Dual Technics 1210 MK7
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
           
           <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <div className="bg-mat-800 p-8 md:p-10 border-2 border-mat-700 rounded-[2.5rem] text-center shadow-xl">
                 <p className="text-4xl md:text-6xl font-black text-white font-exo mb-2 tracking-tighter">100</p>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Capacidad Máxima</p>
              </div>
              <div className="bg-mat-800 p-8 md:p-10 border-2 border-mat-700 rounded-[2.5rem] text-center shadow-xl">
                 <p className="text-4xl md:text-6xl font-black text-white font-exo mb-2 tracking-tighter">46005</p>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Valencia Barrio</p>
              </div>
           </div>
        </section>

        {/* Calculator & Form Section */}
        <div className="flex flex-col items-center mb-16 md:mb-24">
          <h3 className="text-[10px] md:text-sm font-black text-gray-600 uppercase tracking-[0.4em] mb-8">{t('private.type.label')}</h3>
          <div className="bg-mat-800 p-1.5 border border-mat-700 rounded-[2rem] flex shadow-2xl w-full max-w-md">
            <button 
              onClick={() => { setEventType('private'); setIsSubmitted(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ${eventType === 'private' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" /> {t('private.type.private')}
            </button>
            <button 
              onClick={() => { setEventType('promoter'); setIsSubmitted(false); }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-[1.5rem] text-[9px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 ${eventType === 'promoter' ? 'bg-mat-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Headphones className="w-4 h-4 md:w-5 md:h-5" /> {t('private.type.promoter')}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="lg:col-span-8 space-y-12 md:space-y-20 animate-fade-in">
            {eventType === 'private' ? (
              <div className="space-y-12">
                <div className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] overflow-hidden shadow-2xl relative">
                  <div className="bg-mat-900 px-8 py-5 flex justify-between items-center border-b border-mat-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${quote.isWeekend ? 'bg-mat-500 animate-pulse' : 'bg-blue-600'}`}></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {quote.isWeekend ? t('private.simulator.weekend') : 'Tarifa Estándar Semanal'}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12 space-y-12 border-b md:border-b-0 md:border-r border-mat-700">
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('private.guest_count')}</label>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-5xl font-black text-white font-exo leading-none">{formData.guests}</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase">max 100</span>
                          </div>
                        </div>
                        <input 
                          type="range" min="20" max="100" step="5" value={formData.guests} 
                          name="guests" onChange={handleInputChange}
                          className="w-full h-1.5 bg-mat-900 rounded-lg appearance-none cursor-pointer accent-mat-500" 
                        />
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('private.label.duration')}</label>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-5xl font-black text-white font-exo leading-none">{formData.duration}</span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase">HRS</span>
                          </div>
                        </div>
                        <input 
                          type="range" min="3" max="8" step="1" value={formData.duration} 
                          name="duration" onChange={handleInputChange}
                          className="w-full h-1.5 bg-mat-900 rounded-lg appearance-none cursor-pointer accent-mat-500" 
                        />
                      </div>

                      <div className="space-y-6">
                        <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('private.tickets_per_guest')}</label>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4].map(n => (
                            <button 
                              key={n} 
                              onClick={() => setFormData(p => ({...p, ticketsPerGuest: n}))}
                              className={`flex-1 py-4 border-2 transition-all font-black text-xs md:text-sm rounded-xl ${formData.ticketsPerGuest === n ? 'bg-mat-500 border-mat-500 text-white' : 'border-mat-700 text-gray-500 hover:border-mat-500'}`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1a1817] p-8 md:p-12 flex flex-col justify-between">
                       <div className="space-y-8">
                          <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                            <Receipt className="w-6 h-6 text-mat-500" /> Desglose Estimado
                          </h4>
                          <div className="space-y-4 font-mono text-sm md:text-base">
                             <div className="flex justify-between text-gray-400">
                                <span>{t('private.simulator.breakdown.rental')}</span>
                                <span className="text-white">€{quote.rentalBase.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-gray-400">
                                <span>{t('private.simulator.breakdown.consumables')}</span>
                                <span className="text-white">€{quote.consumableRevenue.toFixed(2)}</span>
                             </div>
                             {quote.discount > 0 && (
                               <div className="flex justify-between text-mat-500 font-bold border-t border-mat-700 pt-5">
                                  <span>{t('private.simulator.breakdown.discount')}</span>
                                  <span>-€{quote.discount.toFixed(2)}</span>
                               </div>
                             )}
                          </div>
                       </div>
                       <div className="mt-12 pt-10 border-t-4 border-dashed border-mat-700">
                          <div className="flex justify-between items-end">
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('private.simulator.est_total')}</span>
                             <span className="text-4xl md:text-7xl font-black text-mat-500 font-exo leading-none tracking-tighter">€{quote.finalTotal.toFixed(0)}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-fade-in">
                 <div className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] p-10 md:p-16 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mat-900 via-mat-500 to-mat-900"></div>
                    <div className="relative z-10 max-w-2xl">
                       <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 md:mb-8 leading-none font-exo">
                         {t('private.collab.title')}
                       </h2>
                       <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-10 md:mb-12">
                         {t('private.collab.desc')}
                       </p>
                       <button onClick={handleRequestRider} className={`w-full sm:w-auto px-10 py-5 border-2 flex items-center justify-center gap-4 text-[10px] md:text-sm font-black uppercase tracking-widest transition-all rounded-[1.5rem] shadow-xl ${riderRequested ? 'bg-green-600 border-green-500 text-white' : 'border-mat-700 text-white hover:border-mat-500'}`}>
                          {riderRequested ? <CheckCircle className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                          {riderRequested ? 'Protocolo Enviado' : 'Descargar Guía Técnica'}
                       </button>
                    </div>
                 </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {[
                { icon: <Volume2 className="w-6 h-6" />, title: 'Sonido de Legado', desc: 'Experimenta tu evento a través de stacks Altec + Klipsch La Scala. Claridad analógica real.' },
                { icon: <Users className="w-6 h-6" />, title: 'Soporte del Local', desc: 'Incluye personal de sala y coordinación de la sesión. Cuidamos cada detalle de la experiencia.' }
              ].map((card, i) => (
                <div key={i} className="bg-mat-800 p-8 md:p-10 border border-mat-700 rounded-[2.5rem] flex items-start gap-6 group hover:border-mat-500 transition-all shadow-xl">
                   <div className="p-4 md:p-5 bg-mat-900 border border-mat-500 text-mat-500 rounded-2xl group-hover:bg-mat-500 group-hover:text-white transition-all">
                      {card.icon}
                   </div>
                   <div>
                      <h5 className="font-black text-white uppercase tracking-wider text-sm md:text-base mb-2 md:mb-3">{card.title}</h5>
                      <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-light italic">{card.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-mat-800 border-2 border-mat-700 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
               
               {isSubmitted ? (
                 <div className="py-12 md:py-20 text-center animate-fade-in">
                    <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-mat-500 mx-auto mb-8 md:mb-10" />
                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase mb-6 tracking-tighter font-exo">{t('private.success.title')}</h4>
                    <p className="text-gray-500 text-sm md:text-lg leading-relaxed mb-12 italic">
                      {t('private.success.desc').replace('{date}', formData.date)}
                    </p>
                    <button onClick={() => setIsSubmitted(false)} className="text-mat-500 font-black uppercase text-[10px] md:text-xs tracking-widest underline decoration-2 underline-offset-8 hover:text-white transition-colors">
                      {t('private.success.back')}
                    </button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-4 mb-4 md:mb-10">
                       <Mail className="w-6 h-6 md:w-8 md:h-8 text-mat-500" />
                       <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter font-exo">{t('private.booking_details')}</h4>
                    </div>

                    <div className="space-y-5 md:space-y-7">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('private.form.label.date')}</label>
                          <input required name="date" type="date" value={formData.date} onChange={handleInputChange} className="w-full bg-mat-900 border border-mat-700 p-4 md:p-5 text-white focus:border-mat-500 outline-none uppercase text-xs font-black rounded-xl shadow-inner" />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('private.form.label.name')}</label>
                          <input required name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full bg-mat-900 border border-mat-700 p-4 md:p-5 text-white focus:border-mat-500 outline-none uppercase text-xs font-black rounded-xl shadow-inner" placeholder="TU NOMBRE" />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('private.form.label.email')}</label>
                          <input required name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-mat-900 border border-mat-700 p-4 md:p-5 text-white focus:border-mat-500 outline-none uppercase text-xs font-black rounded-xl shadow-inner" placeholder="EMAIL" />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('private.form.phone')}</label>
                          <input required name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full bg-mat-900 border border-mat-700 p-4 md:p-5 text-white focus:border-mat-500 outline-none uppercase text-xs font-black rounded-xl shadow-inner" placeholder="+34 6XX XX XX XX" />
                       </div>

                       {eventType === 'promoter' && (
                         <div className="space-y-2 animate-fade-in">
                            <label className="text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('private.form.company')}</label>
                            <input name="companyName" type="text" value={formData.companyName} onChange={handleInputChange} className="w-full bg-mat-900 border border-mat-700 p-4 md:p-5 text-white focus:border-mat-500 outline-none uppercase text-xs font-black rounded-xl shadow-inner" placeholder="COLECTIVO / SELLO" />
                         </div>
                       )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full py-6 md:py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.3em] text-[11px] md:text-sm transition-all shadow-2xl flex items-center justify-center gap-4 clip-path-slant group"
                    >
                       {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                       {isProcessing ? 'Sincronizando' : t('private.btn.request')}
                    </button>

                    <p className="text-[9px] md:text-[10px] text-gray-600 text-center uppercase tracking-widest leading-relaxed px-4">
                       {t('private.disclaimer')}
                    </p>
                 </form>
               )}
            </div>

            <div className="mt-10 p-6 md:p-8 border-l-4 border-mat-700 flex items-start gap-4 shadow-xl bg-mat-800/20 rounded-r-3xl">
               <Shield className="w-5 h-5 text-gray-700 mt-1" />
               <div>
                  <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{t('private.form.protocol.label')}</h5>
                  <p className="text-[10px] md:text-xs text-gray-600 font-medium leading-relaxed italic">
                     {t('private.form.protocol.desc')}
                  </p>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
