import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Star,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Mail,
  Edit,
  Briefcase,
  Layers,
  Award,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import StarRating from '@/components/StarRating';
import ServiceCard from '@/components/ServiceCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();

  const [profileUser, setProfileUser] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // 'services', 'portfolio', 'education', 'reviews'

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [uRes, sRes, rRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/users/${id}/services`),
          api.get(`/users/${id}/reviews`),
        ]);

        const u = uRes.data?.data?.user || uRes.data?.user;
        const s = sRes.data?.data?.services || sRes.data?.services || [];
        const r = rRes.data?.data?.reviews || rRes.data?.reviews || [];

        setProfileUser(u);
        setServices(s);
        setReviews(r);
      } catch (err) {
        addToast('User profile not found', 'error');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, navigate, addToast]);

  const handleStartMessage = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/conversations', { recipientId: profileUser._id });
      const conv = res.data?.data?.conversation || res.data?.conversation;
      navigate('/messages', { state: { conversationId: conv?._id } });
    } catch {
      navigate('/messages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading student profile..." />
      </div>
    );
  }

  if (!profileUser) return null;

  const isOwner = currentUser && (currentUser._id === profileUser._id);
  const fullName = `${profileUser.firstName} ${profileUser.lastName || ''}`;

  return (
    <div className="bg-surface-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Banner Card */}
        <div className="bg-white rounded-3xl border border-surface-200 shadow-sm overflow-hidden">
          {/* Top Banner Gradient */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="px-6 sm:px-10 pb-8 relative">
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
              <div className="relative inline-block">
                <div className="ring-4 ring-white rounded-full bg-white shadow-xl overflow-hidden w-28 h-28 sm:w-36 sm:h-36">
                  <Avatar
                    src={profileUser.avatar}
                    name={fullName}
                    size="xl"
                    className="w-full h-full text-3xl font-bold"
                  />
                </div>
                {profileUser.isVerified && (
                  <div className="absolute bottom-1 right-1 bg-brand-600 text-white p-1 rounded-full ring-2 ring-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {isOwner ? (
                  <Link
                    to="/profile/edit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surface-300 bg-white hover:bg-surface-50 text-surface-800 font-semibold text-sm transition-colors shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <button
                    onClick={handleStartMessage}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight">
                    {fullName}
                  </h1>
                  {profileUser.isVerified && (
                    <Badge variant="brand" className="text-xs">
                      Verified Student
                    </Badge>
                  )}
                </div>

                {profileUser.headline && (
                  <p className="text-base text-surface-700 font-medium leading-relaxed">
                    {profileUser.headline}
                  </p>
                )}

                {/* Campus info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600 pt-1">
                  {profileUser.university && (
                    <div className="flex items-center gap-1.5 font-medium text-brand-700">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profileUser.university}</span>
                    </div>
                  )}
                  {profileUser.department && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-surface-400" />
                      <span>{profileUser.department}</span>
                    </div>
                  )}
                  {profileUser.year && (
                    <div className="text-xs px-2.5 py-0.5 rounded-full bg-surface-100 text-surface-600 font-semibold">
                      Year {profileUser.year}
                    </div>
                  )}
                </div>

                {profileUser.bio && (
                  <p className="text-sm text-surface-600 pt-2 leading-relaxed">
                    {profileUser.bio}
                  </p>
                )}
              </div>

              {/* Stats & Social box */}
              <div className="bg-surface-50 p-5 rounded-2xl border border-surface-200/80 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white rounded-xl border border-surface-200">
                    <div className="flex items-center justify-center gap-1 text-surface-900 font-bold text-xl">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span>{(profileUser.rating || 0).toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-surface-500 font-medium">
                      {profileUser.reviewCount || 0} reviews
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-surface-200">
                    <span className="text-xl font-bold text-surface-900 block">
                      {services.length}
                    </span>
                    <span className="text-xs text-surface-500 font-medium">Services Active</span>
                  </div>
                </div>

                {/* Social Links */}
                {profileUser.socialLinks && (
                  <div className="pt-2 flex items-center justify-center gap-3">
                    {profileUser.socialLinks.github && (
                      <a
                        href={profileUser.socialLinks.github}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-surface-600 hover:text-surface-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-surface-200"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {profileUser.socialLinks.linkedin && (
                      <a
                        href={profileUser.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-surface-600 hover:text-brand-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-surface-200"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {profileUser.socialLinks.website && (
                      <a
                        href={profileUser.socialLinks.website}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-surface-600 hover:text-surface-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-surface-200"
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {profileUser.socialLinks.twitter && (
                      <a
                        href={profileUser.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-surface-600 hover:text-sky-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-surface-200"
                        title="Twitter / X"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Skills Pills */}
            {profileUser.skills && profileUser.skills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-surface-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-400 block mb-2">
                  Skills & Endorsements
                </span>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-surface-100 text-surface-800 text-xs font-semibold rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-surface-200 gap-8 text-sm font-semibold">
          {[
            { id: 'services', label: `Services (${services.length})` },
            { id: 'portfolio', label: `Portfolio (${profileUser.portfolio?.length || 0})` },
            { id: 'education', label: 'Education & Degree' },
            { id: 'reviews', label: `Client Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-surface-500 hover:text-surface-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'services' && (
          <div>
            {services.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-surface-200 text-surface-500">
                No active services published yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            {(!profileUser.portfolio || profileUser.portfolio.length === 0) ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-surface-200 text-surface-500">
                No portfolio items added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileUser.portfolio.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden flex flex-col"
                  >
                    {item.image && (
                      <div className="aspect-video bg-surface-100 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-surface-900 text-base mb-1.5">{item.title}</h3>
                        <p className="text-xs text-surface-600 leading-relaxed">{item.description}</p>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                        >
                          <span>View Live Work</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-surface-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              <span>Academic Background</span>
            </h2>

            {(!profileUser.education || profileUser.education.length === 0) ? (
              <p className="text-sm text-surface-500 text-center py-6">
                No formal education history specified yet.
              </p>
            ) : (
              <div className="space-y-6">
                {profileUser.education.map((edu, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-6 border-b border-surface-100 last:border-0 last:pb-0">
                    <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-surface-900 text-base">{edu.institution}</h3>
                      <p className="text-sm text-surface-700 font-medium">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-xs text-surface-400 mt-1">
                        {edu.startYear} — {edu.endYear || 'Present'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-surface-900 mb-6">
              Client Reviews & Testimonials ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-surface-500 text-center py-6">
                No reviews recorded for this student yet.
              </p>
            ) : (
              <div className="divide-y divide-surface-100 space-y-6">
                {reviews.map((rev) => {
                  const revName = rev.reviewer?.firstName
                    ? `${rev.reviewer.firstName} ${rev.reviewer.lastName || ''}`
                    : 'Campus Client';

                  return (
                    <div key={rev._id} className="pt-6 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={rev.reviewer?.avatar} name={revName} size="sm" />
                          <div>
                            <span className="font-semibold text-sm text-surface-900">{revName}</span>
                            {rev.service?.title && (
                              <p className="text-xs text-surface-500">For "{rev.service.title}"</p>
                            )}
                          </div>
                        </div>
                        <StarRating rating={rev.rating} size="sm" />
                      </div>
                      <p className="text-sm text-surface-700 leading-relaxed">{rev.comment}</p>
                      <p className="text-xs text-surface-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
