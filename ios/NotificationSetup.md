# iOS Notification Setup

## Required Steps for iOS

### 1. Install Pods
```bash
cd ios
pod install
cd ..
```

### 2. Enable Push Notifications Capability
1. Open `ios/app.xcworkspace` in Xcode
2. Select your project in the navigator
3. Select your target
4. Go to "Signing & Capabilities" tab
5. Click "+ Capability"
6. Add "Push Notifications"

### 3. Update Info.plist (if needed)
The app will request notification permissions at runtime. No additional Info.plist changes are required.

### 4. Build and Run
```bash
npm run ios
```

## Testing on iOS

1. When the app first launches, it will request notification permissions
2. Grant the permissions
3. Start a mining session
4. Background or close the app
5. Wait for mining to complete
6. You should receive a notification

## Troubleshooting

- If notifications don't appear, check Settings > Notifications > [Your App Name]
- Ensure "Allow Notifications" is enabled
- Check that notification style is set to "Banners" or "Alerts"
