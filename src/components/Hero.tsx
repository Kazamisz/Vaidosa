import React, { useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { COMPANY } from '../data/company';
import { PremiumWhatsAppIcon } from './PremiumWhatsAppIcon';
import { triggerHapticFeedback } from '../utils/haptics';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenFeatured: (productId?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, active: false }));
  };

  const handleScrollToNext = () => {
    const nextSection = document.getElementById('bento');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-24 overflow-hidden bg-stone-950 text-stone-100"
    >
      {/* Full-bleed Background Image with Mobile Focus on the Model */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/background-hero-1280.webp"
          srcSet="/images/background-hero-640.webp 640w, /images/background-hero-1280.webp 1280w, /images/background-hero.webp 1920w"
          sizes="100vw"
          alt="Vaidosa Plus Size - Elegância e Moda"
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-cover object-[78%_center] sm:object-center"
        />
        {/* Subtle mobile radial/vertical ambient contrast to ensure text pops and model stands out */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/30 to-stone-950/75 sm:hidden" />
      </div>

      {/* Cinematic Center Content Container - Max-w-6xl / 7xl */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center justify-center my-auto w-full">
        {/* Subtle Brand Tagline */}
        <span className="text-[11px] sm:text-sm font-semibold tracking-[0.22em] sm:tracking-[0.35em] uppercase text-fuchsia-300 -translate-y-1 sm:-translate-y-3 mb-2.5 sm:mb-5 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] whitespace-nowrap">
          Birigui • Moda Plus Size Ele &amp; Ela
        </span>

        {/* Premium Frosted Glass Card Container from Reference Image - Fully Responsive */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative w-fit max-w-[calc(100vw-1.5rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto overflow-hidden rounded-[18px] sm:rounded-[26px] md:rounded-[32px] border border-white/15 bg-stone-950/40 backdrop-blur-md px-3.5 py-3.5 sm:px-8 sm:py-6 md:px-12 md:py-7 lg:px-14 lg:py-8 mb-4 sm:mb-6 lg:mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-white/25 hover:bg-stone-950/50 inline-flex flex-col items-center justify-center text-center"
        >
          {/* Subtle light streak top border */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-200/30 to-transparent" />

          {/* Mouse-Sensitive Spotlight Aura inside the Card */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              background: mousePos.active
                ? `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 114, 182, 0.15), rgba(121, 9, 49, 0.08), transparent 75%)`
                : `radial-gradient(300px circle at 50% 50%, rgba(244, 114, 182, 0.06), transparent 70%)`,
              opacity: mousePos.active ? 1 : 0.4,
            }}
          />

          {/* H1 - Reference Style with Elegant Horizontal Gradient across Title Width and Interactive Word Hover */}
          <h1
            className="relative z-10 font-outfit tracking-[-0.015em] text-center select-none py-0.5 w-full"
            style={{
              fontSize: 'clamp(1.15rem, 5.2vw, 3.65rem)',
              lineHeight: 1.15,
              background: 'linear-gradient(90deg, #ffffff 0%, #f7e7ec 45%, #f3a6bd 75%, #ff4f78 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {/* Linha 1: Elegância sem Regras */}
            <span className="block whitespace-nowrap">
              {/* Elegância */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-bold">
                  Elegância
                </span>
              </span>{' '}

              {/* sem */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-normal">
                  sem
                </span>
              </span>{' '}

              {/* Regras */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-bold">
                  Regras
                </span>
              </span>
            </span>

            {/* Linha 2: Tamanhos e Proporções */}
            <span className="block whitespace-nowrap my-0.5 sm:my-1 md:my-1.5">
              {/* Tamanhos */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-bold">
                  Tamanhos
                </span>
              </span>{' '}

              {/* e */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-normal">
                  e
                </span>
              </span>{' '}

              {/* Proporções */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-bold">
                  Proporções
                </span>
              </span>
            </span>

            {/* Linha 3: Desenhadas para Você. */}
            <span className="block whitespace-nowrap">
              {/* Desenhadas */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-bold">
                  Desenhadas
                </span>
              </span>{' '}

              {/* para */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-normal">
                  para
                </span>
              </span>{' '}

              {/* Você. */}
              <span className="group/word relative inline-block mx-[2px] sm:mx-1 my-0 sm:my-0.5 transition-[text-shadow] duration-300 ease-out hover:[text-shadow:0_0_20px_rgba(244,114,182,0.65)] cursor-default">
                <span className="relative z-10 font-bold">
                  Você.
                </span>
              </span>
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle */}
        <p className="text-xs sm:text-base md:text-lg lg:text-xl text-stone-300 max-w-2xl lg:max-w-3xl font-light leading-relaxed mb-6 sm:mb-8 lg:mb-10">
          Curadoria com mais de 130 peças femininas até o 70 e masculinas até o 80, combinando caimento nobre e liberdade.
        </p>

        {/* Exactly Two High-Contrast CTAs - Compact and Elegant on Mobile with Haptic Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
          {/* CTA 1: High Contrast Luxury Pearl & Silk Light Button */}
          <button
            onClick={() => {
              triggerHapticFeedback(15);
              onExploreCatalog();
            }}
            className="btn-pearl-silk w-[82%] max-w-[260px] sm:w-auto sm:max-w-none px-6 py-3.5 sm:px-9 sm:py-4 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center space-x-2.5"
          >
            <span className="font-bold">Ver Catálogo</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* CTA 2: High Contrast Accent Button (Pink/Purple with Luminescence Glow) */}
          <a
            href={COMPANY.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHapticFeedback(20)}
            className="w-[82%] max-w-[260px] sm:w-auto sm:max-w-none px-5 py-3 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-[#b52d62] via-[#8f123f] to-[#4e051e] hover:from-[#c93b70] hover:via-[#a51b4c] hover:to-[#630626] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(121,9,49,0.5)] hover:shadow-[0_0_35px_rgba(169,41,90,0.62)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center space-x-2 border border-rose-200/30"
          >
            <PremiumWhatsAppIcon size={18} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" glow />
            <span>Atendimento no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Minimalist Pulsing Premium Scroll Down Indicator - Placed near bottom of section */}
      <motion.button
        onClick={handleScrollToNext}
        aria-label="Rolar para a próxima seção"
        className="group absolute bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center"
        >
          {/* Soft pulsing aura */}
          <span className="absolute -inset-2 rounded-full bg-[#661034]/35 blur-md group-hover:bg-[#661034]/60 transition-all duration-500 animate-pulse" />

          {/* Minimalist Glass Ring Button */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-rose-300/30 group-hover:border-rose-300/60 bg-[#661034] group-hover:bg-[#7e1441] transition-all duration-300 shadow-[0_4px_20px_rgba(102,16,52,0.6)] group-hover:shadow-[0_4px_25px_rgba(126,20,65,0.85)]">
            <ChevronDown className="w-5 h-5 text-white transition-colors duration-300 stroke-[2]" />
          </div>
        </motion.div>
      </motion.button>
    </section>
  );
};
