import { Link } from 'react-router-dom';
import { GraduationCap, Github, Linkedin, Twitter, Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-surface-100">
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-glow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-surface-900">
                On<span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Campus</span>
              </span>
            </Link>

            <p className="text-xs text-surface-500 leading-relaxed max-w-sm">
              The premier student freelancing marketplace and peer collaboration network. Connecting university talent with high-impact projects, hackathons, and clients.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 text-surface-600 hover:text-surface-900 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 text-surface-600 hover:text-brand-600 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 text-surface-600 hover:text-sky-500 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-surface-600 font-medium">
              <li>
                <Link to="/services" className="hover:text-brand-600 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/services?category=web-development" className="hover:text-brand-600 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services?category=ui-ux-design" className="hover:text-brand-600 transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/services?category=video-editing" className="hover:text-brand-600 transition-colors">
                  Video Editing
                </Link>
              </li>
              <li>
                <Link to="/services?category=tutoring" className="hover:text-brand-600 transition-colors">
                  Peer Tutoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Collaborations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900">
              Teammates & Projects
            </h4>
            <ul className="space-y-2 text-xs text-surface-600 font-medium">
              <li>
                <Link to="/projects" className="hover:text-brand-600 transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/projects/new" className="hover:text-brand-600 transition-colors">
                  Post a Teammate Search
                </Link>
              </li>
              <li>
                <Link to="/projects?type=collaboration" className="hover:text-brand-600 transition-colors">
                  Hackathon Teams
                </Link>
              </li>
              <li>
                <Link to="/projects?type=hiring" className="hover:text-brand-600 transition-colors">
                  Student Hiring Gigs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Student Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-900">
              Campus Platform
            </h4>
            <ul className="space-y-2 text-xs text-surface-600 font-medium">
              <li>
                <Link to="/register" className="hover:text-brand-600 transition-colors">
                  Join as Student
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-600 transition-colors">
                  Order Deliveries
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span>Version 2.0 Pro</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-400">
          <p>© {new Date().getFullYear()} OnCampus. Built for student creators.</p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-surface-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-surface-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-surface-600 transition-colors">
              Campus Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
