import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import miningRoutes from './routes/miningRoutes';
import configRoutes from './routes/configRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mining', miningRoutes);
app.use('/api/config', configRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Crypto Miner API is running' });
});

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
});

export default app;
