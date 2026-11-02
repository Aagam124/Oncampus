import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  Bell,
  ChevronDown,
  LayoutDashboard,
  User,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Search,
  Plus,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useNotificationStore from '@/store/notificationStore';
import Avatar from '@/components/Avatar';
import ThemeToggle from '@/components/ThemeToggle';
import Button from '@/components/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`
    : user?.name || 'User';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const activeLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-full text-sm font-semibold tracking-tight transition-all duration-150 ${
      isActive
        ? 'text-[#0071e3] bg-[#0071e3]/10 dark:bg-[#0071e3]/20 shadow-xs'
        : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/90 dark:bg-[#0c0c0e]/90 backdrop-blur-2xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#0071e3] to-[#34c759] rounded-xl flex items-center justify-center shadow-soft-blue-glow group-hover:scale-105 transition-all duration-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#1d1d1f] dark:text-white leading-none">
                On<span className="bg-gradient-to-r from-[#0071e3] to-[#34c759] bg-clip-text text-transparent">Campus</span>
              </span>
              <span className="text-[9px] font-bold text-[#86868b] dark:text-[#6e6e73] uppercase tracking-widest mt-0.5">
                Student Network
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <NavLink to="/projects" className={activeLinkClass}>
              Projects
            </NavLink>
            <NavLink to="/services" className={activeLinkClass}>
              Services
            </NavLink>
            <NavLink to="/services" className={activeLinkClass}>
              Students
            </NavLink>
            <a
              href="/#how-it-works"
              className="relative px-4 py-2 rounded-full text-sm font-semibold tracking-tight text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all duration-150"
            >
              How It Works
            </a>
          </nav>

          {/* Right Desktop Auth & Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Search */}
            <form onSubmit={handleQuickSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="text"
                  placeholder="Search campus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-36 focus:w-56 pl-8 pr-3 py-1.5 bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] text-xs rounded-full border border-black/[0.06] dark:border-white/[0.08] focus:border-[#0071e3] focus:bg-white dark:focus:bg-[#161617] focus:ring-2 focus:ring-[#0071e3]/15 outline-none transition-all duration-300"
                />
              </div>
            </form>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Post action */}
                <Button
                  to="/services/new"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  className="hidden md:inline-flex"
                >
                  Offer Skill
                </Button>

                {/* Notifications Link */}
                <Link
                  to="/messages"
                  className="relative p-2.5 text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-full transition-colors"
                  aria-label="Messages & Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff3b30] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.1] transition-colors"
                    aria-label="User menu"
                  >
                    <Avatar src={user?.avatar} name={userName} size="sm" />
                    <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] max-w-[100px] truncate pl-1">
                      {user?.firstName || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#86868b] pr-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 glass-dropdown rounded-3xl p-2.5 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-3.5 py-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={user?.avatar} name={userName} size="md" />
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-[#1d1d1f] dark:text-white truncate">{userName}</p>
                            <p className="text-xs text-[#86868b] truncate">{user?.email}</p>
                            {user?.university && (
                              <p className="text-[10px] text-[#0071e3] font-semibold truncate mt-0.5">{user.university}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="py-2 space-y-0.5 text-xs">
                        <DropdownLink to="/dashboard" icon={LayoutDashboard} onClick={() => setDropdownOpen(false)}>
                          Student Dashboard
                        </DropdownLink>
                        <DropdownLink to={`/users/${user?._id || user?.id}`} icon={User} onClick={() => setDropdownOpen(false)}>
                          Public Portfolio
                        </DropdownLink>
                        <DropdownLink to="/orders" icon={ShoppingBag} onClick={() => setDropdownOpen(false)}>
                          Orders & Deliveries
                        </DropdownLink>
                        <DropdownLink to="/messages" icon={MessageSquare} onClick={() => setDropdownOpen(false)}>
                          Messages & Chat
                        </DropdownLink>
                        <DropdownLink to="/profile/edit" icon={Settings} onClick={() => setDropdownOpen(false)}>
                          Account Settings
                        </DropdownLink>
                      </div>

                      {user?.role === 'admin' && (
                        <div className="py-1.5 border-t border-black/[0.06] dark:border-white/[0.08]">
                          <DropdownLink to="/admin" icon={Shield} onClick={() => setDropdownOpen(false)}>
                            Admin Control Center
                          </DropdownLink>
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-black/[0.06] dark:border-white/[0.08]">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm">
                  Log In
                </Button>
                <Button to="/register" variant="primary" size="sm">
                  Join OnCampus
                </Button>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-2xl z-50 shadow-2xl sm:hidden overflow-y-auto flex flex-col p-5 border-l border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="font-bold text-[#1d1d1f] dark:text-white text-base">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-xl text-[#86868b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick search on mobile */}
            <form onSubmit={(e) => { handleQuickSearch(e); setMobileOpen(false); }} className="pt-4">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="text"
                  placeholder="Search services, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] text-xs rounded-xl border border-black/[0.06] dark:border-white/[0.08] outline-none"
                />
              </div>
            </form>

            <nav className="py-4 space-y-1">
              <NavLink
                to="/projects"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                Projects
              </NavLink>
              <NavLink
                to="/services"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                Services
              </NavLink>
              <NavLink
                to="/services"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                Students
              </NavLink>
              <a
                href="/#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                How It Works
              </a>
            </nav>

            {/* Appearance switch in drawer */}
            <div className="py-3 px-4 bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl flex items-center justify-between mb-4 border border-black/[0.04] dark:border-white/[0.06]">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Appearance</span>
                <span className="text-[10px] text-[#86868b]">Dark / Light mode</span>
              </div>
              <ThemeToggle variant="switch" />
            </div>

            {isAuthenticated ? (
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-1 mt-auto">
                <div className="flex items-center gap-3 p-3 bg-[#f5f5f7] dark:bg-[#1c1c1e] rounded-2xl mb-3">
                  <Avatar src={user?.avatar} name={userName} size="md" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#1d1d1f] dark:text-white truncate">{userName}</p>
                    <p className="text-[11px] text-[#86868b] truncate">{user?.email}</p>
                  </div>
                </div>
                <MobileLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                <MobileLink to={`/users/${user?._id || user?.id}`} onClick={() => setMobileOpen(false)}>My Profile</MobileLink>
                <MobileLink to="/orders" onClick={() => setMobileOpen(false)}>My Orders</MobileLink>
                <MobileLink to="/messages" onClick={() => setMobileOpen(false)}>Messages</MobileLink>
                <MobileLink to="/profile/edit" onClick={() => setMobileOpen(false)}>Settings</MobileLink>
                {user?.role === 'admin' && (
                  <MobileLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</MobileLink>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5 mt-auto">
                <Button to="/login" variant="secondary" size="md" fullWidth onClick={() => setMobileOpen(false)}>
                  Log In
                </Button>
                <Button to="/register" variant="primary" size="md" fullWidth onClick={() => setMobileOpen(false)}>
                  Sign Up Free
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}

function DropdownLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-[#424245] dark:text-[#d2d2d7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#0071e3] dark:hover:text-[#38a5f6] rounded-xl transition-colors font-medium"
    >
      <Icon className="w-4 h-4 text-[#86868b] group-hover:text-[#0071e3]" />
      <span>{children}</span>
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
    >
      {children}
    </Link>
  );
}
