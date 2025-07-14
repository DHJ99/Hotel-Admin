import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', analyticsController.getAnalytics);
router.post('/refresh', requireRole(['admin']), analyticsController.refreshAnalytics);
router.get('/revenue-report', analyticsController.getRevenueReport);
router.get('/occupancy-report', analyticsController.getOccupancyReport);

export default router;