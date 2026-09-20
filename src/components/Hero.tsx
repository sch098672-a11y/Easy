import React from 'react';
import { ShoppingBag, ArrowRight, Flame, Sparkles, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { ActiveView } from '../types';

interface HeroProps {
  onShopNow: () => void;
  onViewDeals: () => void;
  onSelectCategory: (slug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onViewDeals,
  onSelectCategory
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 sm:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
        
        {/* MAIN PROMOTIONAL HERO BANNER (8 Cols on Desktop) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-10 lg:p-12 shadow-lg flex flex-col justify-between min-h-[380px] sm:min-h-[420px]">
          
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          
          {/* Supermarket Image Showcase (Right side floating overlay on desktop) */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:block pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
              alt="EASYLIFE Supermarket Groceries"
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity mask-gradient"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/70 to-transparent" />
          </div>

          {/* Top Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-700/80 backdrop-blur-xs border border-emerald-500/40 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NIGERIA&apos;S PREFERRED ONLINE SUPERMARKET</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-[1.1] max-w-xl">
              SHOP SMART.<br />
              <span className="text-amber-400">LIVE EASY.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-5 text-emerald-100/90 text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed font-normal">
              Discover everyday essentials, trusted brands and amazing deals — all in one convenient supermarket.
            </p>
          </div>

          {/* Call to Actions & Value Pills */}
          <div className="relative z-10 mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="hero-shop-now-btn"
                onClick={onShopNow}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>SHOP NOW</span>
              </button>

              <button
                id="hero-view-deals-btn"
                onClick={onViewDeals}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-display font-bold text-xs sm:text-sm px-5 sm:px-7 py-3.5 rounded-xl backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>VIEW TODAY&apos;S DEALS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-3 border-t border-emerald-700/50 flex flex-wrap items-center gap-4 text-[11px] sm:text-xs text-emerald-200">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast Lagos & Abuja Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Brand Authenticity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant WhatsApp Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROMOTIONAL SIDE CARDS (4 Cols on Desktop) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 sm:gap-4 justify-between">
          
          {/* Card 1: MEGA DEALS - UP TO 30% OFF */}
          <div 
            onClick={onViewDeals}
            className="group flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white p-5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-black/25 text-amber-200 px-2 py-0.5 rounded-full inline-block mb-1.5">
                  LIMITED TIME
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl tracking-tight text-white">
                  MEGA DEALS
                </h3>
                <p className="text-amber-100 font-extrabold text-sm sm:text-base mt-0.5">
                  UP TO 30% OFF
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-white group-hover:underline">
                  <span>GRAB DEALS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-inner bg-black/20 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=250&q=80"
                  alt="Appliances Mega Deal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Card 2: EVERYDAY ESSENTIALS - SHOP NOW */}
          <div 
            onClick={() => onSelectCategory('food-pantry')}
            className="group flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/10 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full inline-block mb-1.5">
                  PANTRY & KITCHEN
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                  EVERYDAY ESSENTIALS
                </h3>
                <p className="text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">
                  Lowest Supermarket Prices
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:underline">
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-inner bg-white/10 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=250&q=80"
                  alt="Everyday essentials"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Card 3: FRESH PICKS - DISCOVER MORE */}
          <div 
            onClick={() => onSelectCategory('groceries')}
            className="group flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/20 text-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1.5">
                  FARM FRESH
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                  FRESH PICKS
                </h3>
                <p className="text-amber-300 font-bold text-xs sm:text-sm mt-0.5">
                  Direct From Local Farms
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-white group-hover:underline">
                  <span>DISCOVER MORE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-inner bg-black/20 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=250&q=80"
                  alt="Fresh Picks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
