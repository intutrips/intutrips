import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Star, Plus, Minus } from 'lucide-react';

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80",
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
];

function DayItem({ day, index, fallbackImage, isOpen, onToggle }) {
  const image = (day.images && day.images.length > 0)
    ? day.images[0]
    : (fallbackImage || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]);

  const activities = day.activities?.filter(a => a?.trim()) || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-sm">
      {/* Header — clicável */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-[#1A1A1A]">
          Dia {day.day}: <span className="font-semibold">{day.title}</span>
        </span>
        <span className="flex-shrink-0 ml-3 text-[#6b9faf]">
          {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>

      {/* Conteúdo expandido */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-4">
              {/* Imagem de destaque */}
              <div className="rounded-xl overflow-hidden aspect-[16/7] bg-gray-100">
                <img
                  src={image}
                  alt={`Dia ${day.day}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Descrição */}
              {day.description && (
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {day.description}
                </p>
              )}

              {/* Toque da Intu */}
              {day.toque_intu && (
                <div className="flex items-start gap-2.5 bg-gradient-to-r from-[#bda94c]/10 to-[#bda94c]/5 border border-[#bda94c]/30 rounded-xl px-4 py-3">
                  <Star className="h-4 w-4 text-[#bda94c] flex-shrink-0 mt-0.5 fill-[#bda94c]" />
                  <div>
                    <span className="text-xs font-bold text-[#bda94c] uppercase tracking-wider">Toque da Intu</span>
                    <p className="text-sm text-gray-700 font-light mt-0.5">{day.toque_intu}</p>
                  </div>
                </div>
              )}

              {/* Atividades */}
              {activities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activities.map((activity, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
                      <MapPin className="h-3 w-3 text-[#bda94c]" />
                      {activity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ItinerarySection({ itinerary, fallbackImage }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!itinerary || itinerary.length === 0) return null;

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  // Dividir em 2 colunas
  const mid = Math.ceil(itinerary.length / 2);
  const left = itinerary.slice(0, mid);
  const right = itinerary.slice(mid);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-light text-[#1A1A1A] mb-6 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-[#bda94c]" />
        Roteiro Detalhado
      </h2>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-3">
          {left.map((day, i) => (
            <DayItem
              key={i}
              day={day}
              index={i}
              fallbackImage={fallbackImage}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-3">
          {right.map((day, i) => (
            <DayItem
              key={mid + i}
              day={day}
              index={mid + i}
              fallbackImage={fallbackImage}
              isOpen={openIndex === mid + i}
              onToggle={() => toggle(mid + i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
