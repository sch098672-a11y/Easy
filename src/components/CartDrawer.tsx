import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, 
  ShieldCheck, Tag, Sparkles 
} from 'lucide-react';
import { CartItem } from '../types';
import { formatNaira, getCartWhatsAppUrl, EASYLIFE_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );

  const discount = promoApplied ? Math.round(subtotal * promoDiscountRate) : 0;
  
  // Free delivery above ₦30,000, else ₦2,500
  const delivery = subtotal >= 30000 || subtotal === 0 ? 0 : 2500;
  const total = Math.max(0, subtotal - discount + delivery);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'EASYLIFE5' || code === 'SAVE5') {
      setPromoApplied(true);
      setPromoDiscountRate(0.05); // 5% off
    } else if (code === 'WELCOME10' || code === 'SUPER10') {
      setPromoApplied(true);
      setPromoDiscountRate(0.10); // 10% off
    } else {
      setPromoError('Invalid code. Try "EASYLIFE5" or "WELCOME10"');
    }
  };

  const handleOrderCartViaWhatsApp = () => {
    const url = getCartWhatsAppUrl(items, subtotal, discount, delivery, total);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-50">
          
          {/* HEADER */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base">Your Supermarket Cart</h3>
                <p className="text-[11px] text-emerald-300">
                  {items.length} unique {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs">
            {subtotal >= 30000 ? (
              <p className="text-emerald-800 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Congratulations! You qualified for FREE Delivery
              </p>
            ) : (
              <div>
                <p className="text-slate-600 text-[11px]">
                  Add <strong className="text-emerald-700">{formatNaira(30000 - subtotal)}</strong> more for FREE Delivery!
                </p>
                <div className="w-full bg-emerald-200/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 30000) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ITEMS LIST (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover fresh groceries, household essentials, and flash deals today.
                </p>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={onClose}
                  className="mt-5 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-3.5 flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white overflow-hidden flex-shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      brand={item.product.brand}
                      productId={item.product.id}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide truncate">
                      {item.product.brand}
                    </p>
                    <h5 className="font-display font-bold text-xs text-slate-900 truncate">
                      {item.product.name}
                    </h5>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      {formatNaira(item.product.salePrice)}
                    </p>

                    {/* Quantity Stepper */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500">
                        = {formatNaira(item.product.salePrice * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER TOTALS & CHECKOUT */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
              
              {/* Promo code input */}
              {!promoApplied ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Coupon (e.g. EASYLIFE5)"
                      className="w-full text-xs pl-8 pr-2 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    APPLY
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between text-xs bg-emerald-100/70 text-emerald-800 p-2 rounded-lg font-medium">
                  <span>Coupon applied ({Math.round(promoDiscountRate * 100)}% off)</span>
                  <button
                    onClick={() => {
                      setPromoApplied(false);
                      setPromoCode('');
                    }}
                    className="text-[11px] font-bold underline text-emerald-900"
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoError && <p className="text-[10px] text-rose-600 font-medium">{promoError}</p>}

              {/* Subtotal, Discount, Delivery */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatNaira(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{formatNaira(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-slate-900">
                    {delivery === 0 ? <strong className="text-emerald-700">FREE</strong> : formatNaira(delivery)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-base text-emerald-800">{formatNaira(total)}</span>
                </div>
              </div>

              {/* PRIMARY ACTION: PROCEED TO CHECKOUT */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SECONDARY ACTION: ORDER ENTIRE CART VIA WHATSAPP */}
              <button
                id="cart-order-whatsapp-btn"
                onClick={handleOrderCartViaWhatsApp}
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>ORDER ENTIRE CART ON WHATSAPP</span>
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold pt-1"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
