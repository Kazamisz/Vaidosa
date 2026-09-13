import React, { useEffect, useRef, useState } from 'react';
import { useHardware } from '../context/HardwareContext';
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
  const hardware = useHardware();
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    // Decorative backgrounds use a CSS fallback on mobile and reduced-motion devices.
    if (!hardware.ready || !hardware.allowComplexWebGL || hardware.isLowEnd) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldRender(true);
      observer.disconnect();
    }, { rootMargin });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [rootMargin, hardware.ready, hardware.allowComplexWebGL, hardware.isLowEnd]);
  return (
    <div ref={markerRef} className={className} style={{ background: 'radial-gradient(ellipse at 35% 45%, #47041b66, transparent 75%)' }}>
      {shouldRender && hardware.ready && hardware.allowComplexWebGL ? children : null}
    </div>
  );
};

