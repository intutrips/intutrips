import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const IntuStar = ({ size = 18, color = '#bda94c' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={color} className="flex-shrink-0">
    <path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/>
  </svg>
);

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80",
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
];

function DayCarousel({ images, dayIndex, fallbackImage }) {
  const [current, setCurrent] = useState(0);
  const imgs = (images && images.length > 0)
    ? images
    : [fallbackImage || FALLBACK_IMAGES[dayIndex % FALLBACK_IMAGES.length]];

  const prev = () => setCurrent(i => (i - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent(i => (i + 1) % imgs.length);

  return (
    <div className="relative rounded-xl overflow-hidden h-52 bg-gray-100 w-full">
      <img src={imgs[current]} alt={`Foto ${current + 1}`} className="w-full h-full object-cover" />
      {imgs.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ItinerarySection({ itinerary, fallbackImage }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-light text-[#1A1A1A] mb-6 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-[#bda94c]" />
        Roteiro Detalhado
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {itinerary.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-4">
              {/* Conteúdo: badge + texto */}
              <div className="flex gap-4 items-start flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#bda94c]/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#bda94c]">{day.day}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{day.title}</h3>

                  {day.description && (
                    <p className="text-base text-gray-500 font-light mb-3 leading-relaxed">{day.description}</p>
                  )}

                  {day.toque_intu && (
                    <div className="mb-3 flex items-start gap-2.5 bg-gradient-to-r from-[#bda94c]/10 to-[#bda94c]/5 border border-[#bda94c]/30 rounded-xl px-4 py-3">
                      <IntuStar size={18} color="#bda94c" />
                      <div>
                        <span className="text-sm font-bold text-[#bda94c] uppercase tracking-wider">Toque da Intu</span>
                        <p className="text-base text-gray-700 font-light mt-0.5">{day.toque_intu}</p>
                      </div>
                    </div>
                  )}

                  {day.activities && day.activities.filter(a => a?.trim()).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {day.activities.filter(a => a?.trim()).map((activity, actIndex) => (
                        <span key={actIndex} className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-50 rounded-full px-3 py-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#bda94c]" />
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Imagem: largura total no mobile, fixa no desktop */}
              <div className="w-full md:w-64 flex-shrink-0">
                <DayCarousel images={day.images} dayIndex={index} fallbackImage={fallbackImage} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
