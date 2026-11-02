import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Briefcase,
  Layers,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Scale,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  UserX,
  FileCheck2,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AreaTrendChart, DonutChart, SkillsRankings } from '@/components/admin/AdminCharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [attention, setAttention] = useState(null);
  const [activity, setActivity] = useState([]);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, analyticsRes, attentionRes, activityRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get(`/admin/analytics?timeframe=${timeframe}`),
          api.get('/admin/attention'),
          api.get('/admin/activity?limit=10'),
        ]);

        setStats(statsRes.data?.data || {});
        setAnalytics(analyticsRes.data?.data || {});
        setAttention(attentionRes.data?.data || {});
        setActivity(activityRes.data?.data?.activities || []);
      } catch (err) {
        console.error('Failed to load admin overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Assembling Command Center metrics..." />
      </div>
    );
  }

  // Real DB KPI card configurations
  const kpiCards = [
    {
      label: 'Total Students',
      value: stats?.totalUsers || 0,
      sub: `${stats?.activeUsers || 0} active now`,
      icon: Users,
      color: 'text-[#0071e3] bg-[#0071e3]/10 dark:bg-[#0071e3]/20',
      link: '/admin/users',
    },
    {
      label: 'Pending Verification',
      value: stats?.pendingVerifications || 0,
      sub: 'Action required',
      icon: ShieldAlert,
      color: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
      link: '/admin/verification',
      urgent: stats?.pendingVerifications > 0,
    },
    {
      label: 'Active Services',
      value: stats?.activeServices || 0,
      sub: 'Marketplace published',
      icon: Briefcase,
      color: 'text-[#8b5cf6] bg-[#8b5cf6]/10 dark:bg-[#8b5cf6]/20',
      link: '/admin/services',
    },
    {
      label: 'Active Projects',
      value: stats?.totalProjects || 0,
      sub: 'Open collaborations',
      icon: Layers,
      color: 'text-[#38bdf8] bg-[#38bdf8]/10 dark:bg-[#38bdf8]/20',
      link: '/admin/projects',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      sub: `${stats?.completedOrders || 0} completed`,
      icon: ShoppingBag,
      color: 'text-[#34c759] bg-[#34c759]/10 dark:bg-[#34c759]/20',
      link: '/admin/orders',
    },
    {
      label: 'Gross Volume',
      value: `₹${(stats?.grossVolume || 0).toLocaleString()}`,
      sub: 'Total contracted revenue',
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
      link: '/admin/orders',
    },
    {
      label: 'Open Disputes',
      value: stats?.openDisputes || 0,
      sub: 'Requires adjudication',
      icon: Scale,
      color: 'text-orange-500 bg-orange-500/10 dark:bg-orange-500/20',
      link: '/admin/disputes',
      urgent: stats?.openDisputes > 0,
    },
    {
      label: 'Unresolved Reports',
      value: stats?.unresolvedReports || 0,
      sub: 'Moderation queue',
      icon: AlertTriangle,
      color: 'text-[#ef4444] bg-[#ef4444]/10 dark:bg-[#ef4444]/20',
      link: '/admin/reports',
      urgent: stats?.unresolvedReports > 0,
    },
  ];

  // Map order statuses for donut chart
  const orderSegments = (analytics?.orderStatusDistribution || []).map((s) => {
    let color = '#94a3b8';
    if (s._id === 'completed') color = '#34c759';
    else if (s._id === 'in-progress' || s._id === 'accepted') color = '#0071e3';
    else if (s._id === 'pending') color = '#f59e0b';
    else if (s._id === 'disputed') color = '#ef4444';
    else if (s._id === 'cancelled') color = '#64748b';
    return { ...s, color, label: s._id };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Platform Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Real-time student integrity, marketplace transactions, moderation queues, and portal control.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-xs text-xs font-semibold">
          {[
            { label: '7 Days', val: '7d' },
            { label: '30 Days', val: '30d' },
            { label: '90 Days', val: '90d' },
            { label: '12 Months', val: '12m' },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => setTimeframe(t.val)}
              className={`
                px-3 py-1 rounded-lg transition-all
                ${
                  timeframe === t.val
                    ? 'bg-[#0071e3] text-white shadow-xs'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* A. KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link
              key={idx}
              to={c.link}
              className={`
                relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161f30]
                border transition-all duration-200 group flex flex-col justify-between
                ${
                  c.urgent
                    ? 'border-amber-400/40 dark:border-amber-500/40 shadow-xs'
                    : 'border-black/[0.06] dark:border-white/[0.08] shadow-apple-card hover:shadow-apple-card-hover hover:-translate-y-0.5'
                }
              `}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#0071e3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#0f172a] dark:text-white tracking-tight leading-none mb-1">
                  {c.value}
                </div>
                <div className="text-xs font-bold text-[#475569] dark:text-[#cbd5e1] truncate">
                  {c.label}
                </div>
              </div>
              <div className="mt-2 text-[11px] text-[#64748b] dark:text-[#94a3b8] truncate font-medium">
                {c.sub}
              </div>
            </Link>
          );
        })}
      </div>

      {/* B. Needs Attention Banner & Workflows */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base font-extrabold text-[#0f172a] dark:text-white tracking-tight">
              Action Required & Moderation Queues
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8]">
            Direct Adjudication Links
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Verifications */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-amber-500" />
                  Student Verifications
                </span>
                <span className="text-xs font-black text-amber-500">
                  {attention?.pendingVerifications?.length || 0} Pending
                </span>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8] line-clamp-2">
                Review submitted university IDs and institutional email confirmations.
              </p>
            </div>
            <Link
              to="/admin/verification"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0071e3] hover:underline"
            >
              Open Verification Queue <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Unresolved Reports */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                  Content Reports
                </span>
                <span className="text-xs font-black text-[#ef4444]">
                  {attention?.unresolvedReports?.length || 0} Open
                </span>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8] line-clamp-2">
                Investigate flagged services, harassment claims, or inappropriate portfolio uploads.
              </p>
            </div>
            <Link
              to="/admin/reports"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0071e3] hover:underline"
            >
              Open Moderation Center <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Open Disputes */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-orange-500" />
                  Order Disputes
                </span>
                <span className="text-xs font-black text-orange-500">
                  {attention?.openDisputes?.length || 0} Active
                </span>
              </div>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8] line-clamp-2">
                Adjudicate contested milestones, deliverable inspections, or cancellation requests.
              </p>
            </div>
            <Link
              to="/admin/disputes"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0071e3] hover:underline"
            >
              Resolve Open Disputes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* C. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration & Student Growth */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
                Student Registrations Trend
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                New campus signups over {timeframe}
              </p>
            </div>
            <Link to="/admin/analytics" className="text-xs font-bold text-[#0071e3] flex items-center gap-1">
              Deep Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <AreaTrendChart
            data={analytics?.registrations || []}
            color="#0071e3"
            label="Students"
          />
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
              Order Fulfillment Ratio
            </h3>
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
              Real-time contract lifecycle distribution
            </p>
          </div>
          <DonutChart segments={orderSegments} size={150} />
          <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] text-center">
            <Link to="/admin/orders" className="text-xs font-bold text-[#0071e3] hover:underline">
              Inspect All Orders & Contracts
            </Link>
          </div>
        </div>
      </div>

      {/* D. Popular Student Skills & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Popular Skills */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
            Top Campus Talent Skills
          </h3>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
            Most frequent student capabilities listed
          </p>
          <SkillsRankings skills={analytics?.popularSkills || []} />
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
                Live Administrative Activity
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Latest database records, registrations, and enforcement actions
              </p>
            </div>
            <Link to="/admin/audit-logs" className="text-xs font-bold text-[#0071e3] flex items-center gap-1">
              Full Audit Trail <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {activity.length === 0 ? (
              <div className="text-xs text-[#94a3b8] py-8 text-center">
                No recent activity logged
              </div>
            ) : (
              activity.slice(0, 7).map((act, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                    <div>
                      <span className="font-bold text-[#0f172a] dark:text-white">
                        {act.title}
                      </span>
                      {act.meta?.reason && (
                        <span className="text-[#64748b] dark:text-[#94a3b8] ml-2 italic">
                          ({act.meta.reason})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#94a3b8] whitespace-nowrap">
                    {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
