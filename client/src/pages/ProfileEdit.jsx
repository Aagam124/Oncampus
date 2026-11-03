import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Globe,
  Plus,
  Trash2,
  Upload,
  Check,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, updateProfile, fetchUser } = useAuthStore();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('basic'); // basic, skills, education, portfolio, social
  const [submitting, setSubmitting] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    university: '',
    department: '',
    year: 1,
    skills: [],
    education: [],
    portfolio: [],
    socialLinks: {
      github: '',
      linkedin: '',
      website: '',
      twitter: '',
    },
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        headline: user.headline || '',
        bio: user.bio || '',
        university: user.university || '',
        department: user.department || '',
        year: user.year || 1,
        skills: user.skills || [],
        education: user.education || [],
        portfolio: user.portfolio || [],
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          website: user.socialLinks?.website || '',
          twitter: user.socialLinks?.twitter || '',
        },
      });
    }
  }, [user]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  // Skill tag add/remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) {
      addToast('Skill already added', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()],
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Education add/remove/change
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', field: '', startYear: 2022, endYear: 2026 },
      ],
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.education];
      updated[index][field] = value;
      return { ...prev, education: updated };
    });
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Portfolio add/remove/change
  const handleAddPortfolio = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        { title: '', description: '', url: '', image: '' },
      ],
    }));
  };

  const handleUpdatePortfolio = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.portfolio];
      updated[index][field] = value;
      return { ...prev, portfolio: updated };
    });
  };

  const handleRemovePortfolio = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }));
  };

  // Avatar upload
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    setAvatarUploading(true);
    try {
      await api.put('/users/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchUser();
      addToast('Profile avatar updated!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to upload avatar', 'error');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save all profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile(formData);
      addToast('Profile updated successfully!', 'success');
      navigate(`/users/${user._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-50 dark:bg-[#0c0c0e] min-h-screen py-10 text-surface-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={user ? `/users/${user._id}` : '/dashboard'}
            className="inline-flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Public Profile</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#161617] rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-surface-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Edit Your Profile</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                Keep your campus identity and portfolio up to date.
              </p>
            </div>

            {/* Avatar Uploader Quick */}
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatar} name={user?.firstName} size="lg" />
              <div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-300 dark:border-white/[0.12] text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{avatarUploading ? 'Uploading...' : 'Change Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                    disabled={avatarUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-surface-200 dark:border-white/[0.08] bg-surface-50/50 dark:bg-[#121214] px-6 gap-6 text-sm font-semibold">
            {[
              { id: 'basic', label: 'Basic Info', icon: User },
              { id: 'skills', label: 'Skills & Tags', icon: Briefcase },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'portfolio', label: 'Portfolio Works', icon: Globe },
              { id: 'social', label: 'Social & Links', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleBasicChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleBasicChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    placeholder="e.g. Computer Science Undergrad | React & Flutter Developer"
                    value={formData.headline}
                    onChange={handleBasicChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                      University / College *
                    </label>
                    <input
                      type="text"
                      name="university"
                      placeholder="e.g. IIT Delhi, BITS Pilani"
                      value={formData.university}
                      onChange={handleBasicChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                      Current Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleBasicChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] text-sm focus:ring-brand-500 focus:border-brand-500 outline-none bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((yr) => (
                        <option key={yr} value={yr} className="bg-white dark:bg-[#1c1c1e]">
                          Year {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    Department / Major
                  </label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Computer Science and Engineering"
                    value={formData.department}
                    onChange={handleBasicChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    Bio / About You
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    placeholder="Share your interests, key achievements, what projects you love working on..."
                    value={formData.bio}
                    onChange={handleBasicChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-2">
                    Add A Skill
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Next.js, Figma, Deep Learning"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-3">
                    Your Current Skills ({formData.skills.length})
                  </label>
                  {formData.skills.length === 0 ? (
                    <p className="text-sm text-surface-500 dark:text-surface-400">No skills added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 text-brand-800 dark:text-brand-300 text-xs font-semibold rounded-lg"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-brand-500 hover:text-red-600 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 uppercase tracking-wider">
                    Education Entries
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Institution</span>
                  </button>
                </div>

                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-surface-50 dark:bg-[#1c1c1e] rounded-xl border border-surface-200 dark:border-white/[0.08] space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-3 right-3 text-surface-400 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          Institution *
                        </label>
                        <input
                          type="text"
                          required
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          Degree *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Tech"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mechanical Engineering"
                          value={edu.field}
                          onChange={(e) => handleUpdateEducation(idx, 'field', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          Start Year
                        </label>
                        <input
                          type="number"
                          value={edu.startYear}
                          onChange={(e) => handleUpdateEducation(idx, 'startYear', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          End Year (or Expected)
                        </label>
                        <input
                          type="number"
                          value={edu.endYear}
                          onChange={(e) => handleUpdateEducation(idx, 'endYear', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 uppercase tracking-wider">
                    Portfolio Items & Case Studies
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddPortfolio}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project Showcase</span>
                  </button>
                </div>

                {formData.portfolio.map((item, idx) => (
                  <div key={idx} className="p-4 bg-surface-50 dark:bg-[#1c1c1e] rounded-xl border border-surface-200 dark:border-white/[0.08] space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolio(idx)}
                      className="absolute top-3 right-3 text-surface-400 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={item.title}
                          onChange={(e) => handleUpdatePortfolio(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                          Live URL / GitHub Repo
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={item.url}
                          onChange={(e) => handleUpdatePortfolio(idx, 'url', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                        Preview Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={item.image}
                        onChange={(e) => handleUpdatePortfolio(idx, 'image', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-surface-600 dark:text-surface-400 mb-1">
                        Summary
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdatePortfolio(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#161617] text-surface-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    placeholder="https://github.com/username"
                    value={formData.socialLinks.github}
                    onChange={handleSocialChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.socialLinks.linkedin}
                    onChange={handleSocialChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    Personal Portfolio / Blog
                  </label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://yourname.dev"
                    value={formData.socialLinks.website}
                    onChange={handleSocialChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                    Twitter / X Profile
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    placeholder="https://twitter.com/handle"
                    value={formData.socialLinks.twitter}
                    onChange={handleSocialChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-surface-100 dark:border-white/[0.06] flex items-center justify-end gap-3">
              <Link
                to={user ? `/users/${user._id}` : '/dashboard'}
                className="px-5 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving Profile...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
