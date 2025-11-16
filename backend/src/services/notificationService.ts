import cron from 'node-cron';
import { MiningSession } from '../models/MiningSession';

interface CompletedSession {
  sessionId: string;
  wallet: string;
  totalEarned: number;
  completedAt: Date;
}

// Store completed sessions that need notification
const completedSessions: Map<string, CompletedSession> = new Map();

// Parse date string format: "DD/MM/YYYY HH:mm:ss"
const parseDate = (dateStr: string): Date => {
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');
  const [hours, minutes, seconds] = timePart.split(':');
  
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  );
};

// Check for completed mining sessions
const checkCompletedSessions = async () => {
  try {
    const activeSessions = await MiningSession.find({ status: 'mining' });
    
    console.log(`🔍 Checking ${activeSessions.length} active mining session(s)...`);
    
    const now = new Date();
    
    for (const session of activeSessions) {
      const startTime = parseDate(session.miningStartTime);
      const durationMs = session.selectedHour * 60 * 60 * 1000;
      const endTime = new Date(startTime.getTime() + durationMs);
      
      const sessionId = String(session._id);
      const timeRemaining = endTime.getTime() - now.getTime();
      const minutesRemaining = Math.floor(timeRemaining / 60000);
      
      console.log(`  Session ${sessionId}: ${minutesRemaining} minutes remaining`);
      
      // Check if mining is complete
      if (now >= endTime && !completedSessions.has(sessionId)) {
        // Calculate final reward
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const maxSeconds = session.selectedHour * 3600;
        const actualSeconds = Math.min(elapsedSeconds, maxSeconds);
        
        const baseRate = 0.0001; // Should match config
        const currentReward = actualSeconds * baseRate * session.multiplier;
        
        // Store completed session
        completedSessions.set(sessionId, {
          sessionId: sessionId,
          wallet: session.wallet,
          totalEarned: currentReward,
          completedAt: now,
        });
        
        console.log(`🔔 Mining completed for wallet ${session.wallet}. Reward: ${currentReward.toFixed(4)} tokens`);
        console.log(`📊 Total completed sessions in memory: ${completedSessions.size}`);
      }
    }
  } catch (error) {
    console.error('Error checking completed sessions:', error);
  }
};

// Initialize notification service
export const initNotificationService = () => {
  // Check every minute for completed sessions
  cron.schedule('* * * * *', () => {
    checkCompletedSessions();
  });
  
  console.log('✅ Notification service initialized - checking every minute');
};

// Get completed sessions for a wallet
export const getCompletedSessionsForWallet = (walletAddress: string): CompletedSession[] => {
  const sessions: CompletedSession[] = [];
  
  completedSessions.forEach((session) => {
    if (session.wallet === walletAddress) {
      sessions.push(session);
    }
  });
  
  return sessions;
};

// Clear notification for a session (after user has been notified)
export const clearNotification = (sessionId: string) => {
  completedSessions.delete(sessionId);
};

// Get all completed sessions (for polling)
export const getAllCompletedSessions = (): CompletedSession[] => {
  return Array.from(completedSessions.values());
};
