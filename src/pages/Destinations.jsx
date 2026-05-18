import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DestinationCard from '@/components/home/DestinationCard';
import { Button } from "@/components/ui/button";

const countries = ["Todos", "India", "China", "Indonésia", "Vietnã", "Tailândia"];

export default function Destinations() {
  const [selectedCountry, setSelectedCountry] = useState("Todos");

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredDestinations = selectedCountry === "Todos"
    ? destinations
    : destinations.filter(d => d.country === selectedCountry);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/14363477/pexels-photo-14363477.jpeg"
          alt="Destinos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-end pb-14 px-6">
          <div className="max-w-7xl mx-auto w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[#bda94c] text-sm tracking-widest uppercase">
                Explore
              </span>
              <h1 className="text-4xl md:text-6xl font-light text-white mt-4 mb-6">
                Nossos <span className="italic">Destinos</span>
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto font-light">
                Cada roteiro foi pensado para proporcionar experiências únicas,
                com o conforto de um grupo pequeno e exclusivamente brasileiro.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 bg-white border-b sticky top-20 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {countries.map((country) => (
              <Button
                key={country}
                variant={selectedCountry === country ? "default" : "outline"}
                onClick={() => setSelectedCountry(country)}
                className={`rounded-full whitespace-nowrap ${selectedCountry === country
                  ? 'bg-[#1A1A1A] hover:bg-[#2D4A3E] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-[#1A1A1A]'
                  }`}
              >
                {country}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard key={destination.id} destination={destination} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {selectedCountry === "Todos"
                  ? "Nenhum destino cadastrado ainda."
                  : `Nenhum destino disponível para ${selectedCountry}.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}