import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MapPin, Check, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ContactSection from '@/components/home/ContactSection';
import ItinerarySection from '@/components/destination/ItinerarySection';
import InclusionsSection from '@/components/destination/InclusionsSection';
import PaymentSection from '@/components/destination/PaymentSection';
import ContactCTA from '@/components/destination/ContactCTA';
import GallerySection from '@/components/destination/GallerySection';
import HotelsSection from '@/components/destination/HotelsSection';
import TripDaysSection from '@/components/destination/TripDaysSection';

const countryImages = {
  "India": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
  "China": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80",
  "Indonésia": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
  "Vietnã": "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1920&q=80",
  "Tailândia": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80"
};

export default function DestinationDetail() {
  const [searchParams] = useSearchParams();
  const destinationId = searchParams.get('id');

  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', destinationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', destinationId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!destinationId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A962]" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-800 mb-4">Destino não encontrado</h1>
          <Link to={createPageUrl('Destinations')}>
            <Button className="bg-[#1A1A1A] hover:bg-[#2D4A3E]">
              Ver todos os destinos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = destination.image_url || countryImages[destination.country] || countryImages["Tailândia"];

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
          to={createPageUrl('Destinations')}
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
                <span className="inline-block px-4 py-2 bg-[#00634D] text-white text-sm tracking-wider uppercase rounded-full">
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
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* 1. Introdução */}
                <section className="mb-16">
                  <h2 className="text-2xl font-light text-[#1A1A1A] mb-6">
                    Sobre esta viagem
                  </h2>
                  <p className="text-gray-600 font-light leading-relaxed text-lg">
                    {destination.description}
                  </p>
                </section>

                {/* 2. Highlights */}
                {destination.highlights && destination.highlights.length > 0 && (
                  <section className="mb-16">
                    <h2 className="text-2xl font-light text-[#1A1A1A] mb-8">
                      Destaques da viagem
                    </h2>
                    <div className="grid gap-6">
                      {destination.highlights.map((highlight, index) => {
                        const isStringFormat = typeof highlight === 'string';
                        const title = isStringFormat ? highlight : highlight.title;
                        const imageUrl = isStringFormat ? null : highlight.image_url;

                        return (
                          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="grid md:grid-cols-2 gap-0">
                              {imageUrl && (
                                <div className="aspect-[4/3] md:aspect-auto">
                                  <img
                                    src={imageUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className={`p-6 flex items-center ${!imageUrl ? 'md:col-span-2' : ''}`}>
                                <div className="flex items-start gap-4 w-full">
                                  <div className="w-8 h-8 rounded-full bg-[#C9A962]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-[#C9A962]" />
                                  </div>
                                  <span className="text-gray-700 text-lg font-light">{title}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 3. Início e Fim da Viagem */}
                <TripDaysSection
                  tripStartInfo={destination.trip_start_info}
                  tripEndInfo={destination.trip_end_info}
                />

                {/* 5. Exemplos de Hotéis */}
                <HotelsSection hotels={destination.hotels} />

                {/* 6. Roteiro Detalhado */}
                <ItinerarySection itinerary={destination.itinerary} />

                {/* 7. Inclusões e Exclusões */}
                <InclusionsSection
                  inclusions={destination.inclusions}
                  exclusions={destination.exclusions}
                />

                {/* 8. Valores e Pagamento */}
                <PaymentSection
                  price_from={destination.price_from}
                  payment_options={destination.payment_options}
                />

                {/* 9. Contato */}
                <ContactCTA />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 sticky top-28"
              >
                {destination.price_from && (
                  <div className="mb-6">
                    <span className="text-sm text-gray-500">A partir de</span>
                    <div className="text-3xl font-light text-[#1A1A1A]">
                      USD {destination.price_from.toLocaleString('en-US')}
                    </div>
                    <span className="text-sm text-gray-500">por pessoa</span>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-[#C9A962]" />
                    <span>{destination.country}</span>
                  </div>
                  {destination.duration && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="h-5 w-5 text-[#C9A962]" />
                      <span>{destination.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="h-5 w-5 text-[#C9A962]" />
                    <span>{destination.group_size || "6-12 pessoas"}</span>
                  </div>
                </div>

                <a href="#contato">
                  <Button className="w-full bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white rounded-full h-12">
                    Quero Participar
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}