# 🔧 Troubleshooting Guide

## Issue: Signup Screen Not Showing After Splash

### Symptoms
- Splash screen shows
- After 3.5 seconds, nothing happens or wrong screen appears
- Signup screen doesn't appear for new users

### Root Causes & Solutions

#### 1. AsyncStorage Has Old Data
**Problem:** Old wallet address saved in AsyncStorage

**Solution:**
```typescript
// Clear AsyncStorage manually
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.removeItem('walletAddress');
```

**Or in app:**
- Go to Home Screen
- Click Logout button
- This will clear the saved wallet

#### 2. Backend Not Running
**Problem:** Backend API is not accessible

**Check:**
```bash
# Test if backend is running
curl http://localhost:3000/api/health

# Expected response:
{"status":"ok","message":"Crypto Miner API is running"}
```

**Solution:**
```bash
cd backend
npm run dev
```

#### 3. Network Connection Issue
**Problem:** Frontend can't connect to backend

**For iOS Simulator:**
- Use: `http://localhost:3000/api`

**For Android Emulator:**
- Use: `http://10.0.2.2:3000/api`

**For Real Device:**
- Use your computer's IP address
- Example: `http://192.168.1.100:3000/api`

**Update in:** `src/services/api.ts`
```typescript
export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
  // For real device:
  // default: 'http://YOUR_IP:3000/api',
});
```

#### 4. Error in loadUserData
**Problem:** Error when loading user data causes wrong navigation

**Fixed in latest update:**
- Now catches errors properly
- Clears saved wallet if user doesn't exist
- Shows signup screen on error

**Check console logs:**
```
Splash finished, checking for saved wallet...
No saved wallet, showing signup screen
```

Or if wallet exists:
```
Splash finished, checking for saved wallet...
Found saved wallet: test_user_123
Error loading user data: [error details]
```

### Debug Steps

#### Step 1: Check Console Logs
Look for these messages:
```
✅ "Splash finished, checking for saved wallet..."
✅ "No saved wallet, showing signup screen"
```

Or:
```
✅ "Found saved wallet: xxx"
❌ "Error loading user data: xxx"
```

#### Step 2: Clear App Data
```bash
# iOS
xcrun simctl uninstall booted com.yourapp.bundleid

# Android
adb uninstall com.yourapp.bundleid

# Then reinstall
npx react-native run-ios
# or
npx react-native run-android
```

#### Step 3: Test Backend Connection
```bash
# From your terminal
curl http://localhost:3000/api/health

# Should return:
{"status":"ok","message":"Crypto Miner API is running"}
```

#### Step 4: Check AsyncStorage
Add this to your app temporarily:
```typescript
// In App.tsx, add to handleSplashFinish
const savedWallet = await AsyncStorage.getItem('walletAddress');
console.log('Saved wallet:', savedWallet);

// To clear manually:
await AsyncStorage.clear();
console.log('AsyncStorage cleared');
```

### Expected Flow

#### New User (No Saved Wallet)
```
Splash Screen (3.5s)
    ↓
Check AsyncStorage
    ↓
No wallet found
    ↓
Show Signup Screen ✅
```

#### Existing User (Has Saved Wallet)
```
Splash Screen (3.5s)
    ↓
Check AsyncStorage
    ↓
Wallet found: "test_user_123"
    ↓
Load user data from backend
    ↓
Check for active mining session
    ↓
If active session: Show Mining Screen
If no session: Show Home Screen ✅
```

#### Error Case (Backend Down)
```
Splash Screen (3.5s)
    ↓
Check AsyncStorage
    ↓
Wallet found: "test_user_123"
    ↓
Try to load user data
    ↓
Backend error / User not found
    ↓
Clear saved wallet
    ↓
Show Signup Screen ✅
```

## Common Issues

### Issue: Stuck on Splash Screen
**Cause:** JavaScript error preventing navigation

**Solution:**
1. Check console for errors
2. Restart Metro bundler
3. Clear cache: `npx react-native start --reset-cache`

### Issue: Shows Home Screen Instead of Signup
**Cause:** Old wallet saved in AsyncStorage

**Solution:**
1. Click Logout button on Home Screen
2. Or clear AsyncStorage manually
3. Or reinstall app

### Issue: Backend Connection Failed
**Cause:** Backend not running or wrong URL

**Solution:**
1. Start backend: `cd backend && npm run dev`
2. Check API_BASE_URL in `src/services/api.ts`
3. For Android emulator, use `http://10.0.2.2:3000/api`

### Issue: ClaimPopup Shows 0.00
**Cause:** Backend not calculating tokens

**Solution:**
1. Check backend is running
2. Check backend logs for errors
3. Verify MongoDB is running
4. Check session exists in database

## Quick Fixes

### Force Show Signup Screen
```typescript
// In App.tsx, temporarily change:
const handleSplashFinish = async () => {
  setCurrentScreen('signup'); // Force signup
};
```

### Clear All Data
```typescript
// Add this button temporarily
<Button onPress={async () => {
  await AsyncStorage.clear();
  Alert.alert('Cleared', 'All data cleared. Restart app.');
}}>
  Clear Data
</Button>
```

### Test Without Backend
```typescript
// In handleSplashFinish, comment out backend calls:
const handleSplashFinish = async () => {
  // Skip backend check for testing
  setCurrentScreen('signup');
};
```

## Verification Checklist

- [ ] Backend is running (`npm run dev`)
- [ ] MongoDB is running
- [ ] Backend health check works (`curl http://localhost:3000/api/health`)
- [ ] API_BASE_URL is correct for your platform
- [ ] No errors in console logs
- [ ] AsyncStorage is clear (for new user test)
- [ ] Metro bundler is running
- [ ] App is installed correctly

## Still Not Working?

1. **Check Console Logs**
   ```bash
   # iOS
   npx react-native log-ios
   
   # Android
   npx react-native log-android
   ```

2. **Restart Everything**
   ```bash
   # Kill Metro
   # Kill backend
   # Restart backend
   cd backend && npm run dev
   
   # Restart Metro
   npx react-native start --reset-cache
   
   # Reinstall app
   npx react-native run-ios
   ```

3. **Check Backend Logs**
   ```bash
   cd backend
   npm run dev
   # Watch for errors when app tries to connect
   ```

## Success Indicators

✅ Console shows: "No saved wallet, showing signup screen"
✅ Signup screen appears after splash
✅ Can enter wallet address
✅ Can click "Start Mining" button
✅ Backend responds to API calls

---

**If issue persists, check console logs and backend logs for specific error messages.**
