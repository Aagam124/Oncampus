import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/useToast';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

export default function AdminReports() {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  // Resolve note modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionStatus, setActionStatus] = useState('resolved');
  const [adminNote, setAdminNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', '20');

      const res = await api.get(`/admin/reports?${params.toString()}`);
      const payload = res.data?.data?.reports || [];
      const pInfo = res.data?.data?.pagination || { page: 1, limit: 20, total: payload.length, pages: 1 };
      setReports(payload);
      setPagination(pInfo);
    } catch (err) {
      addToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, page]);

  const handleOpenActionModal = (report, status) => {
    setSelectedReport(report);
    setActionStatus(status);
    setAdminNote('');
  };

  const handleConfirmAction = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    setSubmittingAction(true);
    try {
      await api.put(`/admin/reports/${selectedReport._id}`, {
        status: actionStatus,
        adminNote: adminNote.trim(),
      });
      addToast(`Report marked as "${actionStatus}"`, 'success');
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update report', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
              <Link to="/admin" className="hover:underline">Admin</Link>
              <span>/</span>
              <span>Reports</span>
            </div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              Platform Reports & Safety Desk
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Investigate harassment, spam, fraudulent listings, or academic dishonesty flags.
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { val: '', label: 'All Reports' },
              { val: 'pending', label: 'Pending' },
              { val: 'resolved', label: 'Resolved' },
              { val: 'dismissed', label: 'Dismissed' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => {
                  setStatusFilter(tab.val);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === tab.val
                    ? 'bg-brand-600 text-white'
                    : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner message="Loading safety reports..." />
            </div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-surface-500 space-y-2">
              <ShieldAlert className="w-8 h-8 text-surface-300 mx-auto" />
              <p className="text-sm">No reports in this queue.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200 text-surface-500 uppercase font-semibold tracking-wider">
                    <th className="py-3.5 px-4">Reporter</th>
                    <th className="py-3.5 px-4">Target Type</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Reported On</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {reports.map((rep) => {
                    const reporterName = rep.reporter?.firstName
                      ? `${rep.reporter.firstName} ${rep.reporter.lastName || ''}`
                      : 'Anonymous';

                    return (
                      <tr key={rep._id} className="hover:bg-surface-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-surface-900">
                          {reporterName}
                        </td>

                        <td className="py-3 px-4 uppercase font-bold text-[11px] text-surface-600">
                          {rep.targetType}
                        </td>

                        <td className="py-3 px-4 capitalize font-semibold text-red-600">
                          {rep.reason}
                        </td>

                        <td className="py-3 px-4 text-surface-600 max-w-xs truncate">
                          {rep.description || 'No description provided.'}
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              rep.status === 'resolved'
                                ? 'success'
                                : rep.status === 'dismissed'
                                ? 'default'
                                : 'warning'
                            }
                          >
                            {rep.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-surface-400">
                          {new Date(rep.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {rep.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleOpenActionModal(rep, 'resolved')}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold transition-colors"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleOpenActionModal(rep, 'dismissed')}
                                className="px-2.5 py-1 bg-surface-100 text-surface-600 hover:bg-surface-200 rounded-lg font-semibold transition-colors"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="p-4 border-t border-surface-100">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Moderation Action Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 space-y-4">
            <h3 className="text-lg font-bold text-surface-900 capitalize">
              {actionStatus} Report
            </h3>
            <p className="text-xs text-surface-600">
              Target: <span className="font-semibold uppercase">{selectedReport.targetType}</span> | Reason:{' '}
              <span className="font-semibold">{selectedReport.reason}</span>
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-700 mb-1">
                  Admin Resolution Note (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Record internal resolution actions taken..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-surface-300 outline-none focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-semibold text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-sm transition-colors ${
                    actionStatus === 'resolved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-surface-700 hover:bg-surface-800'
                  }`}
                >
                  {submittingAction ? 'Processing...' : `Confirm ${actionStatus}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
