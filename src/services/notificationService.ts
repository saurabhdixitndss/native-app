import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { miningAPI } from './api';

// Configure push notifications
export const configurePushNotifications = async () => {
  // Request permissions
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
      description: 'Notifications for completed mining sessions',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
    console.log('✅ Notification channel created');
  }
};

// Show local notification
export const showMiningCompleteNotification = async (tokensEarned: number, walletAddress?: string) => {
  const walletInfo = walletAddress ? `\nWallet: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '';
  
  await notifee.displayNotification({
    title: '🎉 Mining Complete!',
    body: `You've earned ${tokensEarned.toFixed(4)} tokens. Tap to claim your rewards!${walletInfo}`,
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
};

// Track which sessions have already been notified
const notifiedSessions = new Set<string>();

// Check for completed mining sessions for ALL users
export const checkForCompletedMining = async (): Promise<boolean> => {
  try {
    console.log('🔍 Checking for completed mining (all users)...');
    
    // Import the API
    const { notificationAPI } = require('./api');
    
    // Get ALL completed sessions (not just current user)
    const response = await notificationAPI.getAllPendingNotifications();
    
    console.log('📡 API Response:', JSON.stringify(response, null, 2));
    
    if (!response.notifications || response.notifications.length === 0) {
      console.log('ℹ️ No completed mining sessions found');
      return false;
    }

    console.log(`📋 Found ${response.notifications.length} completed session(s)`);
    let hasNewNotifications = false;

    // Show notification for each completed session that hasn't been notified yet
    for (const notification of response.notifications) {
      const sessionId = notification.sessionId;
      
      console.log(`🔍 Checking session ${sessionId}...`);
      
      // Skip if already notified
      if (notifiedSessions.has(sessionId)) {
        console.log(`⏭️ Session ${sessionId} already notified, skipping`);
        continue;
      }

      console.log(`🔔 Showing notification for session ${sessionId}`);
      
      // Show notification
      await showMiningCompleteNotification(notification.totalEarned, notification.walletAddress);
      
      // Mark as notified
      notifiedSessions.add(sessionId);
      hasNewNotifications = true;
      
      console.log(`✅ Notification shown for wallet ${notification.walletAddress}: ${notification.totalEarned.toFixed(4)} tokens`);
    }

    return hasNewNotifications;
  } catch (error) {
    console.error('❌ Error checking for completed mining:', error);
    return false;
  }
};

// Clear notified session from tracking (when user claims)
export const clearNotifiedSession = (sessionId: string) => {
  notifiedSessions.delete(sessionId);
};

// Schedule periodic checks (every 5 minutes)
let checkInterval: ReturnType<typeof setInterval> | null = null;

export const startPeriodicCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // Check immediately
  checkForCompletedMining();

  // Then check every 5 minutes
  checkInterval = setInterval(() => {
    checkForCompletedMining();
  }, 5 * 60 * 1000); // 5 minutes

  console.log('✅ Started periodic mining completion checks');
};

export const stopPeriodicCheck = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log('⏹️ Stopped periodic mining completion checks');
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  await notifee.cancelAllNotifications();
};
