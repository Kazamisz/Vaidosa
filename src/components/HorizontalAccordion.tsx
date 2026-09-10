import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Produto } from '../types';

interface AccordionItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 'projeto_drbtklvdnxo',
    tag: 'Estúdio & Noite',
    title: 'Macacão Royal',
    subtitle: 'Decote transpassado com cinto dourado estruturado',
    image: '/images/instagram/DRBTkLVDNXO/01.webp',
    category: 'Macacões',
  },
  {
    id: 'projeto_dcwy2surwqd',
    tag: 'Coleção Sol',
    title: 'Vestido Terracota',
    subtitle: 'Fluidez em crepe nobre com padronagem contemporânea',
    image: '/images/instagram/DcWY2suRWQD/01.webp',
    category: 'Vestidos',
  },
  {
    id: 'projeto_drbtoi9dmno',
    tag: 'Alfaiataria Fina',
    title: 'Conjunto Crepe',
    subtitle: 'Blazer cropped estruturado e saia lápis com fenda',
    image: '/images/instagram/DRBToI9DMno/01.webp',
    category: 'Conjuntos',
  },
  {
    id: 'projeto_dsw7a49gu1b',
    tag: 'Casual Premium',
    title: 'Chemise Poá',
    subtitle: 'Modelagem ampla e versatilidade para o dia a dia',
    image: '/images/instagram/DSW7a49gU1B/01.webp',
    category: 'Camisas',
  },
];

interface HorizontalAccordionProps {
  onSelectProductById: (id: string) => void;
  onExploreCatalog: () => void;
}

export const HorizontalAccordion: React.FC<HorizontalAccordionProps> = ({
  onSelectProductById,
  onExploreCatalog,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section className="py-24 md:py-36 bg-[#161412] text-stone-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with wide breathing room */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
              Exploração Tátil
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mt-3 text-white">
              Cortes desenhados para a postura e presença
            </h2>
          </div>
          <button
            onClick={onExploreCatalog}
            className="self-start md:self-end px-6 py-3 rounded-full border border-stone-700 hover:border-white text-xs tracking-wider uppercase font-semibold text-stone-200 hover:text-white transition-colors cursor-pointer"
          >
            Ver Todo o Catálogo
          </button>
        </div>

        {/* Horizontal Accordion Track */}
        <div className="flex flex-col lg:flex-row gap-4 h-[640px] w-full">
          {ACCORDION_ITEMS.map((item, index) => {
            const isActive = activeIdx === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIdx(index)}
                onClick={() => onSelectProductById(item.id)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out border border-stone-800/80 ${
                  isActive ? 'lg:flex-[3.5] flex-grow' : 'lg:flex-1 h-32 lg:h-full'
                }`}
              >
                {/* Background Image with zoom */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-black/85 via-black/30 to-black/20'
                      : 'bg-black/60 lg:bg-black/65 hover:bg-black/45'
                  }`}
                />

                {/* Content Container */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-stone-200 border border-white/10">
                      {item.tag}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? 'bg-white text-stone-950' : 'bg-white/10 text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Bottom Text Block */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm text-stone-300 mt-2 max-w-md transition-all duration-500 ${
                        isActive ? 'opacity-100 max-h-24' : 'opacity-0 max-h-0 overflow-hidden'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
