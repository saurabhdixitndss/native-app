import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  getAllMiningSessions,
  getAnalytics,
  getConfig,
  processPayment,
  getPaymentHistory
} from '../controllers/adminController.js';

const router = Router();

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:walletAddress', getUserDetails);

// Mining Sessions
router.get('/sessions', getAllMiningSessions);

// Analytics
router.get('/analytics', getAnalytics);

// Config
router.get('/config', getConfig);

// Payments
router.post('/users/:walletAddress/payment', processPayment);
router.get('/users/:walletAddress/payment-history', getPaymentHistory);

export default router;
