import React, { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  Server,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { addToast } = useToast();

  const fetchHealth = async () => {
    try {
      setRefreshing(true);
      const res = await api.get('/admin/health');
      setHealth(res.data?.data || {});
    } catch (err) {
      console.error('Failed to load platform health:', err);
      addToast('Health check failed', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Pinging backend infrastructure and MongoDB cluster..." />
      </div>
    );
  }

  const formatUptime = (sec) => {
    if (!sec) return '0m';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Infrastructure Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Platform Health Monitor
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Real-time backend process state, MongoDB cluster roundtrip latency, and runtime diagnostics.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          loading={refreshing}
          onClick={fetchHealth}
        >
          Re-test Health
        </Button>
      </div>

      {/* Core Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* API Server Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                <CheckCircle2 className="w-3 h-3" /> Operational
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
              Node Express API
            </h3>
            <div className="mt-3 space-y-1.5 text-xs text-[#64748b] dark:text-[#94a3b8]">
              <div className="flex justify-between">
                <span>Node Runtime:</span>
                <strong className="text-[#0f172a] dark:text-white">{health?.api?.nodeVersion}</strong>
              </div>
              <div className="flex justify-between">
                <span>Host Platform:</span>
                <strong className="text-[#0f172a] dark:text-white capitalize">{health?.api?.platform}</strong>
              </div>
              <div className="flex justify-between">
                <span>Process Uptime:</span>
                <strong className="text-[#0f172a] dark:text-white">{formatUptime(health?.api?.uptime)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Database Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                <CheckCircle2 className="w-3 h-3" /> {health?.database?.status || 'Healthy'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
              MongoDB Atlas Replica Set
            </h3>
            <div className="mt-3 space-y-1.5 text-xs text-[#64748b] dark:text-[#94a3b8]">
              <div className="flex justify-between">
                <span>Connection:</span>
                <strong className="text-[#0f172a] dark:text-white">{health?.database?.connectionState}</strong>
              </div>
              <div className="flex justify-between">
                <span>Ping Latency:</span>
                <strong className="text-[#0071e3] font-mono">{health?.database?.latencyMs} ms</strong>
              </div>
              <div className="flex justify-between">
                <span>Cluster Node:</span>
                <strong className="text-[#0f172a] dark:text-white truncate max-w-[150px]">{health?.database?.host}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Memory Diagnostics Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0071e3]/10 text-[#0071e3]">
                Normal Load
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
              Process Memory Allocation
            </h3>
            <div className="mt-3 space-y-1.5 text-xs text-[#64748b] dark:text-[#94a3b8]">
              <div className="flex justify-between">
                <span>Resident Set Size (RSS):</span>
                <strong className="text-[#0f172a] dark:text-white font-mono">{health?.memory?.rssMb} MB</strong>
              </div>
              <div className="flex justify-between">
                <span>Heap Total:</span>
                <strong className="text-[#0f172a] dark:text-white font-mono">{health?.memory?.heapTotalMb} MB</strong>
              </div>
              <div className="flex justify-between">
                <span>Heap In Use:</span>
                <strong className="text-[#0071e3] font-mono">{health?.memory?.heapUsedMb} MB</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latency Gauge / Diagnostic Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#0f172a] dark:text-white">
            Live Database Roundtrip Response Time
          </span>
          <span className="text-xs font-mono font-bold text-[#0071e3]">
            {health?.database?.latencyMs} ms
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#f1f5f9] dark:bg-[#0e131f] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#34c759] to-[#0071e3] transition-all duration-300"
            style={{ width: `${Math.min((health?.database?.latencyMs || 50) / 2, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-[#94a3b8] flex items-center justify-between">
          <span>0 ms (Ideal)</span>
          <span>Last Verified: {new Date(health?.database?.lastCheck).toLocaleTimeString()}</span>
          <span>200 ms (Threshold)</span>
        </div>
      </div>
    </div>
  );
}
