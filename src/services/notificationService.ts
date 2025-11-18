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
        smallIcon: 'ic_notification',
        color: '#8B5CF6',
        vibrationPattern: [300, 500, 300],
        lights: ['#8B5CF6', 300, 600],
        largeIcon: 'ic_launcher',
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

// Check mining status and show notification if complete
export const checkMiningStatusAndNotify = async (
  sessionId: string,
  walletAddress: string
): Promise<boolean> => {
  try {
    const statusResponse = await miningAPI.getMiningStatus(sessionId);
    
    if (statusResponse.status.isComplete && statusResponse.status.canClaim) {
      await showMiningCompleteNotification(
        sessionId,
        statusResponse.status.currentReward,
        walletAddress
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking mining status:', error);
    return false;
  }
};

// Schedule periodic check for mining completion
let checkInterval: ReturnType<typeof setInterval> | null = null;

export const startPeriodicMiningCheck = (
  sessionId: string,
  walletAddress: string,
  intervalMs: number = 60000 // Check every minute
) => {
  // Clear any existing interval
  stopPeriodicMiningCheck();

  console.log(`⏰ Starting periodic mining check for session ${sessionId}`);

  // Check immediately
  checkMiningStatusAndNotify(sessionId, walletAddress);

  // Then check periodically
  checkInterval = setInterval(() => {
    checkMiningStatusAndNotify(sessionId, walletAddress).then((notified) => {
      if (notified) {
        // Stop checking once notification is shown
        stopPeriodicMiningCheck();
      }
    });
  }, intervalMs);
};

export const stopPeriodicMiningCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log('⏹️ Stopped periodic mining check');
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
