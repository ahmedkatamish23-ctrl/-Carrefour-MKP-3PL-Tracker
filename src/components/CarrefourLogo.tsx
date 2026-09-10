import React from 'react';

interface CarrefourLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const CarrefourLogo: React.FC<CarrefourLogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const iconDimensions = {
    sm: { width: 44, height: 36 },
    md: { width: 62, height: 50 },
    lg: { width: 80, height: 65 },
  }[size];

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  }[size];

  return (
    <div className="inline-flex items-center gap-3.5 select-none" id="carrefour-brand-logo">
      {/* Authentic Carrefour Emblem (Blue & Red arrows forming negative space 'C') */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
        aria-label="Carrefour Emblem"
      >
        {/* Left Arrow (Carrefour Deep Blue #004E98) */}
        <path
          d="M 40 6 
             C 27 19 13 32 3 40 
             C 13 48 27 61 40 74 
             C 32 64 26 53 26 40 
             C 26 27 32 16 40 6 Z"
          fill="#004E98"
        />
        {/* Right Arrow (Carrefour Vibrant Red #E21836) */}
        <path
          d="M 60 6 
             C 73 19 87 32 97 40 
             C 87 48 73 61 60 74 
             C 66 65 67 56 61 49
             C 52 46 51 34 61 31
             C 67 24 66 15 60 6 Z"
          fill="#E21836"
        />
      </svg>

      {/* Corporate Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-tight text-[#004E98] ${textSizeClasses} leading-none`}
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Carrefour
          </span>
          <span className="bg-[#004E98]/10 text-[#004E98] border border-[#004E98]/20 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            UAE
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-slate-500 mt-1">
            Marketplace Operations
          </span>
        )}
      </div>
    </div>
  );
};
