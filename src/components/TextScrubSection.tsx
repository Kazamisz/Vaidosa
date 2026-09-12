import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_FPS } from '../utils/animation';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.fps(ANIMATION_FPS);

export const TextScrubSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const words = textRef.current.querySelectorAll('.scrub-word');
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15, y: 10 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: '65% 60%',
            scrub: 0.8,
          },
        }
      );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  const manifestoWords = [
    'Na', 'Vaidosa,', 'a', 'moda', 'não', 'tenta', 'disfarçar', 'corpos.',
    'Ela', 'celebra', 'a', 'presença,', 'amplia', 'a', 'postura', 'e',
    'enaltece', 'a', 'beleza', 'singular', 'de', 'cada', 'curva.',
    'Criamos', 'espaço', 'para', 'que', 'você', 'encontre', 'alfaiataria',
    'impecável,', 'tecidos', 'nobres', 'e', 'estampas', 'vibrantes',
    'feitas', 'sob', 'medida', 'para', 'o', 'seu', 'estilo', 'de', 'vida.'
  ];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-16 text-stone-100 md:py-24"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,3,7,.75)_0%,rgba(8,3,7,.85)_50%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        {/* Massive Editorial Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-white leading-[1.25] mb-12 sm:mb-16">
          Vestir a própria essência é um ato de elegância e poder.
        </h2>

        {/* Scrubbing Reveal Paragraph */}
        <div className="max-w-4xl mx-auto">
          <p
            ref={textRef}
            className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed text-stone-300"
          >
            {manifestoWords.map((word, index) => (
              <span key={index} className="scrub-word inline-block mr-2">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Bottom Editorial Details */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-xs sm:text-sm uppercase tracking-widest text-stone-400">
          <div>
            <span className="block text-white font-semibold text-lg">46 ao 70</span>
            <span>Grade Feminina</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)] hidden sm:block" />
          <div>
            <span className="block text-white font-semibold text-lg">Até o 80</span>
            <span>Grade Masculina</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)] hidden sm:block" />
          <div>
            <span className="block text-white font-semibold text-lg">Birigui - SP</span>
            <span>Loja Física &amp; Provador</span>
          </div>
        </div>
      </div>
    </section>
  );
};
