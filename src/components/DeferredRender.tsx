import React, { useEffect, useRef, useState } from 'react';
import { backgroundCoordinator } from '../utils/backgroundCoordinator';

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
  const isInitialUnlocked = order !== undefined ? backgroundCoordinator.isOrderUnlocked(order) : false;
  const [shouldRender, setShouldRender] = useState(isInitialUnlocked);
  const [isVisible, setIsVisible] = useState(isInitialUnlocked);

  // Subscribe to progressive tier unlocks from backgroundCoordinator
  useEffect(() => {
    if (order === undefined || shouldRender) return;

    // Check immediately in case tier advanced
    if (backgroundCoordinator.isOrderUnlocked(order)) {
      setShouldRender(true);
      return;
    }

    const unsubscribe = backgroundCoordinator.subscribe(() => {
      if (backgroundCoordinator.isOrderUnlocked(order)) {
        setShouldRender(true);
      }
    });

    return unsubscribe;
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
    if (!marker) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (order !== undefined) {
          // Unlock this batch if not already unlocked
          backgroundCoordinator.unlockForOrder(order);
          // Preload and unlock the NEXT batch of 2 descending ahead of time
          backgroundCoordinator.advanceFromOrder(order);
          setShouldRender(true);
        } else {
          setShouldRender(true);
        }
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

