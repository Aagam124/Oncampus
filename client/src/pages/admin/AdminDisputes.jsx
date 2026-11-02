import React, { useState, useEffect } from 'react';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adjudication modal
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adjudicateOpen, setAdjudicateOpen] = useState(false);
  const [resolution, setResolution] = useState('buyer'); // 'buyer', 'seller', 'closed'
  const [resolutionNote, setResolutionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders?status=disputed');
      setDisputes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load disputes:', err);
      addToast('Failed to load active disputes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const openAdjudicate = (order) => {
    setSelectedDispute(order);
    setResolution('buyer');
    setResolutionNote('');
    setAdjudicateOpen(true);
  };

  const handleExecuteResolution = async () => {
    if (!selectedDispute) return;
    try {
      setSubmitting(true);
      await api.put(`/admin/orders/${selectedDispute._id}/resolve-dispute`, {
        resolution,
        resolutionNote,
      });

      addToast(`Dispute resolved in favor of ${resolution}`, 'success');
      setAdjudicateOpen(false);
      fetchDisputes();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to resolve dispute', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Dispute Resolution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Order Adjudication Center
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Examine contested contracts, evaluate student work evidence, and arbitrate binding decisions.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] text-orange-500 shadow-xs">
          {disputes.length} Active Disputes
        </div>
      </div>

      {/* Disputes Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Checking disputed orders..." />
          </div>
        ) : disputes.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            <CheckCircle2 className="w-8 h-8 text-[#34c759] mx-auto mb-2 opacity-80" />
            No open order disputes on the platform. All student transactions are nominal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Client (Buyer)</th>
                  <th className="py-3.5 px-4">Provider (Seller)</th>
                  <th className="py-3.5 px-4">Escrow Amount</th>
                  <th className="py-3.5 px-4">Dispute Reason</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {disputes.map((d) => (
                  <tr key={d._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0071e3]">
                      #{String(d._id).slice(-6).toUpperCase()}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0f172a] dark:text-white max-w-[180px] truncate">
                      {d.service?.title || 'Contracted Service'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0f172a] dark:text-white">
                        {d.client?.firstName} {d.client?.lastName}
                      </div>
                      <div className="text-[10px] text-[#64748b]">{d.client?.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0f172a] dark:text-white">
                        {d.provider?.firstName} {d.provider?.lastName}
                      </div>
                      <div className="text-[10px] text-[#64748b]">{d.provider?.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-[#0f172a] dark:text-white">
                      ₹{d.amount?.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-[#ef4444] font-medium max-w-xs truncate">
                      {d.disputeDetails?.reason || 'Deliverable non-compliance / refund dispute'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="primary"
                        size="xs"
                        icon={Scale}
                        onClick={() => openAdjudicate(d)}
                      >
                        Adjudicate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjudication Modal */}
      {adjudicateOpen && selectedDispute && (
        <Modal
          isOpen={adjudicateOpen}
          onClose={() => setAdjudicateOpen(false)}
          title={`Adjudicate Dispute: Order #${String(selectedDispute._id).slice(-6).toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
              <span className="font-bold block mb-0.5">Escrowed Contract Value: ₹{selectedDispute.amount?.toLocaleString()}</span>
              <span>Arbitration decisions immediately update contract state and notify both students.</span>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-[#0f172a] dark:text-white">
                Select Resolution Verdict:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'buyer', label: 'Favor Buyer (Cancel Order)' },
                  { id: 'seller', label: 'Favor Seller (Complete Order)' },
                  { id: 'closed', label: 'Dismiss Dispute' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setResolution(opt.id)}
                    className={`
                      p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all
                      ${
                        resolution === opt.id
                          ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-xs'
                          : 'bg-[#f8fafc] dark:bg-[#0e131f] border-black/[0.06] dark:border-white/[0.08] text-[#64748b] hover:text-[#0f172a] dark:hover:text-white'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Official Arbitration Justification / Reasoning:
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Explain the administrative reasoning based on contract deliverables and conversation evidence..."
                rows={4}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setAdjudicateOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={submitting}
                onClick={handleExecuteResolution}
              >
                Issue Binding Ruling
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
