import React, { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Produto } from '../types';
import { getImageUrl, getImageSrcSet } from '../utils/image';

interface HorizontalAccordionProps {
  products: Produto[];
  onSelectProductById: (id: string) => void;
  onExploreCatalog: () => void;
}

const FEATURED_IDS = [
  'projeto_drbtklvdnxo',
  'projeto_dcwy2surwqd',
  'projeto_drbtoi9dmno',
  'projeto_dygalcjjeim',
];

export const HorizontalAccordion: React.FC<HorizontalAccordionProps> = ({
  products,
  onSelectProductById,
  onExploreCatalog,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useMemo(
    () => FEATURED_IDS.map(id => products.find(product => product.id === id)).filter((product): product is Produto => Boolean(product)),
    [products],
  );

  if (!items.length) return null;

  return (
    <section id="exploracao-tatil" className="relative py-14 sm:py-16 md:py-20 text-stone-100">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(8,3,7,.4)_35%,rgba(8,3,7,.75)_100%)] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl 2xl:max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 text-left sm:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">
              Exploração tátil
            </span>
            <h2 className="mt-3 text-3xl font-normal leading-[1.08] tracking-tight text-white sm:text-5xl">
              Cortes desenhados para postura e presença
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreCatalog}
            className="self-start rounded-full border border-white/20 bg-black/25 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-100 backdrop-blur-md transition-colors hover:border-rose-300/70 hover:bg-rose-950/35 md:self-end"
          >
            Ver todo o catálogo
          </button>
        </div>

        <div className="grid w-full gap-3 lg:flex lg:h-[min(680px,72svh)] lg:min-h-[430px] [contain:layout_style]">
          {items.map((item, index) => {
            const active = activeIndex === index;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelectProductById(item.id)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                data-cursor="view"
                className={`group relative h-[270px] w-full overflow-hidden rounded-3xl border border-white/10 bg-stone-950 text-left shadow-[0_20px_60px_rgba(20,0,8,.26)] transition-[flex-grow,border-color] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[flex-grow] [contain:paint] transform-gpu sm:h-[330px] lg:h-full ${
                  active ? 'lg:flex-[3.5] lg:border-rose-300/35' : 'lg:flex-1'
                }`}
              >
                <img
                  src={getImageUrl(item.imagens[0])}
                  srcSet={getImageSrcSet(item.imagens[0])}
                  sizes="(max-width: 1023px) 100vw, 35vw"
                  alt={item.titulo}
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                  loading="lazy"
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
                {/* Fixed base dark overlay */}
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out" />
                {/* Active gradient overlay with pure GPU opacity transition */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300 ease-out pointer-events-none transform-gpu ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7 pointer-events-none">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`max-w-[75%] rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-100 backdrop-blur-md transition-opacity duration-300 ease-out sm:text-[11px] transform-gpu ${active ? 'opacity-100' : 'opacity-100 lg:opacity-0'}`}>
                      {item.categoria}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-stone-950 transition-transform duration-300 ease-out group-hover:rotate-45 transform-gpu">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <div className={`max-w-xl transition-[transform,opacity] duration-300 ease-out transform-gpu ${active ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100 lg:translate-y-2 lg:opacity-0'}`}>
                    <h3 className="text-2xl font-normal tracking-tight text-white sm:text-3xl lg:text-4xl">
                      {item.titulo}
                    </h3>
                    <p className={`mt-2 line-clamp-2 text-sm leading-relaxed text-stone-200 transition-opacity duration-300 ease-out ${active ? 'opacity-100' : 'opacity-100 lg:opacity-0'}`}>
                      {item.descricao_curta}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
