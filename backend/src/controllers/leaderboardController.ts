import { Request, Response } from 'express';
import { User } from '../models/User';

// Get leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;

    // Get top users by total tokens
    const topUsers = await User.find()
      .sort({ totalTokens: -1 })
      .limit(Number(limit))
      .select('walletAddress totalTokens createdAt');

    // Format response with rankings
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      walletAddress: user.walletAddress,
      totalTokens: user.totalTokens,
      createdAt: user.createdAt,
    }));

    res.json({
      success: true,
      leaderboard,
      total: topUsers.length,
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user rank
export const getUserRank = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count users with more tokens
    const rank = await User.countDocuments({
      totalTokens: { $gt: user.totalTokens },
    }) + 1;

    // Get total users
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      rank,
      totalUsers,
      totalTokens: user.totalTokens,
    });
  } catch (error) {
    console.error('Error getting user rank:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
