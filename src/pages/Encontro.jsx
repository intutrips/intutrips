import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Users, Star, ArrowRight, Check, X } from 'lucide-react';

// ─── CONFIGURAÇÃO DO EVENTO ────────────────────────────────────────────────
// Edite estas constantes para atualizar os detalhes do evento
const EVENTO = {
  data: 'Janeiro de 2025',            // ex: "17 de janeiro de 2025"
  horario: '19h às 22h30',
  local: 'Pinheiros, São Paulo',       // bairro — endereço exato revelado após inscrição
  vagas: 20,
  whatsapp: 'https://wa.me/551151233225?text=Ol%C3%A1%2C+quero+saber+mais+sobre+o+Encontro+Intu+em+janeiro!',
  linkIngresso: '#ingresso',           // substitua pelo link da plataforma (Sympla, etc.)
  lotePrimeiroValor: 'R$ 290',
  loteSegundoValor: 'R$ 350',
  loteUnico: false,                    // true = mostrar apenas um valor
};
// ──────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' } }),
};

function Section({ children, className = '' }) {
  return (
    <section className={`px-6 md:px-12 ${className}`}>
      <div className="max-w-3xl mx-auto">{children}</div>
    </section>
  );
}

function CTAButton({ href = EVENTO.linkIngresso, children, variant = 'primary', className = '' }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
      <button className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 ${
        variant === 'primary'
          ? 'bg-[#bda94c] hover:bg-[#a8922e] text-[#1A1A1A] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
          : 'bg-transparent border-2 border-[#bda94c] text-[#bda94c] hover:bg-[#bda94c]/10'
      } ${className}`}>
        {children}
      </button>
    </a>
  );
}

const MOMENTOS = [
  {
    num: '01',
    titulo: 'Conexão e Presença',
    desc: 'Chegar, respirar e finalmente parar.',
    detalhe: 'A cerimônia do chá abre a noite. Um ritual simples que faz o tempo mudar de velocidade.',
  },
  {
    num: '02',
    titulo: 'Intuição e Silêncio',
    desc: 'Baixar o volume do mundo para ouvir a sua própria voz.',
    detalhe: 'Práticas de introspecção guiadas para acessar o que o barulho do dia cobre.',
  },
  {
    num: '03',
    titulo: 'Escuta e Transformação',
    desc: 'Ser ouvido de um jeito que quase não existe mais.',
    detalhe: 'Dinâmicas em grupo pequeno que criam o tipo de conversa que não acontece no trabalho nem no grupo de amigos.',
  },
  {
    num: '04',
    titulo: 'Integração e Renovação',
    desc: 'Selar a noite e sair com um próximo passo.',
    detalhe: 'Banho de som para encerrar. Você sai com mais clareza do que entrou — e com algo concreto para carregar.',
  },
];

const FAQS = [
  {
    q: 'Preciso ter experiência com meditação ou práticas do tipo?',
    a: 'Não. Tudo é conduzido do zero, passo a passo. Você não precisa ter nenhuma experiência anterior — só precisar estar aberta ao que a noite propõe.',
  },
  {
    q: 'Vou ser obrigada a falar ou me expor na frente de todos?',
    a: 'Não. Você participa no seu tempo e no seu limite. Cada prática respeita o espaço individual. Ninguém é colocada em evidência sem querer.',
  },
  {
    q: 'Isso tem alguma religião por trás?',
    a: 'Não. São práticas contemplativas originárias do Oriente — apresentadas com respeito à tradição e sem nenhum viés religioso ou de crença.',
  },
  {
    q: 'Posso ir sozinha?',
    a: 'A maioria vem sozinha. A curadoria da sala existe justamente para isso: criar um ambiente seguro onde chegar sem conhecer ninguém é parte da experiência, não um obstáculo.',
  },
  {
    q: 'Isso é terapia?',
    a: 'Não. É uma experiência de reconexão e presença. Não substitui acompanhamento terapêutico ou psicológico — e também não compete com ele.',
  },
  {
    q: 'E se eu precisar cancelar?',
    a: 'Cancelamentos com mais de 7 dias de antecedência têm reembolso integral. Após isso, é possível transferir o ingresso para outra pessoa ou usá-lo como crédito na próxima edição.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-[#1A1A1A] font-medium leading-snug">{q}</span>
        <ChevronDown className={`h-5 w-5 text-[#bda94c] flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-gray-600 font-light leading-relaxed pb-5 -mt-2">{a}</p>
      )}
    </div>
  );
}

export default function Encontro() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">

      {/* ── 1. HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center overflow-hidden bg-[#0F0F0F]">
        {/* Fundo texturizado */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/60 via-[#0F0F0F]/40 to-[#0F0F0F]/90" />

        <div className="relative z-10 px-6 max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {/* Chip */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#bda94c]/20 text-[#bda94c] text-xs font-semibold uppercase tracking-widest rounded-full mb-8">
                <Star className="h-3 w-3 fill-[#bda94c]" />
                Encontro Intu · São Paulo · Janeiro 2025
              </span>
            </motion.div>

            {/* Título principal */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
              A maior viagem<br />
              <span className="italic text-[#bda94c]">é para dentro.</span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p variants={fadeUp} className="text-white/60 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Uma noite para reencontrar a sua intuição e recomeçar o ano de dentro para fora —
              em São Paulo, para no máximo {EVENTO.vagas} pessoas.
            </motion.p>

            {/* Detalhes do evento */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { icon: Calendar, text: EVENTO.data },
                { icon: MapPin, text: EVENTO.local },
                { icon: Users, text: `Máximo ${EVENTO.vagas} pessoas` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-4 py-2 bg-white/8 border border-white/12 rounded-full text-white/70 text-sm backdrop-blur-sm">
                  <Icon className="h-3.5 w-3.5 text-[#bda94c]" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton>
                Quero meu lugar
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <span className="text-white/35 text-sm">Vagas limitadas — primeiros a se inscrever garantem o 1º lote</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-white/30" />
        </div>
      </section>

      {/* ── 2. RECONHECIMENTO ──────────────────────────────────── */}
      <Section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
            Você se reconhece aqui?
          </motion.p>
          <motion.p variants={fadeUp} className="text-2xl md:text-3xl text-[#1A1A1A] font-light leading-relaxed">
            Você começou mais um ano prometendo que dessa vez seria diferente.
          </motion.p>
          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mt-6">
            Mas a rotina engoliu a intenção. O barulho de fora abafou a sua voz.
            E você segue decidindo tudo pela cabeça, no automático, seguindo um roteiro
            que nem lembra ter escolhido.
          </motion.p>
          <motion.p variants={fadeUp} className="text-2xl md:text-3xl text-[#1A1A1A] font-light mt-8 italic">
            No fundo, fica a pergunta que não cala: é só isso?
          </motion.p>
        </motion.div>
      </Section>

      {/* Divisor visual */}
      <div className="flex items-center justify-center py-2">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#bda94c]/40 to-transparent" />
      </div>

      {/* ── 3. A VIRADA ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#1A1A1A]">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              Este ano pode ser diferente — de verdade
            </motion.p>
            <motion.p variants={fadeUp} className="text-2xl md:text-3xl text-white font-light leading-relaxed">
              Todo começo de ano te empurra uma lista de metas.
            </motion.p>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-white/50 font-light leading-relaxed mt-6">
              Mas meta sem direção é só mais cobrança.
            </motion.p>
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-white font-light leading-relaxed mt-6">
              E se, antes de decidir para onde correr, você parasse para se ouvir de novo?
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 pl-6 border-l-2 border-[#bda94c]">
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed italic">
                Este encontro não é sobre fazer mais.
                É sobre voltar para dentro, reencontrar a sua intuição
                e deixar que ela aponte o caminho.
                Um recomeço de dentro para fora.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4. O QUE É ─────────────────────────────────────────── */}
      <Section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
            O que é
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-snug">
            Uma noite diferente de tudo que você já foi.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-600 font-light leading-relaxed mb-8">
            Uma experiência intimista, guiada do começo ao fim, num loft com vista para São Paulo,
            luz de vela e chão de almofadas. Não é palestra, não é workshop de auditório,
            não é evento de networking.
          </motion.p>
          <motion.p variants={fadeUp} className="text-xl text-[#1A1A1A] font-light leading-relaxed">
            É uma experiência para no máximo {EVENTO.vagas} pessoas viverem juntas algumas horas de reconexão profunda —
            conduzidas por quem vive essas práticas de verdade.
          </motion.p>

          {/* Chips do que não é */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-8">
            {['Não é palestra', 'Não é workshop', 'Não é curso', 'Não é networking', 'Não é terapia em grupo'].map(t => (
              <span key={t} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-400 text-sm rounded-full">
                <X className="h-3 w-3" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      {/* ── 5. A JORNADA ───────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#FAF8F5]">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              A jornada da noite
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-12 leading-snug">
              Quatro momentos.<br />Uma transformação.
            </motion.h2>

            <div className="space-y-8">
              {MOMENTOS.map((m, i) => (
                <motion.div
                  key={m.num}
                  variants={fadeUp}
                  custom={i}
                  className="flex gap-6 items-start"
                >
                  <span className="text-3xl font-light text-[#bda94c]/30 flex-shrink-0 w-10 leading-tight">{m.num}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{m.titulo}</h3>
                    <p className="text-gray-500 font-light italic mb-2">{m.desc}</p>
                    <p className="text-gray-600 font-light text-sm leading-relaxed">{m.detalhe}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-12 p-6 bg-[#1A1A1A] rounded-2xl">
              <p className="text-white/70 font-light text-sm leading-relaxed">
                Ao longo da noite, práticas ancestrais do Oriente conduzem cada passagem —
                da <span className="text-[#bda94c]">cerimônia do chá</span> ao <span className="text-[#bda94c]">banho de som</span>.
                Cada ritual escolhido a dedo, por quem vive essas tradições, não só ensina sobre elas.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 6. QUEM CONDUZ ─────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              Quem conduz
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-snug">
              Por que criei este encontro.
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-5 text-gray-600 font-light leading-relaxed text-lg">
              <p>
                A Intu leva pessoas a viajar até se sentirem pequenas diante do mundo.
                Não pelo destino, mas pelo desconforto escolhido — aquele que reorganiza o que a gente
                acreditava sobre si mesma.
              </p>
              <p>
                Mas nem todo mundo está pronto para cruzar o planeta. E eu percebi que o mesmo movimento
                que acontece na Tailândia ou na Índia pode acontecer numa noite em São Paulo.
                O mesmo convite a sair do script, a mesma recusa da vida no automático.
              </p>
              <p className="text-[#1A1A1A] italic">
                Este encontro é o espelho interno das expedições. A viagem que não precisa de passaporte.
              </p>
            </motion.div>

            {/* Placeholder facilitadora */}
            <motion.div variants={fadeUp} className="mt-10 p-6 bg-[#FAF8F5] rounded-2xl border border-gray-100">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Facilitação</p>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                As práticas da noite serão conduzidas por facilitadoras especializadas em cerimônia do chá
                e sound healing — escolhidas não pela técnica, mas pela profundidade com que vivem essas tradições.
                Apresentações completas em breve.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 7. PARA QUEM É ─────────────────────────────────────── */}
      <Section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
            A curadoria começa por aqui
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-10 leading-snug">
            Esse encontro é para você?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* É para você */}
            <motion.div variants={fadeUp} className="bg-[#2D4A3E]/5 border border-[#2D4A3E]/20 rounded-2xl p-7">
              <p className="text-sm font-semibold text-[#2D4A3E] uppercase tracking-wider mb-5">É para você se</p>
              <div className="space-y-3.5">
                {[
                  'Sente que a vida pede mais verdade do que a rotina permite',
                  'Está num ponto de virada — um aniversário, uma ruptura, um cansaço que virou estopim',
                  'Quer clareza sobre o próximo passo, não mais uma lista de metas',
                  'Sente falta de conexão real, aquela conversa que não acontece no grupo do trabalho',
                  'Tem vontade de pertencer a algo com profundidade',
                ].map(t => (
                  <div key={t} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-[#2D4A3E] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-light text-sm leading-snug">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Não é para você */}
            <motion.div variants={fadeUp} className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Não é para você se</p>
              <div className="space-y-3.5">
                {[
                  'Procura festa, networking ou um evento para ver e ser visto',
                  'Quer uma solução mágica e instantânea',
                  'Acha silêncio e introspecção perda de tempo',
                  'Prefere ouvir palestrantes do que participar de uma experiência',
                ].map(t => (
                  <div key={t} className="flex items-start gap-3">
                    <X className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400 font-light text-sm leading-snug">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* ── 8. O QUE VOCÊ LEVA ─────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#1A1A1A]">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              O que você leva
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-white mb-12 leading-snug">
              Uma noite que fica.
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp}>
                <p className="text-xs uppercase tracking-widest text-[#6b9faf] font-semibold mb-4">Do lado de dentro</p>
                <div className="space-y-4">
                  {[
                    'Mais clareza sobre o seu próximo passo',
                    'Reconexão com a sua intuição como bússola',
                    'O alívio de ter parado para se ouvir',
                    'Permissão para recomeçar — de dentro para fora',
                  ].map(t => (
                    <div key={t} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#bda94c] flex-shrink-0 mt-2" />
                      <span className="text-white/70 font-light leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <p className="text-xs uppercase tracking-widest text-[#6b9faf] font-semibold mb-4">Do lado de fora</p>
                <div className="space-y-4">
                  {[
                    'Uma noite completa com chá e acolhimento',
                    'Um objeto simbólico para levar — seu marco de recomeço',
                    'O registro do seu próximo passo — escrito por você',
                    'O encontro com pessoas que buscam o mesmo que você',
                  ].map(t => (
                    <div key={t} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#bda94c] flex-shrink-0 mt-2" />
                      <span className="text-white/70 font-light leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SEGUNDO CTA ─────────────────────────────────────────── */}
      <Section className="py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center"
        >
          <p className="text-gray-500 font-light mb-6">
            Vagas limitadas a {EVENTO.vagas} pessoas por edição.
          </p>
          <CTAButton>
            Garantir meu lugar
            <ArrowRight className="h-4 w-4" />
          </CTAButton>
        </motion.div>
      </Section>

      {/* ── 9. ATMOSFERA ───────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              O ambiente
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-snug">
              Um espaço pensado para você<br />desacelerar no primeiro minuto.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 font-light leading-relaxed mb-10">
              Vista para São Paulo. Luz de vela. Almofadas no chão. Chá na mão.
              O espaço já trabalha antes de qualquer palavra ser dita.
            </motion.p>

            {/* Galeria placeholder — substituir por imagens reais do loft */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
                'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80',
                'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80',
                'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80',
              ].map((src, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 md:col-span-1 row-span-2' : ''}`}>
                  <img
                    src={src}
                    alt="Atmosfera do encontro"
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs text-gray-400 text-center mt-4 italic">
              Imagens ilustrativas. Fotos reais do espaço em breve.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── 10. DETALHES PRÁTICOS ───────────────────────────────── */}
      <Section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
            Detalhes
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl font-light text-[#1A1A1A] mb-10">
            Tudo que você precisa saber.
          </motion.h2>

          <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { label: 'Data', value: EVENTO.data },
              { label: 'Horário', value: EVENTO.horario },
              { label: 'Duração', value: 'Aproximadamente 3h30' },
              { label: 'Local', value: `${EVENTO.local} — endereço exato enviado após a confirmação da inscrição` },
              { label: 'Vagas', value: `Máximo ${EVENTO.vagas} pessoas por edição` },
              { label: 'Incluso', value: 'Cerimônia do chá · banho de som · objeto simbólico · registro do próximo passo' },
              { label: 'Cancelamento', value: 'Reembolso integral até 7 dias antes. Após esse prazo, crédito para a próxima edição ou transferência do ingresso.' },
            ].map(({ label, value }, i) => (
              <div key={label} className={`flex gap-6 px-7 py-5 ${i !== 0 ? 'border-t border-gray-100' : ''}`}>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold w-28 flex-shrink-0 pt-0.5">{label}</span>
                <span className="text-gray-700 font-light leading-snug">{value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      {/* ── 11. INVESTIMENTO ────────────────────────────────────── */}
      <section id="ingresso" className="py-20 md:py-28 bg-[#FAF8F5]">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              Investimento
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4 leading-snug">
              Um começo de ano diferente<br />cabe num único gesto.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 font-light mb-10">
              Os ingressos são limitados. Primeiro lote com preço reduzido — quando acabar, acabou.
            </motion.p>

            <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-5">
              {/* 1º Lote */}
              <div className="bg-white border-2 border-[#bda94c] rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#bda94c] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full">
                  Disponível agora
                </div>
                <p className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-3">1º Lote</p>
                <p className="text-5xl font-light text-[#1A1A1A] mb-1">{EVENTO.lotePrimeiroValor}</p>
                <p className="text-sm text-gray-400 font-light mb-6">por pessoa · vagas limitadas</p>
                <CTAButton className="w-full justify-center">
                  Garantir meu lugar
                </CTAButton>
              </div>

              {/* 2º Lote */}
              {!EVENTO.loteUnico && (
                <div className="bg-white border border-gray-200 rounded-2xl p-7 opacity-60">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">2º Lote</p>
                  <p className="text-5xl font-light text-gray-300 mb-1">{EVENTO.loteSegundoValor}</p>
                  <p className="text-sm text-gray-300 font-light mb-6">por pessoa</p>
                  <div className="w-full py-4 rounded-full border border-gray-200 text-center text-gray-400 text-sm">
                    Disponível quando o 1º lote esgotar
                  </div>
                </div>
              )}
            </motion.div>

            <motion.p variants={fadeUp} className="text-xs text-gray-400 text-center mt-6 font-light">
              Pagamento via PIX, boleto ou cartão · Nota fiscal emitida
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── 12. FAQ ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-widest text-[#bda94c] font-semibold mb-6">
              Perguntas frequentes
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-light text-[#1A1A1A] mb-10">
              Dúvidas que todo mundo tem<br />e ninguém pergunta.
            </motion.h2>

            <motion.div variants={fadeUp} className="bg-[#FAF8F5] rounded-2xl px-6">
              {FAQS.map(faq => (
                <FAQItem key={faq.q} {...faq} />
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-gray-400 font-light text-center mt-8">
              Ficou com outra dúvida?{' '}
              <a href={EVENTO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#bda94c] underline underline-offset-4 hover:text-[#a8922e]">
                Fale direto no WhatsApp.
              </a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── 13. FECHAMENTO ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[#1A1A1A] text-center">
        <div className="px-6 max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp}>
              <Star className="h-6 w-6 text-[#bda94c] fill-[#bda94c] mx-auto mb-8" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              Este ano você pode começar<br />do mesmo jeito de sempre.
            </motion.h2>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-light text-white mb-10 leading-tight">
              Ou pode começar<br /><span className="italic text-[#bda94c]">se ouvindo.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/50 font-light mb-10">
              São poucos lugares. E eles acabam.
            </motion.p>
            <motion.div variants={fadeUp}>
              <CTAButton>
                Quero começar o ano de dentro para fora
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 14. RODAPÉ DO EVENTO ────────────────────────────────── */}
      <section className="py-12 bg-[#0F0F0F]">
        <div className="px-6 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-[#bda94c] fill-[#bda94c]" />
            <span className="text-white font-light tracking-wider">Intu Trips</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href={EVENTO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#bda94c] transition-colors font-light">
              Dúvidas · WhatsApp
            </a>
            <a href="https://www.intutrips.com" className="text-white/50 hover:text-[#bda94c] transition-colors font-light">
              Conhecer as expedições
            </a>
            <a href="https://www.instagram.com/intutrips" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#bda94c] transition-colors font-light">
              @intutrips
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
