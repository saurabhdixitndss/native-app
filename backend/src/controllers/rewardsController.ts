import { Request, Response } from 'express';
import DailyReward from '../models/DailyReward';
import { User } from '../models/User';
import Referral from '../models/Referral';

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get daily rewards status
export const getDailyRewardsStatus = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const today = getTodayDate();

    const todayRewards = await DailyReward.find({
      walletAddress,
      date: today,
    });

    res.json({
      claimedToday: todayRewards.length,
      maxDaily: 5,
      canClaim: todayRewards.length < 5,
      rewards: todayRewards,
    });
  } catch (error) {
    console.error('Error getting daily rewards status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Claim daily reward
export const claimDailyReward = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;
    const today = getTodayDate();

    // Check how many rewards claimed today
    const todayRewards = await DailyReward.find({
      walletAddress,
      date: today,
    });

    if (todayRewards.length >= 5) {
      return res.status(400).json({ message: 'Daily limit reached (5 rewards)' });
    }

    // Generate random reward between 0.5 and 5 tokens
    const rewardAmount = parseFloat((Math.random() * 4.5 + 0.5).toFixed(2));

    // Create daily reward record
    const dailyReward = new DailyReward({
      walletAddress,
      amount: rewardAmount,
      date: today,
    });
    await dailyReward.save();

    // Update user balance
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.totalTokens += rewardAmount;
    await user.save();

    // Check if this user was referred and give 10% to referrer
    const referral = await Referral.findOne({ referredWallet: walletAddress });
    if (referral) {
      const referrerBonus = parseFloat((rewardAmount * 0.1).toFixed(2));
      
      const referrer = await User.findOne({ walletAddress: referral.referrerWallet });
      if (referrer) {
        referrer.totalTokens += referrerBonus;
        await referrer.save();

        referral.totalEarnings += referrerBonus;
        await referral.save();

        console.log(`💰 Referrer ${referral.referrerWallet} earned ${referrerBonus} (10% of ${rewardAmount})`);
      }
    }

    res.json({
      success: true,
      rewardAmount,
      newBalance: user.totalTokens,
      claimedToday: todayRewards.length + 1,
    });
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
