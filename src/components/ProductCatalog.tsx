import React, { useState } from 'react';
import { Filter, ArrowUpDown, Check, Grid, List, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from './ProductCard';
import { formatNaira, calculateDiscount } from '../utils/whatsapp';

interface ProductCatalogProps {
  products: Product[];
  selectedCategorySlug?: string;
  onSelectCategory: (slug: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: Set<string>;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategorySlug,
  onSelectCategory,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onSelectProduct,
  searchQuery,
  onClearSearch
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'discount'>('popular');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under_5k' | '5k_to_20k' | 'above_20k'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync external category prop if changed
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setSelectedCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // In stock
    if (inStockOnly && p.stock <= 0) {
      return false;
    }

    // Price filter
    if (priceFilter === 'under_5k' && p.salePrice >= 5000) return false;
    if (priceFilter === '5k_to_20k' && (p.salePrice < 5000 || p.salePrice > 20000)) return false;
    if (priceFilter === 'above_20k' && p.salePrice <= 20000) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.salePrice - b.salePrice;
    if (sortBy === 'price_desc') return b.salePrice - a.salePrice;
    if (sortBy === 'discount') {
      const discA = calculateDiscount(a.originalPrice, a.salePrice);
      const discB = calculateDiscount(b.originalPrice, b.salePrice);
      return discB - discA;
    }
    // Default: Popular (reviews count + rating)
    const ratingScoreA = (a.reviews || 10) * (a.rating || 4.5);
    const ratingScoreB = (b.reviews || 10) * (b.rating || 4.5);
    return ratingScoreB - ratingScoreA;
  });

  const currentCatObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Header Banner / Title */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AUTHENTIC SUPERMARKET AISLE</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {searchQuery ? (
              <>Search Results for &quot;{searchQuery}&quot;</>
            ) : currentCatObj ? (
              currentCatObj.name
            ) : (
              'All Supermarket Products'
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentCatObj?.description || 'Browse everyday groceries, household cleaning, beverages, and electronics.'}
          </p>

          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="mt-2 text-xs text-emerald-700 font-bold underline hover:text-emerald-900"
            >
              Clear search &amp; view all
            </button>
          )}
        </div>

        {/* Filter / Sort bar */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-xl py-2 px-3 text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* SIDEBAR FILTERS (Desktop & Mobile drawer) */}
        <aside className={`md:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          
          {/* Categories Pill Navigation */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  onSelectCategory('all');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      onSelectCategory(cat.slug);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
              Price Range
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under_5k', label: 'Under ₦5,000' },
                { id: '5k_to_20k', label: '₦5,000 - ₦20,000' },
                { id: 'above_20k', label: 'Above ₦20,000' }
              ].map((range) => (
                <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceFilter"
                    checked={priceFilter === range.id}
                    onChange={() => setPriceFilter(range.id as any)}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In-Stock Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
              <span>In-Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-500"
              />
            </label>
          </div>

        </aside>

        {/* MAIN PRODUCTS GRID (9 cols on md) */}
        <main className="md:col-span-9">
          
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-200">
            <span>Showing <strong className="text-slate-900">{sortedProducts.length}</strong> items</span>
            {(selectedCategory !== 'all' || priceFilter !== 'all' || inStockOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceFilter('all');
                  setInStockOnly(false);
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <h3 className="font-display font-bold text-base text-slate-900">
                No items match your selected filters
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try loosening your price filter or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceFilter('all');
                  setInStockOnly(false);
                }}
                className="mt-4 px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                View All Supermarket Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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

        </main>

      </div>

    </div>
  );
};
