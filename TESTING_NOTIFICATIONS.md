# Testing Mining Completion Notifications

## Quick Test Guide

### Prerequisites
1. Backend server running: `cd backend && npm run dev`
2. React Native app running: `npm start` (in separate terminal)
3. App installed on device/emulator

### Test Scenario 1: Short Duration Mining (Recommended for Testing)

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `✅ Notification service initialized - checking every minute`

2. **Start App**
   ```bash
   npm start
   # In another terminal:
   npm run android  # or npm run ios
   ```

3. **Create Account**
   - Enter a wallet address (e.g., `0x1234test`)
   - Sign up

4. **Start Mining**
   - Click "Start Mining"
   - Select "1 Hour" duration
   - Select multiplier (1x for testing)
   - Confirm

5. **Test Notification While App is Open**
   - Wait for mining to complete (or modify duration for faster testing)
   - App should show alert when complete
   - Click "Claim Now" to claim rewards

6. **Test Notification While App is Backgrounded**
   - Start another mining session
   - Press home button (background the app)
   - Wait for completion
   - You should receive a push notification
   - Tap notification to open app and claim

7. **Test Notification While App is Closed**
   - Start another mining session
   - Close the app completely
   - Wait for completion
   - You should receive a push notification
   - Tap notification to open app and claim

### Test Scenario 2: Fast Testing (Modify Duration)

For faster testing, you can temporarily modify the mining duration:

**Option A: Use Shorter Duration in Config**
Edit `backend/src/models/Config.ts` or database to add a test duration like "1 minute"

**Option B: Manually Complete Session**
1. Start mining session
2. In MongoDB or your database, update the `miningStartTime` to be 1+ hours in the past
3. Wait 1 minute for notification service to detect it
4. Notification should appear

### Verification Checklist

- [ ] Backend logs show: `✅ Notification service initialized`
- [ ] Backend logs show: `🔔 Mining completed for wallet...` when session completes
- [ ] App shows local notification when mining completes (app backgrounded)
- [ ] Tapping notification opens app
- [ ] App shows alert dialog with "Claim Now" option
- [ ] Claiming rewards updates balance correctly
- [ ] Notification is cleared after claiming

### Backend Logs to Watch

```
✅ Notification service initialized - checking every minute
🔔 Mining completed for wallet 0x1234test. Reward: 0.3600 tokens
```

### Frontend Logs to Watch

```
✅ Started periodic mining completion checks
📱 App came to foreground - checking for completed mining...
🎉 Mining Complete! notification shown
```

## Testing Different States

### 1. App in Foreground
- Mining completes while user is actively using app
- Should show alert dialog immediately

### 2. App in Background
- Mining completes while app is in background
- Should show push notification
- Tapping notification brings app to foreground

### 3. App Closed
- Mining completes while app is completely closed
- Should show push notification
- Tapping notification launches app

### 4. User Returns to App
- Mining completed while app was closed
- User manually opens app (not via notification)
- Should check for completed mining and show alert

## Common Issues

### Notifications Not Appearing?

1. **Check Permissions**
   - Android: Settings > Apps > [Your App] > Notifications
   - iOS: Settings > Notifications > [Your App]

2. **Check Backend**
   - Is backend server running?
   - Check backend console for notification logs
   - Verify cron job is running (should log every minute)

3. **Check Frontend**
   - Are notification permissions granted?
   - Check app logs for notification service initialization
   - Verify periodic checks are running

4. **Check Mining Session**
   - Is session status still "mining"?
   - Has enough time elapsed?
   - Check session data in database

### Android Specific

- Ensure notification channel is created (check logs)
- Check Do Not Disturb mode
- Verify app has notification permission
- Check battery optimization settings

### iOS Specific

- Ensure notification permissions are granted
- Check notification settings in iOS Settings
- Verify app is not in Low Power Mode
- Check Focus/Do Not Disturb settings

## Manual API Testing

You can test the notification API directly:

### Get Pending Notifications
```bash
curl http://localhost:3000/api/notifications/pending/0x1234test
```

Expected response:
```json
{
  "notifications": [
    {
      "sessionId": "...",
      "message": "Mining complete! 0.3600 tokens ready to claim",
      "totalEarned": 0.36,
      "completedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Clear Notification
```bash
curl -X POST http://localhost:3000/api/notifications/clear/[sessionId]
```

## Performance Notes

- Backend checks every 1 minute (configurable)
- Frontend checks every 5 minutes while app is running (configurable)
- Immediate check when app comes to foreground
- Minimal battery impact

## Next Steps After Testing

Once notifications are working:
1. Adjust check intervals if needed
2. Customize notification messages
3. Add notification preferences
4. Consider adding Firebase Cloud Messaging for production
