import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ShoppingBag, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Produto, CartItem } from '../types';
import { getImageUrl } from '../utils/image';
import { GLSLImageHover } from './GLSLImageHover';

gsap.registerPlugin(ScrollTrigger);

interface CuratedLooksProps {
  products: Produto[];
  onSelectProduct: (p: Produto) => void;
  cart: CartItem[];
  onToggleCart: (id: string) => void;
}

export const CuratedLooks: React.FC<CuratedLooksProps> = ({
  products = [],
  onSelectProduct,
  cart = [],
  onToggleCart,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const curatedIds = [
    'projeto_drbtklvdnxo', // Macacão azul com cinto
    'projeto_dcwy2surwqd', // Vestido midi laranja estampado
    'projeto_db8jnvwpvou', // Conjunto bege blazer
    'projeto_duqcagtgkwi', // Vestido longo azul teal fenda
    'projeto_dygalcjjeim', // Conjunto jeans tomara que caia
    'projeto_dsnkzh7ah7z', // Macacão com aplicação de paetês
  ];

  const curated = curatedIds
    .map(id => (products || []).find(p => p.id === id))
    .filter((p): p is Produto => Boolean(p));

  const cartIds = cart.map(c => c.id);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.gsap-scroll-card');
      if (cards && cards.length > 0) {
        cards.forEach(card => {
          gsap.fromTo(
            card,
            { opacity: 0.85, y: 15 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'center 50%',
                scrub: 0.6,
              },
            }
          );
        });
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, [curated]);

  if (curated.length === 0) return null;

  return (
    <section
      id="curadoria"
      ref={sectionRef}
      className="py-32 md:py-48 bg-[#FAF8F5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-fuchsia-700">
              Curadoria de Estúdio
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-stone-900 mt-3 leading-[1.15]">
              Silhuetas pensadas para valorizar com sofisticação
            </h2>
          </div>
          <p className="text-stone-600 text-sm max-w-md">
            Cada look é selecionado com base em sustentação, liberdade de movimento e riqueza de acabamentos.
          </p>
        </div>

        {/* Dynamic Card Grid with Advanced GSAP Scroll & Hover Physics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {curated.map(item => {
            const inCart = cartIds.includes(item.id);
            const imgSrc = getImageUrl(item.imagens[0]);

            return (
              <div
                key={item.id}
                className="gsap-scroll-card group relative rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Image Container with Hover Scale and GSAP Scroll Scale */}
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 cursor-pointer"
                  data-cursor="view"
                  onClick={() => onSelectProduct(item)}
                >
                  <GLSLImageHover
                    src={imgSrc}
                    alt={item.titulo}
                    aspectRatio="aspect-[3/4]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity pointer-events-none z-10" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                      {item.categoria}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCart(item.id);
                      }}
                      className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        inCart
                          ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.6)]'
                          : 'bg-white/70 hover:bg-white text-stone-800'
                      }`}
                      aria-label="Adicionar ao carrinho"
                      title={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Quick Look prompt on image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none">
                    <span className="text-xs tracking-wider uppercase font-medium">
                      Ver no Provador
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white text-stone-950 flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shadow-md">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-normal text-stone-900 tracking-tight">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.descricao_curta}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-600 font-medium">
                      Birigui • Pronta Entrega
                    </span>
                    <button
                      onClick={() => onSelectProduct(item)}
                      className="text-xs font-semibold uppercase tracking-wider text-fuchsia-700 hover:text-purple-900 transition-colors cursor-pointer"
                    >
                      Detalhes &rarr;
                    </button>
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

