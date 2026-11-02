import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Send,
  Users,
} from 'lucide-react';
import api from '@/lib/axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/announcements');
      setAnnouncements(res.data?.data?.announcements || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
      addToast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setTargetAudience('all');
    setPriority('normal');
    setModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingId(a._id);
    setTitle(a.title);
    setContent(a.content);
    setTargetAudience(a.targetAudience || 'all');
    setPriority(a.priority || 'normal');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return addToast('Title and content are required', 'error');
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/admin/announcements/${editingId}`, {
          title,
          content,
          targetAudience,
          priority,
        });
        addToast('Announcement updated successfully', 'success');
      } else {
        await api.post('/admin/announcements', {
          title,
          content,
          targetAudience,
          priority,
          status: 'published',
        });
        addToast('Announcement broadcasted to campus portal', 'success');
      }

      setModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      addToast('Announcement deleted', 'success');
      fetchAnnouncements();
    } catch (err) {
      addToast('Failed to delete announcement', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0071e3] text-xs font-bold uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Platform Broadcasts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Announcements & News
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Publish official announcements, maintenance schedules, and hackathon alerts to student dashboards.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={openCreateModal}
        >
          Create Announcement
        </Button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 flex items-center justify-center">
            <LoadingSpinner message="Loading announcements..." />
          </div>
        ) : announcements.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-xs text-[#94a3b8] rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08]">
            No announcements broadcasted yet. Click "Create Announcement" to post your first alert.
          </div>
        ) : (
          announcements.map((a) => (
            <div
              key={a._id}
              className="p-5 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] shadow-apple-card flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`
                        px-2 py-0.5 rounded text-[10px] font-bold uppercase
                        ${
                          a.priority === 'urgent'
                            ? 'bg-[#ef4444]/10 text-[#ef4444]'
                            : a.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-[#0071e3]/10 text-[#0071e3]'
                        }
                      `}
                    >
                      {a.priority || 'Normal'}
                    </span>
                    <span className="text-[10px] text-[#64748b] capitalize font-medium">
                      Audience: {a.targetAudience}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(a)}
                      className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0071e3] hover:bg-black/[0.04]"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="p-1.5 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-black/[0.04]"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#0f172a] dark:text-white mb-1.5">
                  {a.title}
                </h3>
                <p className="text-xs text-[#64748b] dark:text-[#94a3b8] leading-relaxed whitespace-pre-wrap">
                  {a.content}
                </p>
              </div>

              <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-[#94a3b8]">
                <span>Author: {a.author ? `${a.author.firstName} ${a.author.lastName}` : 'Administration'}</span>
                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Platform Announcement' : 'Draft New Announcement'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Announcement Headline:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance or Campus Hackathon Kickoff..."
                className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                  Target Audience:
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Campus Members</option>
                  <option value="students">Students Only</option>
                  <option value="providers">Freelance Providers Only</option>
                  <option value="verified_only">Verified Students Only</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                  Priority Banner:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold focus:outline-none"
                >
                  <option value="normal">Normal (Informative)</option>
                  <option value="high">High (Featured)</option>
                  <option value="urgent">Urgent (Important Alert)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Announcement Body / Message:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide detailed instructions or information..."
                rows={4}
                className="w-full p-2.5 rounded-xl bg-[#f8fafc] dark:bg-[#0e131f] border border-black/[0.06] dark:border-white/[0.08] text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" loading={submitting}>
                {editingId ? 'Update Announcement' : 'Broadcast Announcement'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
