import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Plus, Users, SlidersHorizontal, X } from 'lucide-react';
import api from '@/lib/axios';
import ProjectCard from '@/components/ProjectCard';
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
  { value: 'research', label: 'Research & Surveys' },
  { value: 'other', label: 'Other' },
];

export default function ProjectBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      params.append('page', page);
      params.append('limit', '12');

      const res = await api.get(`/projects?${params.toString()}`);
      const payload = res.data?.data || [];
      const paginationInfo = res.data?.pagination || { page, limit: 12, total: payload.length, pages: 1 };

      setProjects(payload);
      setPagination(paginationInfo);
    } catch (err) {
      console.error('Failed to load projects', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, type, status, page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
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

  const hasActiveFilters = Boolean(search || category || type || status);

  return (
    <div className="bg-surface-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-surface-900 tracking-tight">
              Collaborations & Campus Projects
            </h1>
            <p className="mt-1 text-sm text-surface-600">
              Find hackathon teammates, research partners, or join student startup teams.
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/projects/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Project</span>
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

        {/* Search */}
        <div className="bg-white p-3 rounded-2xl border border-surface-200/80 shadow-sm mb-8">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search projects by title, description or skills (e.g. AI, Flutter, Marketing)..."
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
          {/* Sidebar Filters */}
          <div className={`md:block ${showMobileFilters ? 'block' : 'hidden'} md:col-span-1`}>
            <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2 font-semibold text-surface-900">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <span>Filters</span>
                </div>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-xs text-brand-600 hover:text-brand-800 font-medium">
                    Reset
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
                  className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
                  Project Type
                </label>
                <div className="space-y-2">
                  {[
                    { val: '', label: 'All Types' },
                    { val: 'collaboration', label: 'Peer Collaboration' },
                    { val: 'hiring', label: 'Paid Hiring' },
                  ].map((t) => (
                    <label key={t.val} className="flex items-center gap-2 text-sm text-surface-700 cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        checked={type === t.val}
                        onChange={() => updateParam('type', t.val)}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => updateParam('status', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-surface-300 bg-white"
                >
                  <option value="">Any Status</option>
                  <option value="open">Open for Members</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-surface-500">Active filters:</span>
                {category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
                    Category: {category}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('category', '')} />
                  </span>
                )}
                {type && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
                    Type: {type}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('type', '')} />
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

            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner message="Discovering campus projects..." />
              </div>
            ) : projects.length === 0 ? (
              <EmptyState
                title="No projects found"
                description="Be the first to post a collaboration opportunity or tweak your search criteria."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>

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
