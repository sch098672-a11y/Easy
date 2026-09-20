import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Check, Flame, AlertCircle, XCircle } from 'lucide-react';
import { Product } from '../types';
import { formatNaira, getProductWhatsAppUrl, calculateDiscount, getStockStatus } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  isCompact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  isCompact = false
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);

  const stock = Number(product.stock) || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const stockStatus = getStockStatus(stock);

  const discountPercent = calculateDiscount(product.originalPrice, product.salePrice);
  const hasDiscount = discountPercent > 0;

  const handleAddCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getProductWhatsAppUrl(product, 1);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer h-full"
    >
      {/* CARD TOP (Image Area with 1:1 Aspect Ratio + Badges + Wishlist) */}
      <div className="relative pt-[100%] bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0">
          <ProductImage
            src={product.image}
            alt={product.name}
            brand={product.brand}
            productId={product.id}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* BADGES CONTAINER (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs ${
                product.badge === 'FLASH DEAL'
                  ? 'bg-amber-500 text-slate-950 flex items-center gap-1'
                  : product.badge === 'NEW'
                  ? 'bg-sky-600 text-white'
                  : product.badge === 'HOT'
                  ? 'bg-orange-600 text-white'
                  : product.badge === 'BEST SELLER' || product.badge === 'BESTSELLER'
                  ? 'bg-emerald-700 text-white'
                  : product.badge === 'FEATURED'
                  ? 'bg-purple-700 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {product.badge === 'FLASH DEAL' && <Flame className="w-2.5 h-2.5 fill-slate-950" />}
              {product.badge}
            </span>
          )}

          {hasDiscount && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-xs self-start">
              -{discountPercent}% OFF
            </span>
          )}

          {product.flaggedDuplicate && (
            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-600 text-white px-1.5 py-0.5 rounded shadow-xs self-start">
              Duplicate Flagged
            </span>
          )}
        </div>

        {/* WISHLIST HEART (Top Right) */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-all duration-200 z-10 shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-300'
              : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
        </button>

        {/* Unit Tag Overlay (Bottom Left inside image) */}
        {product.unit && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur-xs z-10">
            {product.unit}
          </span>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
            <span className="truncate text-emerald-800 font-bold">{product.brand}</span>
            <span className="text-[10px] text-slate-400 font-normal capitalize truncate">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-current text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              ({product.reviewCount || product.reviews || 0})
            </span>
          </div>

          {/* Price Layout: Sale Price, Original Price (if discounted), Discount */}
          <div className="mt-2.5 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
            <span className="font-display font-black text-sm sm:text-base text-slate-950">
              {formatNaira(product.salePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="mt-2 text-[11px]">
            {isOutOfStock ? (
              <span className="text-rose-700 font-semibold inline-flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                OUT OF STOCK
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Only {stock} left in stock
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                IN STOCK
              </span>
            )}
          </div>
        </div>

        {/* ACTIONS: ADD TO CART & ORDER ON WHATSAPP */}
        <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-100">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddCartClick}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-xl font-display font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white cursor-pointer'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
            }`}
          >
            {isOutOfStock ? (
              <span>OUT OF STOCK</span>
            ) : addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ADDED TO CART</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>

          {/* Buy via WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full py-1.5 px-3 rounded-xl font-display font-semibold text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            title="Order directly on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>ORDER ON WHATSAPP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
