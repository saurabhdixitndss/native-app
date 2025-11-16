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
export const showMiningCompleteNotification = async (tokensEarned: number) => {
  await notifee.displayNotification({
    title: '🎉 Mining Complete!',
    body: `You've earned ${tokensEarned.toFixed(4)} tokens. Tap to claim your rewards!`,
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

// Check for completed mining sessions
export const checkForCompletedMining = async (): Promise<boolean> => {
  try {
    const walletAddress = await AsyncStorage.getItem('walletAddress');
    if (!walletAddress) return false;

    // Get active session
    const sessionData = await miningAPI.getActiveSession(walletAddress);
    if (!sessionData.session) return false;

    // Check if mining is complete
    const statusResponse = await miningAPI.getMiningStatus(sessionData.session._id);
    
    if (statusResponse.status.isComplete && statusResponse.status.canClaim) {
      // Show notification
      showMiningCompleteNotification(statusResponse.status.currentReward);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking for completed mining:', error);
    return false;
  }
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
