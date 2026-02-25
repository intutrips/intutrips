import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Heart, Compass, MessageCircle, Star } from 'lucide-react';
import { useSiteTexts } from '@/hooks/useSiteTexts';

// Ícones fixos por posição — o admin controla título e descrição
const CARD_ICONS = [Users, Heart, Shield, Compass, MessageCircle, Star];

export default function WhyUs() {
  const { texts } = useSiteTexts();

  const features = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    icon: CARD_ICONS[i],
    title: texts[`home_why_card${n}_title`] || ['Grupos Pequenos', '100% Brasileiros', 'Suporte Total', 'Roteiros Exclusivos', 'Guias Locais', 'Datas Fixas'][i],
    description: texts[`home_why_card${n}_desc`] || [
      'Viaje com apenas 6 a 12 pessoas. Experiências mais íntimas, autênticas e personalizadas.',
      'Você viaja com compatriotas, facilitando conexões e tornando a experiência mais familiar.',
      'Do planejamento à volta para casa, estamos com você em cada passo da jornada.',
      'Experiências autênticas longe do turismo de massa, com acesso a lugares especiais.',
      'Parceiros locais que conhecem cada cantinho e compartilham a cultura de verdade.',
      'Calendário definido com antecedência para você se programar com tranquilidade.'
    ][i],
  }));

  return (
    <section className="py-24 px-6 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <span className="text-[#C9A962] text-sm tracking-widest uppercase">
            {texts.home_why_tag || 'Por Que Viajar Conosco'}
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-white mt-4 mb-6">
            {texts.home_why_title || 'A gente cuida de tudo'}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">
            {texts.home_why_desc || 'Sabemos que viajar para a Ásia pode parecer desafiador. Por isso, transformamos o complexo em simples e o sonho em realidade.'}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">

              <div className="w-12 h-12 rounded-xl bg-[#C9A962]/20 flex items-center justify-center mb-6 group-hover:bg-[#C9A962]/30 transition-colors">
                <feature.icon className="h-6 w-6 text-[#C9A962]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 font-light leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}