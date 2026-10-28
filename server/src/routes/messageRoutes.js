import { Router } from 'express';
import {
  getConversations, createOrGetConversation,
  getMessages, sendMessage,
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getConversations);
router.post('/', authenticate, createOrGetConversation);
router.get('/:id/messages', authenticate, getMessages);
router.post('/:id/messages', authenticate, sendMessage);

export default router;
