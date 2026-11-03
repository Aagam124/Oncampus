import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Star,
  MessageSquare,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import StarRating from '@/components/StarRating';
import LoadingSpinner from '@/components/LoadingSpinner';

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Embedded messaging
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef(null);

  // Review state
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      const o = res.data?.data?.order || res.data?.order;
      setOrder(o);
    } catch (err) {
      addToast('Order not found or access denied', 'error');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [order?.messages]);

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      addToast(`Order updated to "${newStatus}"`, 'success');
      fetchOrder();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setSendingMsg(true);
    try {
      const res = await api.post(`/orders/${id}/messages`, {
        content: chatMessage.trim(),
      });
      const msgs = res.data?.data?.messages || res.data?.messages;
      if (msgs) {
        setOrder((prev) => ({ ...prev, messages: msgs }));
      } else {
        fetchOrder();
      }
      setChatMessage('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        orderId: order._id,
        rating,
        comment: reviewComment.trim(),
      });
      addToast('Thank you! Your review has been recorded.', 'success');
      fetchOrder();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading order details..." />
      </div>
    );
  }

  if (!order) return null;

  const isClient = (order.client?._id || order.client) === user?._id;
  const isProvider = (order.provider?._id || order.provider) === user?._id;
  const otherParty = isClient ? order.provider : order.client;
  const otherName = otherParty?.firstName
    ? `${otherParty.firstName} ${otherParty.lastName || ''}`
    : 'Campus Peer';

  // Determine current step index in pipeline
  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status);

  // Check review status
  const hasReviewed = isClient ? !!order.clientReview : !!order.providerReview;
  const existingReview = isClient ? order.clientReview : order.providerReview;

  return (
    <div className="bg-surface-50 dark:bg-[#0c0c0e] min-h-screen py-10 text-surface-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Order ID */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>

          <span className="text-xs font-mono text-surface-400 dark:text-surface-500 bg-white dark:bg-[#161617] px-3 py-1.5 rounded-lg border border-surface-200 dark:border-white/[0.08]">
            Order ID: {order._id}
          </span>
        </div>

        {/* Progress Timeline Header */}
        <div className="bg-white dark:bg-[#161617] p-6 sm:p-8 rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {isClient ? 'You are the Buyer' : 'You are the Service Provider'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white mt-1">
                {order.service?.title || 'Service Order'}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-extrabold text-surface-900 dark:text-white block">
                ₹{(order.amount || 0).toLocaleString()}
              </span>
              <span className="text-xs text-surface-500 dark:text-surface-400">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Stepper Pipeline */}
          {order.status !== 'cancelled' ? (
            <div className="relative">
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-surface-100 dark:bg-white/[0.06] -translate-y-1/2 z-0" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                {ORDER_STEPS.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div key={step.key} className="flex flex-col sm:items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isDone
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'bg-surface-100 dark:bg-[#1c1c1e] text-surface-400 dark:text-surface-500 border border-surface-200 dark:border-white/[0.1]'
                        } ${isCurrent ? 'ring-4 ring-brand-100 dark:ring-brand-900/50' : ''}`}
                      >
                        {isDone ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isDone ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>This order has been cancelled.</span>
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="bg-white dark:bg-[#161617] p-5 rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase">Current Status:</span>
            <Badge
              variant={
                order.status === 'completed'
                  ? 'active'
                  : order.status === 'in-progress'
                  ? 'in-progress'
                  : order.status === 'delivered'
                  ? 'delivered'
                  : order.status === 'cancelled'
                  ? 'cancelled'
                  : 'pending'
              }
            >
              {order.status?.toUpperCase()}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Provider Actions */}
            {isProvider && order.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-surface-300 dark:border-white/[0.12] rounded-xl text-xs font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  Accept Order
                </button>
              </>
            )}

            {isProvider && order.status === 'accepted' && (
              <button
                onClick={() => handleStatusUpdate('in-progress')}
                disabled={actionLoading}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Start Working (In Progress)
              </button>
            )}

            {isProvider && order.status === 'in-progress' && (
              <button
                onClick={() => handleStatusUpdate('delivered')}
                disabled={actionLoading}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Mark Deliverables Delivered
              </button>
            )}

            {/* Client Actions */}
            {isClient && order.status === 'delivered' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Approve & Mark Completed
              </button>
            )}

            {/* Cancel Action */}
            {['pending', 'accepted'].includes(order.status) && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Content: Order Info & Chat Thread */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Requirements & Counterparty */}
          <div className="space-y-6">
            {/* Counterparty Card */}
            <div className="bg-white dark:bg-[#161617] p-5 rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 block mb-3">
                {isClient ? 'Service Provider' : 'Client Student'}
              </span>
              <div className="flex items-center gap-3">
                <Avatar src={otherParty?.avatar} name={otherName} size="md" />
                <div>
                  <Link
                    to={`/users/${otherParty?._id}`}
                    className="font-bold text-surface-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 text-sm"
                  >
                    {otherName}
                  </Link>
                  {otherParty?.email && (
                    <p className="text-xs text-surface-400 dark:text-surface-500">{otherParty.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Client Requirements */}
            <div className="bg-white dark:bg-[#161617] p-5 rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-surface-800 dark:text-surface-200 font-semibold text-sm">
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Initial Requirements</span>
              </div>
              <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 whitespace-pre-line leading-relaxed bg-surface-50 dark:bg-[#1c1c1e] p-4 rounded-xl border border-surface-200/80 dark:border-white/[0.08]">
                {order.requirements || 'No specific requirements submitted.'}
              </p>
            </div>

            {/* Review Section */}
            {order.status === 'completed' && (
              <div className="bg-white dark:bg-[#161617] p-6 rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm space-y-4">
                <h3 className="font-bold text-surface-900 dark:text-white text-base">
                  {isClient ? 'Review the Provider' : 'Review the Client'}
                </h3>

                {hasReviewed ? (
                  <div className="p-4 bg-surface-50 dark:bg-[#1c1c1e] rounded-xl border border-surface-200 dark:border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">Your Rating</span>
                      <StarRating rating={existingReview?.rating || 5} size="sm" />
                    </div>
                    {existingReview?.comment && (
                      <p className="text-xs text-surface-600 dark:text-surface-300 italic">
                        "{existingReview.comment}"
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
                        Rating (1 to 5 Stars)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-surface-300 dark:text-surface-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
                        Feedback / Testimonial
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write an honest review about communication, work quality, and delivery speed..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting Review...' : 'Submit Feedback'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right: Order Workspace Messages Thread */}
          <div className="lg:col-span-2 bg-white dark:bg-[#161617] rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-sm flex flex-col h-[650px]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-surface-100 dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-surface-900 dark:text-white text-sm">
                <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Order Collaboration Workspace</span>
              </div>
              <span className="text-xs text-surface-400 dark:text-surface-500">
                {order.messages?.length || 0} messages
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-surface-50/50 dark:bg-[#101012]">
              {(!order.messages || order.messages.length === 0) ? (
                <div className="h-full flex items-center justify-center text-center text-surface-400 dark:text-surface-500 text-xs py-10">
                  No messages yet. Send updates, deliverables, or questions here.
                </div>
              ) : (
                order.messages.map((msg, idx) => {
                  const isMe = (msg.sender?._id || msg.sender) === user?._id;
                  const senderName = msg.sender?.firstName || 'User';

                  return (
                    <div
                      key={idx}
                      className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <Avatar
                          src={msg.sender?.avatar}
                          name={senderName}
                          size="xs"
                          className="flex-shrink-0 mb-1"
                        />
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none shadow-xs'
                            : 'bg-white dark:bg-[#1c1c1e] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span
                          className={`text-[10px] block mt-1 text-right ${
                            isMe ? 'text-brand-200' : 'text-surface-400 dark:text-surface-500'
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#161617] flex gap-2">
              <input
                type="text"
                placeholder="Share a work update, link to assets, or ask questions..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-surface-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1c1e] text-surface-900 dark:text-white placeholder:text-surface-400 text-sm focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <button
                type="submit"
                disabled={sendingMsg || !chatMessage.trim()}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
