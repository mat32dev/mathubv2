
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { CheckCircle, CreditCard, ShoppingBag, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { stripeService } from '../services/stripeService';
import { dataService } from '../services/dataService';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') formatted = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    if (name === 'expiry') formatted = value.replace(/\s?/g, '').replace(/(\d{2})/g, '$1/').replace(/\/$/, '').substr(0, 5);
    if (name === 'cvc') formatted = value.replace(/\D/g, '').substr(0, 4);

    setCardData(prev => ({ ...prev, [name]: formatted }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripeService.validateCard(cardData.number, cardData.expiry, cardData.cvc)) {
      setError("Please check your card details.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const confirmed = await stripeService.confirmPayment("mock_pm_123");
      if (confirmed) {
        await dataService.recordSale({
          items: cart,
          total: cartTotal + 5,
          timestamp: new Date().toISOString(),
          type: cart.some(i => i.id.startsWith('ticket')) ? 'ticket' : 'record'
        });
        setIsSuccess(true);
        clearCart();
        window.scrollTo(0, 0);
      } else {
        setError("Payment declined. Please try another card.");
      }
    } catch (err) {
      setError("A technical error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-mat-900 flex items-center justify-center p-6">
        <SEO titleKey="seo.checkout.title" descriptionKey="seo.checkout.description" />
        <div className="max-w-lg w-full bg-mat-800 p-10 border border-mat-500 shadow-2xl text-center animate-fade-in rounded-[3rem]">
           <div className="w-24 h-24 bg-mat-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-mat-700 shadow-inner">
              <CheckCircle className="w-12 h-12 text-mat-500" />
           </div>
           <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{t('checkout.success')}</h1>
           <p className="text-gray-400 mb-8 leading-relaxed">
             {t('checkout.success.msg')}
           </p>
           <Link to="/" className="inline-block px-12 py-4 bg-mat-500 text-white font-bold uppercase tracking-widest hover:bg-mat-400 transition-colors clip-path-slant shadow-xl">
             {t('checkout.back_store')}
           </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-mat-900 pt-24 pb-12 px-6 flex flex-col items-center justify-center text-center">
        <SEO titleKey="seo.checkout.title" descriptionKey="seo.checkout.description" />
        <ShoppingBag className="w-16 h-16 text-mat-700 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{t('checkout.empty')}</h1>
        <p className="text-gray-500 mb-8">{t('checkout.empty.desc')}</p>
        <Link to="/records" className="px-8 py-3 border border-mat-500 text-mat-500 font-bold uppercase tracking-widest hover:bg-mat-500 hover:text-white transition-colors">
          {t('checkout.browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mat-900 text-gray-100">
      <SEO titleKey="seo.checkout.title" descriptionKey="seo.checkout.description" />
      <div className="bg-mat-800 py-20 border-b border-mat-700 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-4 text-mat-500">
             <Lock className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Stripe Secure Encryption Active</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white font-exo">Checkout Protocol</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
             <form onSubmit={handlePlaceOrder} className="space-y-12">
                
                <div className="bg-mat-800 p-10 border-2 border-mat-700 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-10 flex items-center gap-4">
                     <span className="w-8 h-8 bg-mat-500 text-mat-900 rounded-full flex items-center justify-center text-sm font-black">1</span>
                     {t('checkout.billing')}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.first_name')}</label>
                         <input required type="text" className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold" />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.last_name')}</label>
                         <input required type="text" className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold" />
                      </div>
                   </div>
                   <div className="space-y-2 mb-8">
                      <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.email')}</label>
                      <input required type="email" className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold" />
                   </div>
                   <div className="space-y-2 mb-8">
                      <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.address')}</label>
                      <input required type="text" className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none uppercase text-xs font-bold" />
                   </div>
                </div>

                <div className="bg-mat-800 p-10 border-2 border-mat-700 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1.5 bg-mat-500"></div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-10 flex items-center gap-4">
                     <span className="w-8 h-8 bg-mat-500 text-mat-900 rounded-full flex items-center justify-center text-sm font-black">2</span>
                     {t('checkout.payment')}
                   </h2>
                   
                   {error && (
                     <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 mb-8 flex items-center gap-3 rounded-xl animate-fade-in">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                     </div>
                   )}

                   <div className="mb-8 space-y-2">
                      <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.card')}</label>
                      <div className="relative">
                         <input 
                            required 
                            name="number"
                            value={cardData.number}
                            onChange={handleCardInput}
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none pl-12 font-mono" 
                         />
                         <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-mat-500 w-5 h-5" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.expiry')}</label>
                         <input 
                            required 
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardInput}
                            type="text" 
                            placeholder="MM/YY" 
                            className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none font-mono" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-mat-500 uppercase tracking-widest">{t('checkout.form.cvc')}</label>
                         <input 
                            required 
                            name="cvc"
                            value={cardData.cvc}
                            onChange={handleCardInput}
                            type="text" 
                            placeholder="123" 
                            className="w-full bg-mat-900 border border-mat-700 p-4 text-white focus:border-mat-500 outline-none font-mono" 
                         />
                      </div>
                   </div>
                   
                   <div className="mt-10 flex items-center gap-3 text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secured by Stripe Elements Protocol</span>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-mat-500 hover:bg-mat-400 text-white font-black py-7 uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-sm clip-path-slant"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      {t('checkout.processing')}
                    </>
                  ) : (
                    <>
                      {t('checkout.place_order')} <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
             </form>
          </div>

          <div className="lg:col-span-4">
             <div className="bg-mat-800 p-8 border-2 border-mat-700 shadow-2xl rounded-[2.5rem] sticky top-28 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-1000 pointer-events-none">
                   <ShoppingBag className="w-48 h-48" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-8 border-b-2 border-mat-700 pb-6">{t('checkout.summary')}</h3>
                <div className="space-y-6 mb-10">
                   {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                         <div className="w-16 h-16 bg-black flex-shrink-0 rounded-lg overflow-hidden border border-mat-700">
                            <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-xs uppercase truncate tracking-tight">{item.title}</p>
                            <p className="text-mat-500 text-[9px] font-black uppercase tracking-widest truncate">{item.artist}</p>
                            <div className="flex justify-between mt-2">
                               <span className="text-gray-500 text-[10px] font-black">QTY: {item.quantity}</span>
                               <span className="text-mat-cream font-mono text-xs font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                
                <div className="border-t-2 border-dashed border-mat-700 pt-8 space-y-4">
                   <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-widest">
                      <span>{t('cart.subtotal')}</span>
                      <span className="font-mono text-gray-300">€{cartTotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-widest">
                      <span>Shipping / Protocol</span>
                      <span className="font-mono text-gray-300">€5.00</span>
                   </div>
                   <div className="flex justify-between items-end pt-4 border-t border-mat-700/50">
                      <span className="text-xs font-black text-white uppercase tracking-widest">{t('checkout.total')}</span>
                      <div className="text-right">
                         <span className="text-4xl font-black text-mat-500 font-exo block leading-none">€{(cartTotal + 5).toFixed(2)}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
