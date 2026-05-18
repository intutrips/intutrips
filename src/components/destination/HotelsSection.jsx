import React, { useState } from 'react';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HotelsSection({ hotels }) {
  const [current, setCurrent] = useState(0);

  if (!hotels || hotels.length === 0) return null;

  const prev = () => setCurrent(i => (i - 1 + hotels.length) % hotels.length);
  const next = () => setCurrent(i => (i + 1) % hotels.length);

  const hotel = hotels[current];
  const isString = typeof hotel === 'string';
  const name = isString ? hotel : hotel.name;
  const imageUrl = isString ? null : (hotel.image || hotel.image_url);
  const rating = isString ? 0 : (hotel.rating || hotel.stars || 0);
  const location = isString ? null : hotel.location;
  const description = isString ? null : hotel.description;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <h2 className="text-2xl font-light text-[#3C3333]">
          Estadias <span className="text-[#6b9faf] italic">Selecionadas</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
        {/* Image */}
        <div className="aspect-[16/7] bg-gray-100 overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 font-light text-sm">Sem imagem</span>
            </div>
          )}

          {/* Navigation arrows over image */}
          {hotels.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Counter */}
          {hotels.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {current + 1} / {hotels.length}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="text-lg font-semibold text-[#3C3333]">{name}</h3>
              {rating > 0 && (
                <div className="flex items-center gap-0.5">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#6b9faf] text-[#6b9faf]" />
                  ))}
                </div>
              )}
            </div>
            {location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                <MapPin className="h-3.5 w-3.5" />
                <span>{location}</span>
              </div>
            )}
            {description && (
              <p className="text-sm text-gray-600 font-light leading-relaxed">{description}</p>
            )}
          </div>

          {/* Dots */}
          {hotels.length > 1 && (
            <div className="flex sm:flex-col gap-1.5 items-center justify-center flex-shrink-0 sm:pt-1">
              {hotels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'bg-[#6b9faf] w-2 h-2' : 'bg-gray-300 w-1.5 h-1.5'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
