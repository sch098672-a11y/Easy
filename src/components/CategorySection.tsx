import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CategoryInfo } from '../types';

interface CategorySectionProps {
  onSelectCategory: (slug: string) => void;
  selectedCategory: string | null;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Aisles</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fresh groceries, household cleaning, personal care, electronics &amp; more.
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory('')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline self-start sm:self-end"
          >
            Show All Products
          </button>
        )}
      </div>

      {/* Categories Grid (12 items) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((category: CategoryInfo) => {
          const isSelected = selectedCategory === category.slug;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.slug)}
              className={`group relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white border-slate-200/80 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {/* Category Image Circle */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 mb-3 border-2 border-slate-100 group-hover:border-emerald-400 transition-colors shadow-inner">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Name */}
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                {category.name}
              </h3>

              {/* Item count tag */}
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                {category.itemCount} items
              </span>

              {/* Active Indicator bar */}
              {isSelected && (
                <span className="absolute bottom-0 inset-x-0 h-1 bg-emerald-600 rounded-b-2xl" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
