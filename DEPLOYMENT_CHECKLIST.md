# Deployment Checklist - Notification Feature

## Pre-Deployment Checklist

### Backend

- [ ] **Dependencies Installed**
  ```bash
  cd backend
  npm install
  ```

- [ ] **Environment Variables Set**
  - [ ] MongoDB connection string in `.env`
  - [ ] PORT configured (default: 3000)
  - [ ] NODE_ENV set appropriately

- [ ] **Build Successful**
  ```bash
  npm run build
  ```

- [ ] **Server Starts Without Errors**
  ```bash
  npm run dev
  ```
  - [ ] See "Notification service initialized" message
  - [ ] No error messages in console

- [ ] **API Endpoints Working**
  - [ ] Test: `GET /api/health`
  - [ ] Test: `GET /api/notifications/pending/:walletAddress`
  - [ ] Test: `POST /api/notifications/clear/:sessionId`

### Frontend

- [ ] **Dependencies Installed**
  ```bash
  npm install
  ```

- [ ] **iOS Pods Installed** (iOS only)
  ```bash
  cd ios
  pod install
  cd ..
  ```

- [ ] **Android Permissions Added**
  - [ ] Check `android/app/src/main/AndroidManifest.xml` has notification permissions
  - [ ] VIBRATE permission
  - [ ] RECEIVE_BOOT_COMPLETED permission
  - [ ] POST_NOTIFICATIONS permission

- [ ] **iOS Capabilities Added** (iOS only)
  - [ ] Push Notifications capability enabled in Xcode
  - [ ] Notification permissions requested at runtime

- [ ] **API Base URL Configured**
  - [ ] Check `src/services/api.ts` has correct backend URL
  - [ ] Update for production environment if needed

- [ ] **Build Successful**
  ```bash
  npm run android  # or npm run ios
  ```

### Testing

- [ ] **Backend Tests**
  - [ ] Cron job runs every minute
  - [ ] Completed sessions are detected
  - [ ] Notifications are stored correctly
  - [ ] API endpoints return correct data

- [ ] **Frontend Tests**
  - [ ] Notification permissions requested
  - [ ] Periodic checks run every 5 minutes
  - [ ] App state changes trigger checks
  - [ ] Notifications appear when mining completes
  - [ ] Tapping notification opens app
  - [ ] Claim flow works correctly

- [ ] **Integration Tests**
  - [ ] End-to-end: Start mining → Complete → Notification → Claim
  - [ ] Test with app in foreground
  - [ ] Test with app in background
  - [ ] Test with app closed
  - [ ] Test on both iOS and Android

### Performance

- [ ] **Backend Performance**
  - [ ] Cron job doesn't cause high CPU usage
  - [ ] Memory usage is stable
  - [ ] Database queries are optimized

- [ ] **Frontend Performance**
  - [ ] Periodic checks don't drain battery
  - [ ] App remains responsive
  - [ ] No memory leaks

### Security

- [ ] **Backend Security**
  - [ ] Environment variables not committed to git
  - [ ] API endpoints have proper validation
  - [ ] Error messages don't expose sensitive info

- [ ] **Frontend Security**
  - [ ] Wallet addresses stored securely
  - [ ] API calls use HTTPS in production
  - [ ] No sensitive data in logs

## Production Deployment

### Backend

- [ ] **Environment Configuration**
  - [ ] Set `NODE_ENV=production`
  - [ ] Configure production MongoDB URL
  - [ ] Set appropriate PORT

- [ ] **Process Management**
  - [ ] Use PM2 or similar for process management
  - [ ] Configure auto-restart on crash
  - [ ] Set up logging

- [ ] **Monitoring**
  - [ ] Set up error tracking (e.g., Sentry)
  - [ ] Configure log aggregation
  - [ ] Set up uptime monitoring

### Frontend

- [ ] **Build Configuration**
  - [ ] Update API base URL for production
  - [ ] Configure proper app signing
  - [ ] Set correct bundle identifiers

- [ ] **App Store / Play Store**
  - [ ] Request notification permissions in app description
  - [ ] Include screenshots showing notifications
  - [ ] Mention notification feature in release notes

- [ ] **Analytics** (Optional)
  - [ ] Track notification delivery rate
  - [ ] Track notification tap rate
  - [ ] Track claim conversion rate

## Post-Deployment

- [ ] **Monitoring**
  - [ ] Check backend logs for notification service activity
  - [ ] Monitor notification delivery rates
  - [ ] Track user engagement with notifications

- [ ] **User Feedback**
  - [ ] Collect feedback on notification timing
  - [ ] Check for notification permission denial rates
  - [ ] Monitor support requests related to notifications

- [ ] **Optimization**
  - [ ] Adjust check intervals based on usage patterns
  - [ ] Optimize notification messages based on user feedback
  - [ ] Consider adding notification preferences

## Rollback Plan

If issues occur:

1. **Backend Issues**
   - [ ] Disable cron job by commenting out `initNotificationService()`
   - [ ] Restart server
   - [ ] Investigate logs

2. **Frontend Issues**
   - [ ] Disable periodic checks by commenting out `startPeriodicCheck()`
   - [ ] Release hotfix update
   - [ ] Notify users via in-app message

## Future Enhancements

Consider for future releases:

- [ ] Firebase Cloud Messaging for remote push notifications
- [ ] Notification preferences (enable/disable, frequency)
- [ ] Rich notifications with images
- [ ] Notification history in app
- [ ] Multiple notification types (upgrades, achievements, etc.)
- [ ] Scheduled notifications (daily reminders)
- [ ] A/B testing for notification messages

## Support Resources

- [Notification Setup Guide](NOTIFICATION_SETUP.md)
- [Testing Guide](TESTING_NOTIFICATIONS.md)
- [Feature Summary](NOTIFICATION_FEATURE_SUMMARY.md)
- [Quick Start Guide](QUICK_START_NOTIFICATIONS.md)

## Contact

For deployment issues or questions, refer to the documentation files or check the backend logs for detailed error messages.
