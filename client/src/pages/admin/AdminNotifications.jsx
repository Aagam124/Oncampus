import React, { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import api from '@/lib/axios';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminNotifications() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [type, setType] = useState('system');
  const [sending, setSending] = useState(false);

  const { addToast } = useToast();

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return addToast('Notification title and message are required', 'error');
    }

    try {
      setSending(true);
      const res = await api.post('/admin/broadcast-notification', {
        title,
        content,
        targetGroup,
        type,
      });

      addToast(res.data?.data?.message || 'Notification broadcasted successfully', 'success');
      setTitle('');
      setContent('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to broadcast notification', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
          <Bell className="w-4 h-4" />
          <span>Direct Student Outreach</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
          Broadcast Notifications
        </h1>
        <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Deliver instant push notifications directly into student notification center inboxes.
        </p>
      </div>

      {/* Broadcast Form Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card">
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#0f172a] dark:text-white mb-1.5">
              Notification Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Action Required: Update Your Campus Profile..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1.5">
                Target Recipient Group:
              </label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold focus:outline-none"
              >
                <option value="all">All Active Campus Members</option>
                <option value="students">Student Users Only</option>
                <option value="verified">Verified Students Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1.5">
                Notification Category Type:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold focus:outline-none"
              >
                <option value="system">System Notification</option>
                <option value="verification">Verification Alert</option>
                <option value="order">Order / Milestone Alert</option>
                <option value="project">Project Notification</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0f172a] dark:text-white mb-1.5">
              Message Content:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the message that will appear in student notification trays..."
              rows={4}
              className="w-full p-3 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#64748b]">
              Recipients will receive this alert upon next login or page refresh.
            </span>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={Send}
              loading={sending}
            >
              Broadcast Notification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
