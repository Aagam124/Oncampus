import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  Tag,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Send,
  Trash2,
  Bookmark,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);

  // Delete project
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bookmark / Favorite
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user?.savedProjects?.includes(id)) {
      setIsSaved(true);
    }
  }, [user, id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }
    try {
      const res = await api.post(`/users/favorites/${id}`);
      const saved = res.data?.data?.isFavorite;
      setIsSaved(saved);
      addToast(saved ? 'Project saved to favorites' : 'Project removed from favorites', 'success');
    } catch {
      addToast('Failed to update favorites', 'error');
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      const p = res.data?.data?.project || res.data?.project;
      setProject(p);
    } catch (err) {
      addToast('Project not found or unavailable', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }

    setSubmittingApply(true);
    try {
      await api.post(`/projects/${id}/apply`, { message: applyMessage.trim() });
      addToast('Application submitted successfully! The owner will review your request.', 'success');
      setApplyModalOpen(false);
      setApplyMessage('');
      fetchProject(); // refresh to show application
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleApplicationDecision = async (applicationId, status) => {
    try {
      await api.put(`/projects/${id}/applications/${applicationId}`, { status });
      addToast(`Application ${status} successfully`, 'success');
      fetchProject();
    } catch (err) {
      addToast(err.response?.data?.message || `Failed to ${status} application`, 'error');
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      addToast('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete project', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleMessageOwner = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/conversations', { recipientId: project.owner._id });
      const conv = res.data?.data?.conversation || res.data?.conversation;
      navigate('/messages', { state: { conversationId: conv?._id } });
    } catch {
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading project details..." />
      </div>
    );
  }

  if (!project) return null;

  const isOwner = user && project.owner && (user._id === project.owner._id || user._id === project.owner);
  const owner = project.owner || {};
  const ownerName = owner.firstName ? `${owner.firstName} ${owner.lastName || ''}` : 'Team Lead';

  // Check if current user has already applied
  const myApplication = project.applications?.find(
    (app) => (app.applicant?._id || app.applicant) === user?._id
  );

  const isMember = project.members?.some(
    (m) => (m._id || m) === user?._id
  );

  const bMin = project.budget?.min;
  const bMax = project.budget?.max;

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-surface-600 hover:text-brand-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                isSaved
                  ? 'bg-[#0071e3]/10 border-[#0071e3]/30 text-[#0071e3]'
                  : 'bg-white dark:bg-[#161617] border-black/[0.08] dark:border-white/[0.1] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#0071e3]' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Project'}</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{project.category?.replace(/-/g, ' ')}</Badge>
                <Badge variant={project.type === 'hiring' ? 'info' : 'brand'}>
                  {project.type === 'hiring' ? 'Paid Project' : 'Peer Collaboration'}
                </Badge>
                <Badge variant={project.status === 'open' ? 'success' : 'default'}>
                  {project.status?.toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight leading-snug">
                {project.title}
              </h1>

              {/* Meta stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-surface-100 text-sm">
                <div>
                  <span className="text-xs text-surface-400 block mb-0.5">Team Size</span>
                  <div className="flex items-center gap-1.5 font-semibold text-surface-800">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span>
                      {project.members?.length || 1} / {project.maxCollaborators || 5}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-surface-400 block mb-0.5">Timeline</span>
                  <div className="flex items-center gap-1.5 font-semibold text-surface-800">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>{project.timeline || 'Flexible'}</span>
                  </div>
                </div>

                {(bMin || bMax) && (
                  <div>
                    <span className="text-xs text-surface-400 block mb-0.5">Budget</span>
                    <div className="flex items-center gap-1.5 font-semibold text-surface-800">
                      <DollarSign className="w-4 h-4 text-brand-600" />
                      <span>
                        {bMin && bMax ? `₹${bMin} - ₹${bMax}` : bMax ? `Up to ₹${bMax}` : `₹${bMin}`}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-surface-400 block mb-0.5">Posted</span>
                  <div className="flex items-center gap-1.5 text-surface-600 text-xs">
                    <Clock className="w-4 h-4 text-surface-400" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-lg font-bold text-surface-900 mb-4">Project Overview & Goals</h2>
              <div className="prose prose-surface max-w-none text-surface-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {project.description}
              </div>

              {/* Required Skills */}
              {project.skills && project.skills.length > 0 && (
                <div className="mt-8 pt-6 border-t border-surface-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Looking For Skills In</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-surface-100 text-surface-700 font-medium text-xs rounded-lg border border-surface-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current Team Members */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-lg font-bold text-surface-900 mb-4">
                Active Team ({project.members?.length || 1})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Owner */}
                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200">
                  <Avatar src={owner.avatar} name={ownerName} size="md" />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <Link to={`/users/${owner._id}`} className="font-semibold text-sm text-surface-900 hover:text-brand-600 truncate">
                        {ownerName}
                      </Link>
                      <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded font-bold uppercase">
                        Lead
                      </span>
                    </div>
                    {owner.headline && <p className="text-xs text-surface-500 truncate">{owner.headline}</p>}
                  </div>
                </div>

                {/* Other Members */}
                {project.members
                  ?.filter((m) => (m._id || m) !== owner._id)
                  .map((member) => {
                    const mName = member.firstName ? `${member.firstName} ${member.lastName || ''}` : 'Team Member';
                    return (
                      <div key={member._id} className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl border border-surface-200">
                        <Avatar src={member.avatar} name={mName} size="md" />
                        <div className="overflow-hidden">
                          <Link to={`/users/${member._id}`} className="font-semibold text-sm text-surface-900 hover:text-brand-600 truncate block">
                            {mName}
                          </Link>
                          {member.headline && <p className="text-xs text-surface-500 truncate">{member.headline}</p>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Owner's Applications Management Panel */}
            {isOwner && (
              <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-surface-900">
                    Applications Received ({project.applications?.length || 0})
                  </h2>
                </div>

                {project.applications?.length === 0 ? (
                  <p className="text-sm text-surface-500 py-4 text-center">
                    No applications received yet.
                  </p>
                ) : (
                  <div className="divide-y divide-surface-100 space-y-4">
                    {project.applications.map((app) => {
                      const applicant = app.applicant || {};
                      const applicantName = applicant.firstName
                        ? `${applicant.firstName} ${applicant.lastName || ''}`
                        : 'Applicant';

                      return (
                        <div key={app._id} className="pt-4 first:pt-0 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar src={applicant.avatar} name={applicantName} size="md" />
                              <div>
                                <Link
                                  to={`/users/${applicant._id}`}
                                  className="font-bold text-sm text-surface-900 hover:text-brand-600"
                                >
                                  {applicantName}
                                </Link>
                                {applicant.headline && (
                                  <p className="text-xs text-surface-500">{applicant.headline}</p>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                app.status === 'accepted'
                                  ? 'success'
                                  : app.status === 'rejected'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {app.status}
                            </Badge>
                          </div>

                          {app.message && (
                            <div className="p-3 bg-surface-50 rounded-xl text-xs text-surface-700 italic border border-surface-200">
                              "{app.message}"
                            </div>
                          )}

                          {app.status === 'pending' && (
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleApplicationDecision(app._id, 'rejected')}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                              <button
                                onClick={() => handleApplicationDecision(app._id, 'accepted')}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept to Team</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Action Box */}
            <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-lg sticky top-20">
              <h3 className="font-bold text-surface-900 text-lg mb-2">Join this collaboration</h3>
              <p className="text-xs text-surface-600 mb-6">
                Connect with the team lead to offer your skills and help build this project.
              </p>

              {isOwner ? (
                <div className="p-3 bg-surface-50 border border-surface-200 rounded-xl text-center text-xs text-surface-600">
                  You are the owner of this project. Manage incoming applications on this page.
                </div>
              ) : isMember ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You are a team member!</span>
                </div>
              ) : myApplication ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-900 space-y-1">
                  <p className="font-bold">Application Status: {myApplication.status?.toUpperCase()}</p>
                  <p className="text-amber-700">Your application has been received and is being reviewed.</p>
                </div>
              ) : project.status !== 'open' ? (
                <div className="p-3 bg-surface-100 rounded-xl text-center text-xs text-surface-600 font-medium">
                  This project is no longer accepting new members.
                </div>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply to Join Team</span>
                </button>
              )}

              <div className="mt-4 text-center">
                <button
                  onClick={handleMessageOwner}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message Project Lead</span>
                </button>
              </div>
            </div>

            {/* Team Lead Card */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-4">
                Project Lead
              </h3>

              <div className="flex items-center gap-3.5 mb-4">
                <Avatar src={owner.avatar} name={ownerName} size="lg" />
                <div>
                  <Link
                    to={`/users/${owner._id}`}
                    className="font-bold text-surface-900 hover:text-brand-600 text-base"
                  >
                    {ownerName}
                  </Link>
                  {owner.university && (
                    <p className="text-xs text-brand-700 font-medium mt-0.5">{owner.university}</p>
                  )}
                </div>
              </div>

              {owner.bio && (
                <p className="text-xs text-surface-600 line-clamp-3 mb-4 leading-relaxed">
                  {owner.bio}
                </p>
              )}

              <Link
                to={`/users/${owner._id}`}
                className="block w-full text-center py-2 px-3 border border-surface-300 rounded-lg text-xs font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
              >
                View Profile & Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-200 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-surface-900">Apply to {project.title}</h3>
              <p className="text-xs text-surface-500 mt-1">
                Tell the project lead why you're interested and what skills you bring to the team.
              </p>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Application Message & Pitch *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Introduce yourself, mention relevant past projects, tech stack, and your availability..."
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApply}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {submittingApply ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Project"
        message="Are you sure you want to delete this project? Active applications will be cancelled."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteProject}
        onCancel={() => setDeleteConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
