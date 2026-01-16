
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Calendar, Users, CheckCircle, AlertTriangle, Loader2, Send, MessageSquare, ExternalLink, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { dataService } from '../services/dataService';

interface BookingFormData {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
}

type BookingStatus = 'idle' | 'submitting' | 'success' | 'error';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    guests: 2
  });
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (bookingForm.name.trim().length < 2) {
      newErrors.name = t('contact.error.name_short');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      newErrors.email = t('contact.error.invalid_email');
    }

    // Date validation (no past dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingForm.date);
    if (selectedDate < today) {
      newErrors.date = t('contact.error.past_date');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setBookingStatus('submitting');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = await dataService.createBooking(bookingForm);
      if (success) {
        setBookingStatus('success');
        window.scrollTo({ top: 300, behavior: 'smooth' });
      } else {
        setBookingStatus('error');
      }
    } catch (err) {
      setBookingStatus('error');
    }
  };

  const resetStatus = () => {
    setBookingStatus('idle');
    setErrors({});
    setBookingForm({
      name: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      guests: 2
    });
  };

  return (
    <div className="min-h-screen bg-mat-900 flex flex-col font-sans">
      <SEO titleKey="nav.contact" descriptionKey="seo.contact.description" />
      
      {/* Header section with high-fidelity feel */}
      <div className="bg-mat-800 py-16 md:py-24 border-b border-mat-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:25px_25px]"></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 bg-mat-900 border border-mat-500 text-mat-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full shadow-lg">
            <MessageSquare className="w-4 h-4" /> Hub Connection
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-4 leading-none font-exo text-glow">
            {t('contact.title')}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light italic max-w-2xl mx-auto">
            {t('contact.desc')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-20 max-w-6xl">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Booking and Info Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* BOOKING SECTION */}
            <section className="bg-mat-800 border-2 border-mat-700 p-8 md:p-12 relative overflow-hidden shadow-2xl rounded-[2.5rem] group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
              
              <div className="relative z-10">
                {bookingStatus === 'success' ? (
                  <div className="py-12 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-mat-700 shadow-xl">
                      <CheckCircle className="w-12 h-12 text-mat-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-4 tracking-tighter font-exo">{t('contact.booking.success')}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed italic max-w-md mx-auto">
                      {t('contact.booking.success_msg')}
                    </p>
                    <button 
                      onClick={resetStatus}
                      className="px-10 py-4 bg-mat-500 text-white font-black uppercase tracking-widest hover:bg-mat-400 transition-all clip-path-slant shadow-xl"
                    >
                      {t('nav.book_table')}
                    </button>
                  </div>
                ) : bookingStatus === 'error' ? (
                  <div className="py-12 text-center animate-fade-in">
                    <div className="w-24 h-24 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/50 shadow-xl">
                      <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black uppercase text-white mb-4 tracking-tighter font-exo">{t('contact.booking.error')}</h2>
                    <p className="text-gray-400 text-lg mb-10 italic max-w-md mx-auto">
                      {t('contact.booking.error_msg')}
                    </p>
                    <button 
                      onClick={() => setBookingStatus('idle')}
                      className="px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-500 transition-all clip-path-slant"
                    >
                      {t('contact.booking.retry')}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-10">
                      <div className={`w-12 h-12 ${bookingStatus === 'submitting' ? 'bg-mat-700' : 'bg-mat-900'} border border-mat-700 rounded-2xl flex items-center justify-center text-mat-500 transition-colors shadow-lg`}>
                        {bookingStatus === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calendar className="w-6 h-6" />}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none font-exo">{t('contact.booking.title')}</h2>
                        <p className="text-gray-500 text-xs mt-1 uppercase font-bold tracking-widest">Reserve Your Spot in the Sanctuary</p>
                      </div>
                    </div>

                    <form onSubmit={handleBookingSubmit} className={`space-y-6 transition-all duration-500 ${bookingStatus === 'submitting' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className={`block text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${errors.name ? 'text-red-500' : 'text-mat-500'}`}>{t('contact.form.name')}</label>
                          <input 
                            required
                            type="text" 
                            name="name"
                            value={bookingForm.name}
                            onChange={handleBookingChange}
                            className={`w-full bg-mat-900 border-2 p-5 text-white focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-xl shadow-inner ${errors.name ? 'border-red-500/50' : 'border-mat-700'}`}
                            placeholder="NAME / ALIAS"
                          />
                          {errors.name && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className={`block text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${errors.email ? 'text-red-500' : 'text-mat-500'}`}>{t('contact.form.email')}</label>
                          <input 
                            required
                            type="email" 
                            name="email"
                            value={bookingForm.email}
                            onChange={handleBookingChange}
                            className={`w-full bg-mat-900 border-2 p-5 text-white focus:border-mat-500 outline-none transition-all uppercase text-[11px] font-black rounded-xl shadow-inner ${errors.email ? 'border-red-500/50' : 'border-mat-700'}`}
                            placeholder="EMAIL"
                          />
                          {errors.email && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className={`block text-[10px] font-black uppercase tracking-widest ml-1 transition-colors ${errors.date ? 'text-red-500' : 'text-mat-500'}`}>{t('contact.booking.label.date')}</label>
                          <input 
                            required
                            type="date" 
                            name="date"
                            value={bookingForm.date}
                            onChange={handleBookingChange}
                            className={`w-full bg-mat-900 border-2 p-5 text-white focus:border-mat-500 outline-none text-[11px] font-black uppercase rounded-xl shadow-inner ${errors.date ? 'border-red-500/50' : 'border-mat-700'}`}
                          />
                          {errors.date && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.date}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('contact.booking.label.time')}</label>
                          <select 
                            name="time"
                            value={bookingForm.time}
                            onChange={handleBookingChange}
                            className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none text-[11px] font-black uppercase rounded-xl appearance-none cursor-pointer shadow-inner"
                          >
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                            <option value="21:00">21:00</option>
                            <option value="22:00">22:00</option>
                            <option value="23:00">23:00</option>
                            <option value="00:00">00:00</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest ml-1">{t('contact.booking.label.guests')}</label>
                          <select 
                            name="guests"
                            value={bookingForm.guests}
                            onChange={handleBookingChange}
                            className="w-full bg-mat-900 border-2 border-mat-700 text-white p-5 focus:border-mat-500 outline-none text-[11px] font-black uppercase rounded-xl appearance-none cursor-pointer shadow-inner"
                          >
                            {[2,3,4,5,6,7,8,9,10,12].map(n => (
                              <option key={n} value={n}>{n} PAX</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={bookingStatus === 'submitting'}
                        className="w-full py-6 md:py-8 bg-mat-500 hover:bg-mat-400 text-white font-black uppercase tracking-[0.3em] text-[11px] md:text-sm transition-all shadow-xl hover:shadow-mat-500/30 clip-path-slant flex items-center justify-center gap-4"
                      >
                        {bookingStatus === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {bookingStatus === 'submitting' ? t('contact.booking.btn_loading') : t('contact.booking.btn')}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </section>

            {/* Visit & Info Cards */}
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-mat-800 p-8 border border-mat-700 rounded-[2rem] flex items-start gap-6 group hover:border-mat-500 transition-colors">
                  <div className="p-4 bg-mat-900 border border-mat-700 text-mat-500 rounded-2xl group-hover:bg-mat-500 group-hover:text-white transition-all">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase text-sm tracking-widest mb-3">{t('contact.visit')}</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      Calle Matías Perelló, 32<br/>
                      46005 Valencia, Spain
                    </p>
                  </div>
               </div>
               <div className="bg-mat-800 p-8 border border-mat-700 rounded-[2rem] flex items-start gap-6 group hover:border-mat-500 transition-colors">
                  <div className="p-4 bg-mat-900 border border-mat-700 text-mat-500 rounded-2xl group-hover:bg-mat-500 group-hover:text-white transition-all">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-black uppercase text-sm tracking-widest mb-3">{t('contact.hours')}</h4>
                    <div className="space-y-1 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex justify-between"><span className="text-gray-500">Thu - Sat:</span> <span className="text-white">18:00 - 02:00</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Sun - Wed:</span> <span className="text-mat-500">Analog Lab</span></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Secondary Column: Map & General Form */}
          <aside className="lg:col-span-5 space-y-12">
            
            {/* Minimal Map Hub */}
            <div className="aspect-video bg-mat-800 border-2 border-mat-700 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-mat-900 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div>
                    <span className="bg-mat-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded mb-2 inline-block">Valencia - Ruzafa</span>
                    <h4 className="text-white font-black text-xl uppercase font-exo tracking-tighter">Mat32 Sanctuary</h4>
                  </div>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 bg-white text-mat-900 rounded-full hover:bg-mat-500 hover:text-white transition-all shadow-2xl"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
               </div>
            </div>

            {/* GENERAL MESSAGE FORM */}
            <section className="bg-mat-900 border-2 border-mat-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl relative">
              <h3 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter font-exo border-b border-mat-800 pb-4">{t('contact.form.title')}</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('contact.form.name')}</label>
                      <input type="text" className="w-full bg-mat-800 border-2 border-mat-700 text-white p-4 focus:border-mat-500 outline-none transition-all rounded-xl uppercase text-[10px] font-black" />
                   </div>
                   <div className="space-y-2">
                      <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('contact.form.email')}</label>
                      <input type="email" className="w-full bg-mat-800 border-2 border-mat-700 text-white p-4 focus:border-mat-500 outline-none transition-all rounded-xl uppercase text-[10px] font-black" />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('contact.form.subject')}</label>
                  <select className="w-full bg-mat-800 border-2 border-mat-700 text-white p-4 focus:border-mat-500 outline-none appearance-none transition-all rounded-xl uppercase text-[10px] font-black cursor-pointer">
                    <option>General Support</option>
                    <option>Selector/Open Decks</option>
                    <option>Record Store Stock</option>
                    <option>Private Hire</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest">{t('contact.form.message')}</label>
                  <textarea className="w-full bg-mat-800 border-2 border-mat-700 text-white p-4 h-32 focus:border-mat-500 outline-none resize-none transition-all rounded-xl uppercase text-[10px] font-black leading-relaxed" placeholder="WRITE YOUR MESSAGE..."></textarea>
                </div>

                <button type="button" className="w-full bg-white hover:bg-mat-500 hover:text-white text-mat-900 font-black py-5 uppercase tracking-[0.3em] text-[10px] transition-all clip-path-slant shadow-xl">
                  {t('contact.btn.send')}
                </button>
              </form>
            </section>

            <div className="flex justify-center gap-10 pt-4">
               <a href="#" className="flex items-center gap-3 text-[10px] font-black text-gray-600 hover:text-mat-500 transition-colors uppercase tracking-widest">
                  <Phone className="w-4 h-4" /> Call Hub
               </a>
               <a href="mailto:groove@mat32.com" className="flex items-center gap-3 text-[10px] font-black text-gray-600 hover:text-mat-500 transition-colors uppercase tracking-widest">
                  <Mail className="w-4 h-4" /> Email Us
               </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
