import express from 'express';
import {
  getPendingNotifications,
  markNotificationShown,
  markSessionClaimed,
  triggerCheck,
} from '../controllers/notificationController';

const router = express.Router();

router.get('/pending/:walletAddress', getPendingNotifications);
router.post('/mark-shown', markNotificationShown);
router.post('/mark-claimed', markSessionClaimed);
router.post('/trigger-check', triggerCheck); // For testing

export default router;
