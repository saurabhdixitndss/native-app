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

// Show mining complete notification
export const showMiningCompleteNotification = async (
  sessionId: string,
  tokensEarned: number,
  walletAddress: string
) => {
  try {
    const shortWallet = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

    await notifee.displayNotification({
      id: `mining-${sessionId}`,
      title: '⛏️ Mining Complete!',
      body: `You earned ${tokensEarned.toFixed(2)} tokens! Tap to claim your rewards.`,
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
          text: `Wallet: ${shortWallet}\nTokens: ${tokensEarned.toFixed(2)}\n\nTap to claim your rewards now!`,
        },
        actions: [
          {
            title: '🎁 Claim Now',
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

    console.log(`🔔 Mining complete notification shown for session ${sessionId}`);
    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
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

// Check backend for pending notifications and show them
export const checkPendingNotifications = async (walletAddress: string): Promise<boolean> => {
  try {
    console.log(`🔍 Checking pending notifications for wallet: ${walletAddress}`);
    const { notificationAPI } = await import('./api');
    const response = await notificationAPI.getPending(walletAddress);
    
    console.log(`📊 Found ${response.count} pending notifications`);
    
    if (response.notifications && response.notifications.length > 0) {
      console.log(`📋 Notifications:`, response.notifications);
      
      // Show notification for each pending session that hasn't been notified
      for (const notification of response.notifications) {
        console.log(`Processing notification for session ${notification.sessionId}, notified: ${notification.notified}`);
        
        if (!notification.notified) {
          console.log(`🔔 Showing notification for session ${notification.sessionId}`);
          await showMiningCompleteNotification(
            notification.sessionId,
            notification.tokensEarned,
            walletAddress
          );
          
          // Mark as notified in backend
          await notificationAPI.markShown(notification.sessionId);
          console.log(`✅ Marked session ${notification.sessionId} as notified`);
        } else {
          console.log(`⏭️ Skipping already notified session ${notification.sessionId}`);
        }
      }
      return true;
    } else {
      console.log(`ℹ️ No pending notifications found`);
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

// Schedule periodic check for pending notifications
let checkInterval: ReturnType<typeof setInterval> | null = null;
let currentWallet: string | null = null;

export const startPeriodicMiningCheck = (
  sessionId: string,
  walletAddress: string,
  intervalMs: number = 60000 // Check every minute
) => {
  // Clear any existing interval
  stopPeriodicMiningCheck();

  currentWallet = walletAddress;
  console.log(`⏰ Starting periodic notification check for wallet ${walletAddress}`);

  // Check immediately
  checkPendingNotifications(walletAddress);

  // Then check periodically
  checkInterval = setInterval(() => {
    if (currentWallet) {
      checkPendingNotifications(currentWallet);
    }
  }, intervalMs);
};

export const stopPeriodicMiningCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    currentWallet = null;
    console.log('⏹️ Stopped periodic notification check');
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
