import React, { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Produto } from '../types';
import { getImageUrl } from '../utils/image';
import { GLSLImageHover } from './GLSLImageHover';
import { ANIMATION_FPS } from '../utils/animation';
import { DeferredRender } from './DeferredRender';

const Scanner = lazy(() => import('./backgrounds/Scanner'));

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.fps(ANIMATION_FPS);

interface CuratedLooksProps {
  products: Produto[];
  onSelectProduct: (product: Produto) => void;
  onAddToCart: (id: string) => void;
}

const CURATED_IDS = [
  'projeto_drbtklvdnxo',
  'projeto_dcwy2surwqd',
  'projeto_db8jnvwpvou',
  'projeto_duqcagtgkwi',
  'projeto_dygalcjjeim',
  'projeto_dsnkzh7ah7z',
];

export const CuratedLooks: React.FC<CuratedLooksProps> = ({ products, onSelectProduct, onAddToCart }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const curated = useMemo(
    () => CURATED_IDS.map(id => products.find(product => product.id === id)).filter((product): product is Produto => Boolean(product)),
    [products],
  );

  useEffect(() => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.gsap-scroll-card');
      cards?.forEach(card => {
        gsap.fromTo(
          card,
          { opacity: 0.82, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'center 58%',
              scrub: 0.5,
            },
          },
        );
      });
    }, sectionRef.current);
    return () => context.revert();
  }, [curated]);

  if (!curated.length) return null;

  return (
    <section id="curadoria" ref={sectionRef} className="curated-ambient relative isolate overflow-hidden bg-[#10050a] py-20 text-white sm:py-24 md:py-32">
      <DeferredRender className="absolute inset-0" rootMargin="1200px 0px">
        <Suspense fallback={null}>
          <Scanner
          color1="#4b0018"
          color2="#c71955"
          color3="#ff709f"
          speed={0.35}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={2.4}
          scale={1.7}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.32}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={1.2}
          contrast={1.05}
          softness={1.4}
          vignette={0.45}
          scanline
          grain
          grainIntensity={0.05}
          opacity={1}
          mouseInteraction={false}
          mouseRadius={0.5}
          mouseStrength={0.5}
          />
        </Suspense>
      </DeferredRender>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,3,7,.12),rgba(16,5,10,.38))]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">
            Curadoria de estúdio
          </span>
          <h2 className="mt-3 text-3xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl">
            Silhuetas pensadas para valorizar com sofisticação
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Cada look é selecionado com atenção ao caimento, à liberdade de movimento e aos acabamentos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {curated.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') onSelectProduct(item);
              }}
              role="button"
              tabIndex={0}
              data-cursor="view"
              className="premium-product-card bento-grid-item gsap-scroll-card group flex min-w-0 flex-col overflow-hidden rounded-[28px] text-left text-white transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
                <GLSLImageHover
                  src={getImageUrl(item.imagens[0])}
                  alt={item.titulo}
                  aspectRatio="aspect-[3/4]"
                  onError={event => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/5 opacity-65 transition-opacity group-hover:opacity-85" />
                <span className="pointer-events-none absolute left-4 top-4 max-w-[70%] truncate rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                  {item.categoria}
                </span>
                <span className="pointer-events-none absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-950 shadow-lg transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="flex min-h-[168px] flex-1 flex-col justify-between p-5 sm:p-6">
                <div>
                  <h3 className="line-clamp-2 text-lg font-medium leading-snug text-white sm:text-xl">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-400 sm:text-sm">
                    {item.descricao_curta}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-fuchsia-300/18 pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-300">
                    Ver no provador
                  </span>
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation();
                      onAddToCart(item.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/30 bg-gradient-to-r from-[#a9295a] to-[#790931] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_22px_rgba(121,9,49,.34)] transition-transform duration-300 hover:scale-[1.03]"
                    aria-label={`Adicionar ${item.titulo} ao carrinho`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
