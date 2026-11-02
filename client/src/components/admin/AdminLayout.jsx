import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShieldCheck,
  UserX,
  Briefcase,
  Layers,
  ShoppingBag,
  Scale,
  Globe2,
  AlertTriangle,
  Archive,
  Megaphone,
  Bell,
  Activity,
  ShieldAlert,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  LogOut,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';
import Avatar from '@/components/Avatar';
import api from '@/lib/axios';

const NAV_SECTIONS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      { label: 'All Students', path: '/admin/users', icon: Users },
      { label: 'Student Verification', path: '/admin/verification', icon: ShieldCheck, badgeKey: 'verifications' },
      { label: 'Suspended Accounts', path: '/admin/suspended', icon: UserX },
    ],
  },
  {
    title: 'MARKETPLACE MANAGEMENT',
    items: [
      { label: 'Projects', path: '/admin/projects', icon: Layers },
      { label: 'Services', path: '/admin/services', icon: Briefcase },
      { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
      { label: 'Disputes', path: '/admin/disputes', icon: Scale, badgeKey: 'disputes' },
    ],
  },
  {
    title: 'CONTENT CONTROL',
    items: [
      { label: 'Portal Management', path: '/admin/portal', icon: Globe2, highlight: true },
      { label: 'Reported Content', path: '/admin/reports', icon: AlertTriangle, badgeKey: 'reports' },
      { label: 'Archived Content', path: '/admin/archived', icon: Archive },
    ],
  },
  {
    title: 'PLATFORM MANAGEMENT',
    items: [
      { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'Platform Health', path: '/admin/health', icon: Activity },
    ],
  },
  {
    title: 'SECURITY',
    items: [
      { label: 'Admin Roles & Permissions', path: '/admin/roles', icon: ShieldAlert },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
      { label: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState({ verifications: 0, reports: 0, disputes: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fetch pending counts for badges
  useEffect(() => {
    const fetchBadgeCounts = async () => {
      try {
        const res = await api.get('/admin/stats');
        const d = res.data?.data || {};
        setBadgeCounts({
          verifications: d.pendingVerifications || 0,
          reports: d.unresolvedReports || 0,
          disputes: d.openDisputes || 0,
        });
      } catch (err) {
        // Silently handle
      }
    };
    fetchBadgeCounts();
  }, [location.pathname]);

  // Compute breadcrumb info
  const getBreadcrumbs = () => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (location.pathname === item.path) {
          return { section: section.title, current: item.label };
        }
      }
    }
    return { section: 'ADMINISTRATION', current: 'Command Center' };
  };

  const breadcrumbs = getBreadcrumbs();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/users?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090a0f] text-[#0f172a] dark:text-[#f1f5f9] flex transition-colors duration-200">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Persistent Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          bg-white/95 dark:bg-[#0e131f]/95 backdrop-blur-xl
          border-r border-black/[0.06] dark:border-white/[0.08]
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-black/[0.05] dark:border-white/[0.06]">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#34c759] flex items-center justify-center text-white shadow-soft-blue-glow flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-[#0f172a] dark:text-white leading-tight">
                  On<span className="text-[#0071e3]">Campus</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                  Admin Center
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#64748b] hover:text-[#0f172a] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Close Button (Mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#64748b] hover:bg-black/[0.04]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {NAV_SECTIONS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-[#94a3b8] dark:text-[#64748b] uppercase">
                  {section.title}
                </div>
              )}
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                const badgeValue = item.badgeKey ? badgeCounts[item.badgeKey] : 0;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => `
                      group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-150
                      ${
                        isActive
                          ? 'bg-[#0071e3] text-white shadow-soft-blue-glow'
                          : item.highlight
                          ? 'text-[#0071e3] dark:text-[#38bdf8] bg-[#0071e3]/8 dark:bg-[#0071e3]/15 hover:bg-[#0071e3]/15'
                          : 'text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                      }
                      ${collapsed ? 'justify-center px-2' : ''}
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                    {!collapsed && badgeValue > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444] text-white">
                        {badgeValue}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Quick Link to Public Portal */}
        <div className="p-3 border-t border-black/[0.05] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] hover:text-[#0071e3] dark:hover:text-[#38bdf8] hover:bg-white dark:hover:bg-[#161f30] border border-transparent hover:border-black/[0.05] transition-all
              ${collapsed ? 'justify-center px-2' : ''}
            `}
            title="Open Student Portal"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>View Student Portal</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Command Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0e131f]/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#64748b] hover:bg-black/[0.04]"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#64748b] dark:text-[#94a3b8]">
              <span className="uppercase text-[10px] tracking-wider font-bold text-[#94a3b8] dark:text-[#64748b]">
                {breadcrumbs.section}
              </span>
              <span>/</span>
              <span className="font-bold text-[#0f172a] dark:text-white">
                {breadcrumbs.current}
              </span>
            </div>
          </div>

          {/* Center: Search Trigger */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, services, projects (Press Enter)..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#f1f5f9] dark:bg-[#161f30] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#0f172a] dark:text-[#f1f5f9] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#111827] focus:ring-2 focus:ring-[#0071e3]/15 transition-all"
              />
            </form>
          </div>

          {/* Right: Controls, Notifications & Admin Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick Action: Needs Attention Pill */}
            {(badgeCounts.reports > 0 || badgeCounts.verifications > 0) && (
              <Link
                to="/admin/reports"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ef4444]/10 text-[#ef4444] text-xs font-bold border border-[#ef4444]/20 hover:bg-[#ef4444]/20 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                <span>{badgeCounts.reports + badgeCounts.verifications} Action Required</span>
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              >
                <Avatar
                  src={user?.avatar}
                  name={`${user?.firstName || 'Admin'} ${user?.lastName || ''}`}
                  size="sm"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#0f172a] dark:text-white leading-tight">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-[10px] font-semibold text-[#0071e3] uppercase">
                    {user?.adminRole === 'super_admin' ? 'Super Admin' : user?.adminRole || 'Administrator'}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <>
                  <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-30" />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#161f30] border border-black/[0.08] dark:border-white/[0.1] shadow-apple-modal py-2 z-40 text-xs font-medium animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-black/[0.05] dark:border-white/[0.06]">
                      <p className="font-bold text-[#0f172a] dark:text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[#64748b] truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0071e3]/10 text-[#0071e3]">
                        {user?.adminRole === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </span>
                    </div>

                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#475569] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Security Settings</span>
                    </Link>
                    <Link
                      to="/admin/audit-logs"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-[#475569] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Audit Trail</span>
                    </Link>

                    <div className="my-1 border-t border-black/[0.05] dark:border-white/[0.06]" />

                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
