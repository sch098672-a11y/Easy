export interface Product {
  id: string; // Permanent ID: EASY-001 ... EASY-060
  name: string;
  brand: string;
  category: string; // groceries, beverages, health-wellness, personal-care, beauty, household, snacks, baby-kids, deals
  description: string;
  image: string; // Primary image URL or path
  images: string[]; // Additional gallery images
  originalPrice: number;
  salePrice: number;
  stock: number; // Stock quantity integer
  sku: string;
  rating: number;
  reviewCount: number;
  reviews?: number; // Backward compatibility with components accessing .reviews
  badge?: 'SALE' | 'NEW' | 'BEST SELLER' | 'FEATURED' | 'LIMITED' | 'POPULAR' | 'FLASH DEAL' | string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  availability?: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  tags?: string[];
  unit?: string; // e.g., '50kg', '500g', 'Pack of 4', '1.13kg'
  features?: string[];
  specs?: Record<string, string>;
  isFlashDeal?: boolean;
  dealCategory?: 'under_10k' | 'under_20k' | 'big_savings' | 'weekly_specials' | 'clearance';
  flaggedDuplicate?: boolean; // For tracking duplicate listings like EASY-034
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
  description: string;
  iconName?: string;
}

export type Category = CategoryInfo;

export interface CheckoutForm {
  fullName: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  additionalNotes: string;
  deliveryMethod: 'standard' | 'express' | 'pickup';
}

export type ActiveView = 'home' | 'catalog' | 'deals' | 'category' | 'saved' | 'admin';
