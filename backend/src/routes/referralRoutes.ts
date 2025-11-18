import express from 'express';
import { getReferralStats, createReferral } from '../controllers/referralController';

const router = express.Router();

router.get('/stats/:walletAddress', getReferralStats);
router.post('/create', createReferral);

export default router;
