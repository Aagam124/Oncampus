import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Layers,
  ShoppingBag,
  RotateCcw,
  Sparkles,
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
  const [portalStatus, setPortalStatus] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // Inspector Modal with full details (Services, Projects, Orders)
  const [selectedUser, setSelectedUser] = useState(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'services', 'projects', 'orders'

  // Action Confirmation Modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'suspend', 'reactivate', 'verify', 'unverify', 'hide', 'restore', 'archive', 'remove'
  const [actionReason, setActionReason] = useState('');
  const [cascadeServices, setCascadeServices] = useState(true);
  const [cascadeProjects, setCascadeProjects] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Service specific action state
  const [serviceActionLoading, setServiceActionLoading] = useState(false);

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
      if (portalStatus) params.append('portalStatus', portalStatus);
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
  }, [pagination.page, status, portalStatus, verificationStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  // Open Inspector Modal & fetch user services/projects
  const handleInspectUser = async (user) => {
    setSelectedUser(user);
    setInspectModalOpen(true);
    setActiveTab('profile');
    try {
      setInspectLoading(true);
      const res = await api.get(`/admin/users/${user._id}`);
      setUserDetail(res.data?.data || null);
    } catch (err) {
      console.error('Failed to load user full details:', err);
      addToast('Could not fetch user portfolio records', 'error');
    } finally {
      setInspectLoading(false);
    }
  };

  const openActionModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setActionReason('');
    setCascadeServices(true);
    setCascadeProjects(true);
    setActionModalOpen(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading(true);
      await api.put(`/admin/users/${selectedUser._id}/status`, {
        action: actionType,
        reason: actionReason,
        cascadeServices,
        cascadeProjects,
      });

      addToast(`Student account successfully updated (${actionType})`, 'success');
      setActionModalOpen(false);
      fetchUsers();

      // Refresh inspector if open
      if (inspectModalOpen && selectedUser) {
        const res = await api.get(`/admin/users/${selectedUser._id}`);
        setUserDetail(res.data?.data || null);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Service action from inspector modal (Hide, Archive, Restore, Delete)
  const handleServiceAction = async (serviceId, action) => {
    if (action === 'delete') {
      const confirmed = window.confirm('Are you sure you want to remove this service from the platform?');
      if (!confirmed) return;
    }
    try {
      setServiceActionLoading(true);
      if (action === 'delete') {
        await api.delete(`/admin/services/${serviceId}`, {
          data: { reason: 'Moderator removed service from student inspector' },
        });
        addToast('Service removed successfully', 'success');
      } else {
        await api.put(`/admin/services/${serviceId}/portal-status`, {
          action,
          reason: `Admin updated service visibility to ${action}`,
        });
        addToast(`Service visibility set to ${action}`, 'success');
      }

      // Reload user details in inspector
      if (selectedUser) {
        const res = await api.get(`/admin/users/${selectedUser._id}`);
        setUserDetail(res.data?.data || null);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update service', 'error');
    } finally {
      setServiceActionLoading(false);
    }
  };

  // Quick Project action from inspector modal
  const handleProjectAction = async (projectId, action) => {
    if (action === 'delete') {
      const confirmed = window.confirm('Are you sure you want to remove this project from the platform?');
      if (!confirmed) return;
    }
    try {
      setServiceActionLoading(true);
      if (action === 'delete') {
        await api.delete(`/admin/projects/${projectId}`, {
          data: { reason: 'Moderator removed project from student inspector' },
        });
        addToast('Project removed successfully', 'success');
      } else {
        await api.put(`/admin/projects/${projectId}/portal-status`, {
          action,
          reason: `Admin updated project visibility to ${action}`,
        });
        addToast(`Project visibility set to ${action}`, 'success');
      }

      if (selectedUser) {
        const res = await api.get(`/admin/users/${selectedUser._id}`);
        setUserDetail(res.data?.data || null);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update project', 'error');
    } finally {
      setServiceActionLoading(false);
    }
  };

  // Bulk actions on user's services
  const handleBulkUserServices = async (action) => {
    if (!userDetail?.services || userDetail.services.length === 0) return;
    try {
      setServiceActionLoading(true);
      await Promise.all(
        userDetail.services.map((s) =>
          api.put(`/admin/services/${s._id}/portal-status`, {
            action,
            reason: `Batch ${action} on provider services`,
          })
        )
      );
      addToast(`Updated all ${userDetail.services.length} services to ${action}`, 'success');
      const res = await api.get(`/admin/users/${selectedUser._id}`);
      setUserDetail(res.data?.data || null);
    } catch (err) {
      addToast('Failed to update some services', 'error');
    } finally {
      setServiceActionLoading(false);
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
            Complete student directory, identity verification, portal visibility, and service controls.
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
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or institutional ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#0f172a] dark:text-white placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0071e3]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Account Status filter */}
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

          {/* Portal Visibility filter */}
          <select
            value={portalStatus}
            onChange={(e) => {
              setPortalStatus(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none"
          >
            <option value="">All Portal States</option>
            <option value="published">Published (Visible)</option>
            <option value="hidden">Hidden from Portal</option>
            <option value="archived">Archived</option>
            <option value="removed">Removed</option>
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
                  <th className="py-3.5 px-4">Portal Visibility</th>
                  <th className="py-3.5 px-4">Account</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {users.map((u) => {
                  const isVerified = u.isVerified || u.verificationStatus === 'verified';
                  const isSuspended = !u.isActive;
                  const isHidden = u.portalStatus === 'hidden';
                  const isArchived = u.portalStatus === 'archived';
                  const isRemoved = u.portalStatus === 'removed';

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
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
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

                      {/* Portal Visibility Badge */}
                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                            <XCircle className="w-3 h-3" /> Removed (Suspended)
                          </span>
                        ) : isHidden ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        ) : isArchived ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#64748b]/10 text-[#64748b]">
                            <Archive className="w-3 h-3" /> Archived
                          </span>
                        ) : isRemoved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                            <XCircle className="w-3 h-3" /> Removed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                            <CheckCircle2 className="w-3 h-3" /> Published
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
                          {/* Inspector button: opens modal with full profile and services */}
                          <button
                            onClick={() => handleInspectUser(u)}
                            className="p-1.5 rounded-lg text-[#0071e3] hover:bg-[#0071e3]/10"
                            title="Inspect Profile & Manage Services"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Portal Visibility Toggle */}
                          {isHidden ? (
                            <button
                              onClick={() => openActionModal(u, 'restore')}
                              className="p-1.5 rounded-lg text-[#34c759] hover:bg-[#34c759]/10"
                              title="Restore to Public Portal"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openActionModal(u, 'hide')}
                              className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10"
                              title="Hide from Public Portal"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}

                          {/* Verify */}
                          {!isVerified && (
                            <button
                              onClick={() => openActionModal(u, 'verify')}
                              className="p-1.5 rounded-lg text-[#0071e3] hover:bg-[#0071e3]/10"
                              title="Verify Student"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}

                          {/* Suspend / Reactivate */}
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

      {/* Comprehensive Student Inspector & Service Control Modal */}
      {inspectModalOpen && selectedUser && (
        <Modal
          isOpen={inspectModalOpen}
          onClose={() => setInspectModalOpen(false)}
          title="Student Profile & Portfolio Inspector"
          size="2xl"
        >
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <Avatar src={selectedUser.avatar} name={`${selectedUser.firstName} ${selectedUser.lastName}`} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                    {selectedUser.firstName} {selectedUser.lastName}
                    {(selectedUser.isVerified || selectedUser.verificationStatus === 'verified') && (
                      <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                    )}
                  </h3>
                  <p className="text-xs text-[#64748b]">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-semibold text-[#0071e3]">{selectedUser.university || 'No campus'}</span>
                    <span>•</span>
                    <span className="text-[#64748b]">{selectedUser.department || 'General'}</span>
                    <span>•</span>
                    <span
                      className={`font-bold ${
                        !selectedUser.isActive || selectedUser.portalStatus === 'removed'
                          ? 'text-red-500'
                          : selectedUser.portalStatus === 'hidden'
                          ? 'text-amber-500'
                          : 'text-[#34c759]'
                      }`}
                    >
                      {!selectedUser.isActive
                        ? 'REMOVED (SUSPENDED)'
                        : selectedUser.portalStatus?.toUpperCase() || 'PUBLISHED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedUser.portalStatus === 'hidden' ? (
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={CheckCircle2}
                    onClick={() => openActionModal(selectedUser, 'restore')}
                  >
                    Restore to Portal
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={EyeOff}
                    onClick={() => openActionModal(selectedUser, 'hide')}
                  >
                    Hide from Portal
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="xs"
                  icon={Archive}
                  onClick={() => openActionModal(selectedUser, 'archive')}
                >
                  Archive
                </Button>

                {!selectedUser.isActive ? (
                  <Button
                    variant="primary"
                    size="xs"
                    icon={UserCheck}
                    onClick={() => openActionModal(selectedUser, 'reactivate')}
                  >
                    Reactivate
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="xs"
                    icon={UserX}
                    onClick={() => openActionModal(selectedUser, 'suspend')}
                  >
                    Suspend
                  </Button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-black/[0.05] dark:border-white/[0.06] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2 px-3 border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a] dark:hover:text-white'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'services'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a] dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Services ({userDetail?.services?.length ?? '...'})</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Projects ({userDetail?.projects?.length ?? '...'})</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a] dark:hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders History</span>
              </button>
            </div>

            {inspectLoading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner message="Fetching user portfolio & service records..." />
              </div>
            ) : (
              <div>
                {/* TAB 1: Profile Details */}
                {activeTab === 'profile' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <h4 className="font-bold text-[#0f172a] dark:text-white mb-1">Headline & Bio</h4>
                      <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed bg-[#f8fafc] dark:bg-[#0e131f] p-3 rounded-xl">
                        {selectedUser.bio || 'No personal bio listed by this student.'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#0f172a] dark:text-white mb-1">Skills & Discipline</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedUser.skills || []).length > 0 ? (
                          selectedUser.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-xs font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#94a3b8]">No skills recorded yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f]">
                        <span className="text-[#94a3b8] block text-[10px]">Verification Email</span>
                        <span className="font-semibold text-[#0f172a] dark:text-white">
                          {selectedUser.verificationDetails?.universityEmail || 'Not submitted'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f]">
                        <span className="text-[#94a3b8] block text-[10px]">Portal State</span>
                        <span className="font-semibold capitalize text-[#0071e3]">
                          {selectedUser.portalStatus || 'Published'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f]">
                        <span className="text-[#94a3b8] block text-[10px]">Account Standing</span>
                        <span className={`font-semibold capitalize ${selectedUser.isActive ? 'text-[#34c759]' : 'text-red-500'}`}>
                          {selectedUser.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Services / Gigs */}
                {activeTab === 'services' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="font-bold text-[#0f172a] dark:text-white">
                        Services Offered by {selectedUser.firstName}
                      </span>
                      {userDetail?.services?.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleBulkUserServices('hide')}
                            disabled={serviceActionLoading}
                            className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[11px] font-semibold"
                          >
                            Hide All
                          </button>
                          <button
                            onClick={() => handleBulkUserServices('archive')}
                            disabled={serviceActionLoading}
                            className="px-2 py-1 rounded-lg bg-gray-500/10 text-gray-600 dark:text-gray-300 hover:bg-gray-500/20 text-[11px] font-semibold"
                          >
                            Archive All
                          </button>
                          <button
                            onClick={() => handleBulkUserServices('publish')}
                            disabled={serviceActionLoading}
                            className="px-2 py-1 rounded-lg bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/20 text-[11px] font-semibold"
                          >
                            Restore All
                          </button>
                        </div>
                      )}
                    </div>

                    {!userDetail?.services || userDetail.services.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#94a3b8] bg-[#f8fafc] dark:bg-[#0e131f] rounded-xl">
                        This student has not published any freelancing services yet.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {userDetail.services.map((s) => {
                          const isServiceHidden = s.portalStatus === 'hidden';
                          const isServiceArchived = s.portalStatus === 'archived';
                          const isServiceRemoved = s.portalStatus === 'removed';

                          return (
                            <div
                              key={s._id}
                              className="p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-[#f8fafc] dark:bg-[#0e131f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-[#0f172a] dark:text-white truncate">
                                    {s.title}
                                  </h5>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isServiceHidden
                                        ? 'bg-amber-500/10 text-amber-500'
                                        : isServiceArchived
                                        ? 'bg-gray-500/10 text-gray-400'
                                        : isServiceRemoved
                                        ? 'bg-red-500/10 text-red-500'
                                        : 'bg-[#34c759]/10 text-[#34c759]'
                                    }`}
                                  >
                                    {s.portalStatus?.toUpperCase() || 'PUBLISHED'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-[#64748b] mt-0.5 flex items-center gap-2">
                                  <span className="capitalize">{s.category}</span>
                                  <span>•</span>
                                  <span className="font-bold text-[#0f172a] dark:text-white">
                                    ₹{s.pricing?.amount || s.price}
                                  </span>
                                  <span>•</span>
                                  <span>{s.ordersCount || 0} orders completed</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                {isServiceHidden ? (
                                  <button
                                    onClick={() => handleServiceAction(s._id, 'publish')}
                                    disabled={serviceActionLoading}
                                    className="px-2 py-1 rounded-lg bg-[#34c759]/10 text-[#34c759] hover:bg-[#34c759]/20 text-[11px] font-semibold"
                                    title="Restore Service"
                                  >
                                    Restore
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleServiceAction(s._id, 'hide')}
                                    disabled={serviceActionLoading}
                                    className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[11px] font-semibold"
                                    title="Hide Service from Public Portal"
                                  >
                                    Hide
                                  </button>
                                )}

                                {!isServiceArchived && (
                                  <button
                                    onClick={() => handleServiceAction(s._id, 'archive')}
                                    disabled={serviceActionLoading}
                                    className="p-1 rounded-lg text-[#64748b] hover:bg-black/[0.04]"
                                    title="Archive Service"
                                  >
                                    <Archive className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleServiceAction(s._id, 'delete')}
                                  disabled={serviceActionLoading}
                                  className="p-1 rounded-lg text-red-500 hover:bg-red-500/10"
                                  title="Remove Service"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <a
                                  href={`/services/${s._id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 rounded-lg text-[#0071e3] hover:bg-[#0071e3]/10"
                                  title="View on Portal"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: Projects */}
                {activeTab === 'projects' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#0f172a] dark:text-white pb-1">
                      Projects Posted by {selectedUser.firstName}
                    </div>

                    {!userDetail?.projects || userDetail.projects.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#94a3b8] bg-[#f8fafc] dark:bg-[#0e131f] rounded-xl">
                        This student has not created any project listings.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {userDetail.projects.map((p) => (
                          <div
                            key={p._id}
                            className="p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-[#f8fafc] dark:bg-[#0e131f] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-[#0f172a] dark:text-white truncate">
                                  {p.title}
                                </h5>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0071e3]/10 text-[#0071e3]">
                                  {p.portalStatus?.toUpperCase() || 'PUBLISHED'}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#64748b] mt-0.5 flex items-center gap-2">
                                <span>Budget: ₹{p.budget?.min} - ₹{p.budget?.max}</span>
                                <span>•</span>
                                <span className="capitalize">{p.category}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {p.portalStatus === 'hidden' ? (
                                <button
                                  onClick={() => handleProjectAction(p._id, 'restore')}
                                  className="px-2 py-1 rounded-lg bg-[#34c759]/10 text-[#34c759] text-[11px] font-semibold"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleProjectAction(p._id, 'hide')}
                                  className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[11px] font-semibold"
                                >
                                  Hide
                                </button>
                              )}
                              <button
                                onClick={() => handleProjectAction(p._id, 'delete')}
                                className="p-1 rounded-lg text-red-500 hover:bg-red-500/10"
                                title="Remove Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`/projects/${p._id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-lg text-[#0071e3]"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: Orders History */}
                {activeTab === 'orders' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-bold text-[#0f172a] dark:text-white mb-2">
                          As Buyer / Client ({userDetail?.orders?.asClient?.length || 0})
                        </h5>
                        {(userDetail?.orders?.asClient || []).length === 0 ? (
                          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] text-[#94a3b8] text-center">
                            No purchases recorded.
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {userDetail.orders.asClient.map((o) => (
                              <div key={o._id} className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] flex justify-between">
                                <span className="font-semibold truncate max-w-[140px]">{o.service?.title || 'Order'}</span>
                                <span className="font-bold text-[#0071e3]">₹{o.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-bold text-[#0f172a] dark:text-white mb-2">
                          As Freelancer / Seller ({userDetail?.orders?.asProvider?.length || 0})
                        </h5>
                        {(userDetail?.orders?.asProvider || []).length === 0 ? (
                          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] text-[#94a3b8] text-center">
                            No seller orders completed.
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {userDetail.orders.asProvider.map((o) => (
                              <div key={o._id} className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] flex justify-between">
                                <span className="font-semibold truncate max-w-[140px]">{o.service?.title || 'Order'}</span>
                                <span className="font-bold text-[#34c759]">₹{o.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
              <Link
                to={`/users/${selectedUser._id}`}
                target="_blank"
                className="text-[#0071e3] font-bold flex items-center gap-1 hover:underline"
              >
                Open Student Public Profile <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Button variant="secondary" size="xs" onClick={() => setInspectModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Action Confirmation Modal (Suspend, Hide, Archive, Remove, Verify) */}
      {actionModalOpen && selectedUser && (
        <Modal
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          title={`Confirm Action: ${actionType.toUpperCase()}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
              You are about to execute action <strong>{actionType}</strong> on student account{' '}
              <strong className="text-[#0f172a] dark:text-white">
                {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
              </strong>.
            </p>

            {/* Cascading checkboxes for Hide / Archive / Remove / Suspend */}
            {['hide', 'archive', 'remove', 'suspend'].includes(actionType) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">
                  Cascading Content Options:
                </span>
                <label className="flex items-center gap-2 text-[#0f172a] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cascadeServices}
                    onChange={(e) => setCascadeServices(e.target.checked)}
                    className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
                  />
                  <span>Also {actionType} all services belonging to this student</span>
                </label>
                <label className="flex items-center gap-2 text-[#0f172a] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cascadeProjects}
                    onChange={(e) => setCascadeProjects(e.target.checked)}
                    className="rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
                  />
                  <span>Also {actionType} all projects posted by this student</span>
                </label>
              </div>
            )}

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
                variant={actionType === 'suspend' || actionType === 'remove' ? 'danger' : 'primary'}
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
