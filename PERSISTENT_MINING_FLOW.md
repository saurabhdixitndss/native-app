# 🔄 Persistent Mining Flow

## Overview

Mining now continues in the background even when the user logs out. When they log back in, they'll see either:
- **Mining in progress** - Continue where they left off
- **Mining complete** - Claim popup appears automatically

## Key Features

### 1. ✅ No Cancel Button
- Removed "Cancel Mining" button
- Mining cannot be cancelled once started
- Ensures users complete their mining sessions

### 2. 🏠 Home Button (Top-Right)
- Replaced back button with Home button
- Located in top-right corner
- Navigates to Home screen
- **Mining continues in background**

### 3. 🔄 Persistent Mining
- Mining continues after logout
- Session stored in MongoDB
- Backend tracks elapsed time
- Tokens calculated on backend

### 4. 🎁 Auto-Claim Popup
- When user logs back in
- If mining is complete
- Claim popup appears automatically
- Shows earned tokens

## User Flow

### Scenario 1: Mining in Progress

```
User starts mining (4 hours)
    ↓
User clicks Home button
    ↓
Goes to Home screen
    ↓
Mining continues in background
    ↓
User logs out
    ↓
Mining still continues on backend
    ↓
User logs back in (after 2 hours)
    ↓
App checks active session
    ↓
Mining still in progress (2 hours remaining)
    ↓
Shows Mining Screen with current progress
    ↓
Tokens: ~72 (2 hours × 0.01 × 1×)
    ↓
User can continue watching or go home again
```

### Scenario 2: Mining Complete

```
User starts mining (1 hour)
    ↓
User logs out
    ↓
Mining continues on backend
    ↓
1 hour passes
    ↓
Mining completes on backend
    ↓
User logs back in
    ↓
App checks active session
    ↓
Detects mining is complete
    ↓
Shows Mining Screen
    ↓
Claim Popup appears automatically! 🎉
    ↓
Shows earned tokens: 36.00
    ↓
User clicks "Claim Rewards"
    ↓
Tokens added to balance
    ↓
Navigate to Home
    ↓
Select Duration popup appears
```

### Scenario 3: Home Button During Mining

```
User is on Mining Screen
    ↓
Clicks Home button (top-right)
    ↓
Navigates to Home Screen
    ↓
Mining continues in background
    ↓
User can:
  - View balance
  - Logout
  - Do other things
    ↓
Mining completes in background
    ↓
User clicks "Start Mining" again
    ↓
App detects active session
    ↓
Shows: "You have an active session"
    ↓
Or if complete: Shows Claim Popup
```

## Technical Implementation

### Backend Tracking

**Session Storage:**
```javascript
{
  _id: "session_id",
  wallet: "user_wallet",
  miningStartTime: "14/11/2025 10:00:00",
  selectedHour: 4,
  multiplier: 1,
  status: "mining",
  totalEarned: 0
}
```

**Calculation on Every Request:**
```javascript
// Backend calculates:
elapsedSeconds = Now - miningStartTime
currentReward = baseRate × multiplier × elapsedSeconds
isComplete = elapsedSeconds >= (selectedHour × 3600)
```

### Frontend Flow

**On App Launch:**
```typescript
1. Check AsyncStorage for saved wallet
2. If found, load user data
3. Check for active mining session
4. If session exists:
   - Get mining status from backend
   - If complete: Show claim popup
   - If in progress: Show mining screen
5. If no session: Show home screen
```

**On Login:**
```typescript
const loadUserData = async (walletAddress) => {
  // Get user balance
  const balanceData = await authAPI.getBalance(walletAddress);
  
  // Check for active session
  const sessionData = await miningAPI.getActiveSession(walletAddress);
  
  if (sessionData.session) {
    // Get current status
    const status = await miningAPI.getMiningStatus(sessionData.session._id);
    
    if (status.isComplete) {
      // Show claim popup automatically
      setShowClaimPopup(true);
    } else {
      // Show mining in progress
      setCurrentScreen('mining');
    }
  }
};
```

**Home Button Handler:**
```typescript
const handleGoHome = () => {
  console.log('🏠 Going home, mining continues...');
  setCurrentScreen('home');
  // Mining session remains active
  // Backend continues tracking
};
```

## UI Changes

### Mining Screen

**Before:**
```
┌─────────────────────────────────────┐
│ ← Back                              │
│                                     │
│         ⛏️ MINING IN PROGRESS       │
│                                     │
│         [Mining Details]            │
│                                     │
│    [Upgrade Multiplier]             │
│    [Cancel Mining]                  │
└─────────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────┐
│                          🏠 Home    │
│                                     │
│         ⛏️ MINING IN PROGRESS       │
│                                     │
│         [Mining Details]            │
│                                     │
│    [Upgrade Multiplier]             │
└─────────────────────────────────────┘
```

### Home Screen with Active Mining

```
┌─────────────────────────────────────┐
│  ⚡ CRYPTO MINER ⚡      🚪 Logout  │
│                                     │
│  💰 Balance: 100.00 TOKENS          │
│                                     │
│  ⛏️ Mining Status                   │
│  ● Mining Active                    │
│  [Continue Mining]                  │
│                                     │
│  Note: Mining continues in          │
│  background. Click to view progress │
└─────────────────────────────────────┘
```

## API Endpoints Used

### Check Active Session
```
GET /api/mining/active/:walletAddress

Response:
{
  "session": {
    "_id": "...",
    "status": "mining",
    "miningStartTime": "...",
    "selectedHour": 4,
    "multiplier": 1
  }
}
```

### Get Mining Status
```
GET /api/mining/status/:sessionId

Response:
{
  "session": { ... },
  "status": {
    "elapsedSeconds": 7200,
    "currentReward": 72.00,
    "isComplete": false,
    "remainingSeconds": 7200,
    "canClaim": false
  }
}
```

### Claim Rewards
```
POST /api/mining/claim/:sessionId

Response:
{
  "message": "Reward claimed successfully",
  "claimedAmount": 144.00,
  "newBalance": 244.00,
  "session": { "status": "claimed", ... }
}
```

## Benefits

### For Users
✅ **No Lost Progress** - Mining continues even after logout
✅ **Flexible** - Can leave app and come back anytime
✅ **Automatic** - Claim popup appears when ready
✅ **Simple** - No cancel button to accidentally press

### For App
✅ **Backend Controlled** - All calculations on server
✅ **Accurate** - Time tracked precisely
✅ **Persistent** - Session stored in database
✅ **Reliable** - Works across app restarts

## Testing Scenarios

### Test 1: Logout During Mining
1. Start 1-hour mining
2. Wait 10 seconds
3. Logout
4. Wait 1 minute
5. Login again
6. Should see mining in progress
7. Tokens should reflect ~70 seconds of mining

### Test 2: Complete While Logged Out
1. Start 1-hour mining
2. Logout immediately
3. Wait 1 hour (or fast-forward backend time)
4. Login again
5. Should see Claim Popup automatically
6. Should show 36.00 tokens

### Test 3: Home Button
1. Start mining
2. Click Home button (top-right)
3. Should navigate to Home
4. Mining continues
5. Can logout, do other things
6. Click "Continue Mining" to go back

### Test 4: Multiple Logins
1. Start mining
2. Logout
3. Login again
4. Should resume mining
5. Logout again
6. Login again
7. Should still show same session

## Console Logs

**On Login with Active Session:**
```
Splash finished, checking for saved wallet...
Found saved wallet: user123
Loading user data...
Active session found: session_id_123
Checking mining status...
Mining in progress: 50% complete
Showing mining screen...
```

**On Login with Completed Mining:**
```
Splash finished, checking for saved wallet...
Found saved wallet: user123
Loading user data...
Active session found: session_id_123
Checking mining status...
⏰ Mining completed! Showing claim popup...
Tokens earned: 144.00
```

**On Home Button Click:**
```
🏠 Going home, mining continues in background...
Navigating to home screen...
Session remains active: session_id_123
```

## Summary

🎯 **Key Changes:**
- ❌ Removed Cancel button
- ✅ Added Home button (top-right)
- ✅ Mining persists after logout
- ✅ Auto-show Claim popup when complete
- ✅ Backend tracks everything

🔄 **Flow:**
```
Start Mining → Logout → Mining Continues → Login → 
  ├─ If Complete: Show Claim Popup
  └─ If In Progress: Show Mining Screen
```

**Your mining now works like a real background process!** ⛏️💰
