import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

function TestimonialCard({ testimonial, index }) {
  const initials = testimonial.client_name
    ? testimonial.client_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#FAF8F5] rounded-2xl border border-[#6b9faf]/15 p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-[#92314D] to-[#6b9faf] flex items-center justify-center overflow-hidden">
          {testimonial.photo_url ? (
            <img src={testimonial.photo_url} alt={testimonial.client_name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-semibold text-sm">{initials}</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-[#1A1A1A] text-sm">{testimonial.client_name}</p>
          {testimonial.trip_info && (
            <p className="text-xs text-gray-400 mt-0.5">{testimonial.trip_info}</p>
          )}
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="h-3 w-3 fill-[#bda94c] text-[#bda94c]" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 font-light text-sm leading-relaxed flex-1">
        "{testimonial.content}"
      </p>
    </motion.div>
  );
}

export default function IndiaReviewsSection({ destinationId }) {
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

  if (testimonials.length === 0) return null;

  return (
    <section className="mb-16">

      {/* Título */}
      <div className="mb-8">
        <h2 className="text-2xl font-light text-[#1A1A1A]">
          Quem já viajou com a gente para a Índia
        </h2>
        <p className="text-gray-500 font-light text-sm mt-1">
          Experiências reais de quem viveu essa viagem
        </p>
      </div>

      {/* Vídeo da Michelle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 rounded-2xl overflow-hidden shadow-md bg-black"
        style={{ maxWidth: 560 }}
      >
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src="https://www.youtube.com/embed/7w3Xrs9eSw4"
            title="Depoimento Michelle — Expedição Índia"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <p className="text-sm font-medium text-[#1A1A1A]">Michelle</p>
          <p className="text-xs text-gray-400">Expedição Índia · Intu Trips</p>
        </div>
      </motion.div>

      {/* Cards de texto */}
      <div className="grid sm:grid-cols-2 gap-4">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} index={i} />
        ))}
      </div>

    </section>
  );
}
