import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code,
  Palette,
  Video,
  PenTool,
  BookOpen,
  Briefcase,
  Users,
  Star,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  DollarSign,
} from 'lucide-react';
import Button from '@/components/Button';

const categories = [
  { icon: Code, label: 'Web & App Development', desc: 'React, Next.js, Node.js & Full-stack projects', tag: 'High Demand', link: 'web-development', count: '18 Active' },
  { icon: Palette, label: 'UI/UX & Product Design', desc: 'Figma prototypes, design systems & mobile apps', tag: 'Trending', link: 'ui-ux-design', count: '12 Active' },
  { icon: Video, label: 'Video & Motion Design', desc: 'YouTube edits, 4K reels & After Effects', tag: 'Popular', link: 'video-editing', count: '8 Active' },
  { icon: PenTool, label: 'Technical Writing', desc: 'Research papers, thesis review & blogs', tag: 'Academic', link: 'content-writing', count: '9 Active' },
  { icon: BookOpen, label: 'Peer Tutoring', desc: 'DSA, machine learning, calculus & AI mentoring', tag: 'Verified', link: 'tutoring', count: '15 Tutors' },
  { icon: Briefcase, label: 'Startup Pitch & Growth', desc: 'Investor decks, market research & analytics', tag: 'New', link: 'data-analysis', count: '6 Active' },
];

const featuredProjects = [
  {
    title: 'AI Study Companion & Notes Summarizer',
    client: 'Aditya Verma',
    university: 'IIT Bombay',
    category: 'Web Development',
    budget: '₹4,500 - ₹8,000',
    type: 'Paid Gig',
    collaborators: '1/3 filled',
    skills: ['React', 'Python', 'OpenAI', 'Tailwind'],
    deadline: 'Due in 5 days',
    link: '/projects',
  },
  {
    title: 'Brand Identity & Mobile UI for Campus Fest 2026',
    client: 'Ananya Roy',
    university: 'BITS Pilani',
    category: 'UI/UX Design',
    budget: '₹6,000',
    type: 'Paid Gig',
    collaborators: '2/4 filled',
    skills: ['Figma', 'Prototyping', 'Illustration'],
    deadline: 'Due in 1 week',
    link: '/projects',
  },
  {
    title: 'Autonomous Rover Telemetry Dashboard',
    client: 'Kavya Nair',
    university: 'IIT Madras',
    category: 'Collaboration',
    budget: 'Hackathon Prize Split',
    type: 'Collaboration',
    collaborators: '3/5 filled',
    skills: ['Next.js', 'WebSockets', 'Chart.js', 'ROS'],
    deadline: 'Hackathon Track',
    link: '/projects',
  },
];

const studentShowcase = [
  {
    name: 'Aarav Sharma',
    university: 'IIT Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Full-Stack Developer',
    earned: '₹54,000 earned',
    projectsCompleted: 18,
    rating: 4.9,
    quote:
      'OnCampus allowed me to work on real client projects right from my hostel room without having to compete with agencies on global platforms.',
    tags: ['React', 'Node.js', 'Next.js', 'MongoDB'],
  },
  {
    name: 'Priya Patel',
    university: 'BITS Pilani',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'UI/UX Designer',
    earned: '14 services delivered',
    projectsCompleted: 14,
    rating: 5.0,
    quote:
      'I found three hackathon teammates and landed two paid design consulting jobs for faculty research startups within my first month!',
    tags: ['Figma', 'Design Systems', 'Mobile UX'],
  },
  {
    name: 'Rohan Gupta',
    university: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Flutter Developer',
    earned: '₹38,000 earned',
    projectsCompleted: 11,
    rating: 4.9,
    quote:
      'The milestone-based order workspace makes collaboration straightforward. You get paid fairly and build a verified portfolio.',
    tags: ['Flutter', 'Firebase', 'State Management'],
  },
];

export default function Landing() {
  return (
    <div className="relative overflow-hidden bg-[#faf9f6] dark:bg-[#0c0c0e] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] mesh-gradient-bg pointer-events-none opacity-45 dark:opacity-25" />

      {/* 1. HERO STAGE (Optically Balanced & Framed) */}
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 dark:bg-[#161617]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.1] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              The Premier Student Talent & Collaboration Network
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-[1.12] max-w-3xl mx-auto">
            Your Campus. Your Talent.{' '}
            <span className="bg-gradient-to-r from-[#0071e3] via-[#0284c7] to-[#34c759] bg-clip-text text-transparent">
              Real Opportunities.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#a1a1a6] max-w-xl mx-auto leading-relaxed">
            Discover meaningful projects, collaborate with talented students, and build a portfolio that takes you beyond the classroom.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/projects"
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto shadow-soft-blue-glow font-semibold"
            >
              Explore Projects
            </Button>

            <Button
              href="#how-it-works"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto border border-black/[0.08] dark:border-white/[0.1]"
            >
              How It Works
            </Button>
          </div>

          {/* Metrics Pill Strip (High-value density) */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#161617]/80 border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" />
              <span>1,200+ Verified Students</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#161617]/80 border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>450+ Projects Completed</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#161617]/80 border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              <span>₹18L+ Earned by Students</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-[#161617]/80 border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8b5cf6]" />
              <span>Milestone Escrow Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW ONCAMPUS WORKS (Bento Grid) */}
      <section id="how-it-works" className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-widest">
            How OnCampus Works
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
            Designed for Student Creators & Founders
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6]">
            Three straightforward steps to collaborate, earn, and build a verified career profile while still in college.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              step: '01',
              title: 'Discover or Offer Skills',
              desc: 'Browse student offerings in web development, design, editing, and tutoring, or publish your own specialized skills.',
              color: 'text-[#0071e3]',
              bg: 'bg-[#0071e3]/10',
              icon: Zap,
            },
            {
              step: '02',
              title: 'Collaborate with Milestones',
              desc: 'Work directly inside project workspaces with real-time chat, requirement milestones, and safe tracking from start to finish.',
              color: 'text-[#34c759]',
              bg: 'bg-[#34c759]/10',
              icon: Users,
            },
            {
              step: '03',
              title: 'Build Verified Portfolios',
              desc: 'Turn completed gigs into verifiable student case studies that faculty and top recruiters can review with genuine peer feedback.',
              color: 'text-[#8b5cf6]',
              bg: 'bg-[#8b5cf6]/10',
              icon: Sparkles,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="
                  bg-white dark:bg-[#161617] rounded-2xl p-5 sm:p-6
                  border border-black/[0.08] dark:border-white/[0.1]
                  shadow-apple-card hover:shadow-apple-card-hover hover:-translate-y-0.5
                  transition-all duration-200 flex flex-col justify-between
                "
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-black text-[#86868b]/30 dark:text-white/20">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CAMPUS DISCIPLINES (Contrasting Band for Optical Balance) */}
      <section className="py-8 sm:py-12 bg-white/70 dark:bg-[#121214]/70 border-y border-black/[0.05] dark:border-white/[0.06] backdrop-blur-xl transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
            <div>
              <span className="text-[11px] font-bold text-[#34c759] uppercase tracking-widest">
                Marketplace Categories
              </span>
              <h2 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
                Explore Campus Disciplines
              </h2>
            </div>
            <Button to="/services" variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              Browse All Services
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <Link
                  key={i}
                  to={`/services?category=${c.link}`}
                  className="
                    group p-4 rounded-xl bg-white dark:bg-[#161617]
                    border border-black/[0.08] dark:border-white/[0.1]
                    shadow-apple-card hover:shadow-apple-card-hover hover:border-[#0071e3]/40
                    hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between
                  "
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#424245] dark:text-[#d2d2d7] border border-black/[0.04]">
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] transition-colors">
                      {c.label}
                    </h3>
                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#0071e3]">
                    <span className="text-[11px] text-[#86868b]">{c.count}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Explore talent <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. OPEN COLLABORATIONS & GIGS */}
      <section className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
          <div>
            <span className="text-[11px] font-bold text-[#0071e3] uppercase tracking-widest">
              Live Opportunities
            </span>
            <h2 className="mt-0.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
              Open Collaborations & Gigs
            </h2>
          </div>
          <Button to="/projects" variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
            View All Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {featuredProjects.map((p, idx) => (
            <div
              key={idx}
              className="
                bg-white dark:bg-[#161617] rounded-2xl p-5
                border border-black/[0.08] dark:border-white/[0.1]
                shadow-apple-card hover:shadow-apple-card-hover hover:-translate-y-0.5
                transition-all duration-200 flex flex-col justify-between
              "
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wide">
                    {p.university}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
                    {p.type}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white mb-2 leading-snug">
                  {p.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#424245] dark:text-[#d2d2d7]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#86868b] block">Budget / Split</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white">{p.budget}</span>
                </div>
                <Button to={p.link} variant="primary" size="xs" icon={ArrowRight} iconPosition="right">
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. STUDENT PORTFOLIO SHOWCASE */}
      <section className="py-8 sm:py-12 bg-white/70 dark:bg-[#121214]/70 border-t border-black/[0.05] dark:border-white/[0.06] backdrop-blur-xl transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-bold text-[#8b5cf6] uppercase tracking-widest">
              Student Success Stories
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
              Trusted by Ambitious Campus Builders
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6]">
              Real student case studies from premier universities across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {studentShowcase.map((s, idx) => (
              <div
                key={idx}
                className="
                  bg-white dark:bg-[#161617] rounded-2xl p-5
                  border border-black/[0.08] dark:border-white/[0.1]
                  shadow-apple-card flex flex-col justify-between
                "
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0071e3]/20"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1d1d1f] dark:text-white">
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-[#0071e3] font-semibold">
                        {s.role} • {s.university}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed italic mb-3">
                    "{s.quote}"
                  </p>
                </div>

                <div className="pt-2.5 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-[#34c759]">{s.earned}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{s.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION (Apple Card) */}
      <section className="py-10 sm:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#1d1d1f] via-[#242426] to-[#1d1d1f] text-white p-8 sm:p-12 text-center shadow-apple-modal">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071e3]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#34c759]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="text-[11px] font-bold text-[#34c759] uppercase tracking-widest">
              Ready to collaborate?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Start Building Your Campus Career Today
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
              Join thousands of student developers, designers, and campus founders turning college skills into real verified portfolios.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                to="/register"
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto font-semibold shadow-soft-blue-glow"
              >
                Join OnCampus Now
              </Button>
              <Button
                to="/projects"
                variant="outline"
                size="md"
                className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
              >
                Browse All Gigs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-[#0c0c0e]/50 py-8 text-xs text-[#86868b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1d1d1f] dark:text-white">OnCampus</span>
            <span>• The Premier Student Talent & Collaboration Network</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link to="/projects" className="hover:text-[#1d1d1f] dark:hover:text-white">Projects</Link>
            <Link to="/services" className="hover:text-[#1d1d1f] dark:hover:text-white">Services</Link>
            <a href="#how-it-works" className="hover:text-[#1d1d1f] dark:hover:text-white">How It Works</a>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#34c759]/10 text-[#34c759] text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
