import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import miningRoutes from './routes/miningRoutes';
import configRoutes from './routes/configRoutes';
import rewardsRoutes from './routes/rewardsRoutes';
import referralRoutes from './routes/referralRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

// Morgan with require to avoid TypeScript issues
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === 'development';

// Morgan HTTP request logger
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/config', configRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Crypto Miner API is running' });
});

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════');
    console.log('⛏️  Crypto Miner Backend Server');
    console.log('═══════════════════════════════════════════════════');
    console.log(`📡 Server running on port: ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Logging: ${isDevelopment ? 'dev mode' : 'combined mode'}`);
    console.log('═══════════════════════════════════════════════════');
  });
});

export default app;
