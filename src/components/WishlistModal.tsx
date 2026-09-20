import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatNaira, getProductWhatsAppUrl } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base">Your Saved Items</h3>
              <p className="text-[11px] text-slate-300">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 divide-y divide-slate-100">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-base text-slate-800">No saved items yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tap the heart icon on any supermarket item or flash deal to save it here for later.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Browse Supermarket
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const isOutOfStock = Number(product.stock) <= 0;
              return (
                <div key={product.id} className="py-3.5 flex items-center gap-3">
                  <div
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden cursor-pointer flex-shrink-0"
                  >
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      brand={product.brand}
                      productId={product.id}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">{product.brand}</span>
                    <h5
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="font-display font-bold text-xs text-slate-900 truncate cursor-pointer hover:text-emerald-700"
                    >
                      {product.name}
                    </h5>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-bold text-xs text-slate-950">{formatNaira(product.salePrice)}</span>
                      {product.originalPrice > product.salePrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatNaira(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (!isOutOfStock) onAddToCart(product, 1);
                      }}
                      disabled={isOutOfStock}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                      title={isOutOfStock ? 'Out of stock' : 'Add to Cart'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">{isOutOfStock ? 'Unavailable' : 'Add'}</span>
                    </button>
                    <button
                      onClick={() => {
                        window.open(getProductWhatsAppUrl(product, 1), '_blank', 'noopener,noreferrer');
                      }}
                      className="p-2 bg-slate-100 hover:bg-[#25D366] hover:text-white text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                      title="Order on WhatsApp"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
