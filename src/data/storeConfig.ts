export interface StoreConfig {
  businessName: string;
  tagline: string;
  primaryHeroMessage: string;
  currency: string;
  currencySymbol: string;
  country: string;
  timezone: string;
  whatsappNumber: string;
  whatsappDisplayNumber: string;
  whatsappUrl: string;
}

export const STORE_CONFIG: StoreConfig = {
  businessName: 'EASYLIFE SUPERMARKET',
  tagline: 'Everything You Need. Delivered With Ease.',
  primaryHeroMessage: 'Shop Better. Live Easier.',
  currency: 'NGN',
  currencySymbol: '₦',
  country: 'Nigeria',
  timezone: 'Africa/Lagos',
  whatsappNumber: '2348089938820',
  whatsappDisplayNumber: '+234 808 993 8820',
  whatsappUrl: 'https://wa.me/2348089938820'
};
