import { Router } from 'express';
import {
  getStats, getAdminUsers, updateUser,
  getAdminServices, updateServiceStatus,
  getReports, updateReport,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAdminUsers);
router.put('/users/:id', updateUser);
router.get('/services', getAdminServices);
router.put('/services/:id', updateServiceStatus);
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);

export default router;
