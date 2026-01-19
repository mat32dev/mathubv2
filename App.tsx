import React, { useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2, Menu, X, DollarSign, Globe } from 'lucide-react';

// Contextos y Componentes Centrales
import { CartDrawer } from './components/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AIChat } from './components/AIChat';

const Events = React.lazy(() => import('./pages/Events'));
const Community = React.lazy(() => import('./pages/Community'));
const OpenDecks = React.lazy(() => import('./pages/OpenDecks'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivateEvents = React.lazy(() => import('./pages/PrivateEvents'));
const Bar = React.lazy(() => import('./pages/Bar'));
const Records = React.lazy(() => import('./pages/Records'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Legal = React.lazy(() => import('./pages/Legal'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-mat-900 flex items-center justify-center">
    <Loader2 className="w-10 h-10 text-mat-500 animate-spin" />
  </div>
);

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-mat-500 to-mat-400 rounded-full flex items-center justify-center shadow-lg">
        <DollarSign className="w-7 h-7 text-mat-cream" />
      </div>
      <div className="flex flex-col">
        <span className="font-exo text-2xl font-black tracking-tight text-mat-cream">MAT32</span>
        <span className="text-[10px] text-mat-500 font-bold tracking-widest -mt-1">DISCOS BAR</span>
      </div>
    </div>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { t, language, setLanguage } = useLanguage();

  const navigation = useMemo(
    () => [
      { name: t('nav.home'), href: '/' },
      { name: t('nav.bar'), href: '/bar' },
      { name: t('nav.events'), href: '/events' },
      { name: t('nav.records'), href: '/shop' },
      { name: t('nav.community'), href: '/community' },
      { name: t('nav.opendecks'), href: '/open-decks' },
      { name: t('nav.contact'), href: '/contact' },
      { name: t('nav.privateevents'), href: '/alquiler-local-eventos-valencia' },
    ],
    [t]
  );

  return (
    <Router>
      <div className="min-h-screen bg-mat-900 text-mat-cream">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-mat-900/95 backdrop-blur-sm border-b border-mat-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" onClick={() => setIsMenuOpen(false)}>
                <Logo />
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={`#${item.href}`}
                    className="text-mat-cream hover:text-mat-500 transition font-medium"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Right Icons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                  className="p-2 hover:bg-mat-800 rounded-full transition"
                  aria-label="Change language"
                >
                  <Globe className="w-5 h-5" />
                </button>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 hover:bg-mat-800 rounded-lg transition"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-mat-800 bg-mat-900">
              <nav className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={`#${item.href}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 hover:bg-mat-800 rounded-lg transition"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pt-16">
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/events" element={<Events />} />
              <Route path="/shop" element={<Records />} />
              <Route path="/community" element={<Community />} />
              <Route path="/open-decks" element={<OpenDecks />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/alquiler-local-eventos-valencia" element={<PrivateEvents />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/legal" element={<Legal />} />
            </Routes>
          </React.Suspense>
        </main>

        {/* Global Components */}
        <CartDrawer />
        <AIChat />
      </div>
    </Router>
  );
}

export default function Root() {
  return (
    <LanguageProvider>
      <CartProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
