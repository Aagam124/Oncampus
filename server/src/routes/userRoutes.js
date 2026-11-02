import { Router } from 'express';
import {
  getUsers, getUserById, updateProfile, updateAvatar,
  getUserServices, getUserReviews, toggleFavorite, getFavorites,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getUsers);
router.get('/favorites', authenticate, getFavorites);
router.post('/favorites/:projectId', authenticate, toggleFavorite);
router.get('/:id', getUserById);
router.put('/profile', authenticate, updateProfile);
router.put('/avatar', authenticate, upload.single('avatar'), updateAvatar);
router.get('/:id/services', getUserServices);
router.get('/:id/reviews', getUserReviews);

export default router;
