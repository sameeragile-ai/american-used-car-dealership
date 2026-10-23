import React, { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  aspectRatio?: '16/9' | '16/10' | '4/3' | '1/1' | 'auto';
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  fallbackTitle?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  aspectRatio = '16/10',
  className = '',
  imageClassName = '',
  priority = false,
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '16/10'
      ? 'aspect-[16/10]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : '';

  return (
    <div
      className={`relative overflow-hidden bg-[#12141A] dark:bg-[#12141A] ${aspectClass} ${className}`}
    >
      {/* Background Pulse / Skeleton shimmer while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] animate-pulse" />
      )}

      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
          } ${imageClassName}`}
        />
      ) : (
        /* Sleek Automotive Fallback Container */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#12141A] via-[#1A1D25] to-[#0A0B0F] border border-white/5">
          <div className="w-14 h-14 mb-3 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-[#FF8A00]">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.9C2.1 10.9 2 11 2 11.2V16c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-mono mb-1">
            Apex Motor Co. Verified
          </span>
          <p className="text-sm font-semibold text-white/90 line-clamp-1">
            {fallbackTitle || alt}
          </p>
        </div>
      )}
    </div>
  );
};
