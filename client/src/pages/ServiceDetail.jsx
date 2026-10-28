import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Star,
  ShieldCheck,
  MessageSquare,
  Edit3,
  Trash2,
  Share2,
  AlertTriangle,
  CheckCircle,
  Tag,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import StarRating from '@/components/StarRating';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/${id}`);
        const s = res.data?.data?.service || res.data?.service;
        setService(s);

        // Fetch reviews
        try {
          const revRes = await api.get(`/reviews/service/${id}`);
          setReviews(revRes.data?.data?.reviews || revRes.data?.reviews || []);
        } catch {
          // reviews can be empty
        }
      } catch (err) {
        addToast('Service not found or unavailable', 'error');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, navigate, addToast]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    if (!requirements.trim()) {
      addToast('Please provide your project requirements or details', 'error');
      return;
    }

    setOrderSubmitting(true);
    try {
      const res = await api.post('/orders', {
        serviceId: service._id,
        requirements: requirements.trim(),
      });
      addToast('Order placed successfully! The provider has been notified.', 'success');
      setOrderModalOpen(false);
      const order = res.data?.data?.order || res.data?.order;
      if (order?._id) {
        navigate(`/orders/${order._id}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const handleDeleteService = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/services/${id}`);
      addToast('Service deleted successfully', 'success');
      navigate('/services');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete service', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleStartMessage = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/conversations', { recipientId: service.provider._id });
      const conv = res.data?.data?.conversation || res.data?.conversation;
      navigate('/messages', { state: { conversationId: conv?._id } });
    } catch {
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading service details..." />
      </div>
    );
  }

  if (!service) return null;

  const isOwner = user && service.provider && (user._id === service.provider._id || user._id === service.provider);
  const provider = service.provider || {};
  const providerName = provider.firstName ? `${provider.firstName} ${provider.lastName || ''}` : 'Campus Talent';

  const amount = service.pricing?.amount ?? service.price ?? 0;
  const pType = service.pricing?.type ?? service.pricingType ?? 'fixed';

  const displayPrice =
    pType === 'free' ? 'Free' : pType === 'negotiable' ? 'Negotiable' : `₹${amount.toLocaleString()}`;

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-surface-500">
            <Link to="/services" className="hover:text-brand-600 transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-surface-700 capitalize">{service.category?.replace(/-/g, ' ')}</span>
          </div>

          {isOwner && (
            <div className="flex items-center gap-3">
              <Link
                to={`/services/${service._id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-surface-300 bg-white hover:bg-surface-50 text-surface-700 font-medium text-sm transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Gallery, Details, Description, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Category Header */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <Badge variant="brand">{service.category?.replace(/-/g, ' ')}</Badge>
                {service.status === 'active' && <Badge variant="success">Active</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight leading-snug mb-4">
                {service.title}
              </h1>

              {/* Quick stats bar */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-surface-600 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-surface-900">{(service.rating || 0).toFixed(1)}</span>
                  <span className="text-surface-400">({service.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-surface-400" />
                  <span>{service.deliveryTime || 3} days delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Campus Verified</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {service.images && service.images.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-100">
                  <img
                    src={service.images[activeImage]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {service.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {service.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activeImage === idx ? 'border-brand-600 ring-2 ring-brand-100' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h2 className="text-lg font-bold text-surface-900 mb-4">About this service</h2>
              <div className="prose prose-surface max-w-none text-surface-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                {service.description}
              </div>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-surface-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Skills & Technologies</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-surface-100 text-surface-700 text-xs font-medium rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-surface-900">
                  Student Feedback ({reviews.length})
                </h2>
                <div className="flex items-center gap-1 text-sm font-semibold text-surface-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{(service.rating || 0).toFixed(1)} out of 5</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-sm text-surface-500 py-4 text-center">
                  No reviews yet. Be the first student client to order and review this service!
                </p>
              ) : (
                <div className="divide-y divide-surface-100 space-y-4">
                  {reviews.map((rev) => {
                    const reviewer = rev.reviewer || {};
                    const reviewerName = reviewer.firstName
                      ? `${reviewer.firstName} ${reviewer.lastName || ''}`
                      : 'Fellow Student';

                    return (
                      <div key={rev._id} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={reviewer.avatar} name={reviewerName} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-surface-800">{reviewerName}</p>
                              {reviewer.university && (
                                <p className="text-xs text-surface-400">{reviewer.university}</p>
                              )}
                            </div>
                          </div>
                          <StarRating rating={rev.rating} size="sm" />
                        </div>
                        <p className="text-sm text-surface-600 mt-2">{rev.comment}</p>
                        <p className="text-xs text-surface-400 mt-1">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 Col): Order Card & Provider Info */}
          <div className="space-y-6">
            {/* Order Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-lg sticky top-20">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm font-medium text-surface-500">Service Fee</span>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-surface-900">{displayPrice}</span>
                  {pType === 'hourly' && <span className="text-xs text-surface-500"> / hr</span>}
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-surface-100 text-sm text-surface-600 mb-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-surface-400" />
                    Delivery Timeline
                  </span>
                  <span className="font-semibold text-surface-800">{service.deliveryTime || 3} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Campus Guarantee
                  </span>
                  <span className="font-medium text-surface-800">Direct Support</span>
                </div>
              </div>

              {isOwner ? (
                <div className="text-center p-3 bg-surface-50 rounded-xl border border-surface-200 text-sm text-surface-600">
                  This is your service listing.
                </div>
              ) : (
                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Continue to Order ({displayPrice})</span>
                </button>
              )}

              <div className="mt-4 text-center">
                <button
                  onClick={handleStartMessage}
                  className="text-sm font-medium text-brand-600 hover:text-brand-800 inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message {provider.firstName || 'Provider'}</span>
                </button>
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-4">
                About The Provider
              </h3>

              <div className="flex items-center gap-3.5 mb-4">
                <Avatar src={provider.avatar} name={providerName} size="lg" />
                <div>
                  <Link
                    to={`/users/${provider._id}`}
                    className="font-bold text-surface-900 hover:text-brand-600 text-base"
                  >
                    {providerName}
                  </Link>
                  {provider.headline && (
                    <p className="text-xs text-surface-600 line-clamp-1">{provider.headline}</p>
                  )}
                  {provider.university && (
                    <p className="text-xs text-brand-700 font-medium mt-0.5">{provider.university}</p>
                  )}
                </div>
              </div>

              {provider.bio && (
                <p className="text-xs text-surface-600 line-clamp-3 mb-4 leading-relaxed">
                  {provider.bio}
                </p>
              )}

              <div className="pt-4 border-t border-surface-100 flex items-center justify-between text-xs">
                <span className="text-surface-500">Overall Rating</span>
                <div className="flex items-center gap-1 font-semibold text-surface-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{(provider.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <Link
                to={`/users/${provider._id}`}
                className="mt-4 block w-full text-center py-2 px-3 border border-surface-300 rounded-lg text-xs font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
              >
                View Full Profile & Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-200 space-y-5">
            <div>
              <h3 className="text-xl font-bold text-surface-900">Place Your Order</h3>
              <p className="text-xs text-surface-500 mt-1">
                You are ordering <span className="font-semibold text-surface-700">{service.title}</span> for {displayPrice}.
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-800 mb-1.5">
                  Order Requirements & Instructions *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your requirements, project scope, deadlines, asset links, or specific instructions for the student freelancer..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
              </div>

              <div className="p-3 bg-surface-50 rounded-xl text-xs text-surface-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>
                  The student will be notified immediately to review your requirements and begin work. You can message back and forth inside the order thread.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {orderSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Service Listing"
        message="Are you sure you want to delete this service? This action will mark it inactive and remove it from campus search."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDeleteService}
        onCancel={() => setDeleteConfirmOpen(false)}
        variant="danger"
      />
    </div>
  );
}
