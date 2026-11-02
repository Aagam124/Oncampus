import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Layers,
  ShoppingBag,
  Calendar,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AreaTrendChart, BarChart, DonutChart, SkillsRankings } from '@/components/admin/AdminCharts';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/analytics?timeframe=${timeframe}`);
        setAnalytics(res.data?.data || {});
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Calculating aggregation pipelines..." />
      </div>
    );
  }

  // Order status segments
  const orderSegments = (analytics?.orderStatusDistribution || []).map((s) => {
    let color = '#94a3b8';
    if (s._id === 'completed') color = '#34c759';
    else if (s._id === 'in-progress' || s._id === 'accepted') color = '#0071e3';
    else if (s._id === 'pending') color = '#f59e0b';
    else if (s._id === 'disputed') color = '#ef4444';
    else if (s._id === 'cancelled') color = '#64748b';
    return { ...s, color, label: s._id };
  });

  const totalRegs = (analytics?.registrations || []).reduce((acc, r) => acc + (r.count || 0), 0);
  const totalRev = (analytics?.revenueTrends || []).reduce((acc, r) => acc + (r.amount || 0), 0);
  const totalProjects = (analytics?.projectTrends || []).reduce((acc, r) => acc + (r.count || 0), 0);
  const totalServices = (analytics?.serviceTrends || []).reduce((acc, r) => acc + (r.count || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Platform Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Analytics & Aggregation Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Deep performance insights derived from real MongoDB time-series queries.
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

      {/* Summary Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card">
          <div className="text-xs font-bold text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-[#0071e3]" />
            New Students ({timeframe})
          </div>
          <div className="text-2xl font-black text-[#0f172a] dark:text-white">{totalRegs}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card">
          <div className="text-xs font-bold text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            Completed Volume ({timeframe})
          </div>
          <div className="text-2xl font-black text-[#0f172a] dark:text-white">₹{totalRev.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card">
          <div className="text-xs font-bold text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
            Projects Created ({timeframe})
          </div>
          <div className="text-2xl font-black text-[#0f172a] dark:text-white">{totalProjects}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card">
          <div className="text-xs font-bold text-[#64748b] dark:text-[#94a3b8] flex items-center gap-1.5 mb-1">
            <Briefcase className="w-3.5 h-3.5 text-[#8b5cf6]" />
            Services Offered ({timeframe})
          </div>
          <div className="text-2xl font-black text-[#0f172a] dark:text-white">{totalServices}</div>
        </div>
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Registrations Trend */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
            Student Registration Trajectory
          </h3>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
            Daily user onboarding curve over {timeframe}
          </p>
          <AreaTrendChart data={analytics?.registrations || []} color="#0071e3" label="Students" />
        </div>

        {/* Contract Volume Trend */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
            Contracted Revenue Stream (₹)
          </h3>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
            Completed order values over {timeframe}
          </p>
          <AreaTrendChart data={analytics?.revenueTrends || []} color="#10b981" label="₹" valuePrefix="₹" />
        </div>
      </div>

      {/* Secondary Charts: Marketplace & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Creations */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
            Project Creation Volume
          </h3>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-2">
            Campus collaborations posted
          </p>
          <BarChart data={analytics?.projectTrends || []} color="#38bdf8" />
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
              Order Status Breakdown
            </h3>
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
              All-time contract completion state
            </p>
          </div>
          <DonutChart segments={orderSegments} size={150} />
          <div className="mt-4 text-center text-xs text-[#64748b]">
            Total orders across platform: {orderSegments.reduce((a, b) => a + (b.count || 0), 0)}
          </div>
        </div>

        {/* Top Skills */}
        <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] p-5 sm:p-6 shadow-apple-card">
          <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1">
            Marketplace Talent Supply
          </h3>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-4">
            Most frequent student skills
          </p>
          <SkillsRankings skills={analytics?.popularSkills || []} />
        </div>
      </div>
    </div>
  );
}
