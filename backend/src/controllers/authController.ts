import { Request, Response } from 'express';
import { User } from '../models/User';

export const signup = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    let user = await User.findOne({ walletAddress });

    if (user) {
      return res.json({
        message: 'User already exists',
        user: {
          walletAddress: user.walletAddress,
          totalTokens: user.totalTokens,
        },
        isNewUser: false,
      });
    }

    user = await User.create({
      walletAddress,
      totalTokens: 0,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        walletAddress: user.walletAddress,
        totalTokens: user.totalTokens,
      },
      isNewUser: true,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const getUserBalance = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      walletAddress: user.walletAddress,
      totalTokens: user.totalTokens,
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
};
