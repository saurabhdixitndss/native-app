import { Router } from 'express';
import { getNotifications, clearNotification } from '../controllers/notificationController';

const router = Router();

// Get pending notifications for a wallet
router.get('/pending/:walletAddress', getNotifications);

// Clear a notification
router.post('/clear/:sessionId', clearNotification);

export default router;
