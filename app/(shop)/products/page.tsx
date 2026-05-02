'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Product, Category } from '@/lib/data';
import { productApi, categoryApi } from '@/lib/storage';
import ProductCard from '@/components/ProductCard';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterNew, setFilterNew] = useState(searchParams.get('filter') === 'new');
  const [filterFeatured, setFilterFeatured] = useState(searchParams.get('filter') === 'featured');

  useEffect(() => { setCategories(categoryApi.list()); }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const result = productApi.list({
      categorySlug: selectedCategory,
      featured: filterFeatured || undefined,
      newArrival: filterNew || undefined,
      search: searchQuery,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sort: sortBy,
    });
    setProducts(result);
    setLoading(false);
  }, [selectedCategory, priceRange, sortBy, searchQuery, filterNew, filterFeatured]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategory(''); setPriceRange([0, 50000]); setSortBy('newest');
    setSearchQuery(''); setFilterNew(false); setFilterFeatured(false);
  };

  const activeFilterCount = [selectedCategory, priceRange[0] > 0 || priceRange[1] < 50000, filterNew, filterFeatured].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="section-subheading mb-3">Browse</p>
          <h1 className="section-heading">
            {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
              : filterNew ? 'New Arrivals' : filterFeatured ? 'Featured'
              : searchQuery ? `Results for "${searchQuery}"` : 'All Collections'}
          </h1>
          <p className="text-center text-[#8C7B75] text-sm mt-2">
            {loading ? 'Loading...' : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2 border border-[#E5DDD8] bg-white rounded-xl px-4 py-2.5 text-sm hover:border-[#E8B4B8] transition-colors">
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && <span className="bg-[#E8B4B8] text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>}
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button onClick={() => setSelectedCategory('')} className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${!selectedCategory ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#E5DDD8] text-[#2D2D2D] hover:border-[#E8B4B8]'}`}>All</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.slug)} className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${selectedCategory === cat.slug ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-[#E5DDD8] text-[#2D2D2D] hover:border-[#E8B4B8]'}`}>{cat.name}</button>
              ))}
            </div>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="appearance-none bg-white border border-[#E5DDD8] rounded-xl px-4 py-2.5 text-sm pr-8 focus:outline-none focus:border-[#E8B4B8] cursor-pointer">
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7B75] pointer-events-none" />
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="bg-white border border-[#F0EAE6] rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-playfair font-semibold text-[#1A1A1A] mb-4">Price Range</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-[#8C7B75]"><span>₹{priceRange[0].toLocaleString('en-IN')}</span><span>₹{priceRange[1].toLocaleString('en-IN')}</span></div>
                {[['Under ₹1,000', 0, 1000], ['₹1,000 – ₹5,000', 1000, 5000], ['₹5,000 – ₹15,000', 5000, 15000], ['₹15,000 – ₹50,000', 15000, 50000], ['All Prices', 0, 50000]].map(([label, min, max]) => (
                  <button key={label as string} onClick={() => setPriceRange([min as number, max as number])} className={`block w-full text-left text-sm py-1.5 transition-colors ${priceRange[0] === min && priceRange[1] === max ? 'text-[#E8B4B8] font-medium' : 'text-[#8C7B75] hover:text-[#1A1A1A]'}`}>{label as string}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-playfair font-semibold text-[#1A1A1A] mb-4">Special</h4>
              <div className="space-y-3">
                {[{ label: 'New Arrivals', state: filterNew, setter: setFilterNew }, { label: 'Featured', state: filterFeatured, setter: setFilterFeatured }].map(({ label, state, setter }) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={state} onChange={(e) => setter(e.target.checked)} className="w-4 h-4 rounded border-[#E5DDD8] text-[#E8B4B8] focus:ring-[#E8B4B8]" />
                    <span className="text-sm text-[#2D2D2D]">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <button onClick={clearFilters} className="flex items-center gap-2 text-sm text-[#E8B4B8] hover:text-[#D4969A] transition-colors"><X size={14} /> Clear all filters</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (<div key={i} className="bg-white rounded-2xl overflow-hidden"><div className="aspect-[3/4] bg-[#F0EAE6] animate-pulse" /><div className="p-4 space-y-2"><div className="h-3 bg-[#F0EAE6] rounded animate-pulse w-1/2" /><div className="h-4 bg-[#F0EAE6] rounded animate-pulse" /><div className="h-4 bg-[#F0EAE6] rounded animate-pulse w-1/4" /></div></div>))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-[#F0EAE6] rounded-full flex items-center justify-center mx-auto mb-4"><SlidersHorizontal size={24} className="text-[#8C7B75]" /></div>
            <h3 className="font-playfair text-xl text-[#1A1A1A] mb-2">No products found</h3>
            <p className="text-[#8C7B75] text-sm mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        )}
      </div>
    </div>
  );
}
