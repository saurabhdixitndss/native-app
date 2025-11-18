import { Request, Response } from 'express';
import Referral from '../models/Referral';
import { User } from '../models/User';

// Get referral stats
export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    // Check if user was referred by someone
    const wasReferred = await Referral.findOne({ referredWallet: walletAddress });

    // Get all users this wallet has referred
    const referrals = await Referral.find({ referrerWallet: walletAddress });

    // Calculate total earnings from referrals
    const totalEarnings = referrals.reduce((sum, ref) => sum + ref.totalEarnings, 0);

    res.json({
      wasReferred: !!wasReferred,
      referredBy: wasReferred?.referrerWallet || null,
      totalReferrals: referrals.length,
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      referrals: referrals.map(ref => ({
        wallet: ref.referredWallet,
        earnings: ref.totalEarnings,
        createdAt: ref.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create referral
export const createReferral = async (req: Request, res: Response) => {
  try {
    const { referrerWallet, referredWallet } = req.body;

    // Validate inputs
    if (!referrerWallet || !referredWallet) {
      return res.status(400).json({ message: 'Both wallet addresses are required' });
    }

    if (referrerWallet === referredWallet) {
      return res.status(400).json({ message: 'Cannot refer yourself' });
    }

    // Check if both users exist
    const referrer = await User.findOne({ walletAddress: referrerWallet });
    const referred = await User.findOne({ walletAddress: referredWallet });

    if (!referrer) {
      return res.status(404).json({ message: 'Referrer wallet not found' });
    }

    if (!referred) {
      return res.status(404).json({ message: 'Referred wallet not found' });
    }

    // Check if referred user already has a referrer
    const existingReferral = await Referral.findOne({ referredWallet });
    if (existingReferral) {
      return res.status(400).json({ 
        message: 'This user has already been referred by someone else' 
      });
    }

    // Create referral
    const referral = new Referral({
      referrerWallet,
      referredWallet,
    });
    await referral.save();

    res.json({
      success: true,
      message: 'Referral created successfully',
      referral: {
        referrerWallet: referral.referrerWallet,
        referredWallet: referral.referredWallet,
        createdAt: referral.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
