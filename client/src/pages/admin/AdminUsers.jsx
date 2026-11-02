import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import api from '@/lib/axios';
import Avatar from '@/components/Avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'suspend', 'reactivate', 'verify', 'unverify'
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (verificationStatus) params.append('verificationStatus', verificationStatus);

      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      addToast('Failed to load student directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, status, verificationStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const openActionModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setActionReason('');
    setActionModalOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      await api.put(`/admin/users/${selectedUser._id}/status`, {
        action: actionType,
        reason: actionReason,
      });

      addToast(`Student account successfully updated (${actionType})`, 'success');
      setActionModalOpen(false);
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Student Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            All Enrolled Students
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Complete student directory, identity verification, and account access management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] text-[#64748b] dark:text-[#94a3b8] shadow-xs">
            Total Students: <strong className="text-[#0f172a] dark:text-white">{pagination.total}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or institutional ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0071e3]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active Accounts Only</option>
            <option value="suspended">Suspended Accounts Only</option>
          </select>

          {/* Verification filter */}
          <select
            value={verificationStatus}
            onChange={(e) => {
              setVerificationStatus(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none"
          >
            <option value="">All Verification States</option>
            <option value="verified">Verified Students</option>
            <option value="pending">Verification Pending</option>
            <option value="unverified">Unverified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Loading student records..." />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No students found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">University & Dept</th>
                  <th className="py-3.5 px-4">Skills</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {users.map((u) => {
                  const isVerified = u.isVerified || u.verificationStatus === 'verified';
                  const isSuspended = !u.isActive;

                  return (
                    <tr key={u._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={`${u.firstName} ${u.lastName}`} size="sm" />
                          <div>
                            <div className="font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                              <span>{u.firstName} {u.lastName}</span>
                              {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />}
                            </div>
                            <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0f172a] dark:text-white">
                          {u.university || 'Not listed'}
                        </div>
                        <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                          {u.department || 'Undergraduate'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(u.skills || []).slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[10px] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                          {(u.skills || []).length > 3 && (
                            <span className="text-[10px] text-[#94a3b8]">
                              +{u.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : u.verificationStatus === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                            <ShieldAlert className="w-3 h-3" /> Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#64748b]/10 text-[#64748b]">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444]">
                            <UserX className="w-3 h-3" /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#64748b] dark:text-[#94a3b8] whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setInspectModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                            title="Inspect Student Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isVerified && (
                            <button
                              onClick={() => openActionModal(u, 'verify')}
                              className="p-1.5 rounded-lg text-[#0071e3] hover:bg-[#0071e3]/10"
                              title="Verify Student"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}

                          {isSuspended ? (
                            <button
                              onClick={() => openActionModal(u, 'reactivate')}
                              className="p-1.5 rounded-lg text-[#34c759] hover:bg-[#34c759]/10"
                              title="Reactivate Account"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openActionModal(u, 'suspend')}
                              className="p-1.5 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10"
                              title="Suspend Account"
                            >
                              <UserX className="w-4 h-4" />
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
          <span>
            Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.pages || 1}</strong>
          </span>
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

      {/* Inspect Profile Modal */}
      {inspectModalOpen && selectedUser && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => setInspectModalOpen(false)}
          title="Student Profile Overview"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <Avatar src={selectedUser.avatar} name={`${selectedUser.firstName} ${selectedUser.lastName}`} size="lg" />
              <div>
                <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-xs text-[#64748b]">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-[#0071e3]">{selectedUser.university}</span>
                  <span>•</span>
                  <span className="text-[11px] text-[#64748b]">{selectedUser.department}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#0f172a] dark:text-white mb-1">Headline & Bio</h4>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
                {selectedUser.bio || 'No bio provided.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#0f172a] dark:text-white mb-1.5">Listed Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedUser.skills || []).map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
              <Link
                to={`/users/${selectedUser._id}`}
                target="_blank"
                className="text-[#0071e3] font-bold flex items-center gap-1 hover:underline"
              >
                View Public Portfolio <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Button variant="secondary" size="xs" onClick={() => setInspectModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Confirmation Modal (Suspend, Reactivate, Verify) */}
      {actionModalOpen && selectedUser && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Confirm Action: ${actionType.toUpperCase()}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
              You are about to <strong>{actionType}</strong> account access for{' '}
              <strong className="text-[#0f172a] dark:text-white">
                {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              </strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] dark:text-white mb-1">
                Document Reason / Administrative Audit Note:
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Explain justification for this administrative decision..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'suspend' ? 'danger' : 'primary'}
                size="sm"
                loading={actionLoading}
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
