# Notification Flow Diagram

## Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER STARTS MINING                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MINING SESSION CREATED                           │
│  • Session stored in MongoDB                                        │
│  • Status: "mining"                                                 │
│  • Start time recorded                                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND CRON JOB (Every 1 min)                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Query all active mining sessions                         │  │
│  │  2. Check if current time >= start time + duration           │  │
│  │  3. Calculate final reward                                   │  │
│  │  4. Store in completedSessions Map                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MINING COMPLETE DETECTED                         │
│  • Notification stored in memory                                    │
│  • Console log: "🔔 Mining completed for wallet..."                │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌───────────────────┐  ┌──────────────────┐
        │  FRONTEND POLLING │  │  APP STATE       │
        │  (Every 5 min)    │  │  CHANGE          │
        └─────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│              FRONTEND CHECKS FOR COMPLETED MINING                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  1. Call checkForCompletedMining()                           │  │
│  │  2. Get active session from backend                          │  │
│  │  3. Check mining status                                      │  │
│  │  4. If complete, show notification                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  LOCAL PUSH NOTIFICATION SHOWN                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🎉 Mining Complete!                                         │  │
│  │  You've earned X.XXXX tokens.                                │  │
│  │  Tap to claim your rewards!                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌───────────────────┐  ┌──────────────────┐
        │  USER TAPS        │  │  USER OPENS      │
        │  NOTIFICATION     │  │  APP MANUALLY    │
        └─────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  └──────────┬──────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    APP COMES TO FOREGROUND                          │
│  • handleAppStateChange triggered                                   │
│  • checkPendingNotifications called                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│              QUERY BACKEND FOR PENDING NOTIFICATIONS                │
│  GET /api/notifications/pending/:walletAddress                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ALERT DIALOG SHOWN                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🎉 Mining Complete!                                         │  │
│  │  Mining complete! X.XXXX tokens ready to claim               │  │
│  │                                                               │  │
│  │  [Claim Now]  [Later]                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌───────────────────┐  ┌──────────────────┐
        │  USER CLICKS      │  │  USER CLICKS     │
        │  "CLAIM NOW"      │  │  "LATER"         │
        └─────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  │                     ▼
                  │          ┌──────────────────┐
                  │          │  Notification    │
                  │          │  stays pending   │
                  │          └──────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  CLEAR NOTIFICATION ON BACKEND                      │
│  POST /api/notifications/clear/:sessionId                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LOAD SESSION AND STATUS                          │
│  • Get active session                                               │
│  • Get mining status                                                │
│  • Update session with final earned amount                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  NAVIGATE TO CLAIM SCREEN                           │
│  • Show ClaimScreen component                                       │
│  • Display earned tokens                                            │
│  • Show "Claim Rewards" button                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    USER CLAIMS REWARDS                              │
│  POST /api/mining/claim/:sessionId                                  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSES CLAIM                          │
│  • Update user balance (totalTokens += earned)                      │
│  • Update session status to "claimed"                               │
│  • Return new balance                                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUCCESS ALERT SHOWN                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  🎉 Tokens Added!                                            │  │
│  │  X.XXXX tokens added to your balance!                        │  │
│  │                                                               │  │
│  │  New balance: Y.YYYY tokens                                  │  │
│  │                                                               │  │
│  │  [OK]                                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  NAVIGATE TO HOME SCREEN                            │
│  • Clear mining session                                             │
│  • Update user balance display                                      │
│  • User can start new mining session                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Parallel Processes

### Backend (Continuous)
```
┌─────────────────────────────────────────────────────────────┐
│  CRON JOB (Every 1 minute)                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  while (server running) {                             │  │
│  │    checkCompletedSessions()                           │  │
│  │    wait 1 minute                                      │  │
│  │  }                                                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Frontend (While App Running)
```
┌─────────────────────────────────────────────────────────────┐
│  PERIODIC CHECK (Every 5 minutes)                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  while (app running) {                                │  │
│  │    checkForCompletedMining()                          │  │
│  │    wait 5 minutes                                     │  │
│  │  }                                                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  APP STATE LISTENER (Event-driven)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  on appState change to 'active':                      │  │
│  │    checkForCompletedMining()                          │  │
│  │    checkPendingNotifications()                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Notification Scenarios

### Scenario 1: App in Foreground
```
Mining Complete → Frontend Detects → Alert Dialog → Claim
```

### Scenario 2: App in Background
```
Mining Complete → Frontend Detects → Push Notification → 
User Taps → App Opens → Alert Dialog → Claim
```

### Scenario 3: App Closed
```
Mining Complete → Backend Stores → User Opens App → 
Frontend Checks → Alert Dialog → Claim
```

### Scenario 4: User Returns Later
```
Mining Complete → Backend Stores → (Time passes) → 
User Opens App → Frontend Checks → Alert Dialog → Claim
```

## Key Components

### Backend Components
- **notificationService.ts**: Core logic, cron job, storage
- **notificationController.ts**: HTTP request handlers
- **notificationRoutes.ts**: API endpoint definitions
- **server.ts**: Service initialization

### Frontend Components
- **notificationService.ts**: Notification configuration, checks
- **App.tsx**: Integration, state management, UI
- **api.ts**: API client methods

## Data Flow

```
MongoDB (Mining Sessions)
    ↓
Backend Cron Job (Check completion)
    ↓
In-Memory Map (Completed sessions)
    ↓
REST API (Notification endpoints)
    ↓
Frontend Service (Polling/State changes)
    ↓
Push Notification System (OS level)
    ↓
User Interface (Alerts/Dialogs)
    ↓
User Action (Claim)
    ↓
Backend API (Process claim)
    ↓
MongoDB (Update balance & session)
```

## Timing Diagram

```
Time    Backend         Frontend        User
─────────────────────────────────────────────────
0:00    Mining starts   Session active  Mining...
...     Cron checks     Polling         Mining...
1:00    Complete!       Polling         Mining...
1:01    Stored          Check → Found!  🔔 Notification
1:02    Waiting         Alert shown     Sees alert
1:03    Waiting         Waiting         Clicks "Claim"
1:04    Process claim   Navigate        Sees success
1:05    Updated DB      Home screen     Can mine again
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│  Error Scenarios                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • Backend down → Frontend shows cached data          │  │
│  │  • Network error → Retry on next check               │  │
│  │  • Permission denied → Request permissions            │  │
│  │  • Session not found → Clear notification             │  │
│  │  • Claim fails → Show error, keep notification        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

- **Backend**: O(n) where n = active sessions (typically small)
- **Frontend**: Minimal battery impact (5-minute intervals)
- **Network**: Small payloads (~100 bytes per check)
- **Storage**: In-memory (cleared after claim)
- **Latency**: 1-5 minutes detection time (configurable)

---

This diagram shows the complete flow from mining start to reward claim, including all notification mechanisms and user interactions.
