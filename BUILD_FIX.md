# Build Fix - AdMob Manifest Conflict

## ✅ Issue Fixed!

The AndroidManifest.xml has been updated to resolve the conflict with the AdMob library.

## What Was Changed

Added `xmlns:tools` and `tools:replace` to the manifest:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    
    ...
    
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-3940256099942544~3347511713"
        tools:replace="android:value"/>
```

This tells Android to use our App ID instead of the library's default.

## How to Build Now

### Step 1: Clean Build
```bash
cd android
./gradlew clean
cd ..
```

### Step 2: Run App
```bash
npm run android
```

## If Still Having Issues

### Option 1: Clean Everything
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Clean Metro cache
npm start -- --reset-cache
```

### Option 2: Rebuild from Scratch
```bash
# Remove build folders
rm -rf android/app/build
rm -rf android/build

# Clean Gradle cache
cd android
./gradlew clean
cd ..

# Run app
npm run android
```

### Option 3: Nuclear Option
```bash
# Stop Metro
# Ctrl+C in Metro terminal

# Clean everything
rm -rf node_modules
rm -rf android/app/build
rm -rf android/build

# Reinstall
npm install

# Rebuild
cd android
./gradlew clean
cd ..

# Run
npm run android
```

## Expected Result

After cleaning and rebuilding, you should see:
```
BUILD SUCCESSFUL
✅ App installed on device
```

Then the app will launch with AdMob working!

## Verification

Once app is running, check logs for:
```
✅ AdMob initialized successfully
✅ Rewarded ad loaded
```

Then test the ad:
1. Start mining
2. Click "UPGRADE MULTIPLIER"
3. Select 2× multiplier
4. Click "Watch Ad & Upgrade"
5. Test ad should appear!

---

**Status**: ✅ Manifest Fixed  
**Next Step**: Clean and rebuild
