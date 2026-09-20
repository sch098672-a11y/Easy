import React from 'react';
import { ShieldCheck, BadgePercent, MessageSquare, HeadphonesIcon } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: 'AUTHENTIC PRODUCTS',
      description: 'Shop trusted products from recognised brands.',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      icon: BadgePercent,
      title: 'GREAT PRICES',
      description: 'Competitive prices on everyday essentials.',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      icon: MessageSquare,
      title: 'CONVENIENT ORDERING',
      description: 'Order online and get assistance directly through WhatsApp.',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      icon: HeadphonesIcon,
      title: 'CUSTOMER SUPPORT',
      description: 'We’re here to help with your questions and orders.',
      color: 'text-sky-700 bg-sky-50 border-sky-200'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
          The EASYLIFE Promise
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
          WHY SHOP WITH EASYLIFE?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Nigeria&apos;s trusted modern supermarket combining quality selection with personalized WhatsApp convenience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {trustFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 text-center flex flex-col items-center justify-between"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 w-8 h-0.5 bg-slate-100 rounded-full" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
