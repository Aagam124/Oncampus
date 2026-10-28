import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import useNotificationStore from '@/store/notificationStore';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

// Pages
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
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminServices from '@/pages/admin/AdminServices';
import AdminReports from '@/pages/admin/AdminReports';

// Layout wrapper
function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
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
      <Routes>
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

          {/* Protected routes */}
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

          {/* Admin routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
