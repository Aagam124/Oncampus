import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  Archive,
  EyeOff,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [portalStatus, setPortalStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedService, setSelectedService] = useState(null);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'publish', 'hide', 'archive', 'reject'
  const [actionReason, setActionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (portalStatus) params.append('portalStatus', portalStatus);

      const res = await api.get(`/admin/services?${params.toString()}`);
      setServices(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      addToast('Failed to load services list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pagination.page, status, portalStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchServices();
  };

  const openActionModal = (service, type) => {
    setSelectedService(service);
    setActionType(type);
    setActionReason('');
    setActionOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedService) return;
    try {
      setSubmitting(true);
      if (actionType === 'remove' || actionType === 'delete') {
        await api.delete(`/admin/services/${selectedService._id}`, {
          data: { reason: actionReason },
        });
        addToast('Service removed successfully', 'success');
      } else {
        await api.put(`/admin/services/${selectedService._id}/portal-status`, {
          action: actionType,
          reason: actionReason,
        });
        addToast(`Service updated to ${actionType} successfully`, 'success');
      }

      setActionOpen(false);
      fetchServices();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update service status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#8b5cf6] text-xs font-bold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Marketplace Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Services & Gigs Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Review student freelancing offerings, pricing models, and control portal visibility.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          Total Services: <strong className="text-[#8b5cf6]">{pagination.total}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title, skills or tags..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0071e3]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={portalStatus}
            onChange={(e) => {
              setPortalStatus(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none"
          >
            <option value="">All Portal States</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden from Portal</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Loading services..." />
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No services found matching current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Student Provider</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Portal Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {services.map((s) => {
                  const pStatus = s.portalStatus || 'published';
                  return (
                    <tr key={s._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#0f172a] dark:text-white truncate">
                          {s.title}
                        </div>
                        <div className="text-[11px] text-[#64748b] truncate">
                          {s.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0f172a] dark:text-white">
                          {s.provider ? `${s.provider.firstName} ${s.provider.lastName}` : 'Student'}
                        </div>
                        <div className="text-[11px] text-[#64748b]">{s.provider?.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#0f172a] dark:text-white">
                          ₹{(s.pricing?.amount || s.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#64748b] block capitalize">
                          {s.pricing?.type || 'Fixed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[10px] font-semibold">
                          {s.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {pStatus === 'published' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : pStatus === 'hidden' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444]">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                            <Archive className="w-3 h-3" /> Archived
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedService(s);
                              setInspectOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-black/[0.04]"
                            title="Inspect Service"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {pStatus === 'published' ? (
                            <button
                              onClick={() => openActionModal(s, 'hide')}
                              className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10"
                              title="Hide from Portal"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openActionModal(s, 'publish')}
                              className="p-1.5 rounded-lg text-[#34c759] hover:bg-[#34c759]/10"
                              title="Restore to Portal"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {pStatus !== 'archived' && (
                            <button
                              onClick={() => openActionModal(s, 'archive')}
                              className="p-1.5 rounded-lg text-[#64748b] hover:bg-black/[0.04]"
                              title="Archive Service"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => openActionModal(s, 'remove')}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                            title="Remove Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Inspect Modal */}
      {inspectOpen && selectedService && (
        <Modal
          isOpen={inspectOpen}
          onClose={() => setInspectOpen(false)}
          title="Service Inspector"
        >
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                {selectedService.title}
              </h3>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                Provider: {selectedService.provider?.firstName} {selectedService.provider?.lastName} ({selectedService.provider?.email})
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#0f172a] dark:text-white mb-1">Service Description</h4>
              <p className="text-[#64748b] leading-relaxed whitespace-pre-wrap">
                {selectedService.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-[#94a3b8] block">Price</span>
                <span className="font-bold text-[#0f172a] dark:text-white">
                  ₹{selectedService.pricing?.amount || selectedService.price}
                </span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Category</span>
                <span className="font-bold capitalize">{selectedService.category}</span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Rating</span>
                <span className="font-bold">{selectedService.rating || 0} ★</span>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <a
                href={`/services/${selectedService._id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#0071e3] font-bold flex items-center gap-1 hover:underline"
              >
                View on Public Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Button variant="secondary" size="xs" onClick={() => setInspectOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Modal */}
      {actionOpen && selectedService && (
        <Modal
          isOpen={actionOpen}
          onClose={() => setActionOpen(false)}
          title={`Confirm Action: ${actionType.toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#64748b] dark:text-[#94a3b8]">
              You are about to set service <strong>"{selectedService.title}"</strong> to{' '}
              <strong className="text-[#0f172a] dark:text-white">{actionType}</strong>.
            </p>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Reason / Student Notification:
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter justification for this action..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActionOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'hide' ? 'danger' : 'primary'}
                size="sm"
                loading={submitting}
                onClick={handleExecuteAction}
              >
                Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
