import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Shield,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data?.data || {});
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading platform metrics..." />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Student Users',
      value: stats?.totalUsers || 0,
      sub: `${stats?.recentSignups || 0} joined recently`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/users',
    },
    {
      label: 'Active Services',
      value: stats?.totalServices || 0,
      sub: 'Marketplace listings',
      icon: Briefcase,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/services',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      sub: 'Campus transactions',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/orders',
    },
    {
      label: 'Gross Volume',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      sub: 'Completed contracts',
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Pending Reports',
      value: stats?.totalReports || 0,
      sub: 'Requires moderation',
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
      link: '/admin/reports',
    },
  ];

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">
              OnCampus Control Center
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Platform overview, moderation queues, student integrity, and transactions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2 bg-white border border-surface-300 rounded-xl text-xs font-semibold text-surface-700 hover:bg-surface-50 shadow-xs transition-colors"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/services"
              className="px-4 py-2 bg-white border border-surface-300 rounded-xl text-xs font-semibold text-surface-700 hover:bg-surface-50 shadow-xs transition-colors"
            >
              Moderation Queue
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wide">
                      {c.label}
                    </span>
                    <div className={`p-2 rounded-xl ${c.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-surface-900 block mb-1">
                    {c.value}
                  </span>
                  <p className="text-xs text-surface-400">{c.sub}</p>
                </div>

                {c.link && (
                  <Link
                    to={c.link}
                    className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Middle Section: Orders by Status & Quick Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Lifecycle Breakdown */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600" />
              <span>Order Fulfillment Status</span>
            </h2>

            {stats?.ordersByStatus && stats.ordersByStatus.length > 0 ? (
              <div className="space-y-4">
                {stats.ordersByStatus.map((item) => {
                  const percent = stats.totalOrders
                    ? Math.round((item.count / stats.totalOrders) * 100)
                    : 0;

                  return (
                    <div key={item._id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-surface-700 capitalize">{item._id}</span>
                        <span className="text-surface-900">
                          {item.count} orders ({percent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-surface-500 py-4">No order lifecycle records yet.</p>
            )}
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-surface-900">Moderation Shortlinks</h2>
            <div className="space-y-3">
              <Link
                to="/admin/users"
                className="block p-4 rounded-xl border border-surface-200 hover:border-brand-500 hover:bg-surface-50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-surface-900">User Directory</span>
                  <ArrowRight className="w-4 h-4 text-surface-400" />
                </div>
                <p className="text-xs text-surface-500">
                  Verify student badges, toggle suspensions, or inspect accounts.
                </p>
              </Link>

              <Link
                to="/admin/services"
                className="block p-4 rounded-xl border border-surface-200 hover:border-brand-500 hover:bg-surface-50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-surface-900">Services Review</span>
                  <ArrowRight className="w-4 h-4 text-surface-400" />
                </div>
                <p className="text-xs text-surface-500">
                  Approve newly listed services or reject policy-violating offerings.
                </p>
              </Link>

              <Link
                to="/admin/reports"
                className="block p-4 rounded-xl border border-surface-200 hover:border-brand-500 hover:bg-surface-50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-surface-900">Reports Desk</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                    {stats?.totalReports || 0}
                  </span>
                </div>
                <p className="text-xs text-surface-500">
                  Investigate user flags, fraud reports, or inappropriate content.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
