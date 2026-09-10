import React from 'react';

const MARQUEE_ITEMS = [
  'MODA PLUS SIZE ELE & ELA',
  'MODELAGEM IMPECÁVEL ATÉ O TAMANHO 80',
  'ALFAIATARIA & CASUAL CHIC',
  'CONSULTORIA PERSONALIZADA EM BIRIGUI',
  'ELEGÂNCIA SEM LIMITES',
  'PROVADOR EXCLUSIVO & ATENDIMENTO VIP',
  'PEÇAS SELECIONADAS COM CAIMENTO REAL',
];

export const InfiniteMarquee: React.FC = () => {
  return (
    <div className="w-full bg-stone-950 text-stone-100 py-5 overflow-hidden border-y border-stone-800 select-none">
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 mx-6">
            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-stone-200">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)] inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
};
