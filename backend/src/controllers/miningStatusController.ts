import { Request, Response } from 'express';
import { MiningSession } from '../models/MiningSession';
import { Config } from '../models/Config';
import {
  calculateMiningReward,
  getElapsedSeconds,
  isSessionComplete,
  getRemainingSeconds,
} from '../utils/miningCalculator';

export const getMiningStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await MiningSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const config = await Config.findOne({ key: 'mining_config' });
    if (!config) {
      return res.status(500).json({ message: 'Config not found' });
    }

    const elapsedSeconds = getElapsedSeconds(session.miningStartTime);
    const currentReward = calculateMiningReward(
      config.baseRate,
      session.multiplier,
      elapsedSeconds
    );
    const isComplete = isSessionComplete(
      session.miningStartTime,
      session.selectedHour
    );
    const remainingSeconds = getRemainingSeconds(
      session.miningStartTime,
      session.selectedHour
    );

    // Update session with current reward
    session.totalEarned = currentReward;
    session.currentMiningPoints = currentReward;
    await session.save();

    res.json({
      session,
      status: {
        elapsedSeconds,
        currentReward,
        isComplete,
        remainingSeconds,
        canClaim: isComplete && session.status === 'mining',
      },
    });
  } catch (error) {
    console.error('Get mining status error:', error);
    res.status(500).json({ message: 'Failed to fetch mining status' });
  }
};
