import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import type { CategoryItem } from '../types/product';

interface FiltersBarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  order: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  onReset: () => void;
  totalProducts?: number;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  sortBy,
  order,
  onSortChange,
  limit,
  onLimitChange,
  onReset,
  totalProducts,
}) => {
  const getCategoryName = (cat: CategoryItem): { slug: string; name: string } => {
    if (typeof cat === 'string') {
      return { slug: cat, name: cat.replace('-', ' ') };
    }
    return { slug: cat.slug, name: cat.name };
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onSortChange('', 'asc');
      return;
    }
    const [field, dir] = val.split('-');
    onSortChange(field, dir as 'asc' | 'desc');
  };

  const currentSortVal = sortBy ? `${sortBy}-${order}` : '';

  const hasActiveFilters = selectedCategory !== 'all' || searchTerm !== '' || sortBy !== '';

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Debounced search across DummyJSON products..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Limit Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-400 font-medium hidden sm:inline">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:border-white outline-none capitalize cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => {
                const { slug, name } = getCategoryName(cat);
                return (
                  <option key={slug} value={slug} className="capitalize bg-zinc-900 text-white">
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 hidden sm:inline" />
            <select
              value={currentSortVal}
              onChange={handleSortSelect}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:border-white outline-none cursor-pointer"
            >
              <option value="">Sort By: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
              <option value="title-asc">Name: A to Z</option>
              <option value="title-desc">Name: Z to A</option>
            </select>
          </div>

          {/* Items Per Page Limit */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium hidden md:inline">Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:border-white outline-none cursor-pointer"
            >
              <option value={12}>12 Items</option>
              <option value={24}>24 Items</option>
              <option value={36}>36 Items</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors flex items-center gap-1.5 text-xs"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="pt-3 border-t border-zinc-900 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors uppercase tracking-wider ${
            selectedCategory === 'all'
              ? 'bg-white text-black'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All
        </button>

        {categories.slice(0, 10).map((cat) => {
          const { slug, name } = getCategoryName(cat);
          const isSelected = selectedCategory === slug;
          return (
            <button
              key={slug}
              onClick={() => onSelectCategory(slug)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors capitalize ${
                isSelected
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Info Status Line */}
      {totalProducts !== undefined && (
        <div className="text-[11px] text-zinc-500 flex items-center justify-between font-mono pt-1">
          <span>Total Found: {totalProducts} items</span>
          {hasActiveFilters && (
            <span className="text-zinc-400 font-sans">Filtered view synced to URL</span>
          )}
        </div>
      )}
    </div>
  );
};
