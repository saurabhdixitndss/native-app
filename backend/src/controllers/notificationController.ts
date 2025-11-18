import { Request, Response } from 'express';
import CompletedMining from '../models/CompletedMining';
import { markAsNotified, markAsClaimed } from '../services/miningMonitorService';

// Get pending notifications for a wallet (ONLY for THIS specific user)
export const getPendingNotifications = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    console.log(`📱 API: Getting pending notifications for wallet: ${walletAddress}`);

    // Find all completed but unclaimed sessions for THIS specific wallet ONLY
    const pending = await CompletedMining.find({
      walletAddress, // Only THIS user's sessions
      claimed: false, // Only unclaimed
    }).sort({ completedAt: -1 });

    console.log(`📊 Found ${pending.length} pending notification(s) for ${walletAddress}`);
    
    if (pending.length > 0) {
      console.log(`   Sessions:`, pending.map(p => ({
        sessionId: p.sessionId,
        tokens: p.tokensEarned,
        notified: p.notified
      })));
    }

    res.json({
      success: true,
      notifications: pending.map(item => ({
        sessionId: item.sessionId,
        tokensEarned: item.tokensEarned,
        completedAt: item.completedAt,
        notified: item.notified,
      })),
      count: pending.length,
      walletAddress, // Confirm which wallet these notifications are for
    });
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as shown
export const markNotificationShown = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    await markAsNotified(sessionId);

    res.json({
      success: true,
      message: 'Notification marked as shown',
    });
  } catch (error) {
    console.error('Error marking notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark session as claimed (called when user claims rewards)
export const markSessionClaimed = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    await markAsClaimed(sessionId);

    res.json({
      success: true,
      message: 'Session marked as claimed',
    });
  } catch (error) {
    console.error('Error marking as claimed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Manual trigger for checking completed sessions (for testing)
export const triggerCheck = async (req: Request, res: Response) => {
  try {
    const { checkCompletedSessions } = await import('../services/miningMonitorService');
    
    console.log('🔧 Manual check triggered via API');
    await checkCompletedSessions();
    
    res.json({
      success: true,
      message: 'Check completed successfully',
    });
  } catch (error) {
    console.error('Error triggering check:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
