# Quick Start - Mining Completion Notifications

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if not already done)
cd ..
npm install

# For iOS only:
cd ios
pod install
cd ..
```

### Step 2: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Notification service initialized - checking every minute
🔔 Notification service: Active
```

### Step 3: Run the App

```bash
# In a new terminal
npm start

# In another terminal:
npm run android
# OR
npm run ios
```

## ✅ That's It!

The notification system is now active. Here's what happens automatically:

1. **Backend**: Checks for completed mining every minute
2. **Frontend**: Checks every 5 minutes and when app comes to foreground
3. **Notifications**: Appear when mining completes (app open, closed, or backgrounded)

## 🧪 Quick Test

1. Sign up with a wallet address
2. Start mining (select 1 hour for faster testing)
3. Background or close the app
4. Wait for mining to complete
5. 🎉 You'll receive a notification!

## 📱 Permissions

### First Launch
- **iOS**: App will request notification permissions - tap "Allow"
- **Android**: Permissions are granted automatically (Android 12 and below)
- **Android 13+**: App will request notification permissions - tap "Allow"

### If Notifications Don't Appear
Check device settings:
- **iOS**: Settings > Notifications > [Your App] > Allow Notifications
- **Android**: Settings > Apps > [Your App] > Notifications > Enable

## 📚 More Information

- **Full Setup Guide**: See `NOTIFICATION_SETUP.md`
- **Testing Guide**: See `TESTING_NOTIFICATIONS.md`
- **Feature Details**: See `NOTIFICATION_FEATURE_SUMMARY.md`

## 🔧 Configuration

Want to change notification behavior?

### Backend Check Interval
Edit `backend/src/services/notificationService.ts`:
```typescript
// Change from every minute to every 30 seconds:
cron.schedule('*/30 * * * * *', () => {
  checkCompletedSessions();
});
```

### Frontend Polling Interval
Edit `src/services/notificationService.ts`:
```typescript
// Change from 5 minutes to 2 minutes:
checkInterval = setInterval(() => {
  checkForCompletedMining();
}, 2 * 60 * 1000); // 2 minutes
```

## 🐛 Troubleshooting

### Backend not detecting completions?
- Check backend console for cron job logs
- Verify mining session exists in database
- Check session status is "mining"

### Frontend not showing notifications?
- Check notification permissions in device settings
- Verify app is not in Do Not Disturb mode
- Check app logs for notification service initialization

### Still having issues?
See detailed troubleshooting in `TESTING_NOTIFICATIONS.md`

## 🎯 What's Next?

The notification system is ready to use! Users will now receive notifications when their mining completes, making it easy to claim rewards without constantly checking the app.

Enjoy! 🎉
