import React, { useEffect, useRef, useState } from 'react';

interface DeferredRenderProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}

export const DeferredRender: React.FC<DeferredRenderProps> = ({
  children,
  className = '',
  rootMargin = '1000px 0px',
}) => {
  const markerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return <div ref={markerRef} className={className}>{shouldRender ? children : null}</div>;
};
