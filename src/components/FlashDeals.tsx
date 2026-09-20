import React, { useState, useEffect, useRef } from 'react';
import { Flame, Clock, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatNaira, getProductWhatsAppUrl, calculateDiscount } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface FlashDealsProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onSelectProduct: (product: Product) => void;
  onViewAllDeals: () => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onSelectProduct,
  onViewAllDeals
}) => {
  // 12-hour countdown timer simulation that resets realistically
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 11, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const flashProducts = products.filter((p) => {
    const disc = calculateDiscount(p.originalPrice, p.salePrice);
    return p.isFlashDeal || p.badge === 'FLASH DEAL' || p.badge === 'SALE' || disc >= 8;
  }).slice(0, 10);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-orange-700 rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        
        {/* Glow & subtle background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* FLASH DEALS HEADER WITH COUNTDOWN */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/20">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-xs text-amber-200 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-2">
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>TIME SENSITIVE OFFERS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
              FLASH DEALS
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 font-medium">
              Limited-time prices. Shop before they&apos;re gone.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Box */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white/20">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 hidden sm:inline">
                Ends In:
              </span>
              <div className="flex items-center font-mono font-black text-base sm:text-lg">
                <span className="bg-white/20 px-2 py-0.5 rounded">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="mx-1">:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="mx-1">:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-amber-300">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                aria-label="Previous deal"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                aria-label="Next deal"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* HORIZONTAL SCROLLABLE PRODUCTS STRIP */}
        <div className="relative mt-6 z-10">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {flashProducts.map((product) => {
              const stock = Number(product.stock) || 0;
              const isOutOfStock = stock <= 0;
              const discount = calculateDiscount(product.originalPrice, product.salePrice);
              const maxStock = 25;
              const soldPercentage = Math.min(
                95,
                Math.max(30, Math.round(((maxStock - Math.min(stock, maxStock)) / maxStock) * 100))
              );

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="flex-shrink-0 w-[240px] sm:w-[260px] bg-white text-slate-900 rounded-2xl p-3.5 shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 snap-start"
                >
                  {/* Top Image + Badges */}
                  <div className="relative pt-[90%] rounded-xl overflow-hidden bg-white border border-slate-100 mb-3">
                    <div className="absolute inset-0">
                      <ProductImage src={product.image} alt={product.name} brand={product.brand} productId={product.id} />
                    </div>
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                          -{discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand & Name */}
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      {product.brand}
                    </span>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                      {product.name}
                    </h4>

                    {/* Pricing */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display font-black text-base text-slate-950">
                        {formatNaira(product.salePrice)}
                      </span>
                      {product.originalPrice > product.salePrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatNaira(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock Indicator Progress Bar */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                        <span className={isOutOfStock ? 'text-rose-600 font-bold' : stock <= 5 ? 'text-amber-700 font-bold' : 'text-slate-600 font-bold'}>
                          {isOutOfStock ? 'Out of stock' : `Only ${stock} left`}
                        </span>
                        <span>{soldPercentage}% claimed</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3.5 space-y-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) onAddToCart(product, 1);
                      }}
                      disabled={isOutOfStock}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        isOutOfStock 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      }`}
                    >
                      {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getProductWhatsAppUrl(product, 1), '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full py-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Order on WhatsApp</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View All button */}
        <div className="sm:hidden mt-4 text-center">
          <button
            onClick={onViewAllDeals}
            className="w-full py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 cursor-pointer"
          >
            VIEW ALL TODAY&apos;S DEALS &rarr;
          </button>
        </div>

      </div>
    </section>
  );
};
