import React from 'react';
import { Home, Grid, Search, ShoppingCart, Heart, User, Flame } from 'lucide-react';
import { ActiveView } from '../types';

interface MobileBottomNavProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAccount
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 py-1.5 px-2 shadow-2xl safe-area-inset-bottom">
      <div className="grid grid-cols-5 gap-1 items-center justify-items-center max-w-md mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-h-[46px] w-full rounded-xl transition-colors ${
            activeView === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* 2. Categories */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center min-h-[46px] w-full rounded-xl transition-colors ${
            activeView === 'catalog' || activeView === 'category' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Categories</span>
        </button>

        {/* 3. Deals (High conversion!) */}
        <button
          onClick={() => onNavigate('deals')}
          className={`flex flex-col items-center justify-center min-h-[46px] w-full rounded-xl transition-colors ${
            activeView === 'deals' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <span className="text-[10px] mt-0.5 text-amber-600 font-semibold">Deals</span>
        </button>

        {/* 4. Cart */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center min-h-[46px] w-full rounded-xl text-slate-500 relative transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Cart</span>
        </button>

        {/* 5. Account / Saved */}
        <button
          onClick={onOpenAccount}
          className="flex flex-col items-center justify-center min-h-[46px] w-full rounded-xl text-slate-500 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Account</span>
        </button>

      </div>
    </div>
  );
};
