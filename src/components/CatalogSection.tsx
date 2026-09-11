import React, { lazy, Suspense, useMemo, useState } from 'react';
import { Eye, Filter, Search, ShoppingBag, Sparkles, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Produto } from '../types';
import { getImageUrl } from '../utils/image';
import { GLSLImageHover } from './GLSLImageHover';
import { DeferredRender } from './DeferredRender';

const Silk = lazy(() => import('./backgrounds/Silk'));

interface CatalogSectionProps {
  products: Produto[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Produto) => void;
  onAddToCart: (id: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products = [],
  selectedCategory = 'Todos',
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  searchInputRef,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(16);
  const reduceMotion = useReducedMotion();
  const effectiveCategory = selectedCategory === 'Ambiente Comercial' ? 'Todos' : selectedCategory;

  const categories = useMemo(() => {
    const values = new Set<string>();
    products.forEach(product => {
      if (product?.categoria && product.categoria !== 'Ambiente Comercial') values.add(product.categoria);
    });
    return ['Todos', ...Array.from(values).sort((a, b) => a.localeCompare(b, 'pt-BR'))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = normalize(searchTerm);
    return products.filter(product => {
      if (!product) return false;
      if (effectiveCategory !== 'Todos' && product.categoria !== effectiveCategory) return false;
      if (!term) return true;
      const searchable = normalize([
        product.titulo,
        product.categoria,
        product.descricao_curta,
        product.descricao_comercial,
        ...(product.palavras_chave || []),
      ].join(' '));
      return searchable.includes(term);
    });
  }, [effectiveCategory, products, searchTerm]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const resetFilters = () => {
    setSearchTerm('');
    onSelectCategory('Todos');
    setVisibleCount(16);
  };

  return (
    <section id="catalogo" className="relative isolate overflow-hidden bg-[#080307] py-20 text-white sm:py-24 md:py-32">
      <DeferredRender className="absolute inset-0" rootMargin="1200px 0px">
        <Suspense fallback={null}>
          <Silk
            speed={5}
            scale={0.9}
            color="#630626"
            noiseIntensity={0.9}
            rotation={0}
          />
        </Suspense>
      </DeferredRender>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl text-left sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-300">
            Acervo e vitrine oficial
          </span>
          <h2 className="mt-3 text-3xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl">
            Catálogo de looks ({filteredProducts.length} itens)
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-300 sm:text-base">
            Explore o acervo visual e abra cada peça para ver suas fotos e detalhes.
          </p>
        </div>

        <div className="mb-8 space-y-4 rounded-3xl border border-white/10 bg-black/35 p-3 backdrop-blur-xl sm:p-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchTerm}
              onChange={event => {
                setSearchTerm(event.target.value);
                setVisibleCount(16);
              }}
              placeholder="Buscar por peça, cor, tecido ou estilo"
              className="w-full rounded-2xl border border-white/12 bg-white/95 py-3 pl-10 pr-10 text-sm text-stone-900 outline-none placeholder:text-stone-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/35"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <Filter className="mt-2 h-4 w-4 shrink-0 text-rose-300" />
            <div data-lenis-prevent className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain pb-1 scrollbar-none">
              <div className="grid w-max grid-flow-col grid-rows-2 gap-1.5 sm:flex sm:w-auto sm:flex-wrap xl:flex-nowrap">
                {categories.map(category => {
                  const active = effectiveCategory === category;
                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() => {
                        onSelectCategory(category);
                        setVisibleCount(16);
                      }}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? 'border-rose-300/70 bg-[#790931] text-white'
                          : 'border-white/12 bg-white/8 text-stone-200 hover:border-rose-300/45 hover:bg-white/12'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-black/30 px-4 py-16 text-center backdrop-blur-md">
            <Sparkles className="mx-auto mb-3 h-9 w-9 text-rose-300" />
            <h3 className="text-lg font-semibold text-white">Nenhuma peça encontrada</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-300">
              Tente outro termo ou limpe os filtros atuais.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-stone-950 transition-transform hover:scale-[1.02]"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.025, 0.2) }}
                onClick={() => onSelectProduct(item)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') onSelectProduct(item);
                }}
                role="button"
                tabIndex={0}
                data-cursor="view"
                className="catalog-product-card premium-product-card bento-grid-item group flex min-w-0 flex-col overflow-hidden rounded-[28px] text-left text-white transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1"
              >
                <div className="catalog-card-image relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                  <GLSLImageHover
                    src={getImageUrl(item.imagens[0])}
                    alt={`${item.titulo}, foto do catálogo`}
                    aspectRatio="aspect-[4/5]"
                    onError={event => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5 opacity-70 transition-opacity group-hover:opacity-90" />
                  <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
                    <span className="max-w-full truncate rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-md sm:text-[10px]">
                      {item.categoria}
                    </span>
                    {item.imagens.length > 1 && (
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold text-stone-800 sm:text-[10px]">
                        {item.imagens.length} fotos
                      </span>
                    )}
                  </div>
                  <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-950 shadow-lg transition-transform group-hover:scale-105">
                    <Eye className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex min-h-[158px] flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <h3 className="line-clamp-2 text-base font-medium leading-snug text-white sm:text-lg">
                      {item.titulo}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-400 sm:text-sm">
                      {item.descricao_curta}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-fuchsia-300/18 pt-3.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-rose-300">
                      Ver detalhes
                    </span>
                    <button
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        onAddToCart(item.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-300/30 bg-gradient-to-r from-[#a9295a] to-[#790931] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(121,9,49,.32)] transition-transform duration-300 hover:scale-[1.03] sm:text-[10px]"
                      aria-label={`Adicionar ${item.titulo} ao carrinho`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Adicionar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {visibleCount < filteredProducts.length && (
          <div className="mt-10 text-center sm:mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount(count => count + 16)}
              className="rounded-full border border-white/15 bg-white px-7 py-3.5 text-sm font-semibold text-stone-950 transition-transform hover:scale-[1.02]"
            >
              Carregar mais peças ({visibleProducts.length} de {filteredProducts.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
