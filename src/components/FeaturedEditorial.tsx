import React from 'react';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { COMPANY } from '../data/company';

interface FeaturedEditorialProps {
  onExploreCatalog: () => void;
}

export const FeaturedEditorial: React.FC<FeaturedEditorialProps> = ({ onExploreCatalog }) => {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#831843] via-[#9F1239] to-[#BE185D] text-white shadow-xl">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-rose-200" />
                <span className="text-xs font-bold tracking-wider uppercase text-rose-100">
                  Moda Especial Birigui
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Beleza autêntica em todos os tamanhos.
              </h2>

              <p className="text-rose-100 text-sm sm:text-base max-w-xl leading-relaxed">
                Descubra peças versáteis selecionadas para quem busca estilo, conforto e caimento impecável. Fale conosco para atendimento personalizado.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onExploreCatalog}
                  className="inline-flex items-center space-x-2 bg-white text-[#831843] hover:bg-rose-50 font-bold px-6 py-3 rounded-full shadow-md transition-all hover:scale-102 cursor-pointer text-sm"
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={COMPANY.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-black/30 hover:bg-black/40 text-white border border-white/30 font-semibold px-6 py-3 rounded-full transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chamar no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Badge & Photo preview (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              {/* Highlight Circle Pill */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex flex-col items-center justify-center text-center p-4 shadow-inner">
                <span className="text-xs uppercase font-bold tracking-widest text-rose-200">
                  Tamanhos
                </span>
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                  70 &amp; 80
                </span>
                <span className="text-[11px] text-rose-100 mt-1">
                  Feminino &amp; Masculino
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
