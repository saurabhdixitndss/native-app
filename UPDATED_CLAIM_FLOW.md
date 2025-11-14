# 🔄 Updated Claim Flow

## New Flow (Correct)

### User Login Flow:

```
User Logs In
    ↓
Load user data from backend
    ↓
Check for active session
    ↓
Store session (if exists)
    ↓
Navigate to Home Screen ✅
    ↓
Home Screen shows:
  - Current balance
  - "Continue Mining" (if session exists)
  - "Start Mining" (if no session)
```

### Start Mining / Continue Mining Flow:

```
User on Home Screen
    ↓
Clicks "Start Mining" or "Continue Mining"
    ↓
Check for active session
    ↓
    ├─ No Session:
    │  └─ Show Duration Selection Popup
    │
    └─ Active Session:
       ↓
       Check session status
       ↓
       ├─ In Progress:
       │  └─ Show Mining Screen
       │
       └─ Complete:
          ↓
          Show Mining Screen
          ↓
          ClaimPopup appears on top ✅
```

### Claim Flow:

```
ClaimPopup visible
    ↓
User clicks "Add to Balance"
    ↓
Backend adds tokens to balance
    ↓
Frontend updates user state
    ↓
Hide ClaimPopup
    ↓
Navigate to Home Screen ✅
    ↓
Show success alert
    ↓
Home Screen displays updated balance ✅
    ↓
User can click "Start Mining" for new session
```

## Key Changes

### 1. Login Always Goes to Home

**Before (Wrong):**
```
Login → Check session → If complete → Show ClaimPopup directly ❌
```

**After (Correct):**
```
Login → Store session → Always go to Home Screen ✅
```

### 2. ClaimPopup Only Shows After User Action

**Before (Wrong):**
```
Login → Auto-show ClaimPopup ❌
```

**After (Correct):**
```
Login → Home Screen → User clicks "Continue Mining" → Show ClaimPopup ✅
```

### 3. After Claim Goes to Home

**Before (Wrong):**
```
Claim → Show Duration Selection ❌
```

**After (Correct):**
```
Claim → Navigate to Home Screen → Show updated balance ✅
```

## Complete User Journey

### Scenario 1: New User

```
1. Splash Screen
2. Signup Screen
3. Enter wallet address
4. Home Screen
   - Balance: 0.00
   - Status: "Ready to Mine"
   - Button: "Start Mining"
5. Click "Start Mining"
6. Duration Selection Popup
7. Select hour and multiplier
8. Mining Screen
9. Mining completes
10. ClaimPopup appears
11. Click "Add to Balance"
12. Navigate to Home Screen
13. Balance updated: 36.00
14. Alert: "Tokens Added!"
15. Click "OK"
16. Can start new mining
```

### Scenario 2: Returning User (Mining In Progress)

```
1. Splash Screen
2. Auto-login
3. Home Screen
   - Balance: 100.00
   - Status: "Mining Active"
   - Button: "Continue Mining"
4. Click "Continue Mining"
5. Mining Screen
   - Shows current progress
   - Timer counting down
   - Tokens accumulating
6. Wait for completion or logout
```

### Scenario 3: Returning User (Mining Complete)

```
1. Splash Screen
2. Auto-login
3. Home Screen
   - Balance: 100.00
   - Status: "Mining Active"
   - Button: "Continue Mining"
4. Click "Continue Mining"
5. Mining Screen appears
6. ClaimPopup appears on top
   - Shows: "You Earned 144.00 TOKENS"
7. Click "Add to Balance"
8. Navigate to Home Screen
9. Balance updated: 244.00
10. Alert: "🎉 Tokens Added!"
11. Click "OK"
12. Home Screen shows:
    - Balance: 244.00
    - Status: "Ready to Mine"
    - Button: "Start Mining"
```

### Scenario 4: User Logs Out During Mining

```
1. User starts mining
2. User logs out
3. Mining continues on backend
4. User logs back in
5. Home Screen
   - Balance: 100.00
   - Status: "Mining Active"
   - Button: "Continue Mining"
6. Click "Continue Mining"
7. Mining Screen shows current progress
8. Can continue watching or go home
```

## Code Changes

### loadUserData (App.tsx)

```typescript
const loadUserData = async (walletAddress: string) => {
  // Get user balance and session
  const [balanceData, sessionData] = await Promise.all([
    authAPI.getBalance(walletAddress),
    miningAPI.getActiveSession(walletAddress),
  ]);

  setUser({
    walletAddress: balanceData.walletAddress,
    totalTokens: balanceData.totalTokens,
  });

  // Store session if exists
  if (sessionData.session) {
    setMiningSession(sessionData.session);
  }

  // Always navigate to Home Screen
  setCurrentScreen('home');  // ← Key change
};
```

### handleClaimReward (App.tsx)

```typescript
const handleClaimReward = async () => {
  // Claim tokens
  const response = await miningAPI.claimReward(miningSession._id);

  // Update balance
  setUser({
    ...user,
    totalTokens: response.newBalance,
  });

  // Clear session and hide popup
  setMiningSession(null);
  setShowClaimPopup(false);

  // Navigate to Home Screen
  setCurrentScreen('home');  // ← Key change

  // Show success alert
  Alert.alert(
    '🎉 Tokens Added!',
    `${response.claimedAmount.toFixed(2)} tokens added!
    New balance: ${response.newBalance.toFixed(2)} tokens`,
    [{ text: 'OK' }]
  );
};
```

## Benefits

### For Users:
✅ **Predictable Flow** - Always starts at Home Screen
✅ **User Control** - User decides when to check mining
✅ **Clear State** - Home Screen shows current status
✅ **Updated Balance** - Balance visible after claiming

### For App:
✅ **Consistent Navigation** - Home is the hub
✅ **Better UX** - No surprise popups on login
✅ **Clear Intent** - User action triggers screens
✅ **Proper State Management** - Balance updates correctly

## Testing Checklist

### Test 1: Fresh Login
- [ ] Login → Goes to Home Screen
- [ ] Balance shows correctly
- [ ] No ClaimPopup appears
- [ ] Can click "Start Mining"

### Test 2: Active Mining
- [ ] Login with active session
- [ ] Goes to Home Screen
- [ ] Shows "Continue Mining"
- [ ] Click button → Shows Mining Screen
- [ ] Progress is correct

### Test 3: Completed Mining
- [ ] Login with completed session
- [ ] Goes to Home Screen
- [ ] Shows "Continue Mining"
- [ ] Click button → Shows Mining Screen
- [ ] ClaimPopup appears
- [ ] Click "Add to Balance"
- [ ] Navigate to Home Screen
- [ ] Balance updated correctly

### Test 4: After Claim
- [ ] Claim tokens
- [ ] Navigate to Home Screen
- [ ] Balance shows new amount
- [ ] Alert shows success
- [ ] Can start new mining

## Summary

🎯 **Key Points:**
- ✅ Login always goes to Home Screen
- ✅ ClaimPopup only shows after user clicks "Continue Mining"
- ✅ After claim, navigate to Home Screen
- ✅ Balance updates correctly after claim
- ✅ User has full control of navigation

🔄 **Flow:**
```
Login → Home → Click Button → Mining/Claim → Claim → Home (Updated Balance)
```

**Your app now has a proper, user-controlled flow!** 🎮✨
