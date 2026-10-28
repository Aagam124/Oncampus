import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Ban,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

export default function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=20`);
      const payload = res.data?.data?.users || [];
      const pInfo = res.data?.data?.pagination || { page: 1, limit: 20, total: payload.length, pages: 1 };
      setUsers(payload);
      setPagination(pInfo);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleUserAction = async (userId, action) => {
    try {
      await api.put(`/admin/users/${userId}`, { action });
      addToast(`User ${action === 'verify' ? 'verified' : action === 'ban' ? 'suspended' : 'reactivated'} successfully`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || `Failed to perform ${action}`, 'error');
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
              <span>Users</span>
            </div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              Student Directory & Moderation
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Inspect student accounts, grant verified campus status, or suspend policy offenders.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-surface-300 w-64 bg-white outline-none focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner message="Fetching user directory..." />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-12">No users matched your query.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200 text-surface-500 uppercase font-semibold tracking-wider">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">University</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {users.map((u) => {
                    const fullName = `${u.firstName} ${u.lastName || ''}`;

                    return (
                      <tr key={u._id} className="hover:bg-surface-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={u.avatar} name={fullName} size="sm" />
                            <div>
                              <Link
                                to={`/users/${u._id}`}
                                className="font-bold text-surface-900 hover:text-brand-600 flex items-center gap-1"
                              >
                                <span>{fullName}</span>
                                <ExternalLink className="w-3 h-3 text-surface-400" />
                              </Link>
                              <span className="text-[11px] text-surface-500">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-surface-600 font-medium">
                          {u.university || 'Not specified'}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-semibold uppercase text-[10px] ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-surface-100 text-surface-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {u.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="text-surface-400">Unverified</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant={u.isActive ? 'success' : 'danger'}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-surface-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {!u.isVerified && (
                            <button
                              onClick={() => handleUserAction(u._id, 'verify')}
                              className="px-2.5 py-1 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg font-semibold transition-colors"
                              title="Verify Student"
                            >
                              Verify
                            </button>
                          )}

                          {u.isActive ? (
                            <button
                              onClick={() => handleUserAction(u._id, 'ban')}
                              className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-colors"
                              title="Suspend"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(u._id, 'unban')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold transition-colors"
                              title="Reactivate"
                            >
                              Reactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
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
    </div>
  );
}
