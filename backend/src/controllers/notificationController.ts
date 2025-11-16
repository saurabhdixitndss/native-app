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

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const { getAllCompletedSessions } = require('../services/notificationService');
    const completedSessions = getAllCompletedSessions();
    
    console.log(`📡 GET /api/notifications/all - Found ${completedSessions.length} completed session(s)`);
    
    const notifications = completedSessions.map((session: any) => ({
      sessionId: session.sessionId,
      walletAddress: session.wallet,
      message: `Mining complete! ${session.totalEarned.toFixed(4)} tokens ready to claim`,
      totalEarned: session.totalEarned,
      completedAt: session.completedAt,
    }));
    
    console.log('📤 Sending notifications:', JSON.stringify(notifications, null, 2));
    
    res.json({ notifications });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch all notifications' });
  }
};

// Test endpoint to manually check for completed sessions
export const testCheckSessions = async (req: Request, res: Response) => {
  try {
    const { MiningSession } = require('../models/MiningSession');
    const activeSessions = await MiningSession.find({ status: 'mining' });
    
    const now = new Date();
    const results = [];
    
    for (const session of activeSessions) {
      const [datePart, timePart] = session.miningStartTime.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
      
      const startTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
      );
      
      const durationMs = session.selectedHour * 60 * 60 * 1000;
      const endTime = new Date(startTime.getTime() + durationMs);
      const timeRemaining = endTime.getTime() - now.getTime();
      const minutesRemaining = Math.floor(timeRemaining / 60000);
      
      results.push({
        sessionId: String(session._id),
        wallet: session.wallet,
        startTime: session.miningStartTime,
        duration: `${session.selectedHour} hour(s)`,
        minutesRemaining,
        isComplete: now >= endTime,
        status: session.status,
      });
    }
    
    res.json({
      totalActiveSessions: activeSessions.length,
      currentTime: now.toISOString(),
      sessions: results,
    });
  } catch (error) {
    console.error('Test check sessions error:', error);
    res.status(500).json({ message: 'Failed to check sessions' });
  }
};
