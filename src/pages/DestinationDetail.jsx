import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin, Check, ArrowLeft, Leaf, Sparkles, Palette, Landmark, Moon, Heart, Globe } from 'lucide-react';

const PROFILE_TAG_ICONS = {
  'Natureza':          Leaf,
  'Espiritualidade':   Sparkles,
  'Cultura':           Palette,
  'História':          Landmark,
  'Vida Noturna':      Moon,
  'Reconexão Pessoal': Heart,
  'Imersão Cultural':  Globe,
};
import { Button } from "@/components/ui/button";
import { Link, useParams } from 'react-router-dom';
import { createPageUrl, generateSlug } from '@/utils';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ContactSection from '@/components/home/ContactSection';
import ItinerarySection from '@/components/destination/ItinerarySection';
import InclusionsSection from '@/components/destination/InclusionsSection';
import PaymentSection from '@/components/destination/PaymentSection';
import GallerySection from '@/components/destination/GallerySection';
import HotelsSection from '@/components/destination/HotelsSection';
import TripDaysSection from '@/components/destination/TripDaysSection';
import TestimonialsSection from '@/components/destination/TestimonialsSection';
import WaitlistSection from '@/components/destination/WaitlistSection';
import FAQSection from '@/components/destination/FAQSection';

const countryImages = {
  "India": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
  "China": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80",
  "Indonésia": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
  "Vietnã": "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=80",
  "Tailândia": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80"
};

export default function DestinationDetail() {
  const { slug } = useParams();

  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', slug],
    queryFn: async () => {
      // Baixa todos porque é rápido e compara em memória pra encontrar o certo através do slug ou id
      const { data, error } = await supabase.from('destinations').select('*');
      if (error) throw error;

      const found = data.find(d => {
        const destSlug = d.slug || (d.country ? generateSlug(d.country) : d.id);
        return destSlug === slug || d.id === slug;
      });

      if (!found) throw new Error("Destination not found");
      return found;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bda94c]" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">Destino não encontrado</h1>
          <Link to={createPageUrl('Destinos')}>
            <Button className="bg-[#1A1A1A] hover:bg-[#2D4A3E]">
              Ver todos os destinos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = destination.image_url || countryImages[destination.country] || countryImages["Tailândia"];

  const whatsappUrls = {
    'Tailândia': 'https://wa.me/551151233225?text=Ola,%20vi%20a%20viagem%20da%20Tailandia%20no%20seu%20site%20e%20me%20interessei.%20Gostaria%20de%20mais%20informacoes.',
    'India': 'https://wa.me/551151233225?text=Ola,%20vi%20a%20viagem%20da%20India%20no%20seu%20site%20e%20me%20interessei.%20Gostaria%20de%20mais%20informacoes.',
    'China': 'https://wa.me/551151233225?text=Ola,%20vi%20a%20viagem%20da%20China%20no%20seu%20site%20e%20me%20interessei.%20Gostaria%20de%20mais%20informacoes.',
  };
  const whatsappUrl = whatsappUrls[destination.country] || `https://wa.me/551151233225?text=Ola,%20vi%20a%20viagem%20${encodeURIComponent(destination.name)}%20no%20seu%20site%20e%20me%20interessei.%20Gostaria%20de%20mais%20informacoes.`;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px]">
        <img
          src={imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back Button */}
        <Link
          to={createPageUrl('Destinos')}
          className="absolute top-28 left-6 md:left-12 z-10"
        >
          <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#6b9faf] text-white text-sm tracking-wider uppercase rounded-full">
                  <img src="/brand/star-4pt-cream.png" alt="" className="w-3 h-3 opacity-80" />
                  {destination.country}
                </span>
                {destination.availability_status === 'sold_out' && (
                  <span className="inline-block px-4 py-2 bg-red-500 text-white text-sm tracking-wider uppercase rounded-full">
                    Esgotado
                  </span>
                )}
                {destination.availability_status === 'few_spots' && (
                  <span className="inline-block px-4 py-2 bg-orange-500 text-white text-sm tracking-wider uppercase rounded-full">
                    Últimas Vagas
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
                {destination.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80">
                {destination.duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {destination.duration}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {destination.group_size || "6-12 pessoas"}
                </span>
                {destination.departure_start_date && destination.departure_end_date && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Datas: {format(new Date(destination.departure_start_date), "dd/MM")} - {format(new Date(destination.departure_end_date), "dd/MM/yyyy")}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Descrição + CTA lado a lado */}
            <section className="mb-12 grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-light text-[#1A1A1A] mb-4">Sobre esta viagem</h2>
                <p className="text-gray-600 font-light leading-relaxed text-lg">
                  {destination.description}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white rounded-full h-12">
                    Quero Participar
                  </Button>
                </a>
                <p className="text-xs text-gray-400 text-center font-light">Vagas limitadas — garanta a sua</p>
              </div>
            </section>

            {/* Highlights — chips horizontais compactos */}
            {destination.highlights && destination.highlights.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-light text-[#1A1A1A] mb-5">Destaques da viagem</h2>
                <div className="flex flex-wrap gap-3">
                  {destination.highlights.map((highlight, index) => {
                    const title = typeof highlight === 'string' ? highlight : highlight.title;
                    return (
                      <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm text-gray-700 font-light">
                        <Check className="h-4 w-4 text-[#bda94c] flex-shrink-0" />
                        {title}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Perfil da Viagem */}
            {destination.profile_tags && destination.profile_tags.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-light text-[#1A1A1A] mb-5">Perfil da viagem</h2>
                <div className="flex flex-wrap gap-3">
                  {destination.profile_tags.map((tag, index) => {
                    const Icon = PROFILE_TAG_ICONS[tag];
                    return (
                      <div key={index} className="flex items-center gap-2.5 px-5 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                        {Icon && <Icon className="h-5 w-5 text-[#6b9faf] flex-shrink-0" />}
                        <span className="text-sm font-medium text-[#3C3333]">{tag}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Galeria compacta */}
            <GallerySection images={destination.images} />

            {/* Início e Fim da Viagem */}
            <TripDaysSection
              tripStartInfo={destination.first_day_info}
              tripEndInfo={destination.last_day_info}
              startDate={destination.departure_start_date}
              endDate={destination.departure_end_date}
            />

            {/* Roteiro com fotos */}
            <ItinerarySection
              itinerary={destination.itinerary}
              fallbackImage={imageUrl}
            />

            {/* Hotéis */}
            <HotelsSection hotels={destination.hotels} />

            {/* Inclusões e Exclusões */}
            <InclusionsSection
              inclusions={destination.inclusions}
              exclusions={destination.exclusions}
            />

            {/* Valores e Pagamento */}
            <PaymentSection
              price_from={destination.price_from}
              price_lote2={destination.price_lote2}
              pricing_lots={destination.pricing_lots}
              payment_options={destination.payment_options}
              whatsappUrl={whatsappUrl}
            />

            {/* Lista de Espera */}
            {destination.show_waitlist && (
              <WaitlistSection
                destinationName={destination.name}
                country={destination.country}
              />
            )}

            {/* Perguntas Frequentes */}
            <FAQSection country={destination.country} extraFaqs={destination.extra_faqs || []} />

            {/* Depoimentos em vídeo */}
            {destination.show_testimonials && (
              <TestimonialsSection testimonials={destination.testimonial_videos} />
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
}