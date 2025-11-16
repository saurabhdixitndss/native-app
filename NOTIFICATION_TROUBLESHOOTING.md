# Notification Troubleshooting Guide

## Not Getting Notifications? Follow These Steps

### Step 1: Check Backend is Running

```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Notification service initialized - checking every minute
🔔 Notification service: Active
```

### Step 2: Check if Mining Session Exists

Open your browser or use a tool to check:
```
http://localhost:3000/api/notifications/test/check-sessions
```

This will show:
- All active mining sessions
- How much time remaining
- Whether they're complete

**Example Response:**
```json
{
  "totalActiveSessions": 1,
  "currentTime": "2024-01-01T12:00:00.000Z",
  "sessions": [
    {
      "sessionId": "abc123",
      "wallet": "0x1234...5678",
      "startTime": "01/01/2024 11:00:00",
      "duration": "1 hour(s)",
      "minutesRemaining": 30,
      "isComplete": false,
      "status": "mining"
    }
  ]
}
```

### Step 3: Wait for Mining to Complete

If `minutesRemaining` is positive, wait for it to reach 0.

The backend checks every minute, so within 1 minute of completion, you should see in backend logs:
```
🔔 Mining completed for wallet 0x1234...5678. Reward: 0.3600 tokens
```

### Step 4: Check Backend Detected Completion

Check backend console logs for:
```
🔍 Checking X active mining session(s)...
  Session abc123: -5 minutes remaining  (negative means complete!)
🔔 Mining completed for wallet 0x1234...5678. Reward: 0.3600 tokens
📊 Total completed sessions in memory: 1
```

### Step 5: Check API Returns Notifications

Open browser or use curl:
```
http://localhost:3000/api/notifications/all
```

**Expected Response:**
```json
{
  "notifications": [
    {
      "sessionId": "abc123",
      "walletAddress": "0x1234...5678",
      "message": "Mining complete! 0.3600 tokens ready to claim",
      "totalEarned": 0.36,
      "completedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

If this is empty, backend hasn't detected completion yet. Wait 1 minute for next check.

### Step 6: Check Frontend is Polling

Look at React Native logs (Metro bundler console):
```
✅ Started periodic mining completion checks
🔍 Checking for completed mining (all users)...
📡 API Response: { "notifications": [...] }
```

### Step 7: Check Notification Permissions

**Android:**
1. Go to Settings > Apps > Your App > Notifications
2. Ensure "Allow Notifications" is ON

**iOS:**
1. Go to Settings > Notifications > Your App
2. Ensure "Allow Notifications" is ON

### Step 8: Force Check

To force an immediate check without waiting 5 minutes:

1. **Background the app** (press home button)
2. **Bring app to foreground** (tap app icon)

This triggers `handleAppStateChange` which calls `checkForCompletedMining()`.

You should see in logs:
```
📱 App came to foreground - checking for completed mining (all users)...
🔍 Checking for completed mining (all users)...
```

### Step 9: Check for Errors

Look for error messages in:

**Backend logs:**
```
❌ Error checking completed sessions: ...
```

**Frontend logs:**
```
❌ Error checking for completed mining: ...
```

## Common Issues

### Issue 1: Backend Not Detecting Completion

**Symptom:** Backend logs show "0 active mining sessions" or never shows completion message.

**Solution:**
1. Check MongoDB is running
2. Check mining session was created: `GET /api/mining/active/:walletAddress`
3. Check session status is "mining" (not "claimed" or "cancelled")

### Issue 2: API Returns Empty Notifications

**Symptom:** `/api/notifications/all` returns `{"notifications": []}`

**Solution:**
1. Wait for backend cron job to detect completion (runs every minute)
2. Check backend logs for completion message
3. Restart backend server: `npm run dev`

### Issue 3: Frontend Not Calling API

**Symptom:** No API calls in frontend logs

**Solution:**
1. Check periodic check started: Look for "✅ Started periodic mining completion checks"
2. Restart app
3. Background and foreground app to trigger check

### Issue 4: Notification Permissions Denied

**Symptom:** Logs show "⚠️ Notification permissions denied"

**Solution:**
1. Uninstall app
2. Reinstall app
3. Grant permissions when prompted
4. Or manually enable in device settings

### Issue 5: Notifications Already Shown

**Symptom:** Logs show "⏭️ Session abc123 already notified, skipping"

**Solution:**
This is normal! Each session is notified only once. To test again:
1. Claim the rewards (clears notification)
2. Start a new mining session
3. Wait for completion

## Testing Checklist

- [ ] Backend server running
- [ ] MongoDB connected
- [ ] Mining session created
- [ ] Mining session status is "mining"
- [ ] Mining duration has elapsed
- [ ] Backend logs show completion detected
- [ ] `/api/notifications/all` returns notifications
- [ ] Frontend periodic check is running
- [ ] Notification permissions granted
- [ ] App is not in Do Not Disturb mode

## Quick Test

For fastest testing:

1. **Start backend**: `cd backend && npm run dev`
2. **Start app**: `npm run android`
3. **Sign up** with wallet address
4. **Start mining** with 1 hour duration
5. **Check test endpoint**: `http://localhost:3000/api/notifications/test/check-sessions`
6. **Wait** for `minutesRemaining` to reach 0
7. **Check backend logs** for completion message
8. **Background/foreground app** to trigger check
9. **See notification!** 🎉

## Manual Notification Test

To test notifications without waiting for mining:

1. Start a mining session
2. In MongoDB, update the `miningStartTime` to be 2 hours in the past
3. Wait 1 minute for backend cron job
4. Backend should detect it as complete
5. Frontend should show notification

## Debug Logs

Enable detailed logging by checking these console outputs:

**Backend:**
```
🔍 Checking X active mining session(s)...
  Session abc123: Y minutes remaining
🔔 Mining completed for wallet ...
📊 Total completed sessions in memory: X
📡 GET /api/notifications/all - Found X completed session(s)
```

**Frontend:**
```
✅ Notification permissions granted
✅ Notification channel created
✅ Started periodic mining completion checks
🔍 Checking for completed mining (all users)...
📡 API Response: {...}
📋 Found X completed session(s)
🔔 Showing notification for session ...
✅ Notification shown for wallet ...
```

## Still Not Working?

1. **Restart everything:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop Metro (Ctrl+C)
   cd backend && npm run dev
   # In new terminal:
   npm start
   # In another terminal:
   npm run android
   ```

2. **Check all logs** for error messages

3. **Verify test endpoint** shows your session as complete

4. **Try manual trigger** by backgrounding/foregrounding app

5. **Check device settings** for notification permissions

## Need More Help?

Check these files:
- `NOTIFICATION_SETUP.md` - Setup guide
- `TESTING_NOTIFICATIONS.md` - Testing guide
- `MULTI_USER_NOTIFICATION_ENHANCEMENT.md` - Feature details

Or check the logs - they're very detailed now! 📝
