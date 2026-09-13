import React, { useEffect, useRef, useState } from 'react';
interface DeferredRenderProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  order?: number;
}
export const DeferredRender: React.FC<DeferredRenderProps> = ({
  children, className = '', rootMargin = '600px 0px',
}) => {
  const markerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    // Decorative backgrounds use a CSS fallback on mobile and reduced-motion devices.
    const lightMode = window.matchMedia('(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    if (lightMode.matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldRender(true);
      observer.disconnect();
    }, { rootMargin });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [rootMargin]);
  return (
    <div ref={markerRef} className={className} style={{ background: 'radial-gradient(ellipse at 35% 45%, #47041b66, transparent 75%)' }}>
      {shouldRender ? children : null}
    </div>
  );
};

