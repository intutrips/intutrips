import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, TrendingDown } from 'lucide-react';

const DEADLINE = new Date('2026-12-05T23:59:59-03:00');

function getTimeLeft() {
  const diff = DEADLINE - Date.now();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[52px] text-center">
        <span className="text-2xl md:text-3xl font-bold text-white tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1">{label}</span>
    </div>
  );
}

export default function DollarFreezeAlert() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 rounded-2xl overflow-hidden shadow-lg"
    >
      <div className="bg-gradient-to-r from-[#2D4A3E] via-[#1e3a2e] to-[#2D4A3E] px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Texto */}
        <div className="flex items-start gap-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-[#bda94c] flex-shrink-0 flex items-center justify-center mt-0.5">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
              <span className="text-[#bda94c] text-xs font-bold uppercase tracking-widest">Oferta especial</span>
            </div>
            <p className="text-white font-semibold text-lg leading-snug mt-0.5">
              Dólar congelado a{' '}
              <span className="text-[#bda94c] text-2xl font-bold">R$ 5,90</span>
            </p>
            <p className="text-white/60 text-sm font-light mt-0.5">
              Feche até 05/12 e garanta o câmbio fixo no seu contrato — sem surpresas.
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Digit value={timeLeft.days}    label="dias"  />
          <span className="text-white/40 text-xl font-light mb-4">:</span>
          <Digit value={timeLeft.hours}   label="horas" />
          <span className="text-white/40 text-xl font-light mb-4">:</span>
          <Digit value={timeLeft.minutes} label="min"   />
          <span className="text-white/40 text-xl font-light mb-4">:</span>
          <Digit value={timeLeft.seconds} label="seg"   />
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#bda94c]"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft.days / 14) * 100}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </motion.div>
  );
}
