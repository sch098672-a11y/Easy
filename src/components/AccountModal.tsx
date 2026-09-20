import React from 'react';
import { X, User, Phone, MapPin, Package, ShieldCheck, MessageCircle, Heart } from 'lucide-react';
import { EASYLIFE_WHATSAPP_NUMBER, EASYLIFE_WHATSAPP_BASE_URL, getGeneralWhatsAppUrl } from '../utils/whatsapp';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  wishlistCount,
  onOpenWishlist
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base">Customer Account</h3>
              <p className="text-[11px] text-emerald-300">EASYLIFE SUPERMARKET NIGERIA</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-900">Direct WhatsApp Customer Support</h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                No complex passwords needed. Check order statuses, change addresses, or re-order via WhatsApp.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-semibold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>My Saved Items / Wishlist</span>
              </div>
              <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            </button>

            <a
              href={getGeneralWhatsAppUrl('Track My Order')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-semibold text-slate-800 flex items-center justify-between transition-colors block"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Track Active Delivery Status</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">WhatsApp &rarr;</span>
            </a>

            <a
              href={getGeneralWhatsAppUrl('Store Location & Pick-up')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left font-semibold text-slate-800 flex items-center justify-between transition-colors block"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Store Addresses &amp; Pick-up Points</span>
              </div>
              <span className="text-[11px] text-slate-500">Lagos / Abuja</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 mb-2">Need immediate assistance with an order?</p>
            <a
              href={EASYLIFE_WHATSAPP_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp ({EASYLIFE_WHATSAPP_NUMBER})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
