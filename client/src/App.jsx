import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useNotificationStore from '@/store/notificationStore';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy-loaded Student Pages (Code-split for instant initial load)
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ServiceBrowse = lazy(() => import('@/pages/ServiceBrowse'));
const ServiceCreate = lazy(() => import('@/pages/ServiceCreate'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const ServiceEdit = lazy(() => import('@/pages/ServiceEdit'));
const ProjectBrowse = lazy(() => import('@/pages/ProjectBrowse'));
const ProjectCreate = lazy(() => import('@/pages/ProjectCreate'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const PublicProfile = lazy(() => import('@/pages/PublicProfile'));
const ProfileEdit = lazy(() => import('@/pages/ProfileEdit'));
const OrderList = lazy(() => import('@/pages/OrderList'));
const OrderDetail = lazy(() => import('@/pages/OrderDetail'));
const Messages = lazy(() => import('@/pages/Messages'));

// Lazy-loaded Admin Command Center Pages & Layout
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminVerification = lazy(() => import('@/pages/admin/AdminVerification'));
const AdminSuspended = lazy(() => import('@/pages/admin/AdminSuspended'));
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'));
const AdminServices = lazy(() => import('@/pages/admin/AdminServices'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminDisputes = lazy(() => import('@/pages/admin/AdminDisputes'));
const AdminPortal = lazy(() => import('@/pages/admin/AdminPortal'));
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'));
const AdminArchived = lazy(() => import('@/pages/admin/AdminArchived'));
const AdminAnnouncements = lazy(() => import('@/pages/admin/AdminAnnouncements'));
const AdminNotifications = lazy(() => import('@/pages/admin/AdminNotifications'));
const AdminHealth = lazy(() => import('@/pages/admin/AdminHealth'));
const AdminRoles = lazy(() => import('@/pages/admin/AdminRoles'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

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
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <LoadingSpinner message="Loading..." />
            </div>
          }
        >
          <Outlet />
        </Suspense>
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
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] dark:bg-[#0c0c0e]">
              <LoadingSpinner message="Loading..." />
            </div>
          }
        >
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
        </Suspense>
      </ErrorBoundary>
    </ToastProvider>
  );
}
