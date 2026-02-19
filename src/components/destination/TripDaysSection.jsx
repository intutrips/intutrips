import React from 'react';
import { motion } from 'framer-motion';
import { Plane, MapPin, Clock } from 'lucide-react';

export default function TripDaysSection({ tripStartInfo, tripEndInfo }) {
  if (!tripStartInfo && !tripEndInfo) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <h2 className="text-2xl font-light text-[#3C3333]">
          Início e <span className="text-[#00634D] italic">Fim da Viagem</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tripStartInfo && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#00634D]/10 flex items-center justify-center">
                <Plane className="h-6 w-6 text-[#00634D]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#3C3333]">Primeiro Dia</h3>
                <p className="text-sm text-gray-500">{tripStartInfo.title}</p>
              </div>
            </div>
            <p className="text-gray-600 font-light mb-4 leading-relaxed">
              {tripStartInfo.description}
            </p>
            <div className="space-y-2">
              {tripStartInfo.meeting_point && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#00634D] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{tripStartInfo.meeting_point}</span>
                </div>
              )}
              {tripStartInfo.time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[#00634D] flex-shrink-0" />
                  <span className="text-gray-600">{tripStartInfo.time}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tripEndInfo && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#54234B]/10 flex items-center justify-center">
                <Plane className="h-6 w-6 text-[#54234B] rotate-90" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#3C3333]">Último Dia</h3>
                <p className="text-sm text-gray-500">{tripEndInfo.title}</p>
              </div>
            </div>
            <p className="text-gray-600 font-light mb-4 leading-relaxed">
              {tripEndInfo.description}
            </p>
            <div className="space-y-2">
              {tripEndInfo.departure_point && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#54234B] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{tripEndInfo.departure_point}</span>
                </div>
              )}
              {tripEndInfo.time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-[#54234B] flex-shrink-0" />
                  <span className="text-gray-600">{tripEndInfo.time}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}