import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationAPI } from './api';

// Configure push notifications
export const configurePushNotifications = async () => {
  const settings = await notifee.requestPermission();
  
  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log('✅ Notification permissions granted');
  } else {
    console.log('⚠️ Notification permissions denied');
  }

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'mining-complete',
      name: 'Mining Complete',
      description: 'Notifications when mining is complete',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
    console.log('✅ Notification channel created');
  }
};

// Show "Claim Rewards" notification
const showClaimRewardsNotification = async (walletAddress: string) => {
  const shortWallet = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
  
  await notifee.displayNotification({
    title: '🎉 Mining Complete!',
    body: `Claim Rewards for wallet ${shortWallet}`,
    android: {
      channelId: 'mining-complete',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
      },
      sound: 'default',
      vibrationPattern: [300, 500],
    },
    ios: {
      sound: 'default',
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
  
  console.log(`🔔 Notification shown for wallet ${shortWallet}`);
};

// Track which wallets have been notified (to avoid duplicates)
const notifiedWallets = new Set<string>();

// Check for completed mining and show notifications
export const checkAndNotify = async (): Promise<void> => {
  try {
    // Get all wallets with completed mining from backend
    const response = await notificationAPI.getCompletedWallets();
    const completedWallets: string[] = response.wallets || [];
    
    if (completedWallets.length === 0) {
      return;
    }

    // Show notification for each wallet that hasn't been notified yet
    for (const wallet of completedWallets) {
      if (!notifiedWallets.has(wallet)) {
        await showClaimRewardsNotification(wallet);
        notifiedWallets.add(wallet);
      }
    }
  } catch (error) {
    console.error('Error checking for completed mining:', error);
  }
};

// Clear notification tracking for a wallet (when user claims)
export const clearNotificationTracking = (walletAddress: string) => {
  notifiedWallets.delete(walletAddress);
};

// Start periodic checking (every 2 minutes)
let checkInterval: ReturnType<typeof setInterval> | null = null;

export const startPeriodicCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // Check immediately
  checkAndNotify();

  // Then check every 2 minutes
  checkInterval = setInterval(() => {
    checkAndNotify();
  }, 2 * 60 * 1000);

  console.log('✅ Started periodic notification checks (every 2 minutes)');
};

export const stopPeriodicCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log('⏹️ Stopped periodic notification checks');
  }
};
