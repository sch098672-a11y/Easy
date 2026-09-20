import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface PromotionalBannerProps {
  onStartShopping: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onStartShopping }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-12 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/50">
        
        {/* Glow Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full inline-block mb-3">
            EASYLIFE SUPERMARKET
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            YOUR EVERYDAY SHOPPING, MADE EASY.
          </h2>
          <p className="mt-2.5 text-emerald-100 text-xs sm:text-sm lg:text-base leading-relaxed">
            Shop groceries, household essentials, beauty products, electronics and more.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <button
            id="promo-start-shopping-btn"
            onClick={onStartShopping}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>START SHOPPING</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </section>
  );
};
