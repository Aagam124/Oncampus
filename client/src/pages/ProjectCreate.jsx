import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Users } from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/useToast';

const CATEGORIES = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'research', label: 'Research & Academic' },
  { value: 'other', label: 'Other' },
];

export default function ProjectCreate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'web-development',
    type: 'collaboration',
    description: '',
    skills: '',
    budgetMin: '',
    budgetMax: '',
    timeline: '2-4 weeks',
    maxCollaborators: 4,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast('Please enter a project title', 'error');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Please describe your project scope and objectives', 'error');
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      type: formData.type,
      description: formData.description.trim(),
      skills: skillsArray,
      timeline: formData.timeline,
      maxCollaborators: parseInt(formData.maxCollaborators, 10) || 3,
      budget: {
        min: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
        max: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined,
        currency: 'INR',
      },
    };

    setSubmitting(true);
    try {
      const res = await api.post('/projects', payload);
      const newProj = res.data?.data?.project || res.data?.project;
      addToast('Project published to campus network!', 'success');
      navigate(newProj?._id ? `/projects/${newProj._id}` : '/projects');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-surface-600 hover:text-brand-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-surface-100 bg-gradient-to-r from-brand-50/50 to-white">
            <div className="flex items-center gap-2 text-brand-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Campus Teammates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
              Post a New Project or Team Search
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Find talented student collaborators, co-founders, or teammates with complementary skills.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Campus Carpool App for Smart Mobility Hackathon"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {/* Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Collaboration Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  <option value="collaboration">Peer Collaboration / Teammates</option>
                  <option value="hiring">Paid Student Hiring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                Project Overview & Mission *
              </label>
              <textarea
                name="description"
                rows={6}
                required
                placeholder="Explain what problem your project solves, the current stage of development, goals, and what responsibilities team members will take on..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                Desired Skills / Tech Stack (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. Flutter, Firebase, Figma, Python, NLP"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {/* Team capacity & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Max Collaborators
                </label>
                <input
                  type="number"
                  name="maxCollaborators"
                  min="1"
                  max="20"
                  value={formData.maxCollaborators}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Estimated Timeline
                </label>
                <input
                  type="text"
                  name="timeline"
                  placeholder="e.g. 1 month, Hackathon weekend, Ongoing"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Optional Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Min Budget (₹) (Optional)
                </label>
                <input
                  type="number"
                  name="budgetMin"
                  placeholder="0"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Max Budget (₹) (Optional)
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  placeholder="5000"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-surface-100 flex items-center justify-end gap-3">
              <Link
                to="/projects"
                className="px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
