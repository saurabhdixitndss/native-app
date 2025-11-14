import { Router } from 'express';
import {
  startMining,
  getActiveSession,
  updateMiningProgress,
  upgradeMultiplier,
  claimReward,
  cancelMining,
  getMiningHistory,
} from '../controllers/miningController';
import { getMiningStatus } from '../controllers/miningStatusController';

const router = Router();

router.post('/start', startMining);
router.get('/active/:walletAddress', getActiveSession);
router.get('/status/:sessionId', getMiningStatus);
router.put('/progress/:sessionId', updateMiningProgress);
router.put('/upgrade/:sessionId', upgradeMultiplier);
router.post('/claim/:sessionId', claimReward);
router.post('/cancel/:sessionId', cancelMining);
router.get('/history/:walletAddress', getMiningHistory);

export default router;
