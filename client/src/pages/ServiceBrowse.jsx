import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Plus, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/axios';
import ServiceCard from '@/components/ServiceCard';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import useAuthStore from '@/store/authStore';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'presentation', label: 'Presentation & Slides' },
  { value: 'research', label: 'Academic & Research' },
  { value: 'other', label: 'Other Services' },
];

export default function ServiceBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states initialized from searchParams
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const pricingType = searchParams.get('pricingType') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (pricingType) params.append('pricingType', pricingType);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', '12');

      const res = await api.get(`/services?${params.toString()}`);
      const payload = res.data?.data || [];
      const paginationInfo = res.data?.pagination || { page, limit: 12, total: payload.length, pages: 1 };

      setServices(payload);
      setPagination(paginationInfo);
    } catch (err) {
      console.error('Failed to load services', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, pricingType, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // reset page on filter change
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(search || category || pricingType || minPrice || maxPrice || sort !== 'newest');

  return (
    <div className="bg-surface-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-surface-900 tracking-tight">Explore Campus Talent</h1>
            <p className="mt-1 text-sm text-surface-600">
              Hire verified peer talent for software, design, video editing, tutoring, and more.
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/services/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Offer a Service</span>
            </Link>
          )}
        </div>

        {/* Category Filter Pills (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => updateParam('category', cat.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-glow-sm scale-105'
                    : 'bg-white hover:bg-surface-100 text-surface-700 border border-surface-200/90'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar & Mobile filter toggle */}
        <div className="bg-white p-3 rounded-2xl border border-surface-200/80 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search skills, services, or keywords (e.g. Next.js, Figma, Python, Reels)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-50 focus:bg-white text-sm outline-none border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-surface-900 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden px-3.5 py-2.5 border border-surface-300 rounded-xl text-surface-700 hover:bg-surface-50 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters Desktop */}
          <div className={`md:block ${showMobileFilters ? 'block' : 'hidden'} md:col-span-1`}>
            <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2 font-semibold text-surface-900">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => updateParam('category', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 focus:ring-brand-500 focus:border-brand-500 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing Type */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
                  Pricing Model
                </label>
                <div className="space-y-2">
                  {['', 'fixed', 'hourly', 'negotiable'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-surface-700 cursor-pointer">
                      <input
                        type="radio"
                        name="pricingType"
                        checked={pricingType === type}
                        onChange={() => updateParam('pricingType', type)}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <span>
                        {type === '' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
                  Budget (₹)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-surface-300"
                  />
                  <span className="text-surface-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-surface-300"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="md:col-span-3">
            {/* Active pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-surface-500">Active filters:</span>
                {category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
                    Category: {category}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('category', '')} />
                  </span>
                )}
                {pricingType && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
                    Type: {pricingType}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('pricingType', '')} />
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
                    "{search}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('search', '')} />
                  </span>
                )}
              </div>
            )}

            {/* Content state */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner message="Loading services..." />
              </div>
            ) : services.length === 0 ? (
              <EmptyState
                title="No services found"
                description="Try tweaking your search keywords or removing some filters to find what you need."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
