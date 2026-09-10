import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { COMPANY } from '../data/company';
import { PremiumWhatsAppIcon } from './PremiumWhatsAppIcon';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenFeatured: (productId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog }) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center justify-center pt-36 pb-28 md:pt-48 md:pb-40 overflow-hidden bg-stone-950 text-stone-100"
    >
      {/* Full-bleed Background Image (Raw / No filters) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/background-hero.webp"
          alt="Vaidosa Plus Size - Elegância e Moda"
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Cinematic Center Content Container - Max-w-6xl to enforce 2-line flow */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        {/* Subtle Brand Tagline */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-fuchsia-300 mb-6 sm:mb-8 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
          Birigui • Moda Plus Size Ele &amp; Ela
        </span>

        {/* H1 - Clamped and constrained to guarantee 2-3 lines max */}
        <h1
          className="font-normal text-white tracking-tight leading-[1.08] mb-8 sm:mb-10 text-balance"
          style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.25rem)' }}
        >
          Elegância sem regras de tamanho e proporções desenhadas para você.
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-base sm:text-xl text-stone-300 max-w-2xl font-light leading-relaxed mb-10 sm:mb-12">
          Curadoria com mais de 130 peças femininas até o 70 e masculinas até o 80, combinando caimento nobre e liberdade.
        </p>

        {/* Exactly Two High-Contrast CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* CTA 1: High Contrast Light Button (Dark Background = White/Light Button with Dark Text) */}
          <button
            onClick={onExploreCatalog}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-white hover:bg-stone-200 text-stone-950 text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-2xl hover:scale-105 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Ver Catálogo</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* CTA 2: High Contrast Accent Button (Pink/Purple with Luminescence Glow) */}
          <a
            href={COMPANY.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 hover:from-fuchsia-500 hover:via-purple-500 hover:to-pink-500 text-white text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(217,70,239,0.45)] hover:shadow-[0_0_35px_rgba(217,70,239,0.7)] hover:scale-105 cursor-pointer flex items-center justify-center space-x-2.5 border border-fuchsia-400/40"
          >
            <PremiumWhatsAppIcon size={20} className="w-5 h-5" glow />
            <span>Atendimento no WhatsApp</span>
          </a>
        </div>


      </div>
    </section>
  );
};
