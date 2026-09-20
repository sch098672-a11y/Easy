import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, Heart, Phone, 
  Menu, X, ChevronDown, Sparkles, Clock, ArrowRight,
  Flame, ShieldCheck, MapPin, User
} from 'lucide-react';
import { Product, ActiveView } from '../types';
import { CATEGORIES } from '../data/categories';
import { 
  EASYLIFE_WHATSAPP_NUMBER, 
  EASYLIFE_WHATSAPP_BASE_URL, 
  formatNaira 
} from '../utils/whatsapp';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSelectProduct: (product: Product) => void;
  products: Product[];
  onSearchSubmit: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAccount: () => void;
  onOpenProductManager?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSelectProduct,
  products,
  onSearchSubmit,
  searchQuery,
  setSearchQuery,
  onOpenAccount,
  onOpenProductManager
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('easylife_recent_searches');
      return saved ? JSON.parse(saved) : ['Air Fryer', 'Peak Milk', 'Vegetable Oil', 'Indomie', 'Smart TV'];
    } catch {
      return ['Air Fryer', 'Peak Milk', 'Vegetable Oil', 'Indomie', 'Smart TV'];
    }
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products for instant autocomplete
  const matchingProducts = searchQuery.trim().length > 0
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchCommit = (term: string) => {
    if (!term.trim()) return;
    setSearchQuery(term);
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    
    // Save to recent searches
    const updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('easylife_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }

    onSearchSubmit(term);
  };

  const handleNavClick = (view: ActiveView, categorySlug?: string) => {
    setActiveView(view);
    if (categorySlug !== undefined) {
      setSelectedCategory(categorySlug);
    } else if (view === 'home' || view === 'deals') {
      setSelectedCategory(null);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-40">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">
              Free Delivery
            </span>
            <span>On orders above ₦30,000 across Lagos & Abuja</span>
            <span className="hidden md:inline text-emerald-400">|</span>
            <span className="hidden md:inline text-emerald-200">100% Authentic Quality Guaranteed</span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200">
            <a 
              href={EASYLIFE_WHATSAPP_BASE_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Order: <strong className="text-white">{EASYLIFE_WHATSAPP_NUMBER}</strong></span>
            </a>
            <div className="hidden lg:flex items-center gap-1 text-emerald-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nationwide Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Logo, Search, Account, Wishlist, Cart, WhatsApp) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* BRAND LOGO */}
          <button
            id="header-brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            {/* Custom Emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-emerald-800" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-emerald-950">
                  EASYLIFE
                </span>
                <span className="font-display font-black text-xs sm:text-sm tracking-wider text-amber-600 uppercase">
                  SUPERMARKET
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                SHOP SMART • LIVE EASY
              </p>
            </div>
          </button>

          {/* DESKTOP SEARCH BAR */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="w-full flex items-center bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border-2 border-slate-200 focus-within:border-emerald-600 rounded-xl transition-all shadow-xs">
              <div className="pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchCommit(searchQuery);
                }}
                placeholder="What are you looking for today? (e.g. Rice, Milk, Air Fryer...)"
                className="w-full py-2.5 px-3 text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  id="clear-desktop-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                id="submit-desktop-search-btn"
                onClick={() => handleSearchCommit(searchQuery)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg m-1 transition-colors flex items-center gap-1.5"
              >
                <span>SEARCH</span>
              </button>
            </div>

            {/* Instant Search Suggestions / Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                {searchQuery.trim().length > 0 ? (
                  <div>
                    {matchingProducts.length > 0 ? (
                      <div>
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                          <span>Product Suggestions</span>
                          <span>{matchingProducts.length} matches</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {matchingProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                onSelectProduct(p);
                                setIsSearchFocused(false);
                              }}
                              className="px-4 py-2.5 flex items-center gap-3 hover:bg-emerald-50/60 cursor-pointer transition-colors"
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-md border border-slate-100 bg-white"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-900 truncate">{p.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-bold text-emerald-700">{formatNaira(p.salePrice)}</span>
                                  {p.originalPrice > p.salePrice && (
                                    <span className="text-[11px] text-slate-400 line-through">{formatNaira(p.originalPrice)}</span>
                                  )}
                                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded capitalize">{p.category.replace('-', ' ')}</span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                        <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                          <button
                            id="view-all-results-btn"
                            onClick={() => handleSearchCommit(searchQuery)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                          >
                            View all results for &ldquo;{searchQuery}&rdquo;
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-sm font-medium text-slate-700">No products found matching &ldquo;{searchQuery}&rdquo;</p>
                        <p className="text-xs text-slate-500 mt-1">Check spelling or try searching for general groceries like &ldquo;Rice&rdquo;, &ldquo;Oil&rdquo;, or &ldquo;Fan&rdquo;.</p>
                        <button
                          id="clear-empty-search-btn"
                          onClick={() => setSearchQuery('')}
                          className="mt-3 text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                        >
                          Clear search
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Popular & Recent Searches
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchCommit(term)}
                          className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                        >
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT ACTIONS: WhatsApp Button, Account, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Mobile Search Trigger Button */}
            <button
              id="mobile-search-trigger-btn"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Store Admin / Product Manager button */}
            {onOpenProductManager && (
              <button
                id="header-admin-btn"
                onClick={onOpenProductManager}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg transition-colors text-xs font-bold border border-slate-200"
                title="Manage store catalogue & prices"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Store Admin</span>
              </button>
            )}

            {/* Account / Delivery Status Button */}
            <button
              id="account-btn"
              onClick={onOpenAccount}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium"
            >
              <User className="w-4 h-4 text-slate-600" />
              <div className="text-left hidden xl:block">
                <span className="text-[10px] text-slate-400 block -mb-0.5">Welcome</span>
                <span className="font-semibold">My Account</span>
              </div>
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              aria-label="Saved wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 px-3 py-2 rounded-xl transition-all font-semibold text-xs"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-emerald-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">Cart</span>
            </button>

            {/* WhatsApp Direct Order Hotline Button */}
            <a
              id="header-whatsapp-order-btn"
              href={EASYLIFE_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all transform active:scale-95"
            >
              {/* WhatsApp Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Order</span>
            </a>

          </div>
        </div>

        {/* MOBILE SEARCH EXPANDABLE ROW */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 focus-within:border-emerald-600">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchCommit(searchQuery);
                }}
                placeholder="What are you looking for today?"
                className="w-full text-sm bg-transparent focus:outline-none py-1.5"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleSearchCommit(searchQuery)}
                className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg ml-1"
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. MAIN NAVIGATION BAR (Desktop Category Nav) */}
      <nav className="bg-slate-900 text-slate-200 border-t border-slate-800 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 py-1 text-xs font-semibold">
              
              {/* All Categories Dropdown Trigger */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  id="categories-dropdown-btn"
                  onClick={() => handleNavClick('catalog')}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-t-lg transition-colors"
                >
                  <Menu className="w-4 h-4" />
                  <span>ALL CATEGORIES</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white text-slate-900 rounded-b-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in-50 duration-150">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleNavClick('category', cat.slug);
                          setCategoriesDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-medium flex items-center justify-between transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{cat.itemCount} items</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Navigation Items Requested */}
              <button
                id="nav-home-btn"
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  activeView === 'home' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Home
              </button>

              <button
                id="nav-supermarket-btn"
                onClick={() => handleNavClick('category', 'groceries')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'groceries' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Supermarket
              </button>

              <button
                id="nav-beauty-btn"
                onClick={() => handleNavClick('category', 'beauty-personal-care')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'beauty-personal-care' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Beauty & Personal Care
              </button>

              <button
                id="nav-electronics-btn"
                onClick={() => handleNavClick('category', 'electronics')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'electronics' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Electronics
              </button>

              <button
                id="nav-home-kitchen-btn"
                onClick={() => handleNavClick('category', 'home-kitchen')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'home-kitchen' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Home & Kitchen
              </button>

              <button
                id="nav-health-btn"
                onClick={() => handleNavClick('category', 'health-wellness')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'health-wellness' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Health & Wellness
              </button>

              <button
                id="nav-baby-btn"
                onClick={() => handleNavClick('category', 'baby-kids')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'baby-kids' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Baby & Kids
              </button>

              <button
                id="nav-drinks-btn"
                onClick={() => handleNavClick('category', 'drinks-beverages')}
                className={`px-3 py-2 rounded-lg transition-colors hover:text-white hover:bg-slate-800 ${
                  selectedCategory === 'drinks-beverages' ? 'text-emerald-400 font-bold bg-slate-800/80' : ''
                }`}
              >
                Drinks & Groceries
              </button>

              {/* FLASH DEALS LINK */}
              <button
                id="nav-deals-btn"
                onClick={() => handleNavClick('deals')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors font-bold ${
                  activeView === 'deals'
                    ? 'text-amber-400 bg-amber-950/50'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Deals</span>
              </button>
            </div>

            {/* Quick delivery helpline */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Easy Returns & Pay on Delivery</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE HAMBURGER SIDE-DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-50 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm tracking-wide">EASYLIFE</h3>
                  <p className="text-[9px] text-emerald-300">SUPERMARKET NIGERIA</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-emerald-800 text-emerald-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Quick Order Callout */}
            <div className="p-3 bg-emerald-50 border-b border-emerald-100">
              <a
                href={EASYLIFE_WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Order via WhatsApp ({EASYLIFE_WHATSAPP_NUMBER})</span>
              </a>
            </div>

            {/* Navigation links */}
            <div className="p-4 space-y-1 divide-y divide-slate-100 flex-1">
              <div className="pb-2 space-y-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleNavClick('deals')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-amber-600 hover:bg-amber-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Today&apos;s Deals & Clearance
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </button>
                {onOpenProductManager && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProductManager();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between"
                  >
                    <span>Store Admin & Product Manager</span>
                    <ArrowRight className="w-4 h-4 text-emerald-700" />
                  </button>
                )}
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                  Browse Categories
                </p>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleNavClick('category', cat.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Need Assistance?</p>
              <p className="text-[11px] mt-0.5">Call or WhatsApp our Lagos store:</p>
              <p className="font-bold text-emerald-700 mt-0.5">{EASYLIFE_WHATSAPP_NUMBER}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
