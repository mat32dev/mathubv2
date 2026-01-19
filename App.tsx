
import React, { useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Loader2, Menu, X, Disc, ShoppingBag, Globe } from 'lucide-react';

// Componentes y Contexto
import { CartDrawer } from './components/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AIChat } from './components/AIChat';

// Importaciones Estáticas de Páginas (Corrige error de resolución en Vercel)
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
import { EventDetail } from './pages/EventDetail';
import { RecordDetail } from './pages/RecordDetail';
import { PostDetail } from './pages/PostDetail';

const Logo: React.FC = () => (
  <div className="flex items-center gap-2 group">
    <Disc className="w-9 h-9 text-mat-500 animate-spin-slow group-hover:text-white transition-colors" />
    <div className="flex flex-col">
      <div className="flex items-start leading-none">
        <span className="font-exo font-black text-2xl text-white tracking-tight">MAT</span>
        <span className="font-exo font-bold text-[0.7rem] text-mat-500 -mt-1 ml-0.5">32</span>
      </div>
      <span className="font-exo text-[0.55rem] text-gray-500 uppercase tracking-[0.25em] font-black leading-none group-hover:text-mat-400 transition-colors mt-0.5">DISCOS BAR</span>
    </div>
  </div>
);

const HeaderContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toggleCart, cartCount } = useCart();
  const { toggleLanguage, language, t } = useLanguage();

  const navLinks = useMemo(() => [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.bar'), path: '/bar' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.records'), path: '/records' },
    { name: t('nav.community'), path: '/community' },
    { name: t('nav.open_decks'), path: '/open-decks' },
  ], [t]); 

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-mat-900/95 backdrop-blur-xl border-b border-mat-800 h-20 md:h-24">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group ${isActive(link.path) ? 'text-mat-500' : 'text-gray-400 hover:text-white'}`}>
                {link.name}
                {isActive(link.path) && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-mat-500"></span>}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-6 border-l border-mat-800 pl-8">
            <Link to="/contact" className="px-6 py-3 bg-mat-500 text-white font-black text-[10px] uppercase tracking-widest clip-path-slant">{t('nav.reserve_table')}</Link>
            <button onClick={toggleLanguage} className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest">{language === 'es' ? 'EN' : 'ES'}</button>
            <button onClick={toggleCart} className="relative p-3 bg-mat-800 rounded-xl text-gray-400">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-mat-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="lg:hidden flex items-center gap-4">
          <button onClick={toggleCart} className="relative p-2.5 bg-mat-800 rounded-xl text-gray-400">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-mat-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>}
          </button>
          <button className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-mat-900 pt-24 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-black uppercase tracking-widest ${isActive(link.path) ? 'text-mat-500' : 'text-white'}`}>{link.name}</Link>
            ))}
            <div className="pt-8 border-t border-mat-800 space-y-4">
               <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-4 bg-mat-500 text-white font-black uppercase tracking-widest rounded-xl">{t('nav.reserve_table')}</Link>
               <button onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }} className="w-full text-center py-4 border border-mat-700 text-gray-500 font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"><Globe size={18} /> {language === 'es' ? 'ENGLISH' : 'ESPAÑOL'}</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-mat-900 text-gray-100 font-sans selection:bg-mat-500 selection:text-white">
              <HeaderContent />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/record/:id" element={<RecordDetail />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/open-decks" element={<OpenDecks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/legal/:type" element={<Legal />} />
                </Routes>
              </main>
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
