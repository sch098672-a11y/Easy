import React, { useState, useEffect, useMemo } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  brand?: string;
  productId?: string;
  className?: string;
  containerClassName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  brand,
  productId,
  className = '',
  containerClassName = ''
}) => {
  // Extract Product ID if available from props or src pattern (e.g. EASY-001)
  const resolvedId = useMemo(() => {
    if (productId && productId.trim()) return productId.trim();
    if (src) {
      const match = src.match(/(EASY-[0-9]{3,4})/i);
      if (match) return match[1].toUpperCase();
    }
    return undefined;
  }, [productId, src]);

  // Build candidate URL list
  const candidates = useMemo(() => {
    const list: string[] = [];

    // 1. If an image is stored in local storage for this product ID, prioritize it
    if (resolvedId && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`easylife_img_${resolvedId}`);
        if (stored && stored.startsWith('data:image/')) {
          list.push(stored);
        }
      } catch {
        // ignore
      }
    }

    // 2. Add src prop if provided
    if (src && src.trim() && !list.includes(src.trim())) {
      list.push(src.trim());
    }

    // 3. Static asset fallbacks
    if (resolvedId) {
      const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'];
      extensions.forEach((ext) => {
        const path = `/images/products/${resolvedId}${ext}`;
        if (!list.includes(path)) {
          list.push(path);
        }
      });
    }

    return list;
  }, [src, resolvedId]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(candidates.length === 0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset when source or product ID changes
  useEffect(() => {
    setCandidateIndex(0);
    setHasFailedAll(candidates.length === 0);
    setIsLoaded(false);
  }, [candidates]);

  const currentSrc = candidates[candidateIndex];

  const handleImageError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasFailedAll(false);
  };

  // When no image exists or all image candidates failed (file not yet uploaded)
  if (hasFailedAll || !currentSrc) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 sm:p-4 text-center select-none ${containerClassName}`}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-400 mb-1.5">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800/60 stroke-[1.5]" />
        </div>
        {brand && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 line-clamp-1 mb-0.5">
            {brand}
          </span>
        )}
        <span className="text-[11px] font-medium text-slate-600 line-clamp-2 px-1 leading-snug">
          {alt}
        </span>
        <span className="mt-2 text-[9px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-200/60 px-2 py-0.5 rounded">
          PHOTO PENDING
        </span>
      </div>
    );
  }

  // When an image candidate is active: renders ONLY the real image with object-fit: contain
  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-white ${containerClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
