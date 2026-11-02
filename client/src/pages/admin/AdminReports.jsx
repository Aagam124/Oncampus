import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  UserX,
  Filter,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Investigation Modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [investigateOpen, setInvestigateOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [takeAction, setTakeAction] = useState('none'); // 'none', 'hide_content', 'suspend_user'
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (statusFilter) params.append('status', statusFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);

      const res = await api.get(`/admin/reports?${params.toString()}`);
      setReports(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
      addToast('Failed to load moderation reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, targetTypeFilter, pagination.page]);

  const openInvestigation = (report) => {
    setSelectedReport(report);
    setAdminNote(report.adminNote || '');
    setTakeAction('none');
    setInvestigateOpen(true);
  };

  const handleUpdateReport = async (newStatus) => {
    if (!selectedReport) return;
    try {
      setSubmitting(true);
      await api.put(`/admin/reports/${selectedReport._id}`, {
        status: newStatus,
        adminNote,
        takeAction,
      });

      addToast(`Report marked as "${newStatus}"`, 'success');
      setInvestigateOpen(false);
      fetchReports();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ef4444] text-xs font-bold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Platform Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Reported Content & Moderation Center
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Review community complaints, investigate potential fraud, and penalize violations.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white shadow-xs focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Queue</option>
            <option value="reviewed">Under Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Checking moderation reports..." />
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            <CheckCircle2 className="w-8 h-8 text-[#34c759] mx-auto mb-2 opacity-80" />
            No reports matching current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Report ID</th>
                  <th className="py-3.5 px-4">Target Type</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Reporter</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Filed On</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">
                      #{String(r._id).slice(-6).toUpperCase()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize font-bold text-[#0f172a] dark:text-white px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[10px]">
                        {r.targetType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#ef4444] font-semibold capitalize">
                      {r.reason}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0f172a] dark:text-white">
                        {r.reporter ? `${r.reporter.firstName} ${r.reporter.lastName}` : 'Anonymous'}
                      </div>
                      <div className="text-[10px] text-[#64748b]">{r.reporter?.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {r.status === 'pending' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444]">Pending Review</span>
                      ) : r.status === 'reviewed' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">Under Review</span>
                      ) : r.status === 'resolved' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">Resolved</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#64748b]/10 text-[#64748b]">Dismissed</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="xs"
                        icon={Eye}
                        onClick={() => openInvestigation(r)}
                      >
                        Investigate
                      </Button>
                    </td>
                  </tr>
                ))}
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

      {/* Investigation Modal */}
      {investigateOpen && selectedReport && (
        <Modal
          isOpen={investigateOpen}
          onClose={() => setInvestigateOpen(false)}
          title={`Moderation Investigation: #${String(selectedReport._id).slice(-6).toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f172a] dark:text-white capitalize">Category: {selectedReport.reason}</span>
                <span className="capitalize text-[10px] font-bold text-[#0071e3]">Target: {selectedReport.targetType}</span>
              </div>
              <p className="text-[#64748b] pt-1">
                Description: {selectedReport.description || 'No additional details provided by reporter.'}
              </p>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Moderation Enforcement Action:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'No Content Action' },
                  { id: 'hide_content', label: 'Hide Target Content' },
                  { id: 'suspend_user', label: 'Suspend Offender' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setTakeAction(act.id)}
                    className={`
                      p-2 rounded-xl border text-center font-bold text-[11px] transition-all
                      ${
                        takeAction === act.id
                          ? 'bg-[#0071e3] text-white border-[#0071e3]'
                          : 'bg-[#f8fafc] dark:bg-[#0e131f] border-black/[0.06] dark:border-white/[0.08] text-[#64748b]'
                      }
                    `}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Internal Administrative Notes / Resolution Record:
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Document investigation outcome and rationale..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="secondary"
                size="xs"
                onClick={() => handleUpdateReport('dismissed')}
                loading={submitting}
              >
                Dismiss Report
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => handleUpdateReport('reviewed')}
                  loading={submitting}
                >
                  Mark Under Review
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => handleUpdateReport('resolved')}
                  loading={submitting}
                >
                  Resolve Case
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
