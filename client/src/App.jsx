import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useNotificationStore from '@/store/notificationStore';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Student Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ServiceBrowse from '@/pages/ServiceBrowse';
import ServiceCreate from '@/pages/ServiceCreate';
import ServiceDetail from '@/pages/ServiceDetail';
import ServiceEdit from '@/pages/ServiceEdit';
import ProjectBrowse from '@/pages/ProjectBrowse';
import ProjectCreate from '@/pages/ProjectCreate';
import ProjectDetail from '@/pages/ProjectDetail';
import PublicProfile from '@/pages/PublicProfile';
import ProfileEdit from '@/pages/ProfileEdit';
import OrderList from '@/pages/OrderList';
import OrderDetail from '@/pages/OrderDetail';
import Messages from '@/pages/Messages';

// Admin Command Center Pages & Layout
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminVerification from '@/pages/admin/AdminVerification';
import AdminSuspended from '@/pages/admin/AdminSuspended';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminServices from '@/pages/admin/AdminServices';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminDisputes from '@/pages/admin/AdminDisputes';
import AdminPortal from '@/pages/admin/AdminPortal';
import AdminReports from '@/pages/admin/AdminReports';
import AdminArchived from '@/pages/admin/AdminArchived';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminHealth from '@/pages/admin/AdminHealth';
import AdminRoles from '@/pages/admin/AdminRoles';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';
import AdminSettings from '@/pages/admin/AdminSettings';

// Public & Student Layout wrapper
function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] dark:bg-[#0c0c0e] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200 overflow-x-hidden">
      <Navbar />
      <main key={location.pathname} className="flex-1 animate-page-enter">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const { fetchUser, isAuthenticated } = useAuthStore();
  const { fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  return (
    <ToastProvider>
      <ErrorBoundary>
        <Routes>
        {/* Admin Command Center (Dedicated Persistent SaaS Layout) */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/verification" element={<AdminVerification />} />
            <Route path="/admin/suspended" element={<AdminSuspended />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/disputes" element={<AdminDisputes />} />
            <Route path="/admin/portal" element={<AdminPortal />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/archived" element={<AdminArchived />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/health" element={<AdminHealth />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Student-facing & Public Portal Routes */}
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<ServiceBrowse />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/projects" element={<ProjectBrowse />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/users/:id" element={<PublicProfile />} />

          {/* Student Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services/new" element={<ServiceCreate />} />
            <Route path="/services/:id/edit" element={<ServiceEdit />} />
            <Route path="/projects/new" element={<ProjectCreate />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/messages" element={<Messages />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  </ToastProvider>
  );
}
