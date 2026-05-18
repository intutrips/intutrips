import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

function TestimonialCard({ testimonial }) {
  const initials = testimonial.client_name
    ? testimonial.client_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="bg-white rounded-2xl border border-[#6b9faf]/20 p-7 flex flex-col gap-4 h-full">
      {/* Header: foto + nome + estrelas */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#92314D] to-[#6b9faf]">
          {testimonial.photo_url ? (
            <img
              src={testimonial.photo_url}
              alt={testimonial.client_name}
              className="w-full h-full object-cover"
            />
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

      {/* Texto */}
      <p className="text-gray-600 font-light text-sm leading-relaxed flex-1">
        {testimonial.content}
      </p>
    </div>
  );
}

const CARDS_PER_PAGE = 3;

export default function Testimonial() {
  const [page, setPage] = useState(0);

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

  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);
  const visible = testimonials.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => setPage(p => (p + 1) % totalPages), 7000);
    return () => clearInterval(timer);
  }, [totalPages]);

  if (isLoading || testimonials.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2.5 text-[#6b9faf] text-sm tracking-widest uppercase">
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#6b9faf"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
            Depoimentos
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#6b9faf"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A] mt-3">
            A opinião de quem <span className="italic text-[#6b9faf]">já viajou com a gente</span>
          </h2>
        </div>

        <div className="relative">
          {/* Seta esquerda */}
          {totalPages > 1 && (
            <button
              onClick={() => setPage(p => (p - 1 + totalPages) % totalPages)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {visible.map((t, i) => (
                <TestimonialCard key={t.id || i} testimonial={t} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Seta direita */}
          {totalPages > 1 && (
            <button
              onClick={() => setPage(p => (p + 1) % totalPages)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === page ? 'bg-[#6b9faf] w-6' : 'bg-[#6b9faf]/30 w-2 hover:bg-[#6b9faf]/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
