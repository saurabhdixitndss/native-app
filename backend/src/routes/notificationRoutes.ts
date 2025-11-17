import { Router } from 'express';
import { getCompletedWallets, clearNotification } from '../controllers/notificationController';

const router = Router();

// Get all wallets with completed mining
router.get('/completed-wallets', getCompletedWallets);

// Clear notification for a wallet
router.post('/clear/:walletAddress', clearNotification);

export default router;
