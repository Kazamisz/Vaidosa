import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY } from '../data/company';

interface InitialEntranceProps {
  onComplete: () => void;
}

export const InitialEntrance: React.FC<InitialEntranceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [statusText, setStatusText] = useState('Iniciando alta curadoria...');
  const isCompleteRef = useRef(false);

  // List of all Formas (Bento) images and responsive variants to prefetch & GPU-decode
  const formasImagePaths = [
    '/images/instagram/DRBTkLVDNXO/01.webp',
    '/images/instagram/DRBTkLVDNXO/01-480.webp',
    '/images/instagram/DRBTkLVDNXO/01-960.webp',
    '/images/instagram/DcWY2suRWQD/01.webp',
    '/images/instagram/DcWY2suRWQD/01-480.webp',
    '/images/instagram/DcWY2suRWQD/01-960.webp',
    '/images/instagram/DRBToI9DMno/01.webp',
    '/images/instagram/DRBToI9DMno/01-480.webp',
    '/images/instagram/DRBToI9DMno/01-960.webp',
    '/images/instagram/Db8jnVWPvoU/01.webp',
    '/images/instagram/Db8jnVWPvoU/01-480.webp',
    '/images/instagram/Db8jnVWPvoU/01-960.webp',
    '/images/instagram/DUqCaGTgKWI/01.webp',
    '/images/instagram/DUqCaGTgKWI/01-480.webp',
    '/images/instagram/DUqCaGTgKWI/01-960.webp',
    '/images/instagram/DYGalCJjEim/01.webp',
    '/images/instagram/DYGalCJjEim/01-480.webp',
    '/images/instagram/DYGalCJjEim/01-960.webp',
    '/images/instagram/DSnKZh7AH7Z/01.webp',
    '/images/instagram/DSnKZh7AH7Z/01-480.webp',
    '/images/instagram/DSnKZh7AH7Z/01-960.webp',
  ];

  // Expose verification diagnostic tool to window for real test validation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verifyDiagnostics = () => {
        // 1. Bento Section Check
        const bentoSection = document.getElementById('bento');
        const bentoImages = Array.from(document.querySelectorAll<HTMLImageElement>('#bento img'));
        const bentoCanvas = document.querySelector<HTMLCanvasElement>('#bento canvas');
        const bentoCards = document.querySelectorAll('#bento [data-cursor="view"]');

        const bentoDetails = bentoImages.map((img) => ({
          src: img.currentSrc || img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        }));

        const bentoImagesReady = bentoImages.length >= 7 && bentoDetails.every((d) => d.complete && d.naturalWidth > 0);
        const bentoCanvasReady = Boolean(bentoCanvas && bentoCanvas.width > 0 && bentoCanvas.height > 0);
        const bentoSectionReady = Boolean(bentoSection && bentoCards.length >= 7);

        // 2. Exploração Tátil (Accordion & GhostFibers) Check
        const accordionSection = document.getElementById('exploracao-tatil');
        const accordionImages = Array.from(document.querySelectorAll<HTMLImageElement>('#exploracao-tatil img'));
        const ghostFibersCanvas = document.querySelector<HTMLCanvasElement>('.section-fusion canvas');
        const accordionCards = document.querySelectorAll('#exploracao-tatil [data-cursor="view"]');

        const accordionDetails = accordionImages.map((img) => ({
          src: img.currentSrc || img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        }));

        const accordionImagesReady = accordionImages.length >= 4 && accordionDetails.every((d) => d.complete && d.naturalWidth > 0);
        const ghostFibersReady = Boolean(ghostFibersCanvas && ghostFibersCanvas.width > 0 && ghostFibersCanvas.height > 0);
        const accordionSectionReady = Boolean(accordionSection && accordionCards.length >= 4);

        const allReady = bentoImagesReady && bentoCanvasReady && bentoSectionReady && accordionImagesReady && ghostFibersReady && accordionSectionReady;

        return {
          success: allReady,
          formas: {
            ready: bentoImagesReady && bentoCanvasReady && bentoSectionReady,
            sectionExists: Boolean(bentoSection),
            totalCards: bentoCards.length,
            imagesCount: bentoImages.length,
            imagesLoaded: bentoDetails.filter((d) => d.complete && d.naturalWidth > 0).length,
            webglCanvas: Boolean(bentoCanvas),
          },
          exploracaoTatil: {
            ready: accordionImagesReady && ghostFibersReady && accordionSectionReady,
            sectionExists: Boolean(accordionSection),
            totalCards: accordionCards.length,
            imagesCount: accordionImages.length,
            imagesLoaded: accordionDetails.filter((d) => d.complete && d.naturalWidth > 0).length,
            ghostFibersCanvas: Boolean(ghostFibersCanvas),
          },
        };
      };

      (window as any).__VERIFY_FORMAS_SECTION_LOADED__ = verifyDiagnostics;
      (window as any).__VERIFY_ALL_PRELOADED_SECTIONS__ = verifyDiagnostics;
    }
  }, []);

  useEffect(() => {
    let active = true;

    // Quick escape if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Phase 1: Real asset decoding & GPU pipeline warm-up
    const loadPromise = async () => {
      // 1. Decode all Formas & Exploração Tátil image assets into GPU memory
      const decodePromises = formasImagePaths.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          if (typeof img.decode === 'function') {
            img.decode().then(() => resolve()).catch(() => resolve());
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        });
      });

      await Promise.allSettled(decodePromises);

      // 2. Poll for DOM #bento and #exploracao-tatil sections & canvas readiness
      const maxAttempts = 35;
      for (let i = 0; i < maxAttempts; i++) {
        const bento = document.getElementById('bento');
        const bentoImgs = Array.from(document.querySelectorAll<HTMLImageElement>('#bento img'));
        const bentoCanvas = document.querySelector<HTMLCanvasElement>('#bento canvas');

        const accordion = document.getElementById('exploracao-tatil');
        const accordionImgs = Array.from(document.querySelectorAll<HTMLImageElement>('#exploracao-tatil img'));
        const ghostFibersCanvas = document.querySelector<HTMLCanvasElement>('.section-fusion canvas');

        const bentoReady = Boolean(bento) && bentoImgs.length >= 7 && bentoImgs.every((img) => img.complete && img.naturalWidth > 0) && Boolean(bentoCanvas && bentoCanvas.width > 0);
        const accordionReady = Boolean(accordion) && accordionImgs.length >= 4 && accordionImgs.every((img) => img.complete && img.naturalWidth > 0) && Boolean(ghostFibersCanvas && ghostFibersCanvas.width > 0);

        if (bentoReady && accordionReady) {
          break;
        }
        await new Promise((r) => setTimeout(r, 50));
      }

      // 3. Ensure fonts are ready
      if ('fonts' in document) {
        try {
          await document.fonts.ready;
        } catch {}
      }
    };

    const sectionReadyPromise = loadPromise();

    // Phase 2: Luxury paced progress bar (~2200ms) ensuring zero visual pop-in or stutter
    const startTime = performance.now();
    const minDuration = 2200; // Optimal duration for simultaneous GPU, texture, and WebGL shader warm-up
    let animationFrameId: number;

    const animateProgress = async (currentTime: number) => {
      if (!active) return;

      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / minDuration, 1);

      // Natural cubic-bezier deceleration curve
      const eased = 1 - Math.pow(1 - progressRatio, 2.8);
      const targetPercent = Math.min(Math.round(eased * 100), 96);

      setProgress(targetPercent);

      // Update editorial status text according to progress milestones
      if (targetPercent < 25) {
        setStatusText('Iniciando atelier...');
      } else if (targetPercent < 55) {
        setStatusText('Renderizando arquitetura de formas...');
      } else if (targetPercent < 80) {
        setStatusText('Sincronizando exploração tátil...');
      } else if (targetPercent < 95) {
        setStatusText('Decodificando catálogo e texturas...');
      } else {
        setStatusText('Finalizando sincronização visual...');
      }

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Wait for actual section preparation to be 100% complete
        await sectionReadyPromise;
        if (!active) return;

        setProgress(100);
        setStatusText('Coleção preparada');

        // Elegant hold before cinematic reveal
        setTimeout(() => {
          if (!active) return;
          setIsVisible(false);
          setTimeout(() => {
            if (!active || isCompleteRef.current) return;
            isCompleteRef.current = true;
            onComplete();
          }, 500);
        }, 220);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  const handleDismiss = () => {
    if (isCompleteRef.current) return;
    isCompleteRef.current = true;
    setIsVisible(false);
    onComplete();
  };

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
