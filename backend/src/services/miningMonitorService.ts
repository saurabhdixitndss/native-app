import { MiningSession } from '../models/MiningSession';
import CompletedMining from '../models/CompletedMining';

// Helper function to calculate mining status
export const calculateMiningStatus = (
  miningStartTime: Date | string,
  selectedHour: number
) => {
  const now = new Date();
  const startTime = new Date(miningStartTime);
  const durationMs = selectedHour * 60 * 60 * 1000;
  const endTime = new Date(startTime.getTime() + durationMs);
  
  const elapsedMs = now.getTime() - startTime.getTime();
  const remainingMs = endTime.getTime() - now.getTime();
  
  const isComplete = now >= endTime;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const elapsedHours = elapsedMs / (60 * 60 * 1000);
  const remainingMinutes = Math.max(0, Math.floor(remainingMs / (60 * 1000)));
  
  return {
    isComplete,
    startTime,
    endTime,
    elapsedMs,
    remainingMs,
    elapsedSeconds,
    remainingSeconds,
    elapsedHours,
    remainingMinutes,
    progressPercent: Math.min(100, (elapsedMs / durationMs) * 100),
  };
};

// Check all active mining sessions and mark completed ones
export const checkCompletedSessions = async () => {
  try {
    // Find all active mining sessions
    const activeSessions = await MiningSession.find({ status: 'mining' });

    if (activeSessions.length === 0) {
      console.log('ℹ️ No active mining sessions to check');
      return;
    }

    console.log(`🔍 Checking ${activeSessions.length} active mining sessions...`);
    const now = new Date();
    console.log(`⏰ Current time: ${now.toISOString()}`);

    for (const session of activeSessions) {
      const sessionId = String(session._id);
      
      // Calculate mining status using helper function
      const status = calculateMiningStatus(session.miningStartTime, session.selectedHour);
      
      console.log(`\n📊 Session ${sessionId}:`);
      console.log(`   Wallet: ${session.wallet}`);
      console.log(`   Start: ${status.startTime.toISOString()}`);
      console.log(`   Duration: ${session.selectedHour} hours`);
      console.log(`   End: ${status.endTime.toISOString()}`);
      console.log(`   Elapsed: ${status.elapsedHours.toFixed(2)} hours`);
      console.log(`   Remaining: ${status.remainingMinutes} minutes`);
      console.log(`   Progress: ${status.progressPercent.toFixed(1)}%`);
      console.log(`   Tokens: ${session.totalEarned}`);
      console.log(`   Complete: ${status.isComplete ? 'YES ✅' : 'NO ⏳'}`);

      // Check if session is complete
      if (status.isComplete) {
        console.log(`✅ Session ${sessionId} is COMPLETE!`);

        // Check if already recorded
        const existing = await CompletedMining.findOne({ sessionId });

        if (!existing) {
          // Record completed session
          const completedRecord = await CompletedMining.create({
            sessionId,
            walletAddress: session.wallet,
            tokensEarned: session.totalEarned,
            completedAt: now,
            notified: false,
            claimed: false,
          });

          console.log(`📝 Recorded completed session ${sessionId}`);
          console.log(`   Tokens earned: ${session.totalEarned}`);
          console.log(`   Ready for notification: YES`);
        } else {
          console.log(`ℹ️ Session ${sessionId} already recorded`);
          console.log(`   Notified: ${existing.notified}`);
          console.log(`   Claimed: ${existing.claimed}`);
        }
      } else {
        console.log(`⏳ Session ${sessionId} still mining (${status.remainingMinutes} min remaining)`);
      }
    }
    
    console.log(`\n✅ Completed checking all sessions\n`);
  } catch (error) {
    console.error('❌ Error checking completed sessions:', error);
  }
};

// Get all completed but unclaimed sessions for a wallet
export const getUnclaimedSessions = async (walletAddress: string) => {
  try {
    const unclaimed = await CompletedMining.find({
      walletAddress,
      claimed: false,
    }).sort({ completedAt: -1 });

    return unclaimed;
  } catch (error) {
    console.error('Error getting unclaimed sessions:', error);
    return [];
  }
};

// Mark session as notified
export const markAsNotified = async (sessionId: string) => {
  try {
    await CompletedMining.updateOne(
      { sessionId },
      { $set: { notified: true } }
    );
    console.log(`🔔 Marked session ${sessionId} as notified`);
  } catch (error) {
    console.error('Error marking as notified:', error);
  }
};

// Mark session as claimed
export const markAsClaimed = async (sessionId: string) => {
  try {
    await CompletedMining.updateOne(
      { sessionId },
      { $set: { claimed: true } }
    );
    console.log(`✅ Marked session ${sessionId} as claimed`);
  } catch (error) {
    console.error('Error marking as claimed:', error);
  }
};

// Start periodic monitoring
let monitorInterval: NodeJS.Timeout | null = null;

export const startMiningMonitor = (intervalMs: number = 60000) => {
  if (monitorInterval) {
    console.log('⚠️ Mining monitor already running');
    return;
  }

  console.log('🚀 Starting mining monitor service...');

  // Check immediately
  checkCompletedSessions();

  // Then check periodically
  monitorInterval = setInterval(() => {
    checkCompletedSessions();
  }, intervalMs);

  console.log(`✅ Mining monitor started (checking every ${intervalMs / 1000}s)`);
};

export const stopMiningMonitor = () => {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    console.log('⏹️ Mining monitor stopped');
  }
};
