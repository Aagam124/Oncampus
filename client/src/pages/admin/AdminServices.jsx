import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Filter,
  Eye,
  AlertCircle,
} from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/useToast';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';

export default function AdminServices() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', '20');

      const res = await api.get(`/admin/services?${params.toString()}`);
      const payload = res.data?.data?.services || [];
      const pInfo = res.data?.data?.pagination || { page: 1, limit: 20, total: payload.length, pages: 1 };
      setServices(payload);
      setPagination(pInfo);
    } catch (err) {
      addToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter, page]);

  const handleUpdateStatus = async (serviceId, status) => {
    try {
      await api.put(`/admin/services/${serviceId}`, { status });
      addToast(`Service marked as "${status}"`, 'success');
      fetchServices();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update service status', 'error');
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
              <span>Services</span>
            </div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              Service Moderation & Approvals
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Review published peer listings to maintain high academic and quality standards.
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { val: '', label: 'All Listings' },
              { val: 'active', label: 'Active' },
              { val: 'under-review', label: 'Under Review' },
              { val: 'rejected', label: 'Rejected' },
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

        {/* Services Table */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner message="Loading services..." />
            </div>
          ) : services.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-12">No services found in this category.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200 text-surface-500 uppercase font-semibold tracking-wider">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Provider</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Pricing</th>
                    <th className="py-3.5 px-4">Orders</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {services.map((s) => {
                    const providerName = s.provider?.firstName
                      ? `${s.provider.firstName} ${s.provider.lastName || ''}`
                      : 'Unknown';

                    return (
                      <tr key={s._id} className="hover:bg-surface-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-surface-900 max-w-xs">
                          <Link
                            to={`/services/${s._id}`}
                            className="hover:text-brand-600 flex items-center gap-1.5 truncate"
                          >
                            <span className="truncate">{s.title}</span>
                            <ExternalLink className="w-3 h-3 text-surface-400 flex-shrink-0" />
                          </Link>
                        </td>

                        <td className="py-3 px-4 text-surface-600">
                          {providerName}
                        </td>

                        <td className="py-3 px-4 capitalize text-surface-600">
                          {s.category?.replace(/-/g, ' ')}
                        </td>

                        <td className="py-3 px-4 font-bold text-surface-800">
                          ₹{(s.pricing?.amount || 0).toLocaleString()}
                        </td>

                        <td className="py-3 px-4 text-surface-500">
                          {s.orderCount || 0}
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              s.status === 'active'
                                ? 'success'
                                : s.status === 'rejected'
                                ? 'danger'
                                : 'warning'
                            }
                          >
                            {s.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {s.status !== 'active' && (
                            <button
                              onClick={() => handleUpdateStatus(s._id, 'active')}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {s.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(s._id, 'rejected')}
                              className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
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
