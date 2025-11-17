import { Request, Response } from 'express';
import { getAllCompletedWallets, clearWalletNotification } from '../services/notificationService';

// Get all wallets with completed mining
export const getCompletedWallets = async (req: Request, res: Response) => {
  try {
    const wallets = getAllCompletedWallets();
    
    res.json({
      wallets,
      count: wallets.length,
    });
  } catch (error) {
    console.error('Get completed wallets error:', error);
    res.status(500).json({ message: 'Failed to fetch completed wallets' });
  }
};

// Clear notification for a wallet
export const clearNotification = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    clearWalletNotification(walletAddress);
    
    res.json({ message: 'Notification cleared', wallet: walletAddress });
  } catch (error) {
    console.error('Clear notification error:', error);
    res.status(500).json({ message: 'Failed to clear notification' });
  }
};
