import express from 'express';
import { getDailyRewardsStatus, claimDailyReward } from '../controllers/rewardsController';

const router = express.Router();

router.get('/daily/:walletAddress', getDailyRewardsStatus);
router.post('/daily/claim', claimDailyReward);

export default router;
