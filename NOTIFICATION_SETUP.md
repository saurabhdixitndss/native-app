# Mining Completion Notification Setup

This application now includes notification functionality that alerts users when their mining session is complete and rewards are ready to claim.

## Features

✅ **Background Monitoring**: Backend checks for completed mining sessions every minute
✅ **Local Notifications**: Push notifications when mining completes (even when app is closed)
✅ **Foreground Checks**: Automatic check when app comes to foreground
✅ **Periodic Polling**: App checks every 5 minutes while running
✅ **Cross-Platform**: Works on both iOS and Android

## How It Works

### Backend Service
- A cron job runs every minute checking for completed mining sessions
- Completed sessions are stored in memory until claimed
- API endpoints allow the app to query pending notifications

### Frontend Service
- Push notifications configured on app startup
- Periodic checks every 5 minutes while app is running
- Immediate check when app comes to foreground
- Shows local notification when mining completes

## User Experience

1. **User starts mining** → Mining session begins
2. **Mining completes** → Backend detects completion
3. **Notification sent** → User receives push notification
4. **User opens app** → Alert shows with "Claim Now" option
5. **User claims** → Tokens added to balance

## Notification Triggers

Notifications are triggered in these scenarios:

1. **App in Background**: Local push notification appears
2. **App in Foreground**: Alert dialog appears
3. **App Closed**: Notification appears in system tray
4. **User Returns**: Check on app launch and foreground

## Testing

To test the notification system:

1. Start a mining session with a short duration (e.g., 1 hour)
2. Close or background the app
3. Wait for mining to complete
4. You should receive a notification
5. Tap notification or open app to see claim prompt

## Configuration

### Backend
- Check interval: Every 1 minute (configurable in `notificationService.ts`)
- Notification storage: In-memory (cleared after claim)

### Frontend
- Polling interval: Every 5 minutes (configurable in `notificationService.ts`)
- Notification channel: "mining-complete" (Android)
- Sound: Default system sound
- Vibration: 300ms

## API Endpoints

### Get Pending Notifications
```
GET /api/notifications/pending/:walletAddress
```

### Clear Notification
```
POST /api/notifications/clear/:sessionId
```

## Permissions Required

### Android
- `android.permission.VIBRATE`
- `android.permission.RECEIVE_BOOT_COMPLETED`
- `android.permission.POST_NOTIFICATIONS`

### iOS
- Notification permissions requested on first launch

## Troubleshooting

### Notifications not appearing?

1. **Check permissions**: Ensure notification permissions are granted
2. **Check backend**: Verify backend server is running
3. **Check logs**: Look for notification service logs in backend console
4. **Test manually**: Call the notification API endpoint directly

### Android specific:
- Ensure notification channel is created
- Check Do Not Disturb settings
- Verify app has notification permission in system settings

### iOS specific:
- Ensure notification permissions are granted
- Check notification settings in iOS Settings app
- Verify app is not in Low Power Mode

## Future Enhancements

Potential improvements:
- Firebase Cloud Messaging for remote push notifications
- Notification history/inbox
- Customizable notification sounds
- Notification preferences (enable/disable)
- Multiple notification types (multiplier upgrades, etc.)
