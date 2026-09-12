import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Produto } from '../types';

interface CategoryBarProps {
  products: Produto[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  products = [],
  selectedCategory,
  onSelectCategory
}) => {
  // Aggregate category counts dynamically from products.json
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, { count: number; sampleImage: string }> = {};
    const safeProducts = Array.isArray(products) ? products : [];
    safeProducts.forEach(p => {
      if (p && p.categoria) {
        if (!counts[p.categoria]) {
          counts[p.categoria] = { count: 0, sampleImage: `/${(p.imagens?.[0] || '').replace(/^\/+/, '')}` };
        }
        counts[p.categoria].count++;
      }
    });
    return counts;
  }, [products]);

  // Curated list of main visible categories
  const categoriesList: [string, { count: number; sampleImage: string }][] = (
    Object.entries(categoryCounts) as [string, { count: number; sampleImage: string }][]
  )
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  return (
    <section id="categorias" className="py-12 border-t border-stone-200/80 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-700 drop-shadow-[0_0_8px_rgba(217,70,239,0.3)]">
              Navegue por Categoria
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Encontre o estilo perfeito
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('Todos')}
            className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-fuchsia-700 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>Ver todas as peças</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid (Circular / Elegant Cards inspired by Lumora) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categoriesList.map(([category, { count, sampleImage }]) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(isSelected ? 'Todos' : category)}
                className={`group flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer ${
                  isSelected ? 'bg-fuchsia-50/80 ring-2 ring-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.25)]' : 'hover:bg-stone-100/70'
                }`}
              >
                {/* Circular image frame */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-stone-200 border-2 border-white shadow-sm mb-3 group-hover:scale-105 transition-transform">
                  <img
                    src={sampleImage}
                    alt={category}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <span className="text-sm font-bold text-stone-800 group-hover:text-fuchsia-700 transition-colors leading-tight">
                  {category}
                </span>
                <span className="text-xs text-stone-500 mt-0.5">
                  {count} {count === 1 ? 'modelo' : 'modelos'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
