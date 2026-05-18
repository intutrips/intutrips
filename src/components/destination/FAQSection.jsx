import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const VISA_INFO = {
  'Tailândia': 'Você não precisa de visto, apenas passaporte válido por pelo menos 6 meses. Além disso, é obrigatória apresentação de vacina da febre amarela e formulário de imigração. Auxiliamos em todo esse processo durante a assessoria do pré-embarque.',
  'China': 'Você não precisa de visto, apenas passaporte válido por pelo menos 6 meses. Auxiliamos em todo esse processo durante a assessoria do pré-embarque.',
  'India': 'Sim, caso queira, temos uma assessoria para tirar seu visto por 50 dólares. Auxiliamos em todo esse processo durante a assessoria do pré-embarque.',
};

const DEFAULT_VISA = 'Entre em contato com nossa equipe para verificar os requisitos de visto específicos para este destino. Auxiliamos em todo o processo durante a assessoria de pré-embarque.';

const BASE_FAQS = [
  {
    q: 'Passagem aérea internacional está inclusa?',
    a: 'Como cada viajante parte de uma cidade diferente, ou até países diferentes, a gente deixa essa etapa livre e personalizável a parte do pacote, assim você pode escolher a melhor combinação de origem, data e horário (e até adaptar se quiser chegar antes ou estender a viagem).',
  },
  {
    q: 'De onde sai o grupo?',
    a: 'A viagem tem início já no destino. Isso significa que você pode pegar o voo partindo da sua cidade de preferência. Nossa assessoria pré-embarque te ajuda a entender quais são as melhores opções, rotas e coordenar os voos de todos os passageiros.',
  },
  {
    q: 'Como funciona a divisão de quartos?',
    a: 'Todos os quartos são duplos com camas twin e já incluem café da manhã. A divisão dos quartos é feita mais próximo à véspera da viagem e não misturamos homem e mulher.',
  },
  {
    q: 'Quero um quarto privado, quanto custa a mais?',
    a: 'Para ficar em um quarto privado, o valor adicional é de USD 700.',
  },
  {
    q: 'Como funciona em caso de cancelamento?',
    a: 'A viagem pode ser cancelada com reembolso integral até 91 dias antes da viagem. A partir daí, encargos são aplicados. Entre 90–60 dias antes, uma taxa de 30%. Entre 59 e 30 dias, 50%. Caso seja cancelado com menos de 30 dias, não há reembolso.',
  },
  {
    q: 'Qual a data limite para fechar o pacote ou quando encerram as vagas?',
    a: 'As vagas ficarão abertas até 40 dias antes do embarque ou até o encerramento das vagas, o que acontecer primeiro 🙂',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
      >
        <span className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
          {faq.q}
        </span>
        <span className="flex-shrink-0 text-[#6b9faf]">
          {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-gray-600 font-light leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection({ country, extraFaqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const visaAnswer = VISA_INFO[country] || DEFAULT_VISA;
  const faqs = [
    ...BASE_FAQS,
    ...extraFaqs,
    {
      q: 'Preciso de visto? Quais são os requisitos?',
      a: visaAnswer,
    },
  ];

  const mid = Math.ceil(faqs.length / 2);
  const left = faqs.slice(0, mid);
  const right = faqs.slice(mid);

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-light text-[#1A1A1A] mb-6 flex items-center gap-3">
        <HelpCircle className="h-6 w-6 text-[#bda94c]" />
        Perguntas Frequentes
      </h2>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {left.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {right.map((faq, i) => (
            <FAQItem
              key={mid + i}
              faq={faq}
              isOpen={openIndex === mid + i}
              onToggle={() => toggle(mid + i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
