import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

export default function GallerySection({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const trackRef = useRef(null);
  const startX = useRef(null);

  const validImages = (images || []).filter(url => typeof url === 'string' && url.trim());
  if (validImages.length === 0) return null;

  const VISIBLE = 3;
  const maxIndex = Math.max(0, validImages.length - VISIBLE);

  const prevCarousel = () => setCarouselIndex(i => Math.max(0, i - 1));
  const nextCarousel = () => setCarouselIndex(i => Math.min(maxIndex, i + 1));

  const openLightbox  = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox  = () => setLightboxIndex(i => (i - 1 + validImages.length) % validImages.length);
  const nextLightbox  = () => setLightboxIndex(i => (i + 1) % validImages.length);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex]);

  // Touch/swipe support
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 40)  nextCarousel();
    if (diff < -40) prevCarousel();
    startX.current = null;
  };

  return (
    <section className="mb-16">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Images className="h-6 w-6 text-[#bda94c]" />
            <h2 className="text-2xl font-light text-[#1A1A1A]">
              Fotos de <span className="text-[#bda94c] italic">quem já foi</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm font-light max-w-xl">
            Essas fotos foram tiradas nas nossas expedições. Clique em qualquer imagem para ver em tela cheia.
          </p>
        </div>
        {/* Controles desktop */}
        {validImages.length > VISIBLE && (
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              onClick={prevCarousel}
              disabled={carouselIndex === 0}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#bda94c] hover:text-[#bda94c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-gray-400 tabular-nums">
              {carouselIndex + 1} – {Math.min(carouselIndex + VISIBLE, validImages.length)} / {validImages.length}
            </span>
            <button
              onClick={nextCarousel}
              disabled={carouselIndex >= maxIndex}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#bda94c] hover:text-[#bda94c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carrossel */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-3"
          animate={{ x: `calc(-${carouselIndex} * (100% / ${VISIBLE} + 4px))` }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        >
          {validImages.map((url, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 cursor-pointer group overflow-hidden rounded-2xl"
              style={{ width: `calc((100% - ${(VISIBLE - 1) * 12}px) / ${VISIBLE})` }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.2) }}
              onClick={() => openLightbox(i)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={url}
                  alt={`Expedição — foto ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 rounded-2xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots indicadores (mobile) */}
      {validImages.length > VISIBLE && (
        <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === carouselIndex ? 'bg-[#bda94c]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={validImages[lightboxIndex]}
              alt={`Foto ${lightboxIndex + 1} de ${validImages.length}`}
              className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIndex + 1} / {validImages.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
