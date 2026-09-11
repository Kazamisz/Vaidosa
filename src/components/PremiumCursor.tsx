import React, { useEffect, useState, useRef } from 'react';
import { ANIMATION_FRAME_INTERVAL } from '../utils/animation';

type CursorVariant = 'default' | 'pointer' | 'text' | 'view';

export const PremiumCursor: React.FC = () => {
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: -200, y: -200 });
  const followerPos = useRef({ x: -200, y: -200 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Detect touch interaction
    const handleTouchStart = () => {
      setIsTouch(true);
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true, once: true });

    const onMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        followerPos.current.x = e.clientX;
        followerPos.current.y = e.clientY;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (followerRef.current) followerRef.current.style.opacity = '1';
      }

      // Determine hover target type
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, select, [role="button"], [data-cursor], .cursor-pointer'
      ) as HTMLElement | null;

      if (interactive) {
        const customCursor = interactive.getAttribute('data-cursor') as CursorVariant | null;
        if (customCursor) {
          setVariant(customCursor);
        } else if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          setVariant('text');
        } else if (
          interactive.closest('.group\\/shader') ||
          interactive.closest('.gsap-scroll-card') ||
          interactive.hasAttribute('data-product-card')
        ) {
          setVariant('view');
        } else {
          setVariant('pointer');
        }
      } else {
        setVariant('default');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (followerRef.current) followerRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (followerRef.current) followerRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Shared 24fps motion budget with lerp easing.
    let rafId: number;
    let lastRenderTime = 0;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick);
      if (time - lastRenderTime < ANIMATION_FRAME_INTERVAL) return;
      lastRenderTime = time;
      followerPos.current.x = lerp(followerPos.current.x, pos.current.x, 0.22);
      followerPos.current.y = lerp(followerPos.current.y, pos.current.y, 0.22);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }

    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Precision Core Dot - Premium Purple (Positioned via ref transform, scaled via inner div) */}
      <div
        ref={dotRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform"
        aria-hidden="true"
      >
        <div
          className={`rounded-full transition-all duration-150 ease-out ${
            variant === 'text'
              ? 'w-1 h-6 bg-gradient-to-b from-fuchsia-400 via-purple-500 to-fuchsia-400 rounded-sm shadow-[0_0_12px_rgba(217,70,239,1)] animate-pulse'
              : variant === 'view'
              ? 'w-2 h-2 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]'
              : variant === 'pointer'
              ? 'w-2.5 h-2.5 bg-fuchsia-400 shadow-[0_0_16px_rgba(217,70,239,1)] ring-1 ring-white/50'
              : 'w-2.5 h-2.5 bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-fuchsia-400 shadow-[0_0_12px_rgba(192,38,211,0.9)] ring-1 ring-purple-300/40'
          }`}
          style={{
            transform: isClicking ? 'scale(0.75)' : 'scale(1)',
          }}
        />
      </div>

      {/* Floating Magnetic Follower Ring - Luxury Purple Aura */}
      <div
        ref={followerRef}
        style={{ opacity: 0 }}
        className="fixed top-0 left-0 pointer-events-none z-[99998] will-change-transform"
        aria-hidden="true"
      >
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
            variant === 'view'
              ? 'w-16 h-16 bg-[#160628]/90 backdrop-blur-md border-2 border-fuchsia-400 shadow-[0_0_30px_rgba(217,70,239,0.7)]'
              : variant === 'pointer'
              ? 'w-13 h-13 bg-fuchsia-500/20 border-2 border-fuchsia-400/90 shadow-[0_0_26px_rgba(217,70,239,0.55)] scale-105'
              : variant === 'text'
              ? 'w-6 h-8 border border-fuchsia-400/50 bg-fuchsia-600/10 rounded-md shadow-[0_0_14px_rgba(192,38,211,0.3)]'
              : 'w-10 h-10 border border-fuchsia-500/60 bg-gradient-to-br from-fuchsia-500/10 to-purple-800/10 shadow-[0_0_18px_rgba(168,85,247,0.35)]'
          }`}
          style={{
            transform: isClicking ? 'scale(0.85)' : 'scale(1)',
          }}
        >
          {/* Dynamic Label for Card Hover */}
          {variant === 'view' && (
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-fuchsia-200 select-none animate-pulse">
              VER
            </span>
          )}
        </div>
      </div>
    </>
  );
};
