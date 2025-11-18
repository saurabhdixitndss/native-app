import notifee, { AndroidImportance, AuthorizationStatus, EventType } from '@notifee/react-native';
import { Platform } from 'react-native';
import { miningAPI } from './api';

// Configure and request notification permissions
export const setupNotifications = async () => {
  try {
    const settings = await notifee.requestPermission();
    
    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('✅ Notification permissions granted');
    } else {
      console.log('⚠️ Notification permissions denied');
    }

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'mining-complete',
        name: 'Mining Complete',
        description: 'Notifications when mining sessions are complete',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#8B5CF6',
      });
      console.log('✅ Notification channel created');
    }

    // Set up foreground event handler
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('User pressed notification:', detail.notification);
        // Navigation will be handled by the app
      }
    });

    return true;
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return false;
  }
};

// Show mining complete notification (ONLY for current logged-in user)
export const showMiningCompleteNotification = async (
  sessionId: string,
  tokensEarned: number,
  walletAddress: string
) => {
  try {
    const shortWallet = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

    console.log(`🔔 Displaying notification for YOUR mining session ${sessionId}`);
    console.log(`   Wallet: ${shortWallet}`);
    console.log(`   Tokens: ${tokensEarned.toFixed(2)}`);

    await notifee.displayNotification({
      id: `mining-${sessionId}`,
      title: '⛏️ Your Mining is Complete!',
      body: `You earned ${tokensEarned.toFixed(2)} tokens! Tap to claim your rewards now.`,
      android: {
        channelId: 'mining-complete',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'claim',
          launchActivity: 'default',
        },
        color: '#8B5CF6',
        vibrationPattern: [100, 300, 200, 500], // [delay, vibrate, delay, vibrate] - must be even number of positive values
        style: {
          type: 1, // BigTextStyle
          text: `Your mining session is complete!\n\nWallet: ${shortWallet}\nTokens Earned: ${tokensEarned.toFixed(2)}\n\nTap to claim your rewards now!`,
        },
        actions: [
          {
            title: '🎁 Claim Rewards',
            pressAction: {
              id: 'claim',
              launchActivity: 'default',
            },
          },
        ],
      },
      ios: {
        sound: 'default',
        categoryId: 'mining-complete',
        attachments: [],
      },
    });

    console.log(`✅ Notification displayed successfully for YOUR session`);
    return true;
  } catch (error) {
    console.error('❌ Error showing notification:', error);
    return false;
  }
};

// Cancel notification
export const cancelNotification = async (sessionId: string) => {
  try {
    await notifee.cancelNotification(`mining-${sessionId}`);
    console.log(`🔕 Cancelled notification for session ${sessionId}`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Check backend for pending notifications and show them (ONLY for current logged-in user)
export const checkPendingNotifications = async (walletAddress: string): Promise<boolean> => {
  try {
    console.log(`🔍 [${new Date().toLocaleTimeString()}] Checking notifications for CURRENT USER: ${walletAddress}`);
    const { notificationAPI } = await import('./api');
    const response = await notificationAPI.getPending(walletAddress);
    
    console.log(`📊 Found ${response.count} pending notifications for THIS user`);
    
    if (response.notifications && response.notifications.length > 0) {
      console.log(`📋 Pending notifications for ${walletAddress}:`, response.notifications.map((n: any) => ({
        sessionId: n.sessionId,
        tokens: n.tokensEarned,
        notified: n.notified
      })));
      
      // Show notification for each pending session that hasn't been notified
      let notifiedCount = 0;
      for (const notification of response.notifications) {
        console.log(`Processing notification for session ${notification.sessionId}, notified: ${notification.notified}`);
        
        if (!notification.notified) {
          console.log(`🔔 Showing notification for THIS user's session ${notification.sessionId}`);
          await showMiningCompleteNotification(
            notification.sessionId,
            notification.tokensEarned,
            walletAddress
          );
          
          // Mark as notified in backend
          await notificationAPI.markShown(notification.sessionId);
          console.log(`✅ Marked session ${notification.sessionId} as notified`);
          notifiedCount++;
        } else {
          console.log(`⏭️ Skipping already notified session ${notification.sessionId}`);
        }
      }
      
      if (notifiedCount > 0) {
        console.log(`✅ Sent ${notifiedCount} notification(s) to current user`);
      }
      return notifiedCount > 0;
    } else {
      console.log(`ℹ️ No pending notifications for current user`);
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error checking pending notifications:', error);
    return false;
  }
};

// Legacy function for backward compatibility
export const checkMiningStatusAndNotify = async (
  sessionId: string,
  walletAddress: string
): Promise<boolean> => {
  // Now just checks backend for all pending notifications
  return checkPendingNotifications(walletAddress);
};

// Schedule periodic check for pending notifications (ONLY for current logged-in user)
let checkInterval: ReturnType<typeof setInterval> | null = null;
let currentWallet: string | null = null;
let currentSession: string | null = null;

export const startPeriodicMiningCheck = (
  sessionId: string,
  walletAddress: string,
  intervalMs: number = 60000 // Check every minute
) => {
  // Clear any existing interval
  stopPeriodicMiningCheck();

  currentWallet = walletAddress;
  currentSession = sessionId;
  
  console.log(`⏰ Starting periodic notification check for CURRENT USER`);
  console.log(`   Wallet: ${walletAddress}`);
  console.log(`   Session: ${sessionId || 'checking all sessions'}`);
  console.log(`   Interval: ${intervalMs / 1000}s`);
  console.log(`   ℹ️ Will ONLY notify THIS user about THEIR mining completion`);

  // Check immediately
  checkPendingNotifications(walletAddress);

  // Then check periodically
  checkInterval = setInterval(() => {
    if (currentWallet) {
      console.log(`⏰ [Periodic Check] Checking for ${currentWallet}...`);
      checkPendingNotifications(currentWallet);
    }
  }, intervalMs);
};

export const stopPeriodicMiningCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    const wallet = currentWallet;
    currentWallet = null;
    currentSession = null;
    console.log(`⏹️ Stopped periodic notification check for ${wallet || 'user'}`);
  }
};

// Get all displayed notifications
export const getDisplayedNotifications = async () => {
  try {
    const notifications = await notifee.getDisplayedNotifications();
    return notifications;
  } catch (error) {
    console.error('Error getting displayed notifications:', error);
    return [];
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await notifee.cancelAllNotifications();
    console.log('🔕 Cancelled all notifications');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
};
