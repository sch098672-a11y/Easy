import React from 'react';
import { 
  Phone, Mail, MapPin, ShoppingBag, ShieldCheck, 
  Truck, ArrowUp, MessageCircle
} from 'lucide-react';
import { 
  EASYLIFE_WHATSAPP_NUMBER, 
  EASYLIFE_WHATSAPP_BASE_URL, 
  getGeneralWhatsAppUrl 
} from '../utils/whatsapp';
import { ActiveView } from '../types';

interface FooterProps {
  onNavigate: (view: ActiveView, category?: string) => void;
  onOpenWhatsAppEnquiry: () => void;
  onOpenProductManager?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenWhatsAppEnquiry, onOpenProductManager }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP ROW: BRAND & COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* BRAND COLUMN (Span 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  EASYLIFE
                </span>
                <span className="font-display font-black text-xs tracking-wider text-amber-500 uppercase ml-1">
                  SUPERMARKET
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 font-medium italic">
              &ldquo;Making everyday shopping easier.&rdquo;
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Nigeria&apos;s premium modern online supermarket delivering fresh groceries, pantry staples, personal care products, and electronics straight to your home or office.
            </p>

            {/* Social Media Placeholders */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5 text-slate-400">
                <a
                  href={EASYLIFE_WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <div className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Instagram">
                  <span className="text-xs font-bold">IG</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="Facebook">
                  <span className="text-xs font-bold">FB</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer" title="X Twitter">
                  <span className="text-xs font-bold">X</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 1: QUICK LINKS */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deals')}
                  className="hover:text-amber-400 text-amber-500 font-bold transition-colors cursor-pointer"
                >
                  Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Categories
                </button>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl('Customer Enquiry')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: CUSTOMER SERVICE */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-4">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href={getGeneralWhatsAppUrl('Help Centre Enquiry')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Help Centre
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl('Delivery Information')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Delivery Information
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl('Returns Policy')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl('Direct Customer Support')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: SHOPPING */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-4">
              SHOPPING
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('category', 'groceries')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Groceries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'beauty-personal-care')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Beauty
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'electronics')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Electronics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'home-kitchen')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home &amp; Kitchen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('category', 'health-wellness')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Health &amp; Wellness
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* CONTACT BOX & GUARANTEES */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                WhatsApp Order &amp; Enquiries:
              </p>
              <a
                href={EASYLIFE_WHATSAPP_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-extrabold text-white hover:text-[#25D366] transition-colors"
              >
                {EASYLIFE_WHATSAPP_NUMBER}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Doorstep Delivery Across Nigeria</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Supermarket Quality</span>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & SCROLL TO TOP */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <p>© 2026 EASYLIFE SUPERMARKET. All rights reserved.</p>
            {onOpenProductManager && (
              <button
                onClick={onOpenProductManager}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors cursor-pointer"
              >
                Store Admin & Product Manager
              </button>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
