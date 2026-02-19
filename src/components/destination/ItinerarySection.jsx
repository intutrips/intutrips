import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Check } from 'lucide-react';

export default function ItinerarySection({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-light text-[#1A1A1A] mb-8 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-[#C9A962]" />
        Roteiro Detalhado
      </h2>
      
      <div className="space-y-6">
        {itinerary.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-[#C9A962]/10 flex items-center justify-center">
                  <span className="text-2xl font-light text-[#C9A962]">
                    {day.day}
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#1A1A1A] mb-2">
                  {day.title}
                </h3>
                <p className="text-gray-600 font-light mb-4 leading-relaxed">
                  {day.description}
                </p>
                
                {day.activities && day.activities.length > 0 && (
                  <div className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-[#C9A962] mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}