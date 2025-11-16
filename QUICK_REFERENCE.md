# Quick Reference - Mining Notifications

## 🚀 Quick Start

```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
npm run android
```

## 📋 Key Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm start               # Run production build
```

### Frontend
```bash
npm install             # Install dependencies
npm run android         # Run on Android
npm run ios             # Run on iOS
npm start               # Start Metro bundler
npm run lint            # Check code quality
```

### Android Specific
```bash
cd android
./gradlew clean         # Clean build
cd ..
```

### iOS Specific
```bash
cd ios
pod install             # Install pods
cd ..
```

## 🔔 Notification Flow

```
User Starts Mining
    ↓
Backend Checks (Every 1 min)
    ↓
Mining Completes
    ↓
Notification Stored
    ↓
Frontend Detects (Polling/App State)
    ↓
Push Notification Shown
    ↓
User Taps → Alert → Claim → Done!
```

## 📁 Key Files

### Backend
- `backend/src/services/notificationService.ts` - Core notification logic
- `backend/src/controllers/notificationController.ts` - API handlers
- `backend/src/routes/notificationRoutes.ts` - API routes
- `backend/src/server.ts` - Server initialization

### Frontend
- `src/services/notificationService.ts` - Notification service
- `App.tsx` - App integration
- `src/services/api.ts` - API client

## 🔧 Configuration

### Backend Check Interval
File: `backend/src/services/notificationService.ts`
```typescript
// Change from every minute to every 30 seconds:
cron.schedule('*/30 * * * * *', () => {
  checkCompletedSessions();
});
```

### Frontend Polling Interval
File: `src/services/notificationService.ts`
```typescript
// Change from 5 minutes to 2 minutes:
checkInterval = setInterval(() => {
  checkForCompletedMining();
}, 2 * 60 * 1000);
```

## 🌐 API Endpoints

### Get Pending Notifications
```
GET /api/notifications/pending/:walletAddress
```

### Clear Notification
```
POST /api/notifications/clear/:sessionId
```

### Health Check
```
GET /api/health
```

## 🧪 Testing

### Quick Test
1. Start backend: `cd backend && npm run dev`
2. Start app: `npm run android`
3. Sign up with wallet address
4. Start mining (1 hour)
5. Background app
6. Wait for completion
7. Receive notification!

### Manual API Test
```bash
# Get notifications
curl http://localhost:3000/api/notifications/pending/0x1234test

# Clear notification
curl -X POST http://localhost:3000/api/notifications/clear/[sessionId]
```

## 🐛 Troubleshooting

### Backend not detecting?
- Check backend console for cron logs
- Verify MongoDB connection
- Check session status is "mining"

### Frontend not showing?
- Check notification permissions
- Verify app is not in Do Not Disturb
- Check app logs for initialization

### Build errors?
```bash
# Clean everything
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

## 📚 Documentation

- `QUICK_START_NOTIFICATIONS.md` - Quick start guide
- `NOTIFICATION_SETUP.md` - Complete setup
- `TESTING_NOTIFICATIONS.md` - Testing guide
- `NOTIFICATION_FLOW_DIAGRAM.md` - Visual flow
- `LIBRARY_UPDATE_NOTE.md` - Library info
- `BUILD_SUCCESS_SUMMARY.md` - Build status

## 🔑 Key Features

✅ Works with app open, closed, or backgrounded  
✅ Cross-platform (iOS & Android)  
✅ Automatic checks every minute (backend)  
✅ Periodic polling every 5 minutes (frontend)  
✅ Immediate check on app foreground  
✅ Local push notifications  
✅ Alert dialogs with claim option  
✅ Automatic navigation to claim screen

## 📦 Dependencies

### Backend
- `node-cron` - Scheduled tasks
- `express` - Web server
- `mongoose` - MongoDB ODM

### Frontend
- `@notifee/react-native` - Notifications
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Storage

## 🎯 Success Indicators

Backend:
```
✅ Notification service initialized - checking every minute
🔔 Mining completed for wallet...
```

Frontend:
```
✅ Notification permissions granted
✅ Notification channel created
✅ Started periodic mining completion checks
```

## 💡 Tips

1. **First time setup**: Run `npm install` in both root and backend
2. **iOS**: Always run `pod install` after npm install
3. **Android**: Clean build if you encounter issues
4. **Testing**: Use 1-hour duration for faster testing
5. **Logs**: Check both backend and frontend logs

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Run `./gradlew clean` in android folder |
| No notifications | Check permissions in device settings |
| Backend not detecting | Verify cron job is running (check logs) |
| App crashes | Check for TypeScript errors with `npm run lint` |

## 📞 Quick Help

1. Check documentation files
2. Review backend logs
3. Review frontend logs
4. Test API endpoints manually
5. Verify permissions in device settings

---

**Version**: 1.1.0  
**Library**: @notifee/react-native v9.1.8  
**Status**: ✅ Working
