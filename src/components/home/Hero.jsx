import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Ásia paisagem"
          className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>

          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm tracking-widest uppercase mb-8 border border-white/20">
            Viagens em Grupo pela Ásia
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="text-amber-50 mb-6 text-4xl font-light normal-case leading-tight md:text-6xl lg:text-7xl">Não somos uma agência, 
somos pontes




        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }} className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">Onde viajar por conta vira barreira, a gente vira apoio.




        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link to={createPageUrl('Destinations')}>
            <Button
              size="lg"
              className="bg-[#00634D] hover:bg-[#032B22] text-white px-8 py-6 text-base rounded-full transition-all duration-300 hover:scale-105">

              Explorar Destinos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to={createPageUrl('About')}>
            <Button
              size="lg"
              variant="outline" className="bg-fuchsia-950 text-white px-8 py-6 text-base font-medium rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground h-10 border-white/30 hover:bg-white/10 backdrop-blur-sm">


              Conheça Nossa História
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">

          {[
          { icon: MapPin, value: "5", label: "Destinos" },
          { icon: Users, value: "6-12", label: "Viajantes" },
          { icon: Heart, value: "100%", label: "Brasileiros" }].
          map((stat, index) =>
          <div key={index} className="text-center">
              <stat.icon className="h-5 w-5 text-[#00634D] mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-light text-white">{stat.value}</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2">

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">

          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>);

}