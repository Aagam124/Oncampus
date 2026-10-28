import { Router } from 'express';
import { createReview, getUserReviews, getServiceReviews } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/service/:serviceId', getServiceReviews);

export default router;
