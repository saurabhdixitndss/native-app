import cron from 'node-cron';
import { MiningSession } from '../models/MiningSession';

// Store wallet addresses that have completed mining (simple Set)
const walletsWithCompletedMining = new Set<string>();

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
    const now = new Date();
    
    for (const session of activeSessions) {
      const startTime = parseDate(session.miningStartTime);
      const durationMs = session.selectedHour * 60 * 60 * 1000;
      const endTime = new Date(startTime.getTime() + durationMs);
      
      // Check if mining is complete
      if (now >= endTime) {
        // Add wallet to completed set
        if (!walletsWithCompletedMining.has(session.wallet)) {
          walletsWithCompletedMining.add(session.wallet);
          console.log(`🔔 Mining completed for wallet ${session.wallet}`);
        }
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

// Check if a wallet has completed mining
export const hasCompletedMining = (walletAddress: string): boolean => {
  return walletsWithCompletedMining.has(walletAddress);
};

// Clear notification for a wallet (after user claims)
export const clearWalletNotification = (walletAddress: string) => {
  walletsWithCompletedMining.delete(walletAddress);
  console.log(`✅ Cleared notification for wallet ${walletAddress}`);
};

// Get all wallets with completed mining
export const getAllCompletedWallets = (): string[] => {
  return Array.from(walletsWithCompletedMining);
};
