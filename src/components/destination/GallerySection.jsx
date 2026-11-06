import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

export default function GallerySection({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const validImages = (images || []).filter(url => typeof url === 'string' && url.trim());
  if (validImages.length === 0) return null;

  const openLightbox  = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i - 1 + validImages.length) % validImages.length);
  const next = () => setLightboxIndex(i => (i + 1) % validImages.length);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex]);

  // Grid layout: every 5th item spans 2 cols or 2 rows for visual rhythm
  const getSpan = (i) => {
    if (validImages.length <= 2) return '';
    if (i % 7 === 0) return 'col-span-2';
    if (i % 7 === 3) return 'row-span-2';
    return '';
  };

  return (
    <section className="mb-16">
      {/* Cabeçalho da seção */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Images className="h-6 w-6 text-[#bda94c]" />
          <h2 className="text-2xl font-light text-[#1A1A1A]">
            Fotos de <span className="text-[#bda94c] italic">quem já foi</span>
          </h2>
        </div>
        <p className="text-gray-500 text-sm font-light max-w-xl">
          Essas fotos foram tiradas nas nossas expedições. A viagem é real — clique em qualquer imagem para ver em tela cheia.
        </p>
      </div>

      {/* Grade assimétrica */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: '160px',
        }}
      >
        {validImages.map((url, i) => {
          const span = getSpan(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${span}`}
              onClick={() => openLightbox(i)}
            >
              <img
                src={url}
                alt={`Expedição — foto ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </motion.div>
          );
        })}
      </div>

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
            {/* Fechar */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Anterior */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Imagem */}
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

            {/* Próxima */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Contador */}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
              {lightboxIndex + 1} / {validImages.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
