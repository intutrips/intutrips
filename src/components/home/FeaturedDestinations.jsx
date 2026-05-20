import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import DestinationCard from './DestinationCard';
import { useSiteTexts } from '@/hooks/useSiteTexts';

export default function FeaturedDestinations({ destinations, isLoading }) {
  const { texts } = useSiteTexts();
  return (
    <section className="py-24 px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <span className="inline-flex items-center gap-2.5 text-[#bda94c] text-sm tracking-widest uppercase">
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#bda94c"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
            {texts.home_destinations_tag || 'Nossos Destinos'}
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#bda94c"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#1A1A1A] mt-4 mb-6">
            {texts.home_destinations_title || 'Explore a Ásia conosco'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light">
            {texts.home_destinations_desc || 'Cada roteiro é cuidadosamente planejado e testado pessoalmente para oferecer experiências autênticas, com o conforto de viajar em um grupo pequeno de brasileiros.'}
          </p>
        </motion.div>

        {/* Destinations Grid */}
        {isLoading ?
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) =>
              <div key={i} className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse" />
            )}
          </div> :
          destinations.length > 0 ?
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.slice(0, 6).map((destination, index) =>
                <DestinationCard key={destination.id} destination={destination} index={index} />
              )}
            </div> :

            <div className="text-center py-16">
              <p className="text-gray-500">Destinos em breve...</p>
            </div>
        }

        {/* CTA */}
        {destinations.length > 6 &&
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12">

            <Link to={createPageUrl('Destinos')}>
              <Button
                variant="outline"
                className="border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full px-8">

                Ver Todos os Destinos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        }
      </div>
    </section>);

}