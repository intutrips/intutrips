import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

function DayCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <div className="relative mt-5 rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
      <img
        src={images[current]}
        alt={`Foto ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ItinerarySection({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-light text-[#1A1A1A] mb-8 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-[#bda94c]" />
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
                <div className="w-16 h-16 rounded-xl bg-[#bda94c]/10 flex items-center justify-center">
                  <span className="text-2xl font-light text-[#bda94c]">
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
                        <MapPin className="h-4 w-4 text-[#bda94c] mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                )}

                <DayCarousel images={day.images} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}