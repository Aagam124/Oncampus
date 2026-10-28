import { Router } from 'express';
import { z } from 'zod';
import {
  getServices, getServiceById, createService,
  updateService, deleteService, getMyServices,
} from '../controllers/serviceController.js';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.enum([
    'web-development', 'mobile-development', 'ui-ux-design', 'graphic-design',
    'video-editing', 'content-writing', 'data-analysis', 'tutoring',
    'presentation', 'research', 'other',
  ]),
  tags: z.array(z.string()).optional(),
  pricing: z.object({
    type: z.enum(['fixed', 'hourly', 'negotiable']),
    amount: z.number().min(0),
  }),
  deliveryTime: z.number().min(1),
  images: z.array(z.string()).optional(),
});

router.get('/', getServices);
router.get('/my/listings', authenticate, getMyServices);
router.get('/:id', getServiceById);
router.post('/', authenticate, validate(serviceSchema), createService);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);

export default router;
