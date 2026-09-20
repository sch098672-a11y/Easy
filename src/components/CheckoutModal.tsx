import React, { useState } from 'react';
import { 
  X, Check, Phone, MapPin, Truck, ShieldCheck, 
  ArrowRight, Sparkles, AlertCircle, Copy, CheckCheck
} from 'lucide-react';
import { CartItem, CheckoutForm } from '../types';
import { 
  formatNaira, 
  getCheckoutWhatsAppUrl, 
  EASYLIFE_WHATSAPP_NUMBER 
} from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: () => void;
}

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Ogun', 'Kano', 'Kaduna', 
  'Enugu', 'Anambra', 'Delta', 'Edo', 'Akwa Ibom', 'Imo', 'Osun', 
  'Ondo', 'Kwara', 'Abia', 'Plateau', 'Benue', 'Cross River', 'Other States'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted
}) => {
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    deliveryAddress: '',
    city: '',
    state: 'Lagos',
    additionalNotes: '',
    deliveryMethod: 'standard'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isOpen) return null;

  // Totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );
  const discount = 0;
  const delivery = subtotal >= 30000 || subtotal === 0 ? 0 : 2500;
  const total = Math.max(0, subtotal - discount + delivery);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Please enter your full name';
    if (!form.phone.trim()) {
      errs.phone = 'Please enter your phone number';
    } else if (form.phone.trim().length < 10) {
      errs.phone = 'Please enter a valid Nigerian phone number (e.g. 080... or +234...)';
    }
    if (!form.deliveryAddress.trim()) errs.deliveryAddress = 'Please enter your street address';
    if (!form.city.trim()) errs.city = 'Please enter your city/area (e.g. Ikeja, Lekki, Wuse)';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Generate unique order reference
    const refCode = `EL-${Date.now().toString().slice(-6)}`;
    setOrderRef(refCode);

    // Formulate WhatsApp URL & open
    const url = getCheckoutWhatsAppUrl(
      items,
      form,
      subtotal,
      discount,
      delivery,
      total
    );

    window.open(url, '_blank', 'noopener,noreferrer');
    setOrderSuccess(true);
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-6 max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              EASYLIFE FAST CHECKOUT
            </span>
            <h3 className="font-display font-extrabold text-lg sm:text-xl">
              Complete Your Order via WhatsApp
            </h3>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {orderSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-display font-black text-xl text-slate-900">
                Order Dispatched to WhatsApp!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your order message has been generated and sent to our EASYLIFE Supermarket customer service hotline at <strong className="text-emerald-800">{EASYLIFE_WHATSAPP_NUMBER}</strong>.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Reference</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{orderRef}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(orderRef);
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                >
                  {copiedRef ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  id="checkout-success-done-btn"
                  onClick={onClose}
                  className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  RETURN TO STORE
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Trust Callout */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Pay on Delivery or Direct Bank Transfer confirmed directly on WhatsApp with our store representative.</span>
              </div>

              {/* 1. Customer Info */}
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
                  1. Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="e.g. Babatunde Adeyemi"
                      className={`w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                        errors.fullName ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 0808 123 4567"
                      className={`w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                        errors.phone ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-rose-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div>
                <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
                  2. Delivery Address
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery Address / Landmark *
                    </label>
                    <input
                      type="text"
                      value={form.deliveryAddress}
                      onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                      placeholder="House number, Street name, Estate or Landmark"
                      className={`w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                        errors.deliveryAddress ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-[10px] text-rose-600 mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City / Area *
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Ikeja, Lekki Phase 1, Garki"
                        className={`w-full text-xs p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none ${
                          errors.city ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] text-rose-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State *
                      </label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={form.additionalNotes}
                      onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                      placeholder="e.g. Gate code, call before arrival, delivery preferred in afternoon"
                      rows={2}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 3. ORDER SUMMARY */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 mb-3">
                  ORDER SUMMARY ({items.length} Items)
                </h4>

                <div className="max-h-36 overflow-y-auto divide-y divide-slate-200 text-xs mb-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-1.5 flex justify-between gap-2">
                      <span className="text-slate-700 truncate">
                        {item.product.name} <strong className="text-slate-900">x{item.quantity}</strong>
                      </span>
                      <span className="font-semibold text-slate-900 flex-shrink-0">
                        {formatNaira(item.product.salePrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>-{formatNaira(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery:</span>
                    <span>{delivery === 0 ? <strong className="text-emerald-700">FREE</strong> : formatNaira(delivery)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t border-slate-200">
                    <span>Total:</span>
                    <span className="text-emerald-800 text-base">{formatNaira(total)}</span>
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON: ORDER VIA WHATSAPP */}
              <button
                id="submit-whatsapp-order-btn"
                type="submit"
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-display font-black text-sm rounded-xl shadow-xl shadow-[#25D366]/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>ORDER VIA WHATSAPP ({EASYLIFE_WHATSAPP_NUMBER})</span>
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Clicking will open WhatsApp with your pre-formatted order summary ready to send.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
