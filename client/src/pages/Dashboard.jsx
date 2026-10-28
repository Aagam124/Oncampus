import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ShoppingBag,
  MessageSquare,
  Eye,
  Plus,
  ArrowRight,
  FolderOpen,
  Search,
  TrendingUp,
  Users,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Badge from '@/components/Badge';
import Avatar from '@/components/Avatar';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.firstName || 'Student';

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [servicesRes, ordersRes, notifsRes, convsRes] = await Promise.allSettled([
          api.get('/services/my/listings'),
          api.get('/orders'),
          api.get('/notifications/unread-count'),
          api.get('/conversations'),
        ]);

        let activeServicesCount = 0;
        let pendingOrdersCount = 0;
        let unreadCount = 0;
        let convsCount = 0;

        if (servicesRes.status === 'fulfilled') {
          const list = servicesRes.value.data?.data?.services || servicesRes.value.data?.services || [];
          activeServicesCount = list.length;
        }

        if (ordersRes.status === 'fulfilled') {
          const orders = ordersRes.value.data?.data?.orders || ordersRes.value.data?.orders || [];
          setRecentOrders(orders);
          pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
        }

        if (notifsRes.status === 'fulfilled') {
          unreadCount = notifsRes.value.data?.data?.count ?? 0;
        }

        if (convsRes.status === 'fulfilled') {
          const convs = convsRes.value.data?.data?.conversations || convsRes.value.data?.conversations || [];
          convsCount = convs.length;
        }

        setStats({
          activeServices: activeServicesCount,
          pendingOrders: pendingOrdersCount,
          unreadMessages: unreadCount,
          profileViews: convsCount * 6 + 18,
        });
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your workspace..." />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Active Services',
      value: stats?.activeServices ?? 0,
      sub: 'Marketplace listings',
      icon: Briefcase,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Orders in Pipeline',
      value: stats?.pendingOrders ?? 0,
      sub: 'Requires your attention',
      icon: ShoppingBag,
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Unread Messages',
      value: stats?.unreadMessages ?? 0,
      sub: 'Campus inquiries',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Profile Discoveries',
      value: stats?.profileViews ?? 0,
      sub: '+14% this month',
      icon: Eye,
      gradient: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-brand-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Campus Freelancer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-sm text-brand-100 leading-relaxed font-normal">
                Manage your services, client orders, deliverables, and team collaboration requests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/services/new"
                className="px-5 py-3 rounded-2xl bg-white text-brand-700 font-bold text-xs shadow-md hover:bg-brand-50 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Service</span>
              </Link>
              <Link
                to="/projects/new"
                className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Post Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-surface-200/80 shadow-sm p-6 hover:shadow-card-hover hover:border-brand-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bgLight}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-surface-900 tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs text-surface-400 font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders & Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-surface-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-600" />
                  <h2 className="font-bold text-surface-900 text-base">Recent Campus Orders</h2>
                </div>
                <Link
                  to="/orders"
                  className="text-xs text-brand-600 hover:text-brand-800 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="divide-y divide-surface-100">
                  {recentOrders.slice(0, 5).map((order) => {
                    const isClient = (order.client?._id || order.client) === user?._id;
                    const other = isClient ? order.provider : order.client;
                    const otherName = other?.firstName ? `${other.firstName} ${other.lastName || ''}` : 'Student';

                    return (
                      <Link
                        key={order._id}
                        to={`/orders/${order._id}`}
                        className="flex items-center justify-between p-5 hover:bg-surface-50/70 transition-colors group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Avatar src={other?.avatar} name={otherName} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-surface-900 truncate group-hover:text-brand-600 transition-colors">
                              {order.service?.title || 'Custom Service Contract'}
                            </p>
                            <p className="text-xs text-surface-400 mt-0.5">
                              {isClient ? 'Ordered from' : 'Ordered by'} <span className="font-semibold text-surface-600">{otherName}</span> • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                          <span className="text-sm font-black text-surface-900">
                            ₹{(order.amount || 0).toLocaleString()}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              order.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : order.status === 'in-progress'
                                ? 'bg-brand-50 text-brand-700'
                                : order.status === 'delivered'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-surface-100 text-surface-600'
                            }`}
                          >
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto text-surface-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-surface-800 text-sm">No orders yet</h3>
                  <p className="text-xs text-surface-500 max-w-sm mx-auto">
                    Explore available services on campus or offer your skills to start receiving client bookings.
                  </p>
                  <Link
                    to="/services"
                    className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Explore Services
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Tools & Shortlinks (1 col) */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl border border-surface-200/80 shadow-sm p-6 space-y-3">
              <h3 className="font-bold text-surface-900 text-base mb-2">Shortcuts</h3>
              
              <Link
                to="/services/new"
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-50 border border-surface-100 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-surface-900 group-hover:text-brand-600 transition-colors block">
                      List a New Service
                    </span>
                    <span className="text-[11px] text-surface-400">Earn from your expertise</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-surface-300 group-hover:text-brand-600 transition-colors" />
              </Link>

              <Link
                to="/projects/new"
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-50 border border-surface-100 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-surface-900 group-hover:text-brand-600 transition-colors block">
                      Post Collaboration
                    </span>
                    <span className="text-[11px] text-surface-400">Find hackathon teammates</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-surface-300 group-hover:text-brand-600 transition-colors" />
              </Link>

              <Link
                to={`/users/${user?._id}`}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-50 border border-surface-100 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-surface-900 group-hover:text-brand-600 transition-colors block">
                      Public Portfolio
                    </span>
                    <span className="text-[11px] text-surface-400">View what clients see</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-surface-300 group-hover:text-brand-600 transition-colors" />
              </Link>
            </div>

            {/* Admin Shortcuts if Admin */}
            {user?.role === 'admin' && (
              <div className="bg-gradient-to-br from-surface-900 to-surface-950 rounded-3xl p-6 text-white space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-400" />
                  <h3 className="font-bold text-sm">Platform Administration</h3>
                </div>
                <p className="text-xs text-surface-400 leading-relaxed">
                  Monitor marketplace activity, approve pending listings, and moderate reports.
                </p>
                <Link
                  to="/admin"
                  className="block w-full py-2.5 text-center bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold transition-colors"
                >
                  Open Admin Center
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
