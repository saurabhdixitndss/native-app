import { Request, Response } from 'express';
import { MiningSession } from '../models/MiningSession';
import { User } from '../models/User';
import { Config } from '../models/Config';

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const startMining = async (req: Request, res: Response) => {
  try {
    const { walletAddress, selectedHour, multiplier = 1 } = req.body;

    if (!walletAddress || !selectedHour) {
      return res.status(400).json({ message: 'Wallet address and selected hour are required' });
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activeSession = await MiningSession.findOne({
      wallet: walletAddress,
      status: 'mining',
    });

    if (activeSession) {
      return res.status(400).json({ message: 'Active mining session already exists' });
    }

    const now = new Date();
    const dateStr = formatDate(now);

    const session = await MiningSession.create({
      wallet: walletAddress,
      createdDate: dateStr,
      multiplier,
      status: 'mining',
      miningStartTime: dateStr,
      currentMultiplierStartTime: dateStr,
      totalEarned: 0,
      currentMiningPoints: 0,
      lastUpdated: dateStr,
      selectedHour,
    });

    res.status(201).json({
      message: 'Mining session started',
      session,
    });
  } catch (error) {
    console.error('Start mining error:', error);
    res.status(500).json({ message: 'Failed to start mining' });
  }
};

export const getActiveSession = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const session = await MiningSession.findOne({
      wallet: walletAddress,
      status: 'mining',
    });

    if (!session) {
      return res.json({ session: null });
    }

    res.json({ session });
  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({ message: 'Failed to fetch active session' });
  }
};

export const updateMiningProgress = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { currentMiningPoints, totalEarned } = req.body;

    const session = await MiningSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'mining') {
      return res.status(400).json({ message: 'Session is not active' });
    }

    session.currentMiningPoints = currentMiningPoints;
    session.totalEarned = totalEarned;
    session.lastUpdated = formatDate(new Date());

    await session.save();

    res.json({
      message: 'Mining progress updated',
      session,
    });
  } catch (error) {
    console.error('Update mining progress error:', error);
    res.status(500).json({ message: 'Failed to update mining progress' });
  }
};

export const upgradeMultiplier = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { newMultiplier } = req.body;

    const session = await MiningSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'mining') {
      return res.status(400).json({ message: 'Session is not active' });
    }

    const config = await Config.findOne({ key: 'mining_config' });
    if (!config) {
      return res.status(500).json({ message: 'Config not found' });
    }

    const multiplierOption = config.multiplierOptions.find(
      (opt: any) => opt.value === newMultiplier
    );

    if (!multiplierOption) {
      return res.status(400).json({ message: 'Invalid multiplier' });
    }

    session.multiplier = newMultiplier;
    session.currentMultiplierStartTime = formatDate(new Date());
    session.lastUpdated = formatDate(new Date());

    await session.save();

    res.json({
      message: 'Multiplier upgraded',
      session,
    });
  } catch (error) {
    console.error('Upgrade multiplier error:', error);
    res.status(500).json({ message: 'Failed to upgrade multiplier' });
  }
};

export const claimReward = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await MiningSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'mining') {
      return res.status(400).json({ message: 'Session is not active' });
    }

    const user = await User.findOne({ walletAddress: session.wallet });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.totalTokens += session.totalEarned;
    await user.save();

    session.status = 'claimed';
    session.lastUpdated = formatDate(new Date());
    await session.save();

    res.json({
      message: 'Reward claimed successfully',
      claimedAmount: session.totalEarned,
      newBalance: user.totalTokens,
      session,
    });
  } catch (error) {
    console.error('Claim reward error:', error);
    res.status(500).json({ message: 'Failed to claim reward' });
  }
};

export const cancelMining = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await MiningSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'mining') {
      return res.status(400).json({ message: 'Session is not active' });
    }

    session.status = 'cancelled';
    session.lastUpdated = formatDate(new Date());
    await session.save();

    res.json({
      message: 'Mining session cancelled',
      session,
    });
  } catch (error) {
    console.error('Cancel mining error:', error);
    res.status(500).json({ message: 'Failed to cancel mining' });
  }
};

export const getMiningHistory = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const sessions = await MiningSession.find({ wallet: walletAddress })
      .sort({ createdDate: -1 })
      .limit(20);

    res.json({ sessions });
  } catch (error) {
    console.error('Get mining history error:', error);
    res.status(500).json({ message: 'Failed to fetch mining history' });
  }
};
