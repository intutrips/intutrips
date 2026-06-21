import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

function TestimonialCard({ testimonial }) {
  const initials = testimonial.client_name
    ? testimonial.client_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="bg-white rounded-2xl border border-[#6b9faf]/20 p-7 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#92314D] to-[#6b9faf]">
          {testimonial.photo_url ? (
            <img src={testimonial.photo_url} alt={testimonial.client_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{initials}</span>
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-[#1A1A1A] text-sm">{testimonial.client_name}</p>
          {testimonial.trip_info && (
            <p className="text-xs text-gray-400 mt-0.5">{testimonial.trip_info}</p>
          )}
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#6b9faf] text-[#6b9faf]" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 font-light text-sm leading-relaxed flex-1">
        {testimonial.content}
      </p>
    </div>
  );
}

export default function Testimonial() {
  const [offset, setOffset] = useState(0);
  const intervalRef = useRef(null);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const n = testimonials.length;

  const resetAutoPlay = () => {
    clearInterval(intervalRef.current);
    if (n > 1) {
      intervalRef.current = setInterval(() => {
        setOffset(o => (o + 1) % n);
      }, 5500);
    }
  };

  useEffect(() => {
    resetAutoPlay();
    return () => clearInterval(intervalRef.current);
  }, [n]);

  const navigate = (dir) => {
    setOffset(o => (o + dir + n) % n);
    resetAutoPlay();
  };

  if (isLoading || n === 0) return null;

  // Cada card recebe uma posição relativa ao offset: -2, -1, 0, 1, 2
  // Normaliza para o range mais curto (wrap-around)
  const getRelPos = (i) => {
    let rel = i - offset;
    if (rel > n / 2) rel -= n;
    if (rel < -n / 2) rel += n;
    return rel;
  };

  // Propriedades visuais por posição relativa
  const cardProps = (relPos) => {
    if (relPos === 0) return {
      x: '0%', scale: 1, opacity: 1,
      filter: 'blur(0px)', zIndex: 10, cursor: 'default',
    };
    if (Math.abs(relPos) === 1) return {
      x: `${relPos * 57}%`, scale: 0.78, opacity: 0.45,
      filter: 'blur(2px)', zIndex: 5, cursor: 'pointer',
    };
    return {
      x: `${relPos * 90}%`, scale: 0.65, opacity: 0,
      filter: 'blur(4px)', zIndex: 1, cursor: 'default',
    };
  };

  return (
    <section className="py-20 px-6 bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto">

        {/* Título */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2.5 text-[#6b9faf] text-sm tracking-widest uppercase">
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#6b9faf"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
            Depoimentos
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#6b9faf"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A] mt-3">
            A opinião de quem <span className="italic text-[#6b9faf]">já viajou com a gente</span>
          </h2>
        </div>

        {/* Carrossel com foco */}
        <div className="relative flex items-center justify-center" style={{ height: 320 }}>
          {testimonials.map((t, i) => {
            const rel = getRelPos(i);
            const props = cardProps(rel);
            const isHidden = Math.abs(rel) >= 2;

            return (
              <motion.div
                key={t.id || i}
                animate={{
                  x: props.x,
                  scale: props.scale,
                  opacity: props.opacity,
                  filter: props.filter,
                  zIndex: props.zIndex,
                }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => {
                  if (rel === -1) navigate(-1);
                  if (rel === 1) navigate(1);
                }}
                className="absolute"
                style={{
                  width: '52%',
                  cursor: props.cursor,
                  pointerEvents: isHidden ? 'none' : 'auto',
                }}
              >
                <TestimonialCard testimonial={t} />
              </motion.div>
            );
          })}
        </div>

        {/* Indicador sutil: linha de progresso */}
        {n > 1 && (
          <div className="flex justify-center gap-1.5 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setOffset(i); resetAutoPlay(); }}
                className={`h-1 rounded-full transition-all duration-400 ${
                  i === offset ? 'bg-[#6b9faf] w-8' : 'bg-[#6b9faf]/25 w-4'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
