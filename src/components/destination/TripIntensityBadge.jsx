import React from 'react';

const INTENSITY_CONFIG = {
  relaxed: {
    label: 'Tranquila',
    description: 'Ritmo leve, com bastante tempo livre e momentos de descanso.',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    activeDots: 1,
  },
  moderate: {
    label: 'Moderada',
    description: 'Equilíbrio entre exploração e descanso — ativa, mas sem ser exaustiva.',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    activeDots: 2,
  },
  intense: {
    label: 'Intensa',
    description: 'Roteiro cheio, muito a explorar — ideal para quem quer aproveitar cada momento.',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    dotColor: 'bg-orange-500',
    activeDots: 3,
  },
};

export default function TripIntensityBadge({ intensity }) {
  const cfg = INTENSITY_CONFIG[intensity];
  if (!cfg) return null;

  return (
    <div className={`inline-flex items-start gap-3 px-4 py-3 rounded-xl border ${cfg.bgColor} ${cfg.borderColor}`}>
      <div className="flex gap-1 mt-0.5 flex-shrink-0">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`w-2.5 h-2.5 rounded-full ${n <= cfg.activeDots ? cfg.dotColor : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <div>
        <p className={`text-sm font-semibold ${cfg.color} leading-tight`}>
          Ritmo {cfg.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cfg.description}</p>
      </div>
    </div>
  );
}
