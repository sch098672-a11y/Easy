import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    slug: 'groceries',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    itemCount: 16,
    description: 'Fresh staple grains, parboiled rice, cooking oils, seasonings, pasta, and pantry essentials'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    slug: 'beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    itemCount: 8,
    description: 'Instant whole milk, chocolate malt drinks, condensed milk, herbal teas, and refreshing drinks'
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    itemCount: 8,
    description: 'Herbal teas, multivitamins for men, detox blends, collagen and immune support supplements'
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    itemCount: 10,
    description: 'Deodorants, premium soaps, toothpaste, hair relaxers, and everyday hygiene essentials'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    itemCount: 6,
    description: 'Soothing aloe vera gels, facial sheet masks, vitamin C oils, and glowing skincare treatments'
  },
  {
    id: 'household',
    name: 'Household',
    slug: 'household',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    itemCount: 10,
    description: 'Water bottles, food flasks, lunch boxes, portable blenders, notebooks, and office stationery'
  },
  {
    id: 'snacks',
    name: 'Snacks',
    slug: 'snacks',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    itemCount: 6,
    description: 'Mixed nuts, Pringles crisps, Twix and Cadbury chocolates, and sweet afternoon treats'
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    slug: 'baby-kids',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    itemCount: 12,
    description: 'Infant cereals, baby lotions, oils, feeding sets, teethers, wipes, and Pampers diapers'
  },
  {
    id: 'deals',
    name: 'Deals',
    slug: 'deals',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
    itemCount: 20,
    description: 'Exclusive discounts, flash savings, and supermarket specials with real automated markdown prices'
  }
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  const normalized = slug.toLowerCase();
  // Support aliases
  if (normalized === 'drinks-beverages') return CATEGORIES.find(c => c.slug === 'beverages');
  if (normalized === 'beauty-personal-care') return CATEGORIES.find(c => c.slug === 'personal-care');
  if (normalized === 'home-kitchen' || normalized === 'cleaning-household') return CATEGORIES.find(c => c.slug === 'household');
  return CATEGORIES.find(c => c.slug === normalized || c.id === normalized);
}
