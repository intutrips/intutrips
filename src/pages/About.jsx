import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Globe, Shield, Sparkles } from 'lucide-react';
import ContactSection from '@/components/home/ContactSection';
import { useSiteTexts } from '@/hooks/useSiteTexts';

const VALUE_ICONS = [Heart, Users, Globe, Shield];

export default function About() {
  const { texts } = useSiteTexts();

  // Valores dinâmicos
  const values = [1, 2, 3, 4].map((n, i) => ({
    icon: VALUE_ICONS[i],
    title: texts[`about_value${n}_title`] || ['Cuidado', 'Comunidade', 'Autenticidade', 'Segurança'][i],
    description: texts[`about_value${n}_desc`] || '',
  }));

  // Itens "Para quem é" e "não é"
  const forItems = [1, 2, 3, 4].map(n => texts[`about_for_item${n}`] || '');
  const noforItems = [1, 2, 3, 4].map(n => texts[`about_nofor_item${n}`] || '');

  // Itens Diferencial
  const diffItems = [1, 2, 3, 4, 5].map(n => texts[`about_diff_item${n}`] || '');

  return (
    <div className="min-h-screen bg-[#FDF6EA]">

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 bg-[#032B22] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Viagem"
            className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-slate-50 text-sm uppercase tracking-widest">
              {texts.about_hero_tag || 'Nossa História'}
            </span>
            <h1 className="text-4xl md:text-6xl font-light text-white mt-4 mb-6 whitespace-pre-wrap">
              {texts.about_hero_title || 'Transformamos seu medo\nem possibilidades'}
            </h1>
            <p className="text-slate-50 mx-auto text-lg font-light max-w-2xl whitespace-pre-wrap">
              {texts.about_hero_subtitle || 'Nascemos da paixão de viver o mundo e do desejo de tornar viagens pela Ásia, Oriente Médio e África seguras, reais e autênticas para brasileiros que sonham em explorar o outro lado do mundo.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story / Quem Somos ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <img
                  src={texts.about_story_image || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80'}
                  alt="Viagem em grupo"
                  className="rounded-2xl w-full shadow-lg" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#00634D] text-sm tracking-widest uppercase">
                {texts.about_story_tag || 'Quem Somos'}
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4 mb-6">
                {texts.about_story_heading1 || 'Onde ir por conta vira barreira,'}<br />
                <span className="italic">{texts.about_story_heading2 || 'a gente vira apoio.'}</span>
              </h2>
              <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                <p className="font-medium text-[#3C3333]">
                  {texts.about_story_intro || 'Intu nasce de intuição.'}
                </p>
                <p>{texts.about_story_1 || 'Acreditamos que existe um momento na vida em que algo dentro de nós pede movimento.'}</p>
                <p>{texts.about_story_2 || 'A Intu nasceu do desejo de tornar o mundo mais acessível para quem sente que viajar pode ser mais do que turismo, pode ser transformação.'}</p>
                <p>{texts.about_story_3 || 'Criamos expedições para destinos que despertam curiosidade, respeito e, muitas vezes, receio.'}</p>
                <p className="font-medium text-[#3C3333]">
                  {texts.about_story_bridge || 'É aí que entramos.'}
                </p>
                <p>{texts.about_story_4 || 'Somos a ponte entre o sonho e a realização.'}</p>
                <p className="italic text-[#3C3333]">
                  {texts.about_story_5 || 'Não oferecemos viagens para colecionar fotos. Oferecemos vivências para ampliar a forma de ver o mundo e a si mesmo.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Diferencial ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              {texts.about_diff_tag || 'Nosso Diferencial'}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4 mb-6">
              {texts.about_diff_title1 || 'O que nos torna'}{' '}
              <span className="italic text-[#00634D]">{texts.about_diff_title2 || 'diferentes'}</span>
            </h2>
            <p className="text-gray-600 font-light leading-relaxed">
              {texts.about_diff_desc || 'A Intu não trabalha com turismo de massa. Não fazemos turismo de vitrine.'}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#FDF6EA] rounded-2xl p-8 md:p-12">
            <p className="text-gray-600 font-light mb-6">
              {texts.about_diff_subtitle || 'Nossas expedições são desenhadas com:'}
            </p>
            <div className="space-y-4">
              {diffItems.filter(Boolean).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00634D] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#3C3333] font-light">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 font-light mt-8 italic">
              {texts.about_diff_closing || 'Você vive a experiência. Nós sustentamos o caminho.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 px-6 bg-[#FDF6EA]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              {texts.about_team_tag || 'Quem Está Por Trás'}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4">
              {texts.about_team_title1 || 'Conheça quem'}{' '}
              <span className="italic text-[#00634D]">{texts.about_team_title2 || 'faz acontecer'}</span>
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto mt-4">
              {texts.about_team_desc || 'Somos viajantes e ao longo dos anos descobrimos nossa paixão por conhecer destinos com culturas diferentes.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Luiza */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#032B22] to-[#00634D] relative overflow-hidden">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/991021d8e_luiza.jpg" alt="Luiza" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3C3333] mb-1">{texts.about_team1_name || 'Luiza (Lu)'}</h3>
                <p className="text-[#00634D] text-sm mb-3">{texts.about_team1_role || 'Fundadora e Líder das Expedições'}</p>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{texts.about_team1_bio || ''}</p>
              </div>
            </motion.div>

            {/* José */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#54234B] to-[#00634D] relative overflow-hidden">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988295eab60382ac956dcb6/4eeedbc64_josezeca.jpg" alt="José" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-[#3C3333] mb-1">{texts.about_team2_name || 'José (Zeca)'}</h3>
                <p className="text-[#00634D] text-sm mb-3">{texts.about_team2_role || 'Fundador e Líder das Expedições'}</p>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{texts.about_team2_bio || ''}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#00634D] text-sm tracking-widest uppercase">
              {texts.about_values_tag || 'Nossos Valores'}
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333] mt-4">
              {texts.about_values_title1 || 'O que nos'}{' '}
              <span className="italic">{texts.about_values_title2 || 'guia'}</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-[#FDF6EA] flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-fuchsia-950 h-7 w-7" />
                </div>
                <h3 className="text-xl font-medium text-[#3C3333] mb-3">{value.title}</h3>
                <p className="text-gray-600 font-light">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Para quem é ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-[#3C3333]">
              {texts.about_forwhom_title1 || 'Para quem'}{' '}
              <span className="italic text-[#00634D]">{texts.about_forwhom_title2 || 'é a Intu'}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#00634D] to-[#032B22] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-light mb-6">{texts.about_for_heading || 'Para quem é a Intu'}</h3>
              <div className="space-y-4">
                {forItems.filter(Boolean).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-light">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#FDF6EA] rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-light text-[#3C3333] mb-6">{texts.about_nofor_heading || 'Para quem não é'}</h3>
              <div className="space-y-4">
                {noforItems.filter(Boolean).map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="font-light text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-gray-600 font-light mt-12 text-lg max-w-3xl mx-auto">
            {texts.about_for_closing || 'Se você sente que o mundo tem algo a te ensinar, mas sabe que não precisa atravessar esse caminho sozinho, a Intu é para você.'}
            <span className="block mt-4 text-[#00634D] font-medium italic">
              {texts.about_for_cta || 'Vamos juntos.'}
            </span>
          </motion.p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#032B22] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00634D]/10 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="h-10 w-10 text-[#00634D] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              {texts.about_cta_title1 || 'Pronto para ver o'}<br />
              <span className="italic text-[#00634D]">{texts.about_cta_title2 || 'mundo real?'}</span>
            </h2>
            <p className="text-white/70 font-light mb-8 max-w-2xl mx-auto">
              {texts.about_cta_desc || 'Entre em contato e vamos juntos planejar a viagem da sua vida.'}
            </p>
          </motion.div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}