import React, { useState, useRef } from 'react';
import { getImageSrcSet } from '../utils/image';

interface GLSLImageHoverProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onClick?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const GLSLImageHover: React.FC<GLSLImageHoverProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/5]',
  onClick,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative w-full overflow-hidden ${aspectRatio} ${className} group/shader select-none`}
    >
      {/* High-res crisp photo with smooth scale & silk contrast on hover */}
      <img
        src={src}
        srcSet={getImageSrcSet(src)}
        sizes="(max-width: 459px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={onError}
        className={`w-full h-full object-cover object-top sm:object-center transition-all duration-700 ease-out will-change-transform ${
          isHovered
            ? 'scale-[1.06] filter brightness-[1.04] contrast-[1.02] saturate-[1.08]'
            : 'scale-100 filter brightness-100 contrast-100'
        }`}
      />

      {/* Interactive Liquid Silk Dispersion Light Flare */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 mix-blend-screen ${
          isHovered ? 'opacity-80' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle 180px at ${mousePos.x}% ${mousePos.y}%, rgba(217, 70, 239, 0.28), rgba(124, 58, 237, 0.15), transparent 75%)`,
        }}
      />

      {/* Luminescent Magenta-Purple Aura Border Glow */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-500 ring-1 ring-inset ${
          isHovered
            ? 'opacity-100 ring-fuchsia-400/50 shadow-[inset_0_0_24px_rgba(217,70,239,0.22)]'
            : 'opacity-0 ring-transparent'
        }`}
      />

      {/* Subtle vignette for editorial depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-black/10 opacity-60 group-hover/shader:opacity-40 transition-opacity" />
    </div>
  );
};
