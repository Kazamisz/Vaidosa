import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY } from '../data/company';

interface InitialEntranceProps { onComplete: () => void; }

export const InitialEntrance: React.FC<InitialEntranceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const statusText = 'Preparando sua experiência';
  const isCompleteRef = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const handleDismiss = () => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;
    setProgress(100);
    setIsVisible(false);
    completeRef.current();
  };

  useEffect(() => {
    let active = true;
    const finish = () => { if (active) handleDismiss(); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    // Decode only the responsive hero selected by the browser; never wait for offscreen sections.
    const hero = document.querySelector<HTMLImageElement>('#inicio img');
    const timeout = window.setTimeout(finish, 900);
    const progressTimer = window.setTimeout(() => { if (active) setProgress(65); }, 100);
    if (hero) {
      hero.decode().then(finish, finish);
    } else {
      finish();
    }
    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.clearTimeout(progressTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-entrance-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -18,
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080307] text-white select-none cursor-pointer overflow-hidden"
          role="dialog"
          aria-label="Carregando experiência Vaidosa Plus Size"
        >
          {/* Subtle Ambient Radial Backlight */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[480px] w-[480px] sm:h-[640px] sm:w-[640px] rounded-full bg-[radial-gradient(circle,rgba(169,41,90,0.22)_0%,rgba(121,9,49,0.12)_45%,transparent_70%)] blur-[90px]" />
          </div>

          {/* Central Luxury Emblem & Branding */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
            {/* Logo with Soft Luminescent Aura */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-fuchsia-600/25 via-rose-500/20 to-purple-600/25 blur-xl animate-pulse" />
              <img
                src="/images/logo-256.webp"
                alt={COMPANY.nome}
                className="relative z-10 h-12 sm:h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                loading="eager"
              />
            </motion.div>

            {/* Tagline */}
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-rose-300/90 mb-2"
            >
              Birigui • Alta Curadoria
            </motion.span>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="text-lg sm:text-xl font-normal tracking-wide text-white mb-6"
            >
              Elegância sem regras de tamanho
            </motion.h2>

            {/* Refined Minimalist Progress Bar */}
            <div className="w-full max-w-[220px] sm:max-w-[260px] h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-fuchsia-500 via-rose-400 to-amber-200 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.85)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Status Feedback and Progress Percentage */}
            <div className="flex items-center justify-between w-full max-w-[220px] sm:max-w-[260px] text-[10px] sm:text-[11px] text-stone-400 font-mono tracking-wider">
              <span className="text-stone-300 font-sans tracking-normal text-[11px] truncate pr-2">
                {statusText}
              </span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Quick skip hint */}
          <div className="absolute bottom-6 sm:bottom-8 text-[10px] text-stone-500 tracking-wider uppercase opacity-60">
            Toque para entrar
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
