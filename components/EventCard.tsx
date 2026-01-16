
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Ticket, ListMusic, User, ArrowRight, Star, Info } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Event } from '../types';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(event.attendees);

  useEffect(() => {
    const checkRSVP = async () => {
      const rsvps = await dataService.getUserRSVPs();
      setIsAttending(rsvps.includes(event.id));
    };
    checkRSVP();
  }, [event.id]);

  const isFree = event.price === 0;

  const handleAction = async () => {
    if (isFree) {
      const newStatus = !isAttending;
      await dataService.toggleRSVP(event.id, newStatus);
      setIsAttending(newStatus);
      setAttendeeCount(prev => newStatus ? prev + 1 : prev - 1);
    } else {
      const ticketItem: any = {
        id: `ticket-${event.id}`,
        title: `Entrada: ${event.title}`,
        artist: event.category,
        price: event.price,
        coverUrl: event.imageUrl,
        genre: 'Event',
        format: 'Entrada Digital',
        description: `Acceso para ${event.title} el ${event.date}`,
        discogsLink: '#'
      };
      addToCart(ticketItem);
      navigate('/checkout');
    }
  };

  return (
    <article 
      itemScope 
      itemType="http://schema.org/Event"
      className="bg-mat-800 border-2 border-mat-700 shadow-2xl hover:border-mat-500 transition-all duration-500 flex flex-col md:flex-row overflow-hidden group rounded-[1.5rem] md:rounded-[2.5rem]"
    >
      <meta itemProp="startDate" content={`${event.date}T${event.time}`} />
      
      {/* Visual Cover */}
      <div className="md:w-2/5 lg:w-1/3 relative bg-black flex-shrink-0">
        <img 
          itemProp="image"
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mat-900/80 to-transparent"></div>
        <div className="absolute bottom-6 left-6">
           <div className="px-4 py-1 bg-mat-500 text-white font-black uppercase text-[10px] tracking-widest rounded shadow-xl">
             {event.category}
           </div>
        </div>
      </div>
      
      {/* Entry Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Main Info */}
        <div className="flex-1 p-6 md:p-10 lg:p-12 flex flex-col">
          <div className="flex items-center gap-3 text-mat-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
            <Calendar className="w-4 h-4" /> {event.date} 
            <span className="text-mat-700">/</span> 
            <Clock className="w-4 h-4" /> {event.time}
          </div>
          
          <h3 itemProp="name" className="text-3xl md:text-5xl font-black text-white uppercase leading-none mb-6 tracking-tighter font-exo group-hover:text-mat-500 transition-colors">
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light italic mb-8 max-w-xl">
            "{event.description}"
          </p>

          <div className="mt-auto flex flex-wrap gap-4 items-center">
             <button 
                onClick={handleAction}
                className={`px-8 py-4 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all duration-300 border-2 clip-path-slant shadow-xl ${isFree ? (isAttending ? 'bg-white border-white text-mat-900' : 'bg-transparent border-mat-500 text-mat-500 hover:bg-mat-500 hover:text-white') : 'bg-mat-500 border-mat-500 text-white hover:bg-mat-400'}`}
              >
                {isFree ? (isAttending ? <Check className="w-4 h-4" /> : <ListMusic className="w-4 h-4" />) : <Ticket className="w-4 h-4" />}
                {isFree ? (isAttending ? t('events.card.attending_confirm') : t('events.card.guestlist')) : `${t('events.card.get_tickets')} (€${event.price})`}
              </button>
              
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <Star className="w-3 h-3 text-mat-500 fill-current" /> {attendeeCount} CONFIRMADOS
              </div>
          </div>
        </div>

        {/* Lineup / Performer Sidebar */}
        <div className="w-full lg:w-80 bg-mat-900/40 p-6 md:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-mat-700/50">
           <h4 className="text-[10px] font-black text-mat-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
              <User className="w-4 h-4" /> Lineup
           </h4>
           
           <div className="space-y-6">
              {event.lineup.map((artist, idx) => (
                <div key={idx} className="group/artist">
                   <div className="flex flex-col">
                      {artist.profileUrl ? (
                        <Link to={artist.profileUrl} className="text-lg font-black text-white uppercase tracking-tighter group-hover/artist:text-mat-500 transition-colors flex items-center gap-2">
                          {artist.name} <ArrowRight className="w-4 h-4 opacity-0 group-hover/artist:opacity-100 transition-all -translate-x-2 group-hover/artist:translate-x-0" />
                        </Link>
                      ) : (
                        <span className="text-lg font-black text-white uppercase tracking-tighter">{artist.name}</span>
                      )}
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{artist.role}</span>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-12 flex flex-wrap gap-2">
              {event.vibe?.map(v => (
                <span key={v} className="text-[8px] font-black text-gray-500 uppercase tracking-tighter border border-mat-700 px-2 py-1 rounded">
                   #{v}
                </span>
              ))}
           </div>
        </div>
      </div>
    </article>
  );
};
