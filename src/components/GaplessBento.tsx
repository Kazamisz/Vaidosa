import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Produto } from '../types';
import GhostFibers from './GhostFibers';

interface GaplessBentoProps {
  products: Produto[];
  onSelectProduct: (product: Produto) => void;
  onExploreCatalog: () => void;
}

export const GaplessBento: React.FC<GaplessBentoProps> = ({
  products,
  onSelectProduct,
  onExploreCatalog,
}) => {
  // Select high-impact items for the bento
  const heroItem = products.find(p => p.id === 'projeto_drbtklvdnxo') || products[0];
  const item2 = products.find(p => p.id === 'projeto_dcwy2surwqd') || products[1];
  const item3 = products.find(p => p.id === 'projeto_drbtoi9dmno') || products[2];
  const item4 = products.find(p => p.id === 'projeto_dsw7a49gu1b') || products[3];
  const item5 = products.find(p => p.id === 'projeto_dsurcstg4h3') || products[4];
  const item6 = products.find(p => p.id === 'projeto_dtkuh7_j85r') || products[5];
  const item7 = products.find(p => p.id === 'projeto_dxlcvikjeyf') || products[6];

  const luminescentBorder = "bento-grid-item cursor-pointer";

  return (
    <section id="bento" className="py-28 md:py-40 bg-stone-950 relative overflow-hidden text-white">
      {/* GhostFibers Background with Store Premium #790931 Palette */}
      <GhostFibers
        lineColor="#790931"
        glowColor="#a21548"
        speed={0.15}
        scale={2.2}
        brightness={1.8}
        blueBoost={1.1}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-20 gap-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              Arquitetura de Formas &amp; Caimento
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight text-white mt-3 leading-[1.1]">
              Equilíbrio entre proporção, tecido fluido e linhas contemporâneas
            </h2>
          </div>
          <button
            onClick={onExploreCatalog}
            className="self-start md:self-end px-7 py-3.5 rounded-full bg-white hover:bg-stone-200 text-stone-950 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/40"
          >
            Explorar Acervo Completo
          </button>
        </div>

        {/* Dense Mathematical Bento Grid with Zero Holes */}
        <div className="grid grid-cols-12 grid-flow-dense gap-5 sm:gap-6">
          {/* Bento Card 1 (Large Anchor - 8 cols, 2 rows) */}
          <div
            onClick={() => onSelectProduct(heroItem)}
            data-cursor="view"
            className={`group col-span-12 lg:col-span-8 lg:row-span-2 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[460px] lg:min-h-[580px] cursor-pointer shadow-xl ${luminescentBorder}`}
          >
            <img
              src={`/${heroItem.imagens[0].replace(/^\/+/, '')}`}
              alt={heroItem.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wider uppercase text-stone-200">
                  {heroItem.categoria} • Destaque
                </span>
                <span className="w-11 h-11 rounded-full bg-white text-stone-950 flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
              <div className="max-w-xl">
                <h3 className="text-2xl sm:text-4xl font-normal text-white tracking-tight leading-tight">
                  {heroItem.titulo}
                </h3>
                <p className="text-stone-300 text-sm mt-2 line-clamp-2">
                  {heroItem.descricao_curta}
                </p>
                <div className="mt-4 flex items-center space-x-3 text-xs font-medium text-fuchsia-200">
                  <span>Tamanhos 46 ao 64</span>
                  <span>•</span>
                  <span>Consultar Loja</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2 (Side Upper - 4 cols, 1 row) */}
          <div
            onClick={() => onSelectProduct(item2)}
            data-cursor="view"
            className={`group col-span-12 sm:col-span-6 lg:col-span-4 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[280px] cursor-pointer shadow-lg ${luminescentBorder}`}
          >
            <img
              src={`/${item2.imagens[0].replace(/^\/+/, '')}`}
              alt={item2.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wider uppercase text-stone-200">
                  {item2.categoria}
                </span>
                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-stone-950 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div>
                <h4 className="text-xl font-normal text-white">{item2.titulo}</h4>
                <span className="text-xs text-stone-300 mt-1 block">Ver composição e medidas</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3 (Side Lower - 4 cols, 1 row) */}
          <div
            onClick={() => onSelectProduct(item3)}
            data-cursor="view"
            className={`group col-span-12 sm:col-span-6 lg:col-span-4 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[280px] cursor-pointer shadow-lg ${luminescentBorder}`}
          >
            <img
              src={`/${item3.imagens[0].replace(/^\/+/, '')}`}
              alt={item3.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wider uppercase text-stone-200">
                  {item3.categoria}
                </span>
                <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-white group-hover:text-stone-950 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div>
                <h4 className="text-xl font-normal text-white">{item3.titulo}</h4>
                <span className="text-xs text-stone-300 mt-1 block">Alfaiataria estruturada</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4 (Row 2 - Triad A: 4 cols) */}
          <div
            onClick={() => onSelectProduct(item4)}
            data-cursor="view"
            className={`group col-span-12 sm:col-span-6 lg:col-span-4 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[340px] cursor-pointer shadow-lg ${luminescentBorder}`}
          >
            <img
              src={`/${item4.imagens[0].replace(/^\/+/, '')}`}
              alt={item4.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wider uppercase text-stone-200 w-fit">
                {item4.categoria}
              </span>
              <div>
                <h4 className="text-xl font-normal text-white">{item4.titulo}</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{item4.descricao_curta}</p>
              </div>
            </div>
          </div>

          {/* Bento Card 5 (Row 2 - Triad B: 4 cols) */}
          <div
            onClick={() => onSelectProduct(item5)}
            data-cursor="view"
            className={`group col-span-12 sm:col-span-6 lg:col-span-4 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[340px] cursor-pointer shadow-lg ${luminescentBorder}`}
          >
            <img
              src={`/${item5.imagens[0].replace(/^\/+/, '')}`}
              alt={item5.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wider uppercase text-stone-200 w-fit">
                {item5.categoria}
              </span>
              <div>
                <h4 className="text-xl font-normal text-white">{item5.titulo}</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{item5.descricao_curta}</p>
              </div>
            </div>
          </div>

          {/* Bento Card 6 (Row 2 - Triad C: 4 cols) */}
          <div
            onClick={() => onSelectProduct(item6)}
            data-cursor="view"
            className={`group col-span-12 lg:col-span-4 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[340px] cursor-pointer shadow-lg ${luminescentBorder}`}
          >
            <img
              src={`/${item6.imagens[0].replace(/^\/+/, '')}`}
              alt={item6.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wider uppercase text-stone-200 w-fit">
                {item6.categoria}
              </span>
              <div>
                <h4 className="text-xl font-normal text-white">{item6.titulo}</h4>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{item6.descricao_curta}</p>
              </div>
            </div>
          </div>

          {/* Bento Card 7 (Row 3 - Wide: 7 cols) */}
          <div
            onClick={() => onSelectProduct(item7)}
            className={`group col-span-12 lg:col-span-7 relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[360px] cursor-pointer shadow-lg ${luminescentBorder}`}
          >
            <img
              src={`/${item7.imagens[0].replace(/^\/+/, '')}`}
              alt={item7.titulo}
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wider uppercase text-stone-200">
                  {item7.categoria}
                </span>
                <span className="w-9 h-9 rounded-full bg-white text-stone-950 flex items-center justify-center transition-transform group-hover:rotate-45 duration-300 shadow-md">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-normal text-white">{item7.titulo}</h4>
                <p className="text-xs text-stone-300 mt-1">{item7.descricao_curta}</p>
              </div>
            </div>
          </div>

          {/* Bento Card 8 (Row 3 - Editorial Narrative Block: 5 cols) */}
          <div className={`col-span-12 lg:col-span-5 rounded-3xl bg-[#1E1B18] text-white p-8 sm:p-10 flex flex-col justify-between shadow-lg ${luminescentBorder}`}>
            <div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                Manifesto da Marca
              </span>
              <h4 className="text-2xl sm:text-3xl font-normal text-white tracking-tight mt-3 leading-snug">
                Moda feita para vestir sua autenticidade, com tecidos de toque macio e corte preciso.
              </h4>
            </div>
            <div className="pt-8 border-t border-purple-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-stone-400">Atendimento em Birigui</p>
                <p className="text-sm font-semibold text-white mt-0.5">Av. Cidade Jardim, 1100</p>
              </div>
              <button
                onClick={onExploreCatalog}
                className="px-5 py-2.5 rounded-full bg-white text-stone-950 hover:bg-stone-200 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                Ver Coleção
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
