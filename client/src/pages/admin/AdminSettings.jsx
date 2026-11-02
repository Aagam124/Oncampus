import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  Bell,
  Database,
  CheckCircle2,
  Save,
} from 'lucide-react';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminSettings() {
  const [requireVerification, setRequireVerification] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [disputeAutoNotify, setDisputeAutoNotify] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Platform configuration saved successfully', 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Security & Policy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
          Admin Settings & Platform Policies
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Adjust moderation thresholds, session authentication limits, and marketplace enforcement.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Verification Policy Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
            <Shield className="w-4 h-4 text-[#0071e3]" />
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
              Student Verification Enforcement
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] cursor-pointer">
              <div>
                <span className="font-bold text-[#0f172a] dark:text-white block">
                  Mandatory ID Verification for Offering Paid Services
                </span>
                <span className="text-[#64748b]">
                  When active, student accounts must have verified status before publishing marketplace services.
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireVerification}
                onChange={(e) => setRequireVerification(e.target.checked)}
                className="w-4 h-4 text-[#0071e3] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.04] cursor-pointer">
              <div>
                <span className="font-bold text-[#0f172a] dark:text-white block">
                  Automated Dispute Adjudication Alerts
                </span>
                <span className="text-[#64748b]">
                  Notify both buyer and seller in real-time when an administrator issues a binding ruling.
                </span>
              </div>
              <input
                type="checkbox"
                checked={disputeAutoNotify}
                onChange={(e) => setDisputeAutoNotify(e.target.checked)}
                className="w-4 h-4 text-[#0071e3] rounded"
              />
            </label>
          </div>
        </div>

        {/* Authentication Security Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
              Session & Token Lifetimes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Access Token Expiration (Minutes):
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                min="5"
                max="60"
                className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Refresh Token Persistence:
              </label>
              <input
                type="text"
                value="7 Days (Configured via JWT_REFRESH_EXPIRES_IN)"
                disabled
                className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] opacity-60"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" size="md" type="submit" icon={Save} loading={saving}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
