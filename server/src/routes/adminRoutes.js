import { Router } from 'express';
import {
  getStats,
  getAnalytics,
  getNeedsAttention,
  getRecentActivity,
  getAdminUsers,
  getAdminUserDetail,
  updateUserStatus,
  verifyStudentDecision,
  getVerifications,
  getAdminProjects,
  updateProjectPortalStatus,
  deleteAdminProject,
  getAdminServices,
  updateServicePortalStatus,
  deleteAdminService,
  getAdminOrders,
  getAdminOrderDetail,
  resolveDispute,
  getPortalContent,
  bulkPortalAction,
  getArchivedContent,
  getReports,
  updateReport,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  broadcastNotification,
  getPlatformHealth,
  getAuditLogs,
  getAdminRoles,
  updateAdminRole,
} from '../controllers/adminController.js';
import { authenticate, authorize, authorizeAdminRole } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// 1. Overview & Analytics
router.get('/stats', getStats);
router.get('/analytics', getAnalytics);
router.get('/attention', getNeedsAttention);
router.get('/activity', getRecentActivity);

// 2. User & Student Management
router.get('/users', getAdminUsers);
router.get('/users/:id', getAdminUserDetail);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/portal-status', updateUserStatus);
router.put('/users/:id/verify', verifyStudentDecision);
router.get('/verifications', getVerifications);

// 3. Marketplace: Projects, Services, Orders & Disputes
router.get('/projects', getAdminProjects);
router.put('/projects/:id/portal-status', updateProjectPortalStatus);
router.delete('/projects/:id', deleteAdminProject);
router.get('/services', getAdminServices);
router.put('/services/:id/portal-status', updateServicePortalStatus);
router.delete('/services/:id', deleteAdminService);
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderDetail);
router.put('/orders/:id/resolve-dispute', resolveDispute);

// 4. Portal Management (Central Content Control)
router.get('/portal', getPortalContent);
router.post('/portal/bulk', bulkPortalAction);
router.get('/archived', getArchivedContent);

// 5. Reports & Moderation
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);

// 6. Announcements & Notifications
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);
router.post('/broadcast-notification', broadcastNotification);

// 7. Platform Health Monitor
router.get('/health', getPlatformHealth);

// 8. Audit Logs & Security
router.get('/audit-logs', getAuditLogs);
router.get('/roles', getAdminRoles);
router.put('/roles/:id', authorizeAdminRole('super_admin'), updateAdminRole);

export default router;
