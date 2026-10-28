import { Router } from 'express';
import { z } from 'zod';
import {
  createOrder, getOrders, getOrderById,
  updateOrderStatus, addOrderMessage,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const createOrderSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  requirements: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'pending', 'accepted', 'in-progress', 'delivered',
    'completed', 'cancelled', 'disputed',
  ]),
});

router.post('/', authenticate, validate(createOrderSchema), createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, validate(updateStatusSchema), updateOrderStatus);
router.post('/:id/messages', authenticate, addOrderMessage);

export default router;
