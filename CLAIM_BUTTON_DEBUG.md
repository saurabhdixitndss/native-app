# 🔧 Claim Button Debug Guide

## Issue: Claim Rewards Button Not Working

### Fixes Applied

1. **Button Component Updated**
   - Now properly handles children that are Views (not just text)
   - Checks if children is string or component

2. **Added Console Logging**
   - ClaimPopup logs when mounted
   - ClaimPopup logs when button pressed
   - handleClaimReward logs execution steps
   - Shows session and user data

3. **Added handleClaim Wrapper**
   - ClaimPopup now has internal handleClaim function
   - Checks if onClaim prop exists before calling
   - Logs if onClaim is undefined

### How to Debug

#### Step 1: Check Console Logs

When ClaimPopup appears, you should see:
```
ClaimPopup mounted with: { minedTokens: 51.56, loading: false, hasOnClaim: true }
```

When you click the button, you should see:
```
ClaimPopup: Claim button pressed
🎁 Claim button clicked!
Mining session: { _id: "...", totalEarned: 51.56, ... }
User: { walletAddress: "...", totalTokens: 100 }
📡 Calling claim API for session: ...
✅ Claim response: { claimedAmount: 51.56, newBalance: 151.56 }
```

#### Step 2: Check for Errors

**If you see:**
```
ClaimPopup: onClaim is undefined!
```
**Problem:** onClaim prop not passed correctly
**Solution:** Check App.tsx ClaimPopup rendering

**If you see:**
```
❌ Missing session or user
```
**Problem:** miningSession or user is null
**Solution:** Check state management in App.tsx

**If you see:**
```
❌ Claim error: [error details]
```
**Problem:** Backend API error
**Solution:** Check backend is running and logs

### Expected Flow

```
1. User clicks "Claim Rewards" button
   ↓
2. ClaimPopup: handleClaim() called
   ↓
3. App.tsx: handleClaimReward() called
   ↓
4. Check session and user exist
   ↓
5. Call backend API: POST /api/mining/claim/:sessionId
   ↓
6. Backend updates user balance
   ↓
7. Frontend updates user state
   ↓
8. Hide ClaimPopup
   ↓
9. Show success alert
   ↓
10. Navigate to Home screen
   ↓
11. Show SelectDurationPopup
```

### Test Steps

1. **Start Mining**
   - Select duration and multiplier
   - Wait for completion (or fast-forward)

2. **Check ClaimPopup Appears**
   - Should show correct token amount
   - Button should be visible and enabled

3. **Click Claim Button**
   - Check console for logs
   - Should see loading state
   - Should see success alert
   - Should navigate to home

4. **Verify Balance Updated**
   - Home screen should show new balance
   - SelectDurationPopup should appear

### Common Issues

#### Issue 1: Button Not Responding
**Symptoms:** Click button, nothing happens

**Debug:**
```typescript
// Check console for:
"ClaimPopup: Claim button pressed"
```

**If not showing:** Button TouchableOpacity not working
**Solution:** Check Button component, verify onPress prop

#### Issue 2: onClaim Not Defined
**Symptoms:** Console shows "onClaim is undefined"

**Debug:**
```typescript
// In App.tsx, verify:
<ClaimPopup
  minedTokens={miningSession.totalEarned}
  onClaim={handleClaimReward}  // ← Check this
  loading={loading}
/>
```

**Solution:** Ensure onClaim prop is passed correctly

#### Issue 3: Backend Error
**Symptoms:** Console shows "Claim error: ..."

**Debug:**
```bash
# Check backend logs
cd backend
npm run dev

# Watch for errors when claim is called
```

**Common backend errors:**
- Session not found
- Session already claimed
- User not found
- Database connection error

**Solution:** Check backend logs, verify session exists

#### Issue 4: Session or User Null
**Symptoms:** Console shows "Missing session or user"

**Debug:**
```typescript
// Check state:
console.log('Session:', miningSession);
console.log('User:', user);
```

**Solution:** Ensure session and user are loaded before showing ClaimPopup

### Manual Test

Add this temporary button to test:
```typescript
// In ClaimPopup, add before the real button:
<TouchableOpacity
  onPress={() => {
    console.log('TEST BUTTON PRESSED');
    Alert.alert('Test', 'Button works!');
  }}
  style={{ padding: 20, backgroundColor: 'red' }}
>
  <Text style={{ color: 'white' }}>TEST BUTTON</Text>
</TouchableOpacity>
```

If test button works but real button doesn't:
- Problem is with Button component or props
- Check Button component implementation

If test button also doesn't work:
- Problem is with Modal or TouchableOpacity
- Check z-index, pointerEvents

### Backend API Test

Test claim endpoint manually:
```bash
# Get session ID from console logs
SESSION_ID="your_session_id_here"

# Call claim API
curl -X POST http://localhost:3000/api/mining/claim/$SESSION_ID

# Expected response:
{
  "message": "Reward claimed successfully",
  "claimedAmount": 51.56,
  "newBalance": 151.56,
  "session": { ... }
}
```

### Success Indicators

✅ Console shows: "ClaimPopup: Claim button pressed"
✅ Console shows: "🎁 Claim button clicked!"
✅ Console shows: "✅ Claim response: ..."
✅ Success alert appears
✅ Balance updates on home screen
✅ SelectDurationPopup appears

### Still Not Working?

1. **Clear cache and rebuild:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Check React Native logs:**
   ```bash
   npx react-native log-ios
   # or
   npx react-native log-android
   ```

3. **Verify backend is running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

4. **Check for JavaScript errors:**
   - Open React Native debugger
   - Check for red screen errors
   - Check console for warnings

---

**With the fixes applied, the Claim button should now work correctly!** 🎉
