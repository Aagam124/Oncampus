import { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  Plus,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import useNotificationStore from '@/store/notificationStore';
import Avatar from '@/components/Avatar';
import ThemeToggle from '@/components/ThemeToggle';

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
    `relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
      isActive
        ? 'text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/60 shadow-xs'
        : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/60 dark:hover:bg-surface-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/70 dark:border-surface-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-surface-900 dark:text-white leading-none">
                On<span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Campus</span>
              </span>
              <span className="text-[10px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-widest mt-0.5">
                Student Network
              </span>
            </div>
          </Link>

          {/* Quick Search on Desktop */}
          <form onSubmit={handleQuickSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500" />
              <input
                type="text"
                placeholder="Search skills, projects, freelancers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-100/70 dark:bg-surface-900/80 hover:bg-surface-100 dark:hover:bg-surface-800 focus:bg-white dark:focus:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 dark:placeholder:text-surface-500 text-xs rounded-full border border-surface-200/80 dark:border-surface-800 focus:border-brand-500 dark:focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/services" className={activeLinkClass}>
              Explore Services
            </NavLink>
            <NavLink to="/projects" className={activeLinkClass}>
              Collaborations
            </NavLink>
          </nav>

          {/* Desktop Auth & CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Post action */}
                <Link
                  to="/services/new"
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/70 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Offer Skill</span>
                </Link>

                {/* Notifications Link */}
                <Link
                  to="/messages"
                  className="relative p-2.5 text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors"
                  aria-label="Messages & Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute 1 top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 border border-surface-200/60 dark:border-surface-800 transition-colors"
                    aria-label="User menu"
                  >
                    <Avatar src={user?.avatar} name={userName} size="sm" />
                    <span className="text-xs font-semibold text-surface-800 dark:text-surface-200 max-w-[100px] truncate pl-1">
                      {user?.firstName || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-surface-400 dark:text-surface-500 pr-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 glass-dropdown rounded-2xl p-2 animate-in fade-in slide-in-from-top-2 z-50">
                      <div className="px-3.5 py-3 border-b border-surface-100 dark:border-surface-800">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={user?.avatar} name={userName} size="md" />
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{userName}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
                            {user?.university && (
                              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold truncate mt-0.5">{user.university}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="py-1.5 space-y-0.5 text-xs">
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
                        <div className="py-1 border-t border-surface-100 dark:border-surface-800">
                          <DropdownLink to="/admin" icon={Shield} onClick={() => setDropdownOpen(false)}>
                            Admin Control Center
                          </DropdownLink>
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-surface-100 dark:border-surface-800">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
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
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-surface-700 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-bold rounded-full shadow-glow-sm hover:shadow-glow transition-all duration-300"
                >
                  Join Campus
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 sm:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-surface-900 z-50 shadow-2xl sm:hidden overflow-y-auto flex flex-col p-5 border-l border-surface-200 dark:border-surface-800">
            <div className="flex items-center justify-between pb-4 border-b border-surface-200 dark:border-surface-800">
              <span className="font-extrabold text-surface-900 dark:text-white text-base">Navigation</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl text-surface-500 dark:text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick search on mobile */}
            <form onSubmit={(e) => { handleQuickSearch(e); setMobileOpen(false); }} className="pt-4">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search services, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 text-xs rounded-xl border border-surface-200 dark:border-surface-700 outline-none"
                />
              </div>
            </form>

            <nav className="py-4 space-y-1">
              <NavLink
                to="/services"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
              >
                Explore Services
              </NavLink>
              <NavLink
                to="/projects"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
              >
                Collaborations
              </NavLink>
            </nav>

            {/* Appearance switch in drawer */}
            <div className="py-3 px-4 bg-surface-50 dark:bg-surface-800/60 rounded-2xl flex items-center justify-between mb-4 border border-surface-200/50 dark:border-surface-700/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-surface-800 dark:text-surface-200">Appearance</span>
                <span className="text-[10px] text-surface-400 dark:text-surface-500">Dark / Light mode</span>
              </div>
              <ThemeToggle variant="switch" />
            </div>

            {isAuthenticated ? (
              <div className="pt-4 border-t border-surface-200 dark:border-surface-800 space-y-1 mt-auto">
                <div className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800/80 rounded-2xl mb-3">
                  <Avatar src={user?.avatar} name={userName} size="md" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-surface-900 dark:text-white truncate">{userName}</p>
                    <p className="text-[11px] text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
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
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-surface-200 dark:border-surface-800 space-y-2.5 mt-auto">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2.5 text-xs font-bold text-surface-800 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Sign Up Free
                </Link>
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
      className="flex items-center gap-2.5 px-3 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100/70 dark:hover:bg-surface-800 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors font-medium"
    >
      <Icon className="w-4 h-4 text-surface-400 dark:text-surface-500 group-hover:text-brand-500" />
      <span>{children}</span>
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2.5 rounded-xl text-xs font-semibold text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
    >
      {children}
    </Link>
  );
}
