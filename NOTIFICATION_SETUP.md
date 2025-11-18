# Mining Completion Notifications

This app now includes automatic notifications when mining sessions are complete!

## Features

✅ **Automatic Notifications** - Get notified when your mining is complete
✅ **Background Monitoring** - App checks mining status even when in background
✅ **Smart Scheduling** - Periodic checks every minute for active sessions
✅ **Rich Notifications** - Shows tokens earned and wallet info
✅ **Action Buttons** - "Claim Now" button in notification (Android)
✅ **Auto-Cancel** - Notifications are removed after claiming

## How It Works

1. **Start Mining** - When you start a mining session, the app begins periodic checks
2. **Background Checks** - Every 60 seconds, the app checks if mining is complete
3. **Notification** - When complete, you receive a notification with:
   - Tokens earned
   - Wallet address
   - "Claim Now" action button
4. **Claim Rewards** - Tap notification or claim in-app to collect tokens
5. **Auto-Cleanup** - Notification is automatically cancelled after claiming

## Technical Details

### Notification Service (`src/services/notificationService.ts`)

- **setupNotifications()** - Initializes notification permissions and channels
- **showMiningCompleteNotification()** - Displays the completion notification
- **checkMiningStatusAndNotify()** - Checks backend and shows notification if complete
- **startPeriodicMiningCheck()** - Starts checking every minute
- **stopPeriodicMiningCheck()** - Stops periodic checks
- **cancelNotification()** - Removes notification

### Android Channel

- **ID**: `mining-complete`
- **Importance**: HIGH
- **Features**: Sound, Vibration, LED lights (purple)
- **Actions**: "Claim Now" button

### iOS Support

- Uses default iOS notification system
- Sound enabled
- Category: `mining-complete`

## Notification Flow

```
User Starts Mining
       ↓
Start Periodic Check (every 60s)
       ↓
Check Mining Status via API
       ↓
Is Complete? → NO → Continue Checking
       ↓ YES
Show Notification
       ↓
User Claims Rewards
       ↓
Cancel Notification & Stop Checks
```

## App State Handling

- **Foreground**: Immediate check when app comes to foreground
- **Background**: Periodic checks continue (every 60 seconds)
- **Terminated**: Checks resume when app reopens with active session

## Permissions

The app requests notification permissions on first launch:
- **Android**: Automatically granted for most devices
- **iOS**: User must approve notification permission

## Testing

To test notifications:
1. Start a short mining session (1 hour)
2. Put app in background
3. Wait for mining to complete
4. You should receive a notification
5. Tap notification to open app and claim

## Notes

- Notifications only show when mining is **complete and ready to claim**
- Multiple sessions are supported (each has unique notification ID)
- Notifications are automatically cleaned up after claiming
- Background checks are battery-efficient (only every 60 seconds)
