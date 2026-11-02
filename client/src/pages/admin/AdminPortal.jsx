import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Archive,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  ExternalLink,
  Layers,
  Briefcase,
  Users,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminPortal() {
  const [content, setContent] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'services', 'projects', 'students'
  const [statusFilter, setStatusFilter] = useState(''); // 'published', 'hidden', 'archived'
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Multi-selection state for Bulk Operations
  const [selectedIds, setSelectedIds] = useState([]); // [{ id, entityType }]

  // Inspect Modal
  const [inspectItem, setInspectItem] = useState(null);
  const [inspectOpen, setInspectOpen] = useState(false);

  // Bulk action confirmation
  const [bulkAction, setBulkAction] = useState(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const { addToast } = useToast();

  const fetchPortalContent = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: typeFilter,
        page: pagination.page,
        limit: pagination.limit,
      });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/admin/portal?${params.toString()}`);
      setContent(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to load portal content:', err);
      addToast('Failed to load portal content directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalContent();
  }, [typeFilter, statusFilter, pagination.page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchPortalContent();
  };

  // Toggle selection
  const handleToggleSelect = (item) => {
    const exists = selectedIds.some((s) => s.id === item._id);
    if (exists) {
      setSelectedIds(selectedIds.filter((s) => s.id !== item._id));
    } else {
      setSelectedIds([...selectedIds, { id: item._id, entityType: item.entityType }]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === content.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(content.map((c) => ({ id: c._id, entityType: c.entityType })));
    }
  };

  // Individual action
  const handleSingleAction = async (item, action) => {
    try {
      if (item.entityType === 'Service') {
        await api.put(`/admin/services/${item._id}/portal-status`, { action });
      } else if (item.entityType === 'Project') {
        await api.put(`/admin/projects/${item._id}/portal-status`, { action });
      } else if (item.entityType === 'Student') {
        await api.put(`/admin/users/${item._id}/status`, {
          action: action === 'hide' ? 'suspend' : 'reactivate',
          reason: `Portal management action: ${action}`,
        });
      }

      addToast(`Item updated to "${action}" successfully`, 'success');
      fetchPortalContent();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update content', 'error');
    }
  };

  // Bulk action
  const handleExecuteBulk = async () => {
    if (selectedIds.length === 0 || !bulkAction) return;
    try {
      setBulkLoading(true);
      await api.post('/admin/portal/bulk', {
        action: bulkAction,
        items: selectedIds,
      });

      addToast(`Successfully applied "${bulkAction}" to ${selectedIds.length} items`, 'success');
      setBulkModalOpen(false);
      setSelectedIds([]);
      fetchPortalContent();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to execute bulk operation', 'error');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <Globe2 className="w-4 h-4" />
            <span>Master Content Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Portal Content Management
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Control exactly what is visible on the public student portal. Hide, publish, archive, or restore with instant synchronization.
          </p>
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-xs text-xs font-semibold">
          {[
            { label: 'All Content', val: 'all' },
            { label: 'Services', val: 'services' },
            { label: 'Projects', val: 'projects' },
            { label: 'Students', val: 'students' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => {
                setTypeFilter(tab.val);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`
                px-3 py-1.5 rounded-lg transition-all
                ${
                  typeFilter === tab.val
                    ? 'bg-[#0071e3] text-white shadow-xs'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control & Bulk Actions Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search portal content by title or name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0071e3]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none"
          >
            <option value="">All Publication States</option>
            <option value="published">Published on Portal</option>
            <option value="hidden">Hidden from Portal</option>
            <option value="archived">Archived</option>
          </select>

          {/* Bulk Operations Dropdown / Buttons */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-xs font-bold text-[#0071e3] px-2">
                {selectedIds.length} Selected
              </span>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  setBulkAction('publish');
                  setBulkModalOpen(true);
                }}
              >
                Bulk Publish
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  setBulkAction('hide');
                  setBulkModalOpen(true);
                }}
              >
                Bulk Hide
              </Button>
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  setBulkAction('archive');
                  setBulkModalOpen(true);
                }}
              >
                Bulk Archive
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Scanning portal catalog..." />
          </div>
        ) : content.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No content entities match the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={handleSelectAll} className="p-1 text-[#64748b]">
                      {selectedIds.length === content.length && content.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#0071e3]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Entity Type</th>
                  <th className="py-3.5 px-4">Title / Name</th>
                  <th className="py-3.5 px-4">Category / Dept</th>
                  <th className="py-3.5 px-4">Portal Visibility</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Instant Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {content.map((item) => {
                  const isSelected = selectedIds.some((s) => s.id === item._id);
                  const pStatus = item.portalStatus || (item.isActive ? 'published' : 'hidden');

                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors ${
                        isSelected ? 'bg-[#0071e3]/5 dark:bg-[#0071e3]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleSelect(item)}
                          className="p-1 text-[#64748b]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0071e3]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase
                            ${
                              item.entityType === 'Service'
                                ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                                : item.entityType === 'Project'
                                ? 'bg-[#0071e3]/10 text-[#0071e3]'
                                : 'bg-[#34c759]/10 text-[#34c759]'
                            }
                          `}
                        >
                          {item.entityType === 'Service' && <Briefcase className="w-3 h-3" />}
                          {item.entityType === 'Project' && <Layers className="w-3 h-3" />}
                          {item.entityType === 'Student' && <Users className="w-3 h-3" />}
                          {item.entityType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#0f172a] dark:text-white max-w-xs truncate">
                        {item.title}
                      </td>

                      <td className="py-3.5 px-4 text-[#64748b] capitalize">
                        {item.category || 'General'}
                      </td>

                      <td className="py-3.5 px-4">
                        {pStatus === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                            <CheckCircle2 className="w-3 h-3" /> Live on Portal
                          </span>
                        ) : pStatus === 'hidden' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444]">
                            <EyeOff className="w-3 h-3" /> Hidden from Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                            <Archive className="w-3 h-3" /> Archived
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {pStatus === 'published' ? (
                            <button
                              onClick={() => handleSingleAction(item, 'hide')}
                              className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10"
                              title="Hide from Portal"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSingleAction(item, 'publish')}
                              className="p-1.5 rounded-lg text-[#34c759] hover:bg-[#34c759]/10"
                              title="Publish / Restore to Portal"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {pStatus !== 'archived' && (
                            <button
                              onClick={() => handleSingleAction(item, 'archive')}
                              className="p-1.5 rounded-lg text-[#64748b] hover:bg-black/[0.04]"
                              title="Archive Content"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs text-[#64748b]">
          <span>Page {pagination.page} of {pagination.pages || 1}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="p-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="p-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {bulkModalOpen && (
        <Modal
          isOpen={bulkModalOpen}
          onClose={() => setBulkModalOpen(false)}
          title={`Confirm Bulk Action: ${bulkAction?.toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#64748b] dark:text-[#94a3b8]">
              You have selected <strong className="text-[#0f172a] dark:text-white">{selectedIds.length} items</strong>.
              Are you sure you want to apply <strong>{bulkAction}</strong> to all of them?
            </p>
            <p className="text-[#ef4444] font-medium">
              Hidden or archived content immediately disappears from the student-facing search and category listings.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setBulkModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={bulkAction === 'hide' ? 'danger' : 'primary'}
                size="sm"
                loading={bulkLoading}
                onClick={handleExecuteBulk}
              >
                Execute Bulk {bulkAction}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
