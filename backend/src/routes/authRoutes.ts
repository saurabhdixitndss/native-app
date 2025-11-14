import { Router } from 'express';
import { signup, getUserBalance } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.get('/balance/:walletAddress', getUserBalance);

export default router;
