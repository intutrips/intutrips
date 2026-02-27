import React from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TripDaysSection({ tripStartInfo, tripEndInfo, startDate, endDate }) {
  if (!tripStartInfo && !tripEndInfo) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <h2 className="text-2xl font-light text-gray-500">
          Início e <span className="text-[#6b9faf] italic">Fim da Viagem</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card Primeiro Dia */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F3F1] flex items-center justify-center flex-shrink-0">
              <Plane className="h-7 w-7 text-[#6b9faf]" />
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-medium text-[#1A1A1A]">Primeiro Dia</h3>
              <p className="text-gray-500">{formatDate(startDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mt-auto">
            <MapPin className="h-5 w-5 text-[#bda94c]" />
            <span className="font-light">{tripStartInfo?.title || 'Destino'}</span>
          </div>
        </motion.div>

        {/* Card Último Dia */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-50 flex flex-col gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F3E8EF] flex items-center justify-center flex-shrink-0">
              <Plane className="h-7 w-7 text-[#92314D] -rotate-45" />
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-medium text-[#1A1A1A]">Último Dia</h3>
              <p className="text-gray-500">{formatDate(endDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mt-auto">
            <MapPin className="h-5 w-5 text-[#bda94c]" />
            <span className="font-light">{tripEndInfo?.title || 'Destino'}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}