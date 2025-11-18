// Simple test function to verify notifications work
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

export const testNotification = async () => {
  try {
    console.log('🧪 Testing notification system...');

    // Request permission
    const settings = await notifee.requestPermission();
    console.log('📱 Permission status:', settings.authorizationStatus);

    // Create channel for Android
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'test-channel',
        name: 'Test Channel',
        importance: AndroidImportance.HIGH,
      });
      console.log('✅ Test channel created');
    }

    // Show simple test notification
    await notifee.displayNotification({
      title: '🧪 Test Notification',
      body: 'If you see this, notifications are working!',
      android: {
        channelId: 'test-channel',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });

    console.log('✅ Test notification displayed');
    return true;
  } catch (error) {
    console.error('❌ Test notification failed:', error);
    return false;
  }
};
