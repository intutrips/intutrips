import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteTexts } from '@/hooks/useSiteTexts';

export default function Hero() {
  const { texts } = useSiteTexts();

  // Campos dinâmicos com fallbacks
  const tagline = texts.home_hero_tagline || 'Viagens em Grupo pela Ásia';
  const headline = texts.home_hero_headline || 'Não somos uma agência,';
  const subheadline = texts.home_hero_subheadline || 'somos pontes';
  const supportText = texts.home_hero_support_text || 'Onde viajar por conta vira barreira, a gente vira apoio.';

  const btn1Label = texts.home_hero_btn1_label || 'Explorar Destinos';
  const btn1Link = texts.home_hero_btn1_link || '/destinos';
  const btn2Label = texts.home_hero_btn2_label || 'Conheça Nossa História';
  const btn2Link = texts.home_hero_btn2_link || '/quem-somos';

  const bgImage = texts.home_hero_bg_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
  const overlayOpacity = parseInt(texts.home_hero_overlay_opacity || '60', 10);
  const overlayValue = Math.min(100, Math.max(0, overlayOpacity)) / 100;

  const stat1Value = texts.home_hero_stat1_value || '5';
  const stat1Label = texts.home_hero_stat1_label || 'Destinos';
  const stat2Value = texts.home_hero_stat2_value || '6–12';
  const stat2Label = texts.home_hero_stat2_label || 'Viajantes';
  const stat3Value = texts.home_hero_stat3_value || '100%';
  const stat3Label = texts.home_hero_stat3_label || 'Brasileiros';

  const stats = [
    { icon: MapPin, value: stat1Value, label: stat1Label },
    { icon: Users, value: stat2Value, label: stat2Label },
    { icon: Heart, value: stat3Value, label: stat3Label },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image dinâmico */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Overlay com opacidade dinâmica */}
        <div
          className="absolute inset-0 bg-gradient-to-b"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,${overlayValue * 0.85}) 0%, rgba(0,0,0,${overlayValue * 0.6}) 50%, rgba(0,0,0,${overlayValue}) 100%)`
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm tracking-widest uppercase mb-8 border border-white/20">
            {tagline}
          </span>
        </motion.div>

        {/* Headline + Subheadline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-amber-50 mb-2 text-4xl font-light normal-case leading-tight md:text-6xl lg:text-7xl"
        >
          {headline}
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-[#bda94c] mb-8 text-4xl font-light italic leading-tight md:text-6xl lg:text-7xl"
        >
          {subheadline}
        </motion.h1>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <Link to={btn1Link}>
            <Button
              size="lg"
              className="bg-[#6b9faf] hover:bg-[#598491] text-white px-8 py-6 text-base rounded-full transition-all duration-300 hover:scale-105"
            >
              {btn1Label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to={btn2Link}>
            <Button
              size="lg"
              variant="outline"
              className="text-white px-8 py-6 text-base rounded-full border-white/30 hover:bg-white/10 backdrop-blur-sm bg-transparent"
            >
              {btn2Label}
            </Button>
          </Link>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}