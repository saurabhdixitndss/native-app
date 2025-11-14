# 🔄 Crypto Miner App - Flow Diagrams

## User Journey Flow

```
┌─────────────────┐
│  Splash Screen  │
│   (Loading)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Signup Screen  │
│ Enter Wallet    │
└────────┬────────┘
         │
         │ POST /api/auth/signup
         │
         ▼
┌─────────────────┐
│   Home Screen   │
│ Show Balance    │
│ Mining Status   │
└────────┬────────┘
         │
         ├─── Active Session? ───┐
         │                       │
         │ No                    │ Yes
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Select Duration │    │  Mining Screen  │
│ Choose Hour     │    │  (Continue)     │
│ Choose Multi.   │    └─────────────────┘
└────────┬────────┘
         │
         │ POST /api/mining/start
         │
         ▼
┌─────────────────┐
│  Mining Screen  │
│  Timer Running  │
│  Token Counter  │
└────────┬────────┘
         │
         │ Timer Complete?
         │
         ▼
┌─────────────────┐
│  Claim Popup    │
│  Show Rewards   │
└────────┬────────┘
         │
         │ POST /api/mining/claim
         │
         ▼
┌─────────────────┐
│   Home Screen   │
│ Updated Balance │
└─────────────────┘
```

## API Request Flow

### 1. User Signup/Login

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │  Backend │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ POST /api/auth/signup         │                               │
     │ { walletAddress }             │                               │
     ├──────────────────────────────>│                               │
     │                               │                               │
     │                               │ Find user by walletAddress    │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ User exists? Return user      │
     │                               │<──────────────────────────────┤
     │                               │                               │
     │                               │ Or create new user            │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │ { user, isNewUser }           │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
```

### 2. Start Mining Session

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │  Backend │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ POST /api/mining/start        │                               │
     │ { walletAddress,              │                               │
     │   selectedHour,                │                               │
     │   multiplier }                 │                               │
     ├──────────────────────────────>│                               │
     │                               │                               │
     │                               │ Check for active session      │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ No active session found       │
     │                               │<──────────────────────────────┤
     │                               │                               │
     │                               │ Create new mining session     │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │ { session }                   │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
```

### 3. Mining Progress Updates

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │  Backend │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ Every 1 second (client-side)  │                               │
     │ Calculate current reward      │                               │
     │ Update UI                     │                               │
     │                               │                               │
     │ Every 10 seconds              │                               │
     │ GET /api/mining/status/:id    │                               │
     ├──────────────────────────────>│                               │
     │                               │                               │
     │                               │ Get session from DB           │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ Session data                  │
     │                               │<──────────────────────────────┤
     │                               │                               │
     │                               │ Calculate:                    │
     │                               │ - Elapsed seconds             │
     │                               │ - Current reward              │
     │                               │ - Remaining time              │
     │                               │ - Is complete?                │
     │                               │                               │
     │ { session, status }           │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
     │ Update UI with accurate data  │                               │
     │                               │                               │
```

### 4. Upgrade Multiplier

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │  Backend │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ User watches ad               │                               │
     │                               │                               │
     │ PUT /api/mining/upgrade/:id   │                               │
     │ { newMultiplier }             │                               │
     ├──────────────────────────────>│                               │
     │                               │                               │
     │                               │ Get session                   │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ Validate multiplier           │
     │                               │ Update session:               │
     │                               │ - multiplier = new value      │
     │                               │ - currentMultiplierStartTime  │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │ { session }                   │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
     │ Recalculate rewards           │                               │
     │                               │                               │
```

### 5. Claim Rewards

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Frontend │                    │  Backend │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ Timer complete                │                               │
     │ Show claim button             │                               │
     │                               │                               │
     │ POST /api/mining/claim/:id    │                               │
     ├──────────────────────────────>│                               │
     │                               │                               │
     │                               │ Get session                   │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ Get user                      │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ Update user:                  │
     │                               │ totalTokens += totalEarned    │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │                               │ Update session:               │
     │                               │ status = 'claimed'            │
     │                               ├──────────────────────────────>│
     │                               │                               │
     │ { claimedAmount,              │                               │
     │   newBalance,                 │                               │
     │   session }                   │                               │
     │<──────────────────────────────┤                               │
     │                               │                               │
     │ Show success message          │                               │
     │ Navigate to Home              │                               │
     │                               │                               │
```

## Mining Calculation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Mining Calculation                        │
└─────────────────────────────────────────────────────────────┘

Input:
├─ Base Rate: 0.01 tokens/sec
├─ Multiplier: 1-6
├─ Start Time: "14/11/2025 10:30:00"
└─ Current Time: "14/11/2025 11:30:00"

Step 1: Calculate Elapsed Time
├─ Parse start time
├─ Get current time
└─ Elapsed = Current - Start = 3600 seconds (1 hour)

Step 2: Calculate Effective Rate
├─ Effective Rate = Base Rate × Multiplier
└─ Example: 0.01 × 3 = 0.03 tokens/sec

Step 3: Calculate Total Reward
├─ Total Reward = Effective Rate × Elapsed Seconds
└─ Example: 0.03 × 3600 = 108 tokens

Step 4: Check Completion
├─ Total Duration = Selected Hour × 3600
├─ Is Complete = Elapsed >= Total Duration
└─ Remaining = Total Duration - Elapsed

Output:
├─ Current Reward: 108 tokens
├─ Is Complete: true/false
├─ Remaining Seconds: 0
└─ Can Claim: true/false
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend State                            │
└─────────────────────────────────────────────────────────────┘

App State:
├─ user: { walletAddress, totalTokens }
├─ activeSession: { _id, selectedHour, multiplier, ... }
├─ config: { durations, multiplierOptions, baseRate }
└─ miningStatus: { currentReward, remainingTime, isComplete }

State Updates:
├─ On App Load:
│  ├─ Load user from storage
│  ├─ Fetch user balance
│  ├─ Check for active session
│  └─ Load config
│
├─ On Start Mining:
│  ├─ Create session via API
│  ├─ Update activeSession state
│  └─ Navigate to Mining Screen
│
├─ During Mining:
│  ├─ Update currentReward every second (local)
│  ├─ Sync with backend every 10 seconds
│  └─ Check for completion
│
└─ On Claim:
   ├─ Call claim API
   ├─ Update user balance
   ├─ Clear activeSession
   └─ Navigate to Home
```

## Database Operations Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Database Operations                       │
└─────────────────────────────────────────────────────────────┘

Collections:
├─ users
├─ miningsessions
└─ configs

Operations:

1. User Signup:
   ├─ findOne({ walletAddress })
   └─ If not found: create({ walletAddress, totalTokens: 0 })

2. Start Mining:
   ├─ findOne({ wallet, status: 'mining' })
   ├─ If exists: return error
   └─ create({ wallet, selectedHour, multiplier, ... })

3. Get Active Session:
   └─ findOne({ wallet, status: 'mining' })

4. Update Progress:
   ├─ findById(sessionId)
   └─ update({ currentMiningPoints, totalEarned, lastUpdated })

5. Upgrade Multiplier:
   ├─ findById(sessionId)
   └─ update({ multiplier, currentMultiplierStartTime })

6. Claim Reward:
   ├─ findById(sessionId)
   ├─ findOne({ walletAddress })
   ├─ update user: totalTokens += session.totalEarned
   └─ update session: status = 'claimed'

7. Get History:
   └─ find({ wallet }).sort({ createdDate: -1 }).limit(20)
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling                            │
└─────────────────────────────────────────────────────────────┘

Frontend:
├─ Network Error
│  ├─ Catch axios error
│  ├─ Show "Check your connection" message
│  └─ Retry option
│
├─ API Error (4xx, 5xx)
│  ├─ Parse error message from response
│  ├─ Show user-friendly message
│  └─ Log error for debugging
│
└─ Validation Error
   ├─ Check input before API call
   ├─ Show inline validation messages
   └─ Prevent invalid requests

Backend:
├─ Validation Error
│  ├─ Check required fields
│  ├─ Validate data types
│  └─ Return 400 with message
│
├─ Not Found Error
│  ├─ Check if resource exists
│  └─ Return 404 with message
│
├─ Business Logic Error
│  ├─ Check business rules
│  └─ Return 400 with message
│
└─ Server Error
   ├─ Catch unexpected errors
   ├─ Log error details
   └─ Return 500 with generic message
```

---

These diagrams illustrate the complete flow of data and operations in the Crypto Miner App.
