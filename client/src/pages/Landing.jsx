import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code,
  Palette,
  Video,
  PenTool,
  BookOpen,
  Megaphone,
  Camera,
  Music,
  Users,
  Briefcase,
  Rocket,
  Globe,
  Award,
  GraduationCap,
  Zap,
  TrendingUp,
  Star,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock,
} from 'lucide-react';
import Avatar from '@/components/Avatar';

const categories = [
  { icon: Code, label: 'Web Development', desc: 'React, Next.js, APIs & Full-stack', color: 'from-blue-500 to-indigo-600', link: 'web-development' },
  { icon: Palette, label: 'UI/UX Design', desc: 'Figma prototypes, mobile UX, design systems', color: 'from-pink-500 to-rose-600', link: 'ui-ux-design' },
  { icon: Video, label: 'Video Editing', desc: 'YouTube reels, 4K documentary, animations', color: 'from-purple-500 to-violet-600', link: 'video-editing' },
  { icon: PenTool, label: 'Technical Writing', desc: 'Research papers, thesis, case studies', color: 'from-emerald-500 to-teal-600', link: 'content-writing' },
  { icon: BookOpen, label: 'Peer Tutoring', desc: 'DSA, discrete math, calculus & AI', color: 'from-amber-500 to-orange-600', link: 'tutoring' },
  { icon: Megaphone, label: 'Presentations', desc: 'Pitch decks, academic slides, infographics', color: 'from-red-500 to-pink-600', link: 'presentation' },
  { icon: Camera, label: 'Data Analytics', desc: 'Python, Pandas, ML models, dashboards', color: 'from-cyan-500 to-blue-600', link: 'data-analysis' },
  { icon: Rocket, label: 'Campus Hackathons', desc: 'Find teammates, build MVP prototypes', color: 'from-indigo-500 to-purple-600', link: 'mobile-development' },
];

const universities = [
  'IIT Delhi',
  'BITS Pilani',
  'IIT Bombay',
  'Delhi University',
  'IIT Madras',
  'NIT Warangal',
  'SRCC Delhi',
  'Jadavpur University',
];

const testimonials = [
  {
    name: 'Aarav Sharma',
    university: 'IIT Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Full-Stack Developer',
    earned: '₹48,000 earned',
    quote:
      'OnCampus allowed me to work on real client projects right from my hostel room without having to compete with agencies on global platforms.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    university: 'BITS Pilani',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'UI/UX Designer',
    earned: '14 services delivered',
    quote:
      'I found three hackathon teammates and landed two paid design consulting jobs for faculty research startups within my first month!',
    rating: 5,
  },
  {
    name: 'Rohan Gupta',
    university: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Flutter Developer',
    earned: '₹35,000 earned',
    quote:
      'The milestone-based order workspace makes collaboration straightforward. You get paid fairly and build a verified portfolio.',
    rating: 5,
  },
];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 mesh-gradient-bg">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-brand-200/80 shadow-xs backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping" />
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                  The Premier Student Talent Network
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-surface-900 tracking-tight leading-[1.1]">
                Your Campus.{' '}
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Your Skills.
                </span>
                <br />
                Your Opportunities.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-surface-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect with verified student peers for websites, UI/UX, video editing, and project collaborations.
                Transform your academic know-how into paid contracts and build a real portfolio.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Start Freelancing Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/80 hover:bg-white text-surface-800 font-bold rounded-2xl border border-surface-200 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Browse Student Talent</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-surface-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>College Verified Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Transparent Peer Ratings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Direct Milestone Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Glass Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-surface-200/80 shadow-2xl p-6 relative overflow-hidden animate-float">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        AS
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-surface-900">Aarav Sharma</h4>
                          <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px] font-extrabold uppercase">
                            IIT Delhi
                          </span>
                        </div>
                        <p className="text-xs text-surface-500">MERN Stack Web Developer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-800 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="p-3 bg-surface-50 rounded-2xl border border-surface-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 block mb-1">
                        Active Order Delivery
                      </span>
                      <p className="text-xs font-semibold text-surface-800">
                        "Full-Stack E-Commerce Portal for Campus Tech Fest"
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-surface-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-600" /> Due in 2 days
                        </span>
                        <span className="font-bold text-emerald-600">₹3,500.00</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Next.js', 'Tailwind', 'MongoDB'].map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-[11px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-100 flex items-center justify-between">
                    <span className="text-xs text-surface-400">Status: <span className="text-emerald-600 font-bold">In Progress</span></span>
                    <button className="px-3.5 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs">
                      View Deliverables
                    </button>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-surface-200/90 shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-surface-900">Order Approved</p>
                    <p className="text-[10px] text-surface-400">+₹2,500 transferred</p>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-5 -right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-surface-200/90 shadow-xl flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-surface-900">New Teammate Joined</p>
                    <p className="text-[10px] text-surface-400">Smart Mobility Hackathon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERSITIES MARQUEE BANNER */}
      <section className="py-8 bg-white border-y border-surface-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-surface-400 mb-5">
            Empowering students from leading institutions across the country
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {universities.map((uni, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-surface-50 hover:bg-surface-100 rounded-full text-xs font-semibold text-surface-700 border border-surface-200/60 transition-colors"
              >
                {uni}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-20 sm:py-28 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Explore Talent
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
                Campus Skill Categories
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors"
            >
              <span>Explore all 12 specializations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/services?category=${cat.link}`}
                  className="group bg-white rounded-2xl border border-surface-200/80 p-5 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 shadow-sm transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-surface-900 text-base mb-1 group-hover:text-brand-600 transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-surface-500 leading-relaxed mb-4">{cat.desc}</p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                    <span>Browse providers</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
              How OnCampus Works
            </h2>
            <p className="mt-3 text-sm text-surface-600">
              From discovering opportunities to receiving milestone deliveries and getting paid securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface-50 rounded-3xl border border-surface-200/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-glow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">Publish Your Offerings</h3>
              <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                Showcase your past GitHub repos, Figma prototypes, or video reels. Define your delivery timeline and pricing.
              </p>
            </div>

            <div className="p-8 bg-surface-50 rounded-3xl border border-surface-200/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-glow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">Collaborate in Order Rooms</h3>
              <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                Receive client orders with project specifications. Exchange files, track milestones, and share draft updates directly.
              </p>
            </div>

            <div className="p-8 bg-surface-50 rounded-3xl border border-surface-200/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg mb-6 shadow-glow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">Build Campus Reputation</h3>
              <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                Receive verified 5-star student testimonials, build an undeniable freelance portfolio, and get discovered by top campus teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="py-20 sm:py-28 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Real Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">
              Stories from Student Creators
            </h2>
            <p className="mt-3 text-sm text-surface-600">
              Here is how students are turning university knowledge into income and real experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-surface-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-surface-700 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                  <Avatar src={t.avatar} name={t.name} size="md" />
                  <div>
                    <h4 className="font-bold text-sm text-surface-900">{t.name}</h4>
                    <p className="text-xs text-brand-700 font-semibold">{t.university}</p>
                    <span className="text-[11px] text-surface-400">{t.earned}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 relative bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-brand-200 backdrop-blur-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to turn your skills into campus opportunities?
          </h2>
          <p className="text-base text-brand-100 max-w-xl mx-auto leading-relaxed">
            Create your free student account in 60 seconds. Connect with student peers and start offering your services today.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl shadow-xl hover:bg-brand-50 hover:scale-105 transition-all duration-300"
            >
              <span>Join OnCampus Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
