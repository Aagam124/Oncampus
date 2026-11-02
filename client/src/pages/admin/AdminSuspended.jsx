import React, { useState, useEffect } from 'react';
import {
  UserX,
  UserCheck,
  Search,
  AlertTriangle,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import Avatar from '@/components/Avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { useToast } from '@/hooks/useToast';

export default function AdminSuspended() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });

  // Reactivate modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  const { addToast } = useToast();

  const fetchSuspended = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?status=suspended&search=${encodeURIComponent(search)}&page=${pagination.page}&limit=${pagination.limit}`);
      setUsers(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load suspended accounts:', err);
      addToast('Failed to load suspended accounts list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuspended();
  }, [pagination.page]);

  const handleReactivate = async () => {
    if (!selectedUser) return;
    try {
      setReactivating(true);
      await api.put(`/admin/users/${selectedUser._id}/status`, {
        action: 'reactivate',
        reason: 'Account reinstated by administrator.',
      });
      addToast('Student account reactivated successfully', 'success');
      setModalOpen(false);
      fetchSuspended();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reactivate account', 'error');
    } finally {
      setReactivating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ef4444] text-xs font-bold uppercase tracking-wider mb-1">
            <UserX className="w-4 h-4" />
            <span>Restricted Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Suspended Student Accounts
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Review disabled accounts, suspension reasons, and reinstate portal access.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] text-[#ef4444] shadow-xs">
          {pagination.total} Suspended
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Checking suspended accounts..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No suspended student accounts on record.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">University</th>
                  <th className="py-3.5 px-4">Suspension Reason</th>
                  <th className="py-3.5 px-4">Suspended On</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {users.map((u) => {
                  const s = u.suspensionDetails || {};
                  return (
                    <tr key={u._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={`${u.firstName} ${u.lastName}`} size="sm" />
                          <div>
                            <span className="font-bold text-[#0f172a] dark:text-white">
                              {u.firstName} {u.lastName}
                            </span>
                            <div className="text-[11px] text-[#64748b]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#0f172a] dark:text-white">
                        {u.university || 'Unspecified'}
                      </td>

                      <td className="py-3.5 px-4 text-[#ef4444] font-medium max-w-xs">
                        <div className="truncate">{s.reason || 'Platform policy violation'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {s.suspendedAt ? new Date(s.suspendedAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="primary"
                          size="xs"
                          icon={UserCheck}
                          onClick={() => {
                            setSelectedUser(u);
                            setModalOpen(true);
                          }}
                        >
                          Reactivate
                        </Button>
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

      {/* Confirmation Modal */}
      {modalOpen && selectedUser && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Reactivate Student Account"
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#64748b] dark:text-[#94a3b8]">
              Are you sure you want to lift the suspension for{' '}
              <strong className="text-[#0f172a] dark:text-white">
                {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              </strong>?
              They will regain full login privileges and access to their marketplace services.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={reactivating}
                onClick={handleReactivate}
              >
                Confirm Reactivation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
