import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import api from '@/lib/axios';
import Avatar from '@/components/Avatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminVerification() {
  const [verifications, setVerifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'verified', 'rejected'
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Decision Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState('approve'); // 'approve', 'reject', 'request_info'
  const [decisionReason, setDecisionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/verifications?status=${statusFilter}&page=${pagination.page}&limit=${pagination.limit}`);
      setVerifications(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination((prev) => ({ ...prev, ...res.data.pagination }));
      }
    } catch (err) {
      console.error('Failed to load verifications:', err);
      addToast('Failed to load verification queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter, pagination.page]);

  const openDecision = (student, type) => {
    setSelectedStudent(student);
    setDecisionType(type);
    setDecisionReason('');
    setDecisionModalOpen(true);
  };

  const handleExecuteDecision = async () => {
    if (!selectedStudent) return;
    try {
      setSubmitting(true);
      await api.put(`/admin/users/${selectedStudent._id}/verify`, {
        decision: decisionType,
        reason: decisionReason,
      });

      addToast(`Verification decision recorded: ${decisionType}`, 'success');
      setDecisionModalOpen(false);
      fetchVerifications();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit verification decision', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Identity Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Student Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Review institutional documents, verify enrollment, and award verified badges.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-xs text-xs font-semibold">
          {[
            { label: 'Pending Queue', val: 'pending' },
            { label: 'Verified Students', val: 'verified' },
            { label: 'Rejected Applications', val: 'rejected' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => {
                setStatusFilter(tab.val);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`
                px-3 py-1.5 rounded-lg transition-all
                ${
                  statusFilter === tab.val
                    ? 'bg-[#0071e3] text-white shadow-xs'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Loading verification records..." />
          </div>
        ) : verifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            No verification records found in the "{statusFilter}" queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">University & Email</th>
                  <th className="py-3.5 px-4">Verification Proof</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {verifications.map((s) => {
                  const details = s.verificationDetails || {};
                  return (
                    <tr key={s._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.avatar} name={`${s.firstName} ${s.lastName}`} size="sm" />
                          <div>
                            <span className="font-bold text-[#0f172a] dark:text-white">
                              {s.firstName} {s.lastName}
                            </span>
                            <div className="text-[11px] text-[#64748b]">{s.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0f172a] dark:text-white">{s.university || 'Unspecified'}</div>
                        <div className="text-[11px] text-[#0071e3] font-medium">
                          {details.universityEmail || s.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#64748b]" />
                          <span className="font-medium text-[#0f172a] dark:text-white">
                            {details.documentType || 'Institutional ID'}
                          </span>
                          {details.documentUrl && (
                            <a
                              href={details.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0071e3] hover:underline flex items-center gap-0.5 text-[11px]"
                            >
                              <span>Doc</span> <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#64748b] dark:text-[#94a3b8] whitespace-nowrap">
                        {details.submittedAt
                          ? new Date(details.submittedAt).toLocaleDateString()
                          : new Date(s.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {s.isVerified || s.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34c759]/10 text-[#34c759]">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : s.verificationStatus === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444]">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">
                            <Clock className="w-3 h-3" /> Under Review
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.verificationStatus !== 'verified' && (
                            <Button
                              variant="primary"
                              size="xs"
                              onClick={() => openDecision(s, 'approve')}
                            >
                              Approve
                            </Button>
                          )}
                          {s.verificationStatus === 'pending' && (
                            <>
                              <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => openDecision(s, 'request_info')}
                              >
                                Need Info
                              </Button>
                              <Button
                                variant="danger"
                                size="xs"
                                onClick={() => openDecision(s, 'reject')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Decision Modal */}
      {decisionModalOpen && selectedStudent && (
        <Modal
          isOpen={decisionModalOpen}
          onClose={() => setDecisionModalOpen(false)}
          title={`Verification Decision: ${decisionType.toUpperCase()}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
              Recording official verification decision for{' '}
              <strong className="text-[#0f172a] dark:text-white">
                {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.university})
              </strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] dark:text-white mb-1">
                Reason / Student Notification Note:
              </label>
              <textarea
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder={
                  decisionType === 'approve'
                    ? 'Optional approval note...'
                    : 'Specify document deficiency or required additional evidence...'
                }
                rows={3}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDecisionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={decisionType === 'approve' ? 'primary' : decisionType === 'reject' ? 'danger' : 'secondary'}
                size="sm"
                loading={submitting}
                onClick={handleExecuteDecision}
              >
                Record {decisionType.replace('_', ' ').toUpperCase()}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
