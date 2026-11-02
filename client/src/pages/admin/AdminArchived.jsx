import React, { useState, useEffect } from 'react';
import {
  Archive,
  RotateCcw,
  Eye,
  Trash2,
  Briefcase,
  Layers,
  Megaphone,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminArchived() {
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore action
  const [selectedItem, setSelectedItem] = useState(null);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const { addToast } = useToast();

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/archived');
      setArchived(res.data?.data?.archivedContent || []);
    } catch (err) {
      console.error('Failed to load archived content:', err);
      addToast('Failed to load archived items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const handleRestore = async () => {
    if (!selectedItem) return;
    try {
      setRestoring(true);
      if (selectedItem.entityType === 'Service') {
        await api.put(`/admin/services/${selectedItem._id}/portal-status`, { action: 'restore' });
      } else if (selectedItem.entityType === 'Project') {
        await api.put(`/admin/projects/${selectedItem._id}/portal-status`, { action: 'restore' });
      }

      addToast(`Restored "${selectedItem.title}" to portal catalog`, 'success');
      setRestoreModalOpen(false);
      fetchArchived();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to restore item', 'error');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Archive className="w-4 h-4" />
            <span>Vault & Deprecated Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Archived Portal Content
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Review archived student offerings, projects, and announcements. Restoring reinstates active publication status.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
          {archived.length} Archived Items
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner message="Scanning archive vault..." />
          </div>
        ) : archived.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#94a3b8]">
            <CheckCircle2 className="w-8 h-8 text-[#34c759] mx-auto mb-2 opacity-80" />
            Archive vault is empty. No archived records on file.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] dark:bg-[#0e131f] border-b border-black/[0.05] dark:border-white/[0.06] text-[#64748b] dark:text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Entity Type</th>
                  <th className="py-3.5 px-4">Content Title</th>
                  <th className="py-3.5 px-4">Original Owner</th>
                  <th className="py-3.5 px-4">Archive Reason</th>
                  <th className="py-3.5 px-4">Archived On</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                {archived.map((item) => (
                  <tr key={item._id} className="hover:bg-[#f8fafc]/60 dark:hover:bg-[#141b2b] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500">
                        {item.entityType === 'Service' && <Briefcase className="w-3 h-3" />}
                        {item.entityType === 'Project' && <Layers className="w-3 h-3" />}
                        {item.entityType === 'Announcement' && <Megaphone className="w-3 h-3" />}
                        {item.entityType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#0f172a] dark:text-white max-w-xs truncate">
                      {item.title}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#0f172a] dark:text-white">
                        {item.owner ? `${item.owner.firstName} ${item.owner.lastName}` : 'Platform'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#64748b] max-w-xs truncate">
                      {item.archiveReason || 'Administrative archival'}
                    </td>

                    <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                      {new Date(item.archivedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="primary"
                        size="xs"
                        icon={RotateCcw}
                        onClick={() => {
                          setSelectedItem(item);
                          setRestoreModalOpen(true);
                        }}
                      >
                        Restore
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restore Confirmation Modal */}
      {restoreModalOpen && selectedItem && (
        <Modal
          isOpen={restoreModalOpen}
          onClose={() => setRestoreModalOpen(false)}
          title={`Restore Content: ${selectedItem.title}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-[#64748b] dark:text-[#94a3b8]">
              Are you sure you want to restore <strong>"{selectedItem.title}"</strong> ({selectedItem.entityType})?
              This will return the item to active publication on the student portal and allow public discovery.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setRestoreModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={restoring}
                onClick={handleRestore}
              >
                Confirm Restore
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
