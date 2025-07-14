import { Router } from 'express';
import { customerController } from '../controllers/customerController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', requireRole(['admin']), customerController.createCustomer);
router.put('/:id', requireRole(['admin']), customerController.updateCustomer);
router.delete('/:id', requireRole(['admin']), customerController.deleteCustomer);

export default router;