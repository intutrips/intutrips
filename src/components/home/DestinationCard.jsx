import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/utils';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const countryImages = {
  "India": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "China": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
  "Indonésia": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  "Vietnã": "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&q=80",
  "Tailândia": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80"
};

export default function DestinationCard({ destination, index }) {
  const imageUrl = destination.image_url || countryImages[destination.country] || countryImages["Tailândia"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`${createPageUrl('DestinationDetail')}?id=${destination.id}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#1A1A1A]">
          {/* Availability Badge */}
          {destination.availability_status === 'sold_out' && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-red-500 text-white text-xs font-medium uppercase rounded-full">
              Esgotado
            </div>
          )}
          {destination.availability_status === 'few_spots' && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium uppercase rounded-full">
              Últimas Vagas
            </div>
          )}

          {/* Image */}
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-[#C9A962]/90 text-white text-xs tracking-wider uppercase rounded-full mb-3">
              {destination.country}
            </span>

            <h3 className="text-2xl font-light text-white mb-2 group-hover:text-[#C9A962] transition-colors">
              {destination.name}
            </h3>

            <p className="text-white/70 text-sm line-clamp-2 mb-4">
              {destination.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2 text-xs text-white/60">
                <div className="flex items-center gap-4">
                  {destination.duration && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {destination.duration}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {destination.group_size || "6-12 pessoas"}
                  </span>
                </div>
                {destination.departure_start_date && destination.departure_end_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Datas: {format(new Date(destination.departure_start_date), "dd/MM")} - {format(new Date(destination.departure_end_date), "dd/MM/yyyy")}
                  </span>
                )}
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#C9A962] transition-all duration-300">
                <ArrowUpRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Price Badge */}
          {destination.price_from && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg">
              <span className="text-xs text-gray-500">a partir de</span>
              <div className="text-lg font-medium text-[#1A1A1A]">
                USD {formatCurrency(destination.price_from)}

              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}