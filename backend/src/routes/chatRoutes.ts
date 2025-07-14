import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/message', chatLimiter, chatController.sendMessage);
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:session_id', chatController.getConversation);
router.delete('/conversations/:session_id', chatController.deleteConversation);

export default router;