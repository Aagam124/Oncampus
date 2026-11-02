import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Shield,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [entityType, setEntityType] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Inspector Modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [inspectOpen, setInspectOpen] = useState(false);

  const { addToast } = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (search) params.append('action', search);
      if (entityType) params.append('entityType', entityType);

      const res = await api.get(`/admin/audit-logs?${params.toString()}`);
      setLogs(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      addToast('Failed to load audit trail', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.page, entityType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchLogs();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Immutable Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Administrative Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Tamper-evident logs of every moderation decision, account status change, and portal modification.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          Total Recorded Actions: <strong className="text-[#0071e3]">{pagination.total}</strong>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action name (e.g. SUSPEND, HIDE)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0071e3]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none"
          >
            <option value="">All Entity Types</option>
            <option value="User">User</option>
            <option value="Service">Service</option>
            <option value="Project">Project</option>
            <option value="Order">Order</option>
            <option value="Report">Report</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Retrieving security audit logs..." />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No administrative audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Documented Reason</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                    <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#0f172a] dark:text-white">
                      {log.admin ? `${log.admin.firstName} ${log.admin.lastName}` : 'System Agent'}
                      <span className="block text-[10px] text-[#0071e3] font-bold uppercase">
                        {log.admin?.adminRole || log.admin?.role || 'Admin'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#0f172a] dark:text-white">
                        {log.entityType}
                      </span>
                      <span className="block text-[10px] text-[#64748b] truncate max-w-[150px]">
                        {log.entityTitle || log.entityId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#64748b] max-w-xs truncate">
                      {log.reason || 'Routine administrative maintenance'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setInspectOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-black/[0.04]"
                        title="View Full State Payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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

      {/* Audit Log Modal */}
      {inspectOpen && selectedLog && (
        <Modal
          isOpen={inspectOpen}
          onClose={() => setInspectOpen(false)}
          title={`Audit Record: ${selectedLog.action}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <span className="text-[#94a3b8] block">Admin Operator</span>
                <span className="font-bold text-[#0f172a] dark:text-white">
                  {selectedLog.admin?.firstName} {selectedLog.admin?.lastName} ({selectedLog.admin?.email})
                </span>
              </div>
              <div>
                <span className="text-[#94a3b8] block">Timestamp</span>
                <span className="font-bold">{new Date(selectedLog.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-[#94a3b8] block mb-1">State Transition Payload</span>
              <pre className="p-3 rounded-xl bg-[#0f172a] text-[#38bdf8] font-mono text-[11px] overflow-x-auto max-h-56">
                {JSON.stringify(
                  {
                    action: selectedLog.action,
                    entityType: selectedLog.entityType,
                    entityId: selectedLog.entityId,
                    previousState: selectedLog.previousState,
                    newState: selectedLog.newState,
                    reason: selectedLog.reason,
                    ipAddress: selectedLog.ipAddress,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="xs" onClick={() => setInspectOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
