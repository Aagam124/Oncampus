import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Inspector modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inspectOpen, setInspectOpen] = useState(false);

  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });
      if (status) params.append('status', status);

      const res = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, status]);

  const getStatusBadge = (st) => {
    switch (st) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">Completed</span>;
      case 'disputed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444]">Disputed</span>;
      case 'in-progress':
      case 'accepted':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0071e3]/10 text-[#0071e3]">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#64748b]/10 text-[#64748b]">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/[0.05] text-[#64748b] capitalize">{st}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#34c759] text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Campus Commerce</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Order Transactions & Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Track student client contracts, deliverable status, and transaction amounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-[#0f172a] dark:text-white focus:outline-none shadow-xs"
          >
            <option value="">All Order Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Loading orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No orders found matching status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Buyer (Client)</th>
                  <th className="py-3.5 px-4">Seller (Provider)</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">
                      #{String(o._id).slice(-6).toUpperCase()}
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-bold text-[#0f172a] dark:text-white truncate">
                        {o.service?.title || 'Contracted Service'}
                      </div>
                      <span className="text-[10px] text-[#64748b] capitalize">{o.service?.category}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0f172a] dark:text-white">
                        {o.client?.firstName} {o.client?.lastName}
                      </div>
                      <div className="text-[10px] text-[#64748b]">{o.client?.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0f172a] dark:text-white">
                        {o.provider?.firstName} {o.provider?.lastName}
                      </div>
                      <div className="text-[10px] text-[#64748b]">{o.provider?.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0f172a] dark:text-white">
                      ₹{o.amount?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(o.status)}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setInspectOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-black/[0.04]"
                        title="View Order Details"
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

      {/* Inspect Modal */}
      {inspectOpen && selectedOrder && (
        <Modal
          isOpen={inspectOpen}
          onClose={() => setInspectOpen(false)}
          title={`Order #${String(selectedOrder._id).slice(-6).toUpperCase()} Inspection`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
                  {selectedOrder.service?.title}
                </h3>
                <span className="text-[11px] text-[#64748b]">
                  Contract Amount: <strong className="text-emerald-500">₹{selectedOrder.amount?.toLocaleString()}</strong>
                </span>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04]">
                <span className="text-[10px] font-bold text-[#64748b] uppercase block mb-1">Client (Buyer)</span>
                <p className="font-bold text-[#0f172a] dark:text-white">
                  {selectedOrder.client?.firstName} {selectedOrder.client?.lastName}
                </p>
                <p className="text-[#64748b]">{selectedOrder.client?.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04]">
                <span className="text-[10px] font-bold text-[#64748b] uppercase block mb-1">Provider (Seller)</span>
                <p className="font-bold text-[#0f172a] dark:text-white">
                  {selectedOrder.provider?.firstName} {selectedOrder.provider?.lastName}
                </p>
                <p className="text-[#64748b]">{selectedOrder.provider?.email}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#0f172a] dark:text-white mb-1">Contract Requirements</h4>
              <p className="text-[#64748b] leading-relaxed whitespace-pre-wrap p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04]">
                {selectedOrder.requirements || 'No specific requirements documented.'}
              </p>
            </div>

            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <a
                href={`/orders/${selectedOrder._id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#0071e3] font-bold flex items-center gap-1 hover:underline"
              >
                Open Order Workspace <ExternalLink className="w-3.5 h-3.5" />
              </a>
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
