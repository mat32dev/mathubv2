
import React, { useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { Community } from './pages/Community';
import { OpenDecks } from './pages/OpenDecks';
import { Contact } from './pages/Contact';
import { PrivateEvents } from './pages/PrivateEvents';
import { Records } from './pages/Records';
import { Bar } from './pages/Bar';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { Legal } from './pages/Legal';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Menu, X, Disc, Instagram, ShoppingBag, Globe, Settings, Music } from 'lucide-react';
import { AIChat } from './components/AIChat';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center gap-2 group ${className}`}>
    <div className="relative">
      <Disc className="w-9 h-9 text-mat-500 animate-spin-slow group-hover:text-white transition-colors" />
    </div>
    <div className="flex flex-col">
      <div className="flex items-start leading-none">
        <span className="font-exo font-black text-2xl text-white tracking-tight">MAT</span>
        <span className="font-exo font-bold text-[0.7rem] text-mat-500 -mt-1 ml-0.5">32</span>
      </div>
      <span className="font-exo text-[0.55rem] text-gray-500 uppercase tracking-[0.25em] font-black leading-none group-hover:text-mat-400 transition-colors mt-0.5">DISCOS BAR</span>
    </div>
  </div>
);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleCart, cartCount } = useCart();
  const { toggleLanguage, language, t } = useLanguage();

  const navLinks = useMemo(() => [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.bar'), path: '/bar' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.records'), path: '/records' },
    { name: t('nav.private_events'), path: '/alquiler-local-eventos-valencia' },
    { name: t('nav.community'), path: '/community' },
    { name: t('nav.open_decks'), path: '/opendecks' },
    { name: t('nav.contact'), path: '/contact' },
  ], [t]); 

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-mat-900/90 backdrop-blur-xl border-b border-mat-800 h-20 md:h-24">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${isActive(link.path) ? 'text-mat-500' : 'text-gray-400 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-6 border-l border-mat-800 pl-8">
            <button onClick={toggleLanguage} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <Globe className="w-4 h-4" /> {language.toUpperCase()}
            </button>
            <button onClick={toggleCart} className="relative text-gray-400 hover:text-mat-500 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-3 -right-3 bg-mat-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">{cartCount}</span>}
            </button>
            <Link to="/contact" className="px-8 py-3 bg-mat-500 hover:bg-mat-400 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl clip-path-slant">
              {t('nav.book_table')}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:hidden">
           <button onClick={toggleCart} className="relative text-gray-400 hover:text-mat-500 transition-colors mr-2">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-3 -right-3 bg-mat-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">{cartCount}</span>}
          </button>
          <button className="text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-mat-900 border-b border-mat-800 absolute w-full left-0 z-50 animate-fade-in shadow-2xl">
          <nav className="flex flex-col p-10 space-y-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`text-sm font-black uppercase tracking-[0.4em] ${isActive(link.path) ? 'text-mat-500' : 'text-gray-400'}`}>
                {link.name}
              </Link>
            ))}
            <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="text-mat-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 pt-4 border-t border-mat-800">
               <Globe className="w-5 h-5" /> {language === 'en' ? 'SWAP TO SPANISH' : 'CAMBIAR A INGLÉS'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0c0a09] border-t border-mat-800 pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5 space-y-10">
            <Logo />
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm italic font-light">
              "{t('footer.tagline')}"
            </p>
            <div className="flex gap-5">
              <a href="https://instagram.com/mat32_vlc" target="_blank" rel="noopener noreferrer" className="p-4 bg-mat-900 border border-mat-800 rounded-2xl text-gray-500 hover:text-mat-500 transition-all shadow-xl"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="p-4 bg-mat-900 border border-mat-800 rounded-2xl text-gray-500 hover:text-mat-500 transition-all shadow-xl"><Music className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">NAVIGATE</h4>
            <nav className="flex flex-col space-y-4">
              <Link to="/bar" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.bar')}</Link>
              <Link to="/events" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.events')}</Link>
              <Link to="/records" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.records')}</Link>
              <Link to="/community" className="text-gray-500 hover:text-mat-500 transition-colors text-[10px] font-black uppercase tracking-widest">{t('nav.community')}</Link>
            </nav>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">LOCATION</h4>
            <div className="space-y-6">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Calle Matías Perelló, 32<br/>
                46005 Valencia, Spain
              </p>
              <div className="space-y-2">
                 <p className="text-mat-500 text-[10px] font-black uppercase tracking-widest">Thu - Sat: 18:00 - 02:00</p>
                 <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Sun - Wed: Analog Laboratory</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-mat-800 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-wrap gap-10 justify-center">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">© 2025 MAT32 | VALENCIA</p>
            <Link to="/legal/aviso-legal" className="text-[10px] font-black text-gray-600 hover:text-mat-500 transition-colors uppercase tracking-widest">{t('legal.notice')}</Link>
            <Link to="/legal/privacidad" className="text-[10px] font-black text-gray-600 hover:text-mat-500 transition-colors uppercase tracking-widest">{t('legal.privacy')}</Link>
          </div>
          <div className="flex gap-10 items-center">
            <Link to="/admin" className="text-mat-900 hover:text-mat-500 transition-all opacity-40 hover:opacity-100 flex items-center gap-2">
              <Settings className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">CORE</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans selection:bg-mat-500 selection:text-white">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/opendecks" element={<OpenDecks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/legal/:type" element={<Legal />} />
                </Routes>
              </main>
              <Footer />
              <CartDrawer />
              <AIChat />
            </div>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </LanguageProvider>
  );
};

export default App;
