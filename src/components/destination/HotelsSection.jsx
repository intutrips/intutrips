import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';

export default function HotelsSection({ hotels }) {
  if (!hotels || hotels.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <h2 className="text-2xl font-light text-[#3C3333]">
          Exemplos de <span className="text-[#00634D] italic">Acomodação</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={hotel.image_url}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-[#3C3333]">
                  {hotel.name}
                </h3>
                {hotel.stars && (
                  <div className="flex items-center gap-1">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-[#00634D] text-[#00634D]" />
                    ))}
                  </div>
                )}
              </div>
              {hotel.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="h-3 w-3" />
                  <span>{hotel.location}</span>
                </div>
              )}
              {hotel.description && (
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {hotel.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-sm text-gray-500 text-center mt-6 font-light italic">
        * Os hotéis são exemplos de acomodações similares que podem ser utilizadas. 
        A acomodação final pode variar de acordo com disponibilidade.
      </p>
    </section>
  );
}