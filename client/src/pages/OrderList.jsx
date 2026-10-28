import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';

const STATUS_TABS = [
  { id: '', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function OrderList() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'client', 'provider'
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/orders?${params.toString()}`);
      const list = res.data?.data?.orders || res.data?.orders || [];
      setOrders(list);
    } catch (err) {
      console.error('Failed to load orders', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Filter by client vs provider locally
  const filteredOrders = orders.filter((order) => {
    if (roleFilter === 'client') {
      return (order.client?._id || order.client) === user?._id;
    }
    if (roleFilter === 'provider') {
      return (order.provider?._id || order.provider) === user?._id;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="brand">In Progress</Badge>;
      case 'delivered':
        return <Badge variant="warning">Delivered</Badge>;
      case 'accepted':
        return <Badge variant="info">Accepted</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Order Management</h1>
            <p className="text-sm text-surface-600 mt-1">
              Track project milestones, deliveries, order chats, and client approvals.
            </p>
          </div>

          {/* Role Filter Pills */}
          <div className="flex p-1 bg-surface-200/70 rounded-xl max-w-fit">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'client', label: 'As Client (Purchased)' },
              { id: 'provider', label: 'As Provider (Delivering)' },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setRoleFilter(role.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleFilter === role.id
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs Bar */}
        <div className="flex overflow-x-auto gap-2 border-b border-surface-200 pb-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List Content */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner message="Loading orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
            <EmptyState
              title="No orders found"
              description="You have no orders matching the selected status or role filters."
              actionText="Browse Marketplace"
              onAction={() => (window.location.href = '/services')}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isClient = (order.client?._id || order.client) === user?._id;
              const otherParty = isClient ? order.provider : order.client;
              const otherName = otherParty?.firstName
                ? `${otherParty.firstName} ${otherParty.lastName || ''}`
                : 'Campus User';

              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="block bg-white rounded-2xl border border-surface-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Service Info & Counterparty */}
                    <div className="flex items-start gap-4">
                      {order.service?.images && order.service.images.length > 0 ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                          <img
                            src={order.service.images[0]}
                            alt={order.service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                          <Package className="w-7 h-7" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
                            {isClient ? 'Buying from' : 'Delivering to'}
                          </span>
                          <span className="text-xs text-surface-400">•</span>
                          <span className="text-xs font-medium text-surface-600">{otherName}</span>
                        </div>

                        <h3 className="font-bold text-surface-900 text-base sm:text-lg line-clamp-1">
                          {order.service?.title || 'Custom Service Order'}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-surface-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          {order.deliveryDate && (
                            <span>
                              Due: {new Date(order.deliveryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Price, Status & CTA */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-surface-100 gap-2">
                      <div className="text-left sm:text-right">
                        <span className="text-xl font-extrabold text-surface-900 block">
                          ₹{(order.amount || 0).toLocaleString()}
                        </span>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform mt-2">
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
