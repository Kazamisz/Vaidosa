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
        <span className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase text-fuchsia-300 -translate-y-2 sm:-translate-y-3 mb-3 sm:mb-5 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
          Birigui • Moda Plus Size Ele &amp; Ela
        </span>

        {/* Premium Frosted Glass Card Container with Dynamic Mouse-Sensitive Luminescence - Hugging Text */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative w-fit max-w-[calc(100vw-2rem)] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-white/15 bg-stone-950/35 backdrop-blur-[6px] px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 mb-5 sm:mb-7 lg:mb-8 shadow-[0_16px_50px_rgba(0,0,0,0.55)] transition-all duration-500 hover:border-white/30 hover:bg-stone-950/45 hover:shadow-[0_24px_65px_rgba(121,9,49,0.25)] inline-flex flex-col items-center justify-center text-center"
        >
          {/* Subtle light streak top border */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-200/40 to-transparent" />

          {/* Mouse-Sensitive Spotlight Aura inside the Card */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
            style={{
              background: mousePos.active
                ? `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 114, 182, 0.2), rgba(121, 9, 49, 0.1), transparent 75%)`
                : `radial-gradient(300px circle at 50% 50%, rgba(244, 114, 182, 0.08), transparent 70%)`,
              opacity: mousePos.active ? 1 : 0.4,
            }}
          />

          {/* H1 - High contrast editorial presentation with breathing float, thicker weight, solid colors */}
          <h1
            className="relative z-10 font-semibold sm:font-bold tracking-tight leading-[1.32] sm:leading-[1.38] md:leading-[1.42] lg:leading-[1.36] [word-spacing:0.16em] sm:[word-spacing:0.22em] text-balance max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl animate-hero-float hero-text-stroke transition-all duration-300 select-none py-1"
            style={{
              fontSize: 'clamp(1.85rem, 3.8vw, 3.75rem)',
            }}
          >
            {/* Word 1: Elegância */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-white hover:text-stone-100 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] cursor-default">
              Elegância
            </span>{' '}
            {/* Word 2: sem - Diamond Rose Quartz */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-stone-100 hover:text-[#ffe4e6] hover:drop-shadow-[0_0_20px_rgba(254,205,211,0.85)] cursor-default">
              sem
            </span>{' '}
            {/* Word 3: regras - Velvet Bordeaux / Crimson */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-rose-100 hover:text-[#f43f5e] hover:drop-shadow-[0_0_24px_rgba(244,63,94,0.9)] cursor-default">
              regras
            </span>{' '}
            {/* Word 4: de - Soft Amethyst Rose */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-stone-200 hover:text-[#f5d0fe] hover:drop-shadow-[0_0_20px_rgba(232,121,249,0.85)] cursor-default">
              de
            </span>{' '}
            {/* Word 5: tamanho - Fuchsia Royale */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-white hover:text-[#e879f9] hover:drop-shadow-[0_0_26px_rgba(217,70,239,0.95)] cursor-default">
              tamanho
            </span>{' '}
            {/* Word 6: e - Sunset Rose Gold */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-rose-200 hover:text-[#fb7185] hover:drop-shadow-[0_0_20px_rgba(251,113,133,0.85)] cursor-default">
              e
            </span>{' '}
            {/* Word 7: proporções - Magenta to Orchid Solid */}
            <span className="inline-block mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-rose-200 hover:text-[#d946ef] hover:drop-shadow-[0_0_26px_rgba(160,43,212,0.9)] cursor-default">
              proporções
            </span>{' '}
            {/* Word 8: desenhadas - Radiant Rose Gold */}
            <span className="inline-block italic font-semibold mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-rose-200 hover:text-[#f472b6] hover:drop-shadow-[0_0_24px_rgba(244,114,182,0.9)] cursor-default">
              desenhadas
            </span>{' '}
            {/* Word 9: para - Pure Pearl Rose */}
            <span className="inline-block italic font-semibold mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-0.5 text-rose-200/90 hover:text-[#fce7f3] hover:drop-shadow-[0_0_20px_rgba(244,114,182,0.8)] cursor-default">
              para
            </span>{' '}
            {/* Word 10: você. - Signature Burgundy / Deep Velvet Rose */}
            <span className="inline-block italic font-bold mx-0.5 sm:mx-1 my-0.5 sm:my-1 transition-all duration-300 ease-out hover:scale-[1.06] hover:-translate-y-0.5 text-[#fb7185] hover:text-[#e11d48] hover:drop-shadow-[0_0_28px_rgba(225,29,72,0.95)] cursor-default">
              você.
            </span>
          </h1>
        </div>

        {/* Editorial Subtitle */}
        <p className="text-xs sm:text-base md:text-lg lg:text-xl text-stone-300 max-w-2xl lg:max-w-3xl font-light leading-relaxed mb-6 sm:mb-8 lg:mb-10">
          Curadoria com mais de 130 peças femininas até o 70 e masculinas até o 80, combinando caimento nobre e liberdade.
        </p>

        {/* Exactly Two High-Contrast CTAs - Compact and Elegant on Mobile with Haptic Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
          {/* CTA 1: High Contrast Light Button */}
          <button
            onClick={() => {
              triggerHapticFeedback(15);
              onExploreCatalog();
            }}
            className="w-[82%] max-w-[260px] sm:w-auto sm:max-w-none px-5 py-3 sm:px-9 sm:py-4 rounded-full bg-white hover:bg-stone-200 text-stone-950 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Ver Catálogo</span>
            <ArrowUpRight className="w-4 h-4" />
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
