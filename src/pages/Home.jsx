import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useSiteTexts } from '@/hooks/useSiteTexts';

import Hero from '@/components/home/Hero';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import WhyUs from '@/components/home/WhyUs';
import Testimonial from '@/components/home/Testimonial';
import ContactSection from '@/components/home/ContactSection';

function TeamSection() {
  const { texts } = useSiteTexts();
  return (
    <section className="py-24 px-6 bg-[#f8eee5]">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2.5 text-[#6b9faf] text-sm tracking-widest uppercase">
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#6b9faf"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
            {texts.about_team_tag || 'Quem Está Por Trás'}
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#6b9faf"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4">
            {texts.about_team_title1 || 'Conheça quem'}{' '}
            <span className="italic text-[#6b9faf]">{texts.about_team_title2 || 'faz acontecer'}</span>
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto mt-4">
            {texts.about_team_desc || 'Somos viajantes e ao longo dos anos descobrimos nossa paixão por conhecer destinos com culturas diferentes.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#92314D] to-[#6b9faf] relative overflow-hidden">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/991021d8e_luiza.jpg" alt="Luiza" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-medium text-[#3C3333] mb-1">{texts.about_team1_name || 'Luiza (Lu)'}</h3>
              <p className="text-[#6b9faf] text-sm mb-3">{texts.about_team1_role || 'Fundadora e Líder das Expedições'}</p>
              <p className="text-gray-600 font-light text-sm leading-relaxed">{texts.about_team1_bio || ''}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#92314D] to-[#6b9faf] relative overflow-hidden">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/4eeedbc64_josezeca.jpg" alt="José" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-medium text-[#3C3333] mb-1">{texts.about_team2_name || 'José (Zeca)'}</h3>
              <p className="text-[#6b9faf] text-sm mb-3">{texts.about_team2_role || 'Fundador e Líder das Expedições'}</p>
              <p className="text-gray-600 font-light text-sm leading-relaxed">{texts.about_team2_bio || ''}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ['destinations-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDestinations destinations={destinations} isLoading={isLoading} />
      <WhyUs />
      <Testimonial />
      <TeamSection />
      <ContactSection />
    </div>
  );
}