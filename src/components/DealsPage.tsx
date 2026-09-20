import React, { useState } from 'react';
import { Flame, Sparkles, Tag, Filter, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { calculateDiscount } from '../utils/whatsapp';

interface DealsPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onSelectProduct: (product: Product) => void;
}

type DealFilter = 'all' | 'flash' | 'big_savings' | 'under_10k' | 'under_20k' | 'weekly_specials' | 'clearance';

export const DealsPage: React.FC<DealsPageProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onSelectProduct
}) => {
  const [activeTab, setActiveTab] = useState<DealFilter>('all');
  const [sortBy, setSortBy] = useState<'discount' | 'price_asc' | 'price_desc'>('discount');

  // Filter deals using calculateDiscount
  const filteredProducts = products.filter((product) => {
    const disc = calculateDiscount(product.originalPrice, product.salePrice);
    if (activeTab === 'all') return disc >= 5 || product.badge === 'SALE' || product.isFlashDeal;
    if (activeTab === 'flash') return product.isFlashDeal || product.badge === 'FLASH DEAL';
    if (activeTab === 'big_savings') return disc >= 12 || product.dealCategory === 'big_savings';
    if (activeTab === 'under_10k') return product.salePrice <= 10000;
    if (activeTab === 'under_20k') return product.salePrice <= 20000;
    if (activeTab === 'weekly_specials') return product.badge === 'BEST SELLER' || product.bestSeller || product.featured;
    if (activeTab === 'clearance') return disc >= 15;
    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const discA = calculateDiscount(a.originalPrice, a.salePrice);
    const discB = calculateDiscount(b.originalPrice, b.salePrice);
    if (sortBy === 'discount') return discB - discA;
    if (sortBy === 'price_asc') return a.salePrice - b.salePrice;
    if (sortBy === 'price_desc') return b.salePrice - a.salePrice;
    return 0;
  });

  const tabs: { id: DealFilter; label: string; count: number }[] = [
    { id: 'all', label: 'ALL DEALS', count: products.filter(p => calculateDiscount(p.originalPrice, p.salePrice) >= 5 || p.badge === 'SALE').length },
    { id: 'flash', label: 'FLASH DEALS', count: products.filter(p => p.isFlashDeal || p.badge === 'FLASH DEAL').length },
    { id: 'big_savings', label: 'BIG SAVINGS', count: products.filter(p => calculateDiscount(p.originalPrice, p.salePrice) >= 12).length },
    { id: 'under_10k', label: 'UNDER ₦10,000', count: products.filter(p => p.salePrice <= 10000).length },
    { id: 'under_20k', label: 'UNDER ₦20,000', count: products.filter(p => p.salePrice <= 20000).length },
    { id: 'weekly_specials', label: 'WEEKLY SPECIALS', count: products.filter(p => p.badge === 'BEST SELLER' || p.bestSeller || p.featured).length },
    { id: 'clearance', label: 'CLEARANCE DEALS', count: products.filter(p => calculateDiscount(p.originalPrice, p.salePrice) >= 15).length },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-orange-700 text-white p-6 sm:p-10 shadow-xl overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-xs text-amber-200 text-xs font-black uppercase px-3 py-1 rounded-full mb-3">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>SAVE UP TO 30% ON QUALITY NIGERIAN COMMODITIES</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            EASYLIFE DEALS &amp; CLEARANCE
          </h1>
          <p className="mt-2 text-amber-100 text-sm sm:text-base font-medium">
            Shop exclusive supermarket markdowns, budget bundles, and limited-stock warehouse bargains.
          </p>
        </div>
      </div>

      {/* Tabs / Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-bold text-slate-600">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
          >
            <option value="discount">Biggest Discount %</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">No current items in this deals category right now.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-4 px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition-colors"
          >
            View All Current Deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(product.id)}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}

    </div>
  );
};
