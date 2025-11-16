import { Request, Response } from 'express';
import { getCompletedSessionsForWallet, clearNotification as clearNotificationService } from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    const completedSessions = getCompletedSessionsForWallet(walletAddress);
    
    res.json({
      notifications: completedSessions.map(session => ({
        sessionId: session.sessionId,
        message: `Mining complete! ${session.totalEarned.toFixed(4)} tokens ready to claim`,
        totalEarned: session.totalEarned,
        completedAt: session.completedAt,
      })),
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const clearNotification = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    clearNotificationService(sessionId);
    
    res.json({ message: 'Notification cleared' });
  } catch (error) {
    console.error('Clear notification error:', error);
    res.status(500).json({ message: 'Failed to clear notification' });
  }
};
