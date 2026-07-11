import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function IndiaReviewsSection({ destinationId }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-india', destinationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .or(`destination_id.eq.${destinationId},trip_info.ilike.%ndia%`)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!destinationId,
  });

  const n = testimonials.length;

  const go = (dir) => {
    setDirection(dir);
    setCurrent(c => (c + dir + n) % n);
    resetTimer();
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    if (n > 1) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrent(c => (c + 1) % n);
      }, 5000);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [n]);

  if (n === 0) return null;

  const t = testimonials[current];
  const initials = t.client_name
    ? t.client_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <section className="mb-16">

      <div className="mb-8">
        <h2 className="text-2xl font-light text-[#1A1A1A]">
          Quem já viajou com a gente para a Índia
        </h2>
        <p className="text-gray-500 font-light text-sm mt-1">
          Experiências reais de quem viveu essa viagem
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">

        {/* Vídeo vertical 9:16 */}
        <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-md bg-black" style={{ width: 260 }}>
          <div className="relative" style={{ paddingBottom: '177.78%' }}>
            <iframe
              src="https://www.youtube.com/embed/7w3Xrs9eSw4?modestbranding=1&rel=0"
              title="Depoimento Michelle — Expedição Índia"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
            {/* Gradiente para cobrir branding do YouTube no topo */}
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '22%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          </div>
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <p className="text-sm font-medium text-[#1A1A1A]">Michelle</p>
            <p className="text-xs text-gray-400">Expedição Índia · Intu Trips</p>
          </div>
        </div>

        {/* Slideshow de reviews — compacto como a homepage */}
        <div className="flex-1 flex flex-col gap-4">

          <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white rounded-2xl border border-[#6b9faf]/20 p-7 flex flex-col gap-4"
              >
                {/* Cabeçalho: foto + nome + estrelas */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#92314D] to-[#6b9faf]">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.client_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{initials}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A1A] text-sm">{t.client_name}</p>
                    {t.trip_info && (
                      <p className="text-xs text-gray-400 mt-0.5">{t.trip_info}</p>
                    )}
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#6b9faf] text-[#6b9faf]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Texto */}
                <p className="text-gray-600 font-light text-sm leading-relaxed">
                  {t.content}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navegação */}
          {n > 1 && (
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); resetTimer(); }}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-[#6b9faf] w-6' : 'bg-[#6b9faf]/25 w-3'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => go(1)}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
