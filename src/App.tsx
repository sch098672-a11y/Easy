import React, { useState, useEffect } from 'react';
import { Product, CartItem, ActiveView } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { FlashDeals } from './components/FlashDeals';
import { ProductCard } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { DealsPage } from './components/DealsPage';
import { TrustSection } from './components/TrustSection';
import { PromotionalBanner } from './components/PromotionalBanner';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { WishlistModal } from './components/WishlistModal';
import { AccountModal } from './components/AccountModal';
import { ProductManagerModal } from './components/ProductManagerModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getGeneralWhatsAppUrl } from './utils/whatsapp';
import { saveProductImage, getAllProductImages, deleteProductImage } from './utils/imageStorage';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Central Products State (Real Catalogue with LocalStorage persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('easylife_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Product) => {
            if (p.id === 'EASY-001' && (!p.image || p.image === '/products/IMG_2724.jpeg')) {
              return {
                ...p,
                image: '/images/products/EASY-001.jpg',
                images: ['/images/products/EASY-001.jpg']
              };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage', e);
    }
    return PRODUCTS;
  });

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);

  // Instant Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('easylife_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('easylife_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('easylife_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('easylife_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Load any stored images from IndexedDB on startup
  useEffect(() => {
    getAllProductImages().then((storedImages) => {
      if (storedImages && Object.keys(storedImages).length > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => {
            const customImg = storedImages[p.id.toUpperCase()];
            if (customImg) {
              return {
                ...p,
                image: customImg,
                images: [customImg, ...(p.images ? p.images.filter(img => img !== customImg) : [])]
              };
            }
            return p;
          })
        );
        setSelectedProduct((prev) => {
          if (!prev) return null;
          const customImg = storedImages[prev.id.toUpperCase()];
          if (customImg) {
            return {
              ...prev,
              image: customImg,
              images: [customImg, ...(prev.images ? prev.images.filter(img => img !== customImg) : [])]
            };
          }
          return prev;
        });
      }
    }).catch((err) => {
      console.warn('Could not load stored product images on init:', err);
    });
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Dedicated real-time handler for uploading / saving product images
  const handleUpdateProductImage = async (productId: string, imageDataUrl: string) => {
    const cleanId = productId.toUpperCase();
    
    // 1. Persist into IndexedDB and LocalStorage mirror
    await saveProductImage(cleanId, imageDataUrl);

    // 2. Update central products state
    setProducts((prevProducts) => {
      const updated = prevProducts.map((p) => {
        if (p.id.toUpperCase() === cleanId) {
          return {
            ...p,
            image: imageDataUrl,
            images: [imageDataUrl, ...(p.images ? p.images.filter(img => img !== imageDataUrl) : [])]
          };
        }
        return p;
      });

      try {
        localStorage.setItem('easylife_products', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage quota reached, image safely preserved in IndexedDB');
      }

      return updated;
    });

    // 3. Update current selectedProduct if open
    setSelectedProduct((prev) => {
      if (!prev || prev.id.toUpperCase() !== cleanId) return prev;
      return {
        ...prev,
        image: imageDataUrl,
        images: [imageDataUrl, ...(prev.images ? prev.images.filter(img => img !== imageDataUrl) : [])]
      };
    });

    // 4. Update cart items if present
    setCartItems((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id.toUpperCase() === cleanId) {
          return {
            ...item,
            product: {
              ...item.product,
              image: imageDataUrl,
              images: [imageDataUrl, ...(item.product.images ? item.product.images.filter(img => img !== imageDataUrl) : [])]
            }
          };
        }
        return item;
      })
    );

    showToast(`Photograph attached to ${cleanId} and saved!`);
  };

  const handleRemoveProductImage = async (productId: string) => {
    const cleanId = productId.toUpperCase();
    await deleteProductImage(cleanId);

    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id.toUpperCase() === cleanId) {
          return {
            ...p,
            image: '',
            images: []
          };
        }
        return p;
      });

      try {
        localStorage.setItem('easylife_products', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      return updated;
    });

    setSelectedProduct((prev) => {
      if (!prev || prev.id.toUpperCase() !== cleanId) return prev;
      return {
        ...prev,
        image: '',
        images: []
      };
    });

    showToast(`Removed custom photo for ${cleanId}`);
  };

  // Catalogue Management Handlers
  const handleSaveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem('easylife_products', JSON.stringify(updatedProducts));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
    showToast(`Catalogue successfully updated (${updatedProducts.length} items)`);
  };

  const handleResetCatalogue = () => {
    setProducts(PRODUCTS);
    try {
      localStorage.removeItem('easylife_products');
    } catch (e) {
      console.error('Failed to clear custom products', e);
    }
    showToast('Reset to original 60 starter products');
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (Number(product.stock) <= 0) {
      showToast(`${product.name} is currently out of stock`);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed from saved items`);
      } else {
        next.add(product.id);
        showToast(`Saved to wishlist!`);
      }
      return next;
    });
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(product.id);
      return next;
    });
  };

  // Navigation Handler
  const handleNavigate = (view: ActiveView, categorySlug?: string) => {
    setActiveView(view);
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveView('catalog');
    }
  };

  // Products saved in wishlist
  const wishlistProducts = products.filter((p: Product) => wishlistIds.has(p.id));

  // Curated Department Products for Homepage Showcase
  const groceryShowcase = products.filter((p: Product) => p.category === 'groceries').slice(0, 4);
  const drinksShowcase = products.filter((p: Product) => p.category === 'beverages' || p.category === 'drinks-beverages').slice(0, 4);
  const householdShowcase = products.filter((p: Product) => p.category === 'household' || p.category === 'household-cleaning').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. HEADER */}
      <Header
        activeView={activeView}
        setActiveView={(v) => handleNavigate(v)}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat || 'all');
          if (cat) {
            handleNavigate('category', cat);
          }
        }}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSelectProduct={(p: Product) => setSelectedProduct(p)}
        products={products}
        onSearchSubmit={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
      />

      {/* 2. MAIN BODY */}
      <main className="flex-1 pb-16 lg:pb-0">
        
        {/* VIEW: HOME */}
        {activeView === 'home' && (
          <div className="space-y-6 sm:space-y-10">
            
            {/* HERO CAROUSEL */}
            <Hero
              onShopNow={() => handleNavigate('catalog')}
              onViewDeals={() => handleNavigate('deals')}
              onSelectCategory={(slug: string) => handleNavigate('category', slug)}
            />

            {/* 12-DEPARTMENT CATEGORY GRID */}
            <CategorySection
              onSelectCategory={(slug: string) => handleNavigate('category', slug)}
              selectedCategory={selectedCategory}
            />

            {/* FLASH DEALS CAROUSEL */}
            <FlashDeals
              products={products}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onSelectProduct={(product: Product) => setSelectedProduct(product)}
              onViewAllDeals={() => handleNavigate('deals')}
            />

            {/* DEPARTMENT SHOWCASE 1: GROCERIES & STAPLES */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                      PANTRY &amp; COOKING
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">
                      Groceries &amp; Food Cupboard
                    </h3>
                    <p className="text-xs text-slate-500">
                      Nigeria&apos;s finest rice, cooking oils, golden semovita, and seasonings.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('category', 'groceries')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
                  {groceryShowcase.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistIds.has(product.id)}
                      onSelectProduct={(p: Product) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* DEPARTMENT SHOWCASE 2: DRINKS & BEVERAGES */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded">
                      REFRESHMENT &amp; BREAKFAST
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">
                      Drinks &amp; Beverages
                    </h3>
                    <p className="text-xs text-slate-500">
                      Malt drinks, pure table waters, breakfast chocolates, and milks.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('category', 'beverages')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
                  {drinksShowcase.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistIds.has(product.id)}
                      onSelectProduct={(p: Product) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* DEPARTMENT SHOWCASE 3: HOUSEHOLD & CLEANING */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded">
                      HYGIENE &amp; CARE
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-1">
                      Household Essentials &amp; Cleaning
                    </h3>
                    <p className="text-xs text-slate-500">
                      Antiseptics, laundry detergents, surface cleaners, and bathroom essentials.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('category', 'household')}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
                  {householdShowcase.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistIds.has(product.id)}
                      onSelectProduct={(p: Product) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* PROMOTIONAL BANNER */}
            <PromotionalBanner
              onStartShopping={() => handleNavigate('catalog')}
            />

            {/* TRUST & WHY SHOP WITH US */}
            <TrustSection />

          </div>
        )}

        {/* VIEW: CATALOG OR SPECIFIC CATEGORY */}
        {(activeView === 'catalog' || activeView === 'category') && (
          <ProductCatalog
            products={products}
            selectedCategorySlug={selectedCategory}
            onSelectCategory={(slug) => setSelectedCategory(slug)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onSelectProduct={(product: Product) => setSelectedProduct(product)}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {/* VIEW: DEALS PAGE */}
        {activeView === 'deals' && (
          <DealsPage
            products={products}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onSelectProduct={(product: Product) => setSelectedProduct(product)}
          />
        )}

      </main>

      {/* 3. FOOTER */}
      <Footer
        onNavigate={handleNavigate}
        onOpenWhatsAppEnquiry={() => {
          window.open(getGeneralWhatsAppUrl('Enquiry'), '_blank', 'noopener,noreferrer');
        }}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
      />

      {/* 4. FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />

      {/* 5. MOBILE STICKY BOTTOM NAVIGATION */}
      <MobileBottomNav
        activeView={activeView}
        onNavigate={(v) => handleNavigate(v)}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => {
          handleNavigate('catalog');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* 6. DRAWERS & MODALS */}
      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Nigerian WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderCompleted={() => {
          handleClearCart();
        }}
      />

      {/* Product Details Modal / View */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
        allProducts={products}
        onSelectProduct={(p: Product) => setSelectedProduct(p)}
        onUpdateProductImage={handleUpdateProductImage}
        onRemoveProductImage={handleRemoveProductImage}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p: Product) => setSelectedProduct(p)}
      />

      {/* Account / Support Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        wishlistCount={wishlistIds.size}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Store Owner Product Management Modal */}
      <ProductManagerModal
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        products={products}
        onSaveProducts={handleSaveProducts}
        onResetCatalogue={handleResetCatalogue}
      />

    </div>
  );
}
