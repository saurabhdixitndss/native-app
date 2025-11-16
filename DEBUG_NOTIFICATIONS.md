# Quick Debug Steps

## Step-by-Step Debugging

### 1. Start Backend with Logs
```bash
cd backend
npm run dev
```

Watch for:
```
✅ Notification service initialized - checking every minute
```

### 2. Check Active Sessions
Open in browser:
```
http://localhost:3000/api/notifications/test/check-sessions
```

Look for:
- `totalActiveSessions`: Should be > 0 if you have mining
- `minutesRemaining`: Should be negative if complete
- `isComplete`: Should be `true` if ready

### 3. Check Completed Notifications
Open in browser:
```
http://localhost:3000/api/notifications/all
```

Should return:
```json
{
  "notifications": [...]
}
```

If empty, mining hasn't completed yet or backend hasn't detected it.

### 4. Watch Backend Logs

Every minute you should see:
```
🔍 Checking X active mining session(s)...
  Session abc123: Y minutes remaining
```

When complete:
```
🔔 Mining completed for wallet 0x1234...
📊 Total completed sessions in memory: 1
```

### 5. Watch Frontend Logs

In Metro bundler console, look for:
```
✅ Started periodic mining completion checks
🔍 Checking for completed mining (all users)...
📡 API Response: { "notifications": [...] }
```

If you see:
```
📋 Found X completed session(s)
🔔 Showing notification for session ...
```

Then notification should appear!

### 6. Force Frontend Check

1. Background app (home button)
2. Foreground app (tap icon)

Should trigger:
```
📱 App came to foreground - checking for completed mining (all users)...
```

## What to Check

| Check | Command/Action | Expected Result |
|-------|---------------|-----------------|
| Backend running | `cd backend && npm run dev` | "Notification service initialized" |
| Active sessions | Browser: `localhost:3000/api/notifications/test/check-sessions` | Shows your session |
| Mining complete | Check `isComplete: true` in test endpoint | Should be true |
| Backend detected | Check backend logs | "🔔 Mining completed..." |
| API has notifications | Browser: `localhost:3000/api/notifications/all` | Returns array with notifications |
| Frontend polling | Check Metro logs | "🔍 Checking for completed mining..." |
| Permissions | Device settings | Notifications enabled |

## Common Problems

### Problem: "totalActiveSessions": 0

**Cause:** No mining session exists or already claimed

**Fix:** Start a new mining session

### Problem: "minutesRemaining": 45

**Cause:** Mining not complete yet

**Fix:** Wait for it to reach 0 or negative

### Problem: Backend never shows "🔔 Mining completed..."

**Cause:** Cron job not running or session not detected

**Fix:** 
1. Restart backend
2. Check MongoDB connection
3. Verify session status is "mining"

### Problem: `/api/notifications/all` returns empty array

**Cause:** Backend hasn't detected completion yet

**Fix:** Wait 1 minute for next cron check

### Problem: Frontend logs show no API calls

**Cause:** Periodic check not started

**Fix:**
1. Restart app
2. Check for "✅ Started periodic mining completion checks"
3. Background/foreground app to trigger check

### Problem: "⚠️ Notification permissions denied"

**Cause:** User denied permissions

**Fix:**
1. Uninstall app
2. Reinstall
3. Grant permissions when asked

## Quick Test (5 minutes)

1. **Backend**: `cd backend && npm run dev`
2. **App**: `npm run android`
3. **Sign up**: Any wallet address
4. **Mine**: Start 1 hour mining
5. **Check**: `localhost:3000/api/notifications/test/check-sessions`
6. **See**: `minutesRemaining: 60` (or less)
7. **Wait**: Until `minutesRemaining` is negative
8. **Watch**: Backend logs for "🔔 Mining completed..."
9. **Check**: `localhost:3000/api/notifications/all` has data
10. **Trigger**: Background/foreground app
11. **See**: Notification! 🎉

## Still Nothing?

Share these logs:

1. **Backend console output** (last 20 lines)
2. **Frontend Metro console** (last 20 lines)
3. **Test endpoint result**: `localhost:3000/api/notifications/test/check-sessions`
4. **All notifications**: `localhost:3000/api/notifications/all`

This will help identify the exact issue!
