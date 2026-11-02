import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Shield,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import api from '@/lib/axios';
import Avatar from '@/components/Avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';
import useAuthStore from '@/store/authStore';

export default function AdminRoles() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  // Edit role modal
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/roles');
      setAdmins(res.data?.data?.admins || []);
    } catch (err) {
      console.error('Failed to load admins:', err);
      addToast('Failed to load administrator accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openRoleEdit = (admin) => {
    setSelectedAdmin(admin);
    setNewRole(admin.adminRole || 'admin');
    setRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedAdmin) return;
    try {
      setSubmitting(true);
      await api.put(`/admin/roles/${selectedAdmin._id}`, {
        adminRole: newRole,
      });

      addToast(`Updated ${selectedAdmin.firstName}'s administrative role to ${newRole}`, 'success');
      setRoleModalOpen(false);
      fetchAdmins();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update admin role', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isSuperAdmin = currentUser?.adminRole === 'super_admin' || currentUser?.role === 'admin';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Admin Roles & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Configure administrative authorization tiers, moderation privileges, and platform security policies.
          </p>
        </div>
      </div>

      {/* Role Tier Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card space-y-2">
          <div className="flex items-center gap-2 text-[#0071e3] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>SUPER ADMIN</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Full root authority across the entire platform. Can manage administrator roles, reconfigure security settings, and execute irreversible operations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card space-y-2">
          <div className="flex items-center gap-2 text-[#8b5cf6] font-bold text-xs">
            <Shield className="w-4 h-4" />
            <span>ADMINISTRATOR</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Operational governance: manage student verification, publish or hide portal content, adjudicate order disputes, and broadcast announcements.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card space-y-2">
          <div className="flex items-center gap-2 text-[#34c759] font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>MODERATOR</span>
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed">
            Review reported marketplace services, investigate complaints, and temporarily hide inappropriate content pending supervisor review.
          </p>
        </div>
      </div>

      {/* Administrator Accounts Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        <div className="p-4 border-b border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-bold text-[#0f172a] dark:text-white uppercase tracking-wider">
            Active Administrative Accounts
          </span>
          <span className="text-xs text-[#64748b]">Backend Role Enforcement Active</span>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Loading administrator roster..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Assigned Role Tier</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {admins.map((adm) => {
                  const roleTier = adm.adminRole === 'super_admin' ? 'Super Admin' : adm.adminRole === 'moderator' ? 'Moderator' : 'Administrator';
                  return (
                    <tr key={adm._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={adm.avatar} name={`${adm.firstName} ${adm.lastName}`} size="sm" />
                          <span className="font-bold text-[#0f172a] dark:text-white">
                            {adm.firstName} {adm.lastName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#64748b]">{adm.email}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`
                            px-2.5 py-0.5 rounded-full text-[10px] font-bold
                            ${
                              adm.adminRole === 'super_admin'
                                ? 'bg-[#0071e3]/10 text-[#0071e3]'
                                : adm.adminRole === 'moderator'
                                ? 'bg-[#34c759]/10 text-[#34c759]'
                                : 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                            }
                          `}
                        >
                          {roleTier}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {new Date(adm.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => openRoleEdit(adm)}
                        >
                          Modify Role
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Edit Modal */}
      {roleModalOpen && selectedAdmin && (
        <Modal
          isOpen={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          title={`Assign Admin Role: ${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#64748b] dark:text-[#94a3b8]">
              Select the administrative authority tier for{' '}
              <strong className="text-[#0f172a] dark:text-white">{selectedAdmin.email}</strong>:
            </p>

            <div className="space-y-2">
              {[
                { id: 'super_admin', label: 'Super Admin', desc: 'Full platform root privileges + role administration' },
                { id: 'admin', label: 'Administrator', desc: 'Manage students, marketplace orders, and portal content' },
                { id: 'moderator', label: 'Moderator', desc: 'Review reports and hide violating services' },
              ].map((tier) => (
                <label
                  key={tier.id}
                  onClick={() => setNewRole(tier.id)}
                  className={`
                    flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${
                      newRole === tier.id
                        ? 'border-[#0071e3] bg-[#0071e3]/5 dark:bg-[#0071e3]/10'
                        : 'border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02]'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="adminRole"
                    checked={newRole === tier.id}
                    onChange={() => setNewRole(tier.id)}
                    className="mt-0.5 text-[#0071e3]"
                  />
                  <div>
                    <span className="font-bold text-[#0f172a] dark:text-white block">{tier.label}</span>
                    <span className="text-[#64748b] text-[11px]">{tier.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setRoleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={submitting} onClick={handleUpdateRole}>
                Save Role Assignment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
