import React from 'react';
import { motion } from 'framer-motion';

export default function Waitlist2027() {
  return (
    <section className="py-24 px-6 bg-[#1B3028]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2.5 text-[#bda94c] text-sm tracking-widest uppercase mb-6">
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#bda94c"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
            Calendário 2027
            <svg width="10" height="10" viewBox="0 0 100 100" fill="#bda94c"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
          </span>

          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 leading-snug">
            Novos destinos a caminho para{' '}
            <span className="italic text-[#bda94c]">2027</span>
          </h2>

          <p className="text-white/60 font-light text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Estamos preparando um novo calendário de expedições para 2027. Se você já sabe que quer
            viajar, entre na lista de espera e seja o primeiro a saber quando as vagas abrirem.
          </p>

          <a
            href="https://forms.gle/iBzcRrTPc9CTqfUr5"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.fbq && window.fbq('track', 'Contact')}
          >
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#bda94c] text-[#1B3028] text-sm font-semibold tracking-wider uppercase rounded-full hover:bg-[#c9b75a] transition-colors">
              <svg width="10" height="10" viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 C52 40 60 48 100 50 C60 52 52 60 50 100 C48 60 40 52 0 50 C40 48 48 40 50 0Z"/></svg>
              Quero entrar na lista de espera
            </button>
          </a>

          <p className="text-white/30 text-xs mt-5 font-light">
            Sem compromisso — você recebe um aviso quando o calendário estiver pronto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
