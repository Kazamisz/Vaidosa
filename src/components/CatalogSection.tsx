import React, { useState, useMemo } from 'react';
import { Search, X, Filter, MessageCircle, Eye, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Produto, CartItem } from '../types';
import { COMPANY } from '../data/company';
import { getImageUrl } from '../utils/image';
import { GLSLImageHover } from './GLSLImageHover';

interface CatalogSectionProps {
  products: Produto[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (p: Produto) => void;
  cart: CartItem[];
  onToggleCart: (id: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products = [],
  selectedCategory = 'Todos',
  onSelectCategory,
  onSelectProduct,
  cart = [],
  onToggleCart,
  searchInputRef
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(16);
  const [onlyCart, setOnlyCart] = useState(false);

  const cartIds = useMemo(() => cart.map(item => item.id), [cart]);
  const totalCartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Dynamic categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    (products || []).forEach(p => {
      if (p?.categoria) set.add(p.categoria);
    });
    return ['Todos', ...Array.from(set).sort()];
  }, [products]);

  // Filter products by category, search term, and cart
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    return (products || []).filter(p => {
      if (!p) return false;
      // Category match
      if (selectedCategory !== 'Todos' && p.categoria !== selectedCategory) {
        return false;
      }

      // Cart filter
      if (onlyCart && !cartIds.includes(p.id)) {
        return false;
      }

      // Search term match
      if (term) {
        const fullText = `${p.titulo} ${p.categoria} ${p.descricao_curta} ${p.descricao_comercial} ${p.palavras_chave?.join(' ') || ''}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        if (!fullText.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, searchTerm, onlyCart, cartIds]);

  // Sliced items for progressive loading
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 16);
  };

  const clearFilters = () => {
    setSearchTerm('');
    onSelectCategory('Todos');
    setOnlyCart(false);
    setVisibleCount(16);
  };

  return (
    <section id="catalogo" className="py-32 md:py-48 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 text-left gap-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-fuchsia-600 drop-shadow-[0_0_8px_rgba(217,70,239,0.35)]">
              Acervo &amp; Vitrine Oficial
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-stone-900 mt-3 leading-[1.15]">
              Catálogo de Looks ({filteredProducts.length} itens)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
            Disponibilidade de tamanhos, caimento personalizado e condições confirmados diretamente com o atendimento da loja.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(16);
                }}
                placeholder="Buscar por peça, cor, tecido ou estilo..."
                className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-stone-300/80 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all shadow-2xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Cart Toggle */}
            <button
              onClick={() => setOnlyCart(!onlyCart)}
              className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                onlyCart
                  ? 'bg-fuchsia-50/80 border-fuchsia-500 text-fuchsia-800 shadow-[0_0_12px_rgba(217,70,239,0.25)]'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${onlyCart ? 'text-fuchsia-600' : ''}`} />
              <span>No Carrinho ({totalCartCount})</span>
            </button>
          </div>

          {/* Category Filter Pills (Horizontal scrolling on mobile) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-left">
            <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
            {categories.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setVisibleCount(16);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_14px_rgba(217,70,239,0.45)]'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <Sparkles className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-800">Nenhuma peça encontrada</h3>
            <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
              Não encontramos nenhum item correspondente aos filtros atuais. Tente buscar com outros termos.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 inline-flex items-center space-x-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:scale-102 transition-all cursor-pointer"
            >
              <span>Limpar filtros de busca</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleProducts.map((item, idx) => {
            const inCart = cartIds.includes(item.id);
            const coverImage = getImageUrl(item.imagens[0]);
            const totalImgs = item.imagens.length;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.3) }}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-fuchsia-300 hover:shadow-[0_10px_30px_rgba(217,70,239,0.12)] transition-all duration-500 flex flex-col justify-between text-left"
              >
                {/* Photo container with 4:5 aspect ratio with OGL GLSL Shaders */}
                <div
                  onClick={() => onSelectProduct(item)}
                  data-cursor="view"
                  className="relative aspect-[4/5] bg-stone-100 cursor-pointer overflow-hidden"
                >
                  <GLSLImageHover
                    src={coverImage}
                    alt={`${item.titulo}, foto do catálogo`}
                    aspectRatio="aspect-[4/5]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/instagram/DRBTkLVDNXO/01.webp';
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    <span className="bg-[#1E1B18]/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.categoria}
                    </span>
                    {totalImgs > 1 && (
                      <span className="bg-white/90 text-stone-800 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit">
                        {totalImgs} fotos
                      </span>
                    )}
                  </div>

                  {/* Quick Cart Button on Top-Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCart(item.id);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2.5 rounded-full shadow-sm transition-all active:scale-90 cursor-pointer z-10 ${
                      inCart
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.6)]'
                        : 'bg-white/90 hover:bg-white text-stone-700'
                    }`}
                    title={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                    aria-label="Adicionar ao carrinho"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  {/* Hover visual label */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                    <span className="bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-md flex items-center space-x-1.5 border border-fuchsia-200">
                      <Eye className="w-3.5 h-3.5 text-fuchsia-600" />
                      <span>Ver Fotos</span>
                    </span>
                  </div>
                </div>

                {/* Card Info & Actions */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectProduct(item)}
                      className="font-serif text-base font-bold text-stone-900 group-hover:text-fuchsia-700 transition-colors leading-snug cursor-pointer line-clamp-1"
                    >
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.descricao_curta}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleCart(item.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        inCart
                          ? 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-300'
                          : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs hover:scale-102'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-fuchsia-600" />
                          <span>No Carrinho</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Carrinho</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`${COMPANY.whatsapp_url}?text=${encodeURIComponent(
                        `Olá! Vi a peça "${item.titulo}" (${item.categoria}) no catálogo da Vaidosa e gostaria de saber tamanhos disponíveis.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                      title="Pedir no WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>Carregar mais peças</span>
              <span className="text-stone-400 text-xs">
                ({visibleProducts.length} de {filteredProducts.length})
              </span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

