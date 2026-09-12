import React, { useEffect, useRef, useState } from 'react';

interface DeferredRenderProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  order?: number;
}

export const DeferredRender: React.FC<DeferredRenderProps> = ({
  children,
  className = '',
  rootMargin = '500px 0px',
  order,
}) => {
  const markerRef = useRef<HTMLDivElement>(null);
  
  // If order is provided, check if it's already unlocked in the current tier
  const isInitialUnlocked = order !== undefined && order < 2;
  const [shouldRender, setShouldRender] = useState(isInitialUnlocked);
  const [isVisible, setIsVisible] = useState(isInitialUnlocked);

  // Prepare shaders in staggered steps behind the entrance overlay, rather
  // than compiling them on the first scroll into each section.
  useEffect(() => {
    if (order === undefined || shouldRender) return;
    const timer = window.setTimeout(() => setShouldRender(true), order * 150);
    return () => window.clearTimeout(timer);
  }, [order, shouldRender]);


  // Smooth fade-in transition once shouldRender turns true
  useEffect(() => {
    if (shouldRender && !isVisible) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [shouldRender, isVisible]);

  // IntersectionObserver: coordinates unlocking of this batch and anticipation of the next batch
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || order !== undefined) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Mount only this nearby background. Global pixel thresholds used to
        // create several distant WebGL contexts together during the first scroll.
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [rootMargin, order]);

  return (
    <div
      ref={markerRef}
      className={`${className} transition-opacity duration-700 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {shouldRender ? children : null}
    </div>
  );
};

