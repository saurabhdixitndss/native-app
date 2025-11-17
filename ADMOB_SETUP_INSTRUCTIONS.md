# AdMob Setup Instructions for Your App

## ✅ Current Status

**App ID**: `ca-app-pub-3604124226782932~3225406088` ✅ Already configured!

**Ad Unit**: Currently using **TEST AD UNIT** for development

## 📋 Next Steps to Get Real Ads

### Step 1: Create Rewarded Ad Unit in AdMob Console

1. **Go to AdMob Console**
   - Visit: https://apps.admob.google.com
   - Sign in with your Google account

2. **Navigate to Your App**
   - Click "Apps" in left menu
   - Find your app (ID: ca-app-pub-3604124226782932~3225406088)

3. **Create Ad Unit**
   - Click "Ad units" tab
   - Click "ADD AD UNIT" button
   - Select "Rewarded" ad format
   - Name it: "Multiplier Upgrade Reward" (or any name you prefer)
   - Click "CREATE AD UNIT"

4. **Copy Ad Unit ID**
   - You'll get an Ad Unit ID like: `ca-app-pub-3604124226782932/XXXXXXXXXX`
   - **Save this ID** - you'll need it in Step 2

### Step 2: Update Code with Real Ad Unit ID

Once you have your Ad Unit ID, update the code:

**File**: `src/services/adMobService.ts`

Find this line:
```typescript
const adUnitId = TestIds.REWARDED;
```

Replace with your real Ad Unit ID:
```typescript
const adUnitId = 'ca-app-pub-3604124226782932/XXXXXXXXXX'; // Your real Ad Unit ID
```

### Step 3: Build and Test

1. **Clean Build**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. **Build Release**
   ```bash
   cd android
   ./gradlew assembleRelease
   cd ..
   ```

3. **Install and Test**
   ```bash
   npm run android
   ```

## ⚠️ Important Notes

### Test Ads vs Real Ads

**Currently Using**: Test Ads (Google's sample ads)
- ✅ Always show
- ✅ No approval needed
- ✅ Safe for development
- ❌ Don't earn revenue

**After Switching to Real Ads**:
- ⏳ May take 24-48 hours for approval
- ⏳ Ads may not show immediately
- ✅ Will earn revenue
- ⚠️ Must follow AdMob policies

### Testing Real Ads

**DO NOT** click your own ads repeatedly! This can get your account banned.

Instead:
1. Use test devices
2. Add test device ID in AdMob console
3. Or keep using test ads during development

### Ad Serving

Real ads may not always show because:
- App is new (low fill rate)
- Geographic location
- Time of day
- Ad inventory availability

This is normal! Test ads always show, but real ads depend on availability.

## 🔍 Verification Checklist

Before going live with real ads:

- [ ] App ID configured in AndroidManifest.xml ✅ (Already done!)
- [ ] Created Rewarded Ad Unit in AdMob console
- [ ] Copied Ad Unit ID
- [ ] Updated `adMobService.ts` with real Ad Unit ID
- [ ] Built release version
- [ ] Tested on real device
- [ ] Verified ads show (may take 24-48 hours)
- [ ] App published or in testing track

## 📊 Monitoring

### Check Ad Performance

1. **AdMob Console**
   - Go to https://apps.admob.google.com
   - Click "Reports"
   - View impressions, clicks, revenue

2. **Key Metrics**
   - **Impressions**: How many times ad was shown
   - **Fill Rate**: % of ad requests that were filled
   - **eCPM**: Earnings per 1000 impressions
   - **Revenue**: Total earnings

### Troubleshooting

**Ads not showing?**
1. Check AdMob console for errors
2. Verify Ad Unit ID is correct
3. Wait 24-48 hours for approval
4. Check app logs for errors
5. Ensure internet connection

**Low fill rate?**
- Normal for new apps
- Improves over time
- Depends on location and time
- Consider mediation (advanced)

## 🎯 Current Implementation

### Where Ads Show

**Multiplier Upgrades**:
- 1× → Free (no ad)
- 2× → Watch ad
- 3× → Watch ad
- 4× → Watch ad
- 5× → Watch ad

### User Flow

```
User clicks "UPGRADE MULTIPLIER"
    ↓
Selects 2× or higher
    ↓
Clicks "Watch Ad & Upgrade"
    ↓
Rewarded ad shows
    ↓
User watches completely
    ↓
Multiplier upgraded!
```

## 💡 Tips for Success

### 1. Start with Test Ads
- Develop and test with test ads
- Switch to real ads only when ready to publish

### 2. Don't Rush
- Wait for AdMob approval
- Don't panic if ads don't show immediately
- Monitor performance over time

### 3. Follow Policies
- Read AdMob policies
- Don't click your own ads
- Don't encourage users to click ads
- Provide value, not just ads

### 4. Optimize Placement
- Current placement is good (optional upgrade)
- Don't show too many ads
- Balance monetization with user experience

## 📞 Support

### If You Need Help

1. **AdMob Help Center**
   - https://support.google.com/admob

2. **Check Logs**
   - Look for AdMob initialization messages
   - Check for ad loading errors

3. **Test with Test Ads First**
   - Verify everything works with test ads
   - Then switch to real ads

## 🚀 Quick Reference

### Your AdMob Details

```
App ID: ca-app-pub-3604124226782932~3225406088
Ad Unit ID: (Create in AdMob console)
Ad Format: Rewarded
Purpose: Multiplier Upgrade
```

### Files to Update

1. ✅ `android/app/src/main/AndroidManifest.xml` - Already has your App ID
2. ⏳ `src/services/adMobService.ts` - Update with Ad Unit ID when ready

### Commands

```bash
# Clean build
cd android && ./gradlew clean && cd ..

# Build release
cd android && ./gradlew assembleRelease && cd ..

# Run app
npm run android
```

---

**Your App ID**: ca-app-pub-3604124226782932~3225406088 ✅  
**Status**: Ready for Ad Unit creation  
**Next Step**: Create Rewarded Ad Unit in AdMob console
