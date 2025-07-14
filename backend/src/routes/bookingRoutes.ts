import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBooking);
router.post('/', requireRole(['admin']), bookingController.createBooking);
router.put('/:id', requireRole(['admin']), bookingController.updateBooking);
router.delete('/:id', requireRole(['admin']), bookingController.deleteBooking);

export default router;