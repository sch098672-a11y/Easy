import React, { useState, useRef } from 'react';
import { 
  X, Star, Heart, ShoppingCart, ShieldCheck, Truck, 
  RotateCcw, Check, Plus, Minus, Share2, Sparkles, AlertCircle, XCircle,
  Edit3, Camera, Upload, Trash2, Image as ImageIcon
} from 'lucide-react';
import { Product } from '../types';
import { formatNaira, getProductWhatsAppUrl, EASYLIFE_WHATSAPP_NUMBER, calculateDiscount, calculateSavings, getStockStatus } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';
import { optimizeImageFile } from '../utils/imageStorage';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onUpdateProductImage?: (productId: string, dataUrl: string) => Promise<void> | void;
  onRemoveProductImage?: (productId: string) => Promise<void> | void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  allProducts,
  onSelectProduct,
  onUpdateProductImage,
  onRemoveProductImage
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // In-modal Product Edit & Photo Upload State
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!product) return null;

  const stock = Number(product.stock) || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const stockStatus = getStockStatus(stock);

  const discountPercent = calculateDiscount(product.originalPrice, product.salePrice);
  const savings = calculateSavings(product.originalPrice, product.salePrice);

  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const activeImage = images[activeImageIndex] || product.image || '';

  // Handle native mobile/desktop photo selection
  const handleImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    try {
      setIsUploading(true);
      setUploadFeedback(`Optimizing & attaching photo to ${product.id}...`);

      // Optimize image (downsample large iPhone photos to 1400px high quality JPEG, preventing storage quota overflow)
      const dataUrl = await optimizeImageFile(file);

      if (onUpdateProductImage) {
        await onUpdateProductImage(product.id, dataUrl);
      }

      setActiveImageIndex(0);
      setUploadFeedback(`Real photograph attached to ${product.id} and saved permanently!`);
      setTimeout(() => setUploadFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to attach image:', err);
      setUploadFeedback('Error processing image. Please choose another photograph.');
      setTimeout(() => setUploadFeedback(null), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveCustomPhoto = async () => {
    if (!product || !onRemoveProductImage) return;
    try {
      await onRemoveProductImage(product.id);
      setUploadFeedback(`Custom photo removed from ${product.id}`);
      setTimeout(() => setUploadFeedback(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const url = getProductWhatsAppUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Find 1 complimentary product for "Frequently Bought Together"
  const complementaryProduct = allProducts.find(
    (p) => p.id !== product.id && (p.category === product.category || p.stock > 0)
  ) || allProducts.find((p) => p.id !== product.id);

  const bundleTotalPrice = product.salePrice + (complementaryProduct ? complementaryProduct.salePrice : 0);

  // Related products (same category or nearby)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200">
      {/* Dark Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col">
        
        {/* Top Floating Close Button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-emerald-700 shadow-md transition-colors cursor-pointer"
            title="Share product link"
            aria-label="Share product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white shadow-md transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8 divide-y divide-slate-100">
          
          {/* SECTION 1: GALLERY & BUYING ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 pt-2">
            
            {/* LEFT: GALLERY (5 cols) */}
            <div className="md:col-span-6 flex flex-col gap-3">
              {/* Main Featured Image with object-fit: contain */}
              <div className="relative w-full pt-[90%] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
                <div className="absolute inset-0">
                  <ProductImage
                    src={activeImage}
                    alt={product.name}
                    brand={product.brand}
                    productId={product.id}
                  />
                </div>
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm z-10">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="absolute top-3 right-14 bg-emerald-700 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs z-10">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer bg-white ${
                        activeImageIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-400/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <ProductImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} brand={product.brand} productId={product.id} />
                    </button>
                  ))}
                </div>
              )}

              {/* STORE MANAGEMENT: DIRECT PHOTO UPLOAD & EDIT SECTION */}
              <div className="mt-2 space-y-2.5">
                {/* Hidden Native File Input for iPhone Photo Library / Camera */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUploadChange}
                  className="hidden"
                  id={`upload-input-${product.id}`}
                />

                {/* Direct Action Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    id="btn-upload-product-image"
                    className="sm:col-span-8 w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>SAVING TO {product.id}...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 text-emerald-200" />
                        <span>UPLOAD PRODUCT IMAGE</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`sm:col-span-4 w-full py-3 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isEditMode
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditMode ? 'HIDE EDIT' : 'EDIT PRODUCT'}</span>
                  </button>
                </div>

                {/* EXPANDED EDIT PRODUCT PANEL */}
                {isEditMode && (
                  <div className="p-4 bg-slate-50 border-2 border-emerald-500/30 rounded-2xl space-y-3.5 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                          Store Admin Panel
                        </span>
                        <h4 className="font-display font-extrabold text-sm text-slate-900">
                          EDIT PRODUCT
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-black bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {product.id}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900 line-clamp-1">{product.name}</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Tap <strong>UPLOAD PRODUCT IMAGE</strong> to select your real product photograph from your iPhone photo library or take a photo with your camera. It attaches directly to <strong>{product.id}</strong> and saves persistently across page refreshes.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{product.image && product.image.startsWith('data:image') ? 'REPLACE PRODUCT IMAGE' : 'UPLOAD PRODUCT IMAGE'}</span>
                      </button>

                      {product.image && product.image.startsWith('data:image') && (
                        <button
                          type="button"
                          onClick={handleRemoveCustomPhoto}
                          className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Feedback Toast / Banner */}
                {uploadFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in-50">
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <span>{uploadFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: BUYING DETAILS & WHATSAPP (6 cols) */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                {/* Brand, ID & Edit Action Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                      {product.id}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Brand: {product.brand}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize hidden sm:inline">
                      {product.category.replace('-', ' ')}
                    </span>
                    <button
                      onClick={() => setIsEditMode(!isEditMode)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditMode ? 'Close' : 'EDIT'}</span>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 5)
                            ? 'fill-current text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{product.rating || 4.8}</span>
                  <span className="text-xs text-slate-400">({product.reviewCount || product.reviews || 0} verified reviews)</span>
                  <span className="text-xs text-emerald-600 font-semibold ml-auto flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> 100% Genuine
                  </span>
                </div>

                {/* Price block */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-baseline gap-3">
                  <span className="font-display font-black text-2xl sm:text-3xl text-slate-950">
                    {formatNaira(product.salePrice)}
                  </span>
                  {discountPercent > 0 && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {formatNaira(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Save {formatNaira(savings)}
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" /> OUT OF STOCK (Currently unavailable)
                    </span>
                  ) : isLowStock ? (
                    <span className="text-amber-700 font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> LOW STOCK (Only {stock} units left at EASYLIFE Supermarket)
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      IN STOCK ({stock} units available at EASYLIFE Supermarket)
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="p-2 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      disabled={isOutOfStock || quantity >= stock}
                      className="p-2 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Total: <strong className="text-slate-900">{formatNaira(product.salePrice * quantity)}</strong>
                  </span>
                </div>

                {/* ACTION BUTTONS (ADD TO CART & ORDER ON WHATSAPP) */}
                <div className="mt-6 space-y-3">
                  <div className="flex gap-3">
                    {/* Add to Cart Button */}
                    <button
                      id="details-add-to-cart-btn"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 py-3.5 px-6 rounded-xl font-display font-black text-sm transition-all flex items-center justify-center gap-2 ${
                        isOutOfStock
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-700/20 cursor-pointer'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isOutOfStock ? 'OUT OF STOCK' : addedToast ? 'ADDED TO YOUR CART!' : 'ADD TO CART'}</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                        isWishlisted
                          ? 'border-rose-300 bg-rose-50 text-rose-600'
                          : 'border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200'
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* WhatsApp Order Button */}
                  <button
                    id="details-order-whatsapp-btn"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3.5 px-6 rounded-xl font-display font-black text-sm bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>ORDER ON WHATSAPP ({EASYLIFE_WHATSAPP_NUMBER})</span>
                  </button>
                </div>

                {isCopied && (
                  <p className="text-xs text-center text-emerald-600 font-semibold mt-2">
                    Product link copied to clipboard!
                  </p>
                )}
              </div>

              {/* Delivery & Trust Highlights Box */}
              <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <Truck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">Fast Dispatch</span>
                  <span>Lagos & Abuja 24-48h</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">Authenticity</span>
                  <span>100% Brand Seal</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <RotateCcw className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">Easy Returns</span>
                  <span>Hassle-free 7 days</span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: DESCRIPTION & SPECIFICATIONS */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Product Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Specifications Table */}
            <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <h4 className="font-display font-bold text-sm text-slate-900 mb-3">
                Product Details & Specs
              </h4>
              <div className="divide-y divide-slate-200 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Catalogue ID</span>
                  <span className="text-slate-900 font-mono font-bold">{product.id}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">SKU</span>
                  <span className="text-slate-900 font-mono font-semibold">{product.sku || `EL-${product.id}`}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Stock Status</span>
                  <span className={`font-semibold ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {stockStatus} ({stock} units)
                  </span>
                </div>
                {product.unit && (
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Unit Package</span>
                    <span className="text-slate-900 font-semibold">{product.unit}</span>
                  </div>
                )}
                {product.specs && Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="py-2 flex justify-between gap-3">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="text-slate-900 font-semibold text-right">{val}</span>
                  </div>
                ))}
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Verified Supermarket</span>
                  <span className="text-emerald-700 font-semibold">EASYLIFE Supermarket Direct</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: FREQUENTLY BOUGHT TOGETHER */}
          {complementaryProduct && (
            <div className="pt-8">
              <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Frequently Bought Together</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Item 1 */}
                    <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                      <ProductImage src={product.image} alt={product.name} brand={product.brand} />
                    </div>
                    <span className="text-slate-400 font-bold text-lg">+</span>
                    {/* Item 2 */}
                    <div 
                      onClick={() => onSelectProduct(complementaryProduct)}
                      className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0 cursor-pointer hover:border-emerald-600"
                    >
                      <ProductImage src={complementaryProduct.image} alt={complementaryProduct.name} brand={complementaryProduct.brand} />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-slate-800 line-clamp-1">{product.name}</p>
                      <p className="text-slate-500 line-clamp-1">+ {complementaryProduct.name}</p>
                      <p className="font-bold text-emerald-800 mt-0.5">
                        Bundle Total: {formatNaira(bundleTotalPrice)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!isOutOfStock) onAddToCart(product, 1);
                      if (complementaryProduct.stock > 0) onAddToCart(complementaryProduct, 1);
                      setAddedToast(true);
                      setTimeout(() => setAddedToast(false), 2000);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    ADD BOTH TO CART
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="pt-8">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mb-4">
                Customers Also Viewed in {product.category.replace('-', ' ')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectProduct(rel);
                      setActiveImageIndex(0);
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="w-full pt-[90%] relative rounded-lg overflow-hidden bg-white mb-2">
                      <div className="absolute inset-0">
                        <ProductImage src={rel.image} alt={rel.name} brand={rel.brand} />
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-800 font-bold uppercase">{rel.brand}</p>
                    <h5 className="text-xs font-semibold text-slate-900 truncate mt-0.5">{rel.name}</h5>
                    <p className="text-xs font-bold text-slate-900 mt-1">{formatNaira(rel.salePrice)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
