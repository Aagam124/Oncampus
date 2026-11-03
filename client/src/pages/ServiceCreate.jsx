import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Image as ImageIcon, Sparkles } from 'lucide-react';
import api from '@/lib/axios';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIES = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'ui-ux-design', label: 'UI/UX Design' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'tutoring', label: 'Tutoring & Academic Help' },
  { value: 'presentation', label: 'Presentation & Slides' },
  { value: 'research', label: 'Research & Surveys' },
  { value: 'other', label: 'Other Specialization' },
];

export default function ServiceCreate({ isEdit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'web-development',
    description: '',
    tags: '',
    pricingType: 'fixed',
    price: 500,
    deliveryTime: 3,
    images: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchService = async () => {
        try {
          const res = await api.get(`/services/${id}`);
          const s = res.data?.data?.service || res.data?.service;
          if (s) {
            setFormData({
              title: s.title || '',
              category: s.category || 'web-development',
              description: s.description || '',
              tags: Array.isArray(s.tags) ? s.tags.join(', ') : '',
              pricingType: s.pricing?.type || 'fixed',
              price: s.pricing?.amount ?? 500,
              deliveryTime: s.deliveryTime || 3,
              images: Array.isArray(s.images) ? s.images.join(', ') : '',
            });
          }
        } catch (err) {
          addToast('Failed to load service data for editing', 'error');
          navigate('/services');
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [isEdit, id, navigate, addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast('Please enter a service title', 'error');
      return;
    }
    if (!formData.description.trim()) {
      addToast('Please provide a description of your service', 'error');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const imagesArray = formData.images
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      tags: tagsArray,
      pricing: {
        type: formData.pricingType,
        amount: parseFloat(formData.price) || 0,
      },
      deliveryTime: parseInt(formData.deliveryTime, 10) || 1,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'],
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/services/${id}`, payload);
        addToast('Service updated successfully!', 'success');
        navigate(`/services/${id}`);
      } else {
        const res = await api.post('/services', payload);
        const newService = res.data?.data?.service || res.data?.service;
        addToast('Service published to campus marketplace!', 'success');
        navigate(newService?._id ? `/services/${newService._id}` : '/services');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Loading service details..." />
      </div>
    );
  }

  return (
    <div className="bg-surface-50 dark:bg-[#0c0c0e] min-h-screen py-10 text-surface-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to={isEdit ? `/services/${id}` : '/services'}
          className="inline-flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isEdit ? 'Service' : 'Services'}</span>
        </Link>

        <div className="bg-white dark:bg-[#161617] rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-surface-100 dark:border-white/[0.06] bg-gradient-to-r from-brand-50/50 dark:from-brand-950/20 to-white dark:to-[#161617]">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Campus Talent Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              {isEdit ? 'Edit Your Service Listing' : 'Publish a New Service'}
            </h1>
            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
              Provide accurate details so student peers and campus clients know exactly what you deliver.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Full-stack React & Node.js Website Development"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                Be specific and descriptive about the tangible outcome.
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-white dark:bg-[#1c1c1e]">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                Description & Scope of Work *
              </label>
              <textarea
                name="description"
                rows={6}
                required
                placeholder="Explain what is included in this service, your technical stack, what the client needs to provide, and revisions policy..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                  Pricing Model *
                </label>
                <select
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white"
                >
                  <option value="fixed" className="bg-white dark:bg-[#1c1c1e]">Fixed Price</option>
                  <option value="hourly" className="bg-white dark:bg-[#1c1c1e]">Hourly Rate</option>
                  <option value="negotiable" className="bg-white dark:bg-[#1c1c1e]">Negotiable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="50"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                  Delivery (Days) *
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  min="1"
                  required
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                Skills / Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. React, Tailwind CSS, TypeScript, MongoDB"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-surface-800 dark:text-surface-200 mb-1.5">
                Showcase Image URLs (comma separated)
              </label>
              <input
                type="text"
                name="images"
                placeholder="https://images.unsplash.com/..., https://..."
                value={formData.images}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
                Provide direct image links. If left empty, an aesthetic preview image will be assigned.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-surface-100 dark:border-white/[0.06] flex items-center justify-end gap-3">
              <Link
                to={isEdit ? `/services/${id}` : '/services'}
                className="px-5 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
