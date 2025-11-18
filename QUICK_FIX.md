# Quick Notification Fix

## TEST NOW: Tap 🔔 Bell Icon

I added a test button (🔔 bell icon) in the top navigation bar.

**Tap it now** to test if basic notifications work.

### If Test Works ✅
Problem is with mining detection or API. Check backend logs.

### If Test Fails ❌
Problem is with notification permissions.

## Fix Permissions

### Android:
Settings → Apps → Your App → Notifications → Enable

### Check Console:
Should see: `✅ Notification permissions granted`

## Check Backend

Backend should log every 60s:
```
🔍 Checking X active mining sessions...
```

When complete:
```
✅ Session XXX is COMPLETE!
```

## Check Database

```bash
# MongoDB
db.completedminings.find({})
```

Should have records with `notified: false`

## Check App Polling

App should log every 60s:
```
🔍 Checking pending notifications for wallet...
```

## Manual Test

```bash
# Test API
curl http://localhost:3000/api/notifications/pending/YOUR_WALLET

# Trigger backend check
curl -X POST http://localhost:3000/api/notifications/trigger-check
```

## Report Back

Tell me which step fails:
1. Test notification (🔔)
2. Backend detection
3. Database record
4. API response
5. App polling
6. Notification display
