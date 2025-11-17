import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  getAllMiningSessions,
  getAnalytics,
  getConfig
} from '../controllers/adminController';

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

export default router;
