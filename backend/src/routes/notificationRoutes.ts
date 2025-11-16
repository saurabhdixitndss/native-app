import { Router } from 'express';
import { getNotifications, clearNotification, getAllNotifications, testCheckSessions } from '../controllers/notificationController';

const router = Router();

// Get pending notifications for a wallet
router.get('/pending/:walletAddress', getNotifications);

// Get ALL pending notifications (for any user)
router.get('/all', getAllNotifications);

// Test endpoint to check active sessions
router.get('/test/check-sessions', testCheckSessions);

// Clear a notification
router.post('/clear/:sessionId', clearNotification);

export default router;
