# Crypto Miner API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### 1. Signup / Login
**POST** `/auth/signup`

Create a new user or login existing user.

**Request Body:**
```json
{
  "walletAddress": "0x123abc..."
}
```

**Response (New User):**
```json
{
  "message": "User created successfully",
  "user": {
    "walletAddress": "0x123abc...",
    "totalTokens": 0
  },
  "isNewUser": true
}
```

**Response (Existing User):**
```json
{
  "message": "User already exists",
  "user": {
    "walletAddress": "0x123abc...",
    "totalTokens": 150.5
  },
  "isNewUser": false
}
```

### 2. Get User Balance
**GET** `/auth/balance/:walletAddress`

Get current token balance for a user.

**Response:**
```json
{
  "walletAddress": "0x123abc...",
  "totalTokens": 150.5
}
```

## Mining Endpoints

### 3. Start Mining Session
**POST** `/mining/start`

Start a new mining session.

**Request Body:**
```json
{
  "walletAddress": "0x123abc...",
  "selectedHour": 4,
  "multiplier": 1
}
```

**Response:**
```json
{
  "message": "Mining session started",
  "session": {
    "_id": "session_id",
    "wallet": "0x123abc...",
    "selectedHour": 4,
    "multiplier": 1,
    "status": "mining",
    "miningStartTime": "14/11/2025 10:30:00",
    "totalEarned": 0
  }
}
```

### 4. Get Active Session
**GET** `/mining/active/:walletAddress`

Get the current active mining session for a user.

**Response:**
```json
{
  "session": {
    "_id": "session_id",
    "wallet": "0x123abc...",
    "selectedHour": 4,
    "multiplier": 1,
    "status": "mining",
    "miningStartTime": "14/11/2025 10:30:00",
    "totalEarned": 25.5
  }
}
```

### 5. Get Mining Status
**GET** `/mining/status/:sessionId`

Get detailed status of a mining session including calculated rewards.

**Response:**
```json
{
  "session": { ... },
  "status": {
    "elapsedSeconds": 3600,
    "currentReward": 36.0,
    "isComplete": false,
    "remainingSeconds": 10800,
    "canClaim": false
  }
}
```

### 6. Update Mining Progress
**PUT** `/mining/progress/:sessionId`

Update the current mining progress (called periodically from frontend).

**Request Body:**
```json
{
  "currentMiningPoints": 25.5,
  "totalEarned": 25.5
}
```

**Response:**
```json
{
  "message": "Mining progress updated",
  "session": { ... }
}
```

### 7. Upgrade Multiplier
**PUT** `/mining/upgrade/:sessionId`

Upgrade the multiplier during an active session.

**Request Body:**
```json
{
  "newMultiplier": 3
}
```

**Response:**
```json
{
  "message": "Multiplier upgraded",
  "session": { ... }
}
```

### 8. Claim Reward
**POST** `/mining/claim/:sessionId`

Claim rewards from a completed mining session.

**Response:**
```json
{
  "message": "Reward claimed successfully",
  "claimedAmount": 144.0,
  "newBalance": 294.5,
  "session": { ... }
}
```

### 9. Cancel Mining
**POST** `/mining/cancel/:sessionId`

Cancel an active mining session.

**Response:**
```json
{
  "message": "Mining session cancelled",
  "session": { ... }
}
```

### 10. Get Mining History
**GET** `/mining/history/:walletAddress`

Get the last 20 mining sessions for a user.

**Response:**
```json
{
  "sessions": [
    {
      "_id": "session_id",
      "wallet": "0x123abc...",
      "selectedHour": 4,
      "multiplier": 2,
      "status": "claimed",
      "totalEarned": 288.0
    }
  ]
}
```

## Config Endpoints

### 11. Get Config
**GET** `/config`

Get mining configuration (durations, multipliers, base rate).

**Response:**
```json
{
  "key": "mining_config",
  "durations": [
    { "h": 1, "label": "1 Hour", "seconds": 3600 },
    { "h": 2, "label": "2 Hours", "seconds": 7200 }
  ],
  "multiplierOptions": [
    { "value": 1, "label": "1×", "requiresAd": false },
    { "value": 2, "label": "2×", "requiresAd": true }
  ],
  "baseRate": 0.01
}
```

### 12. Update Config
**PUT** `/config`

Update mining configuration (admin only).

**Request Body:**
```json
{
  "durations": [...],
  "multiplierOptions": [...],
  "baseRate": 0.01
}
```

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "message": "Wallet address is required"
}
```

**404 Not Found:**
```json
{
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Failed to start mining"
}
```

## Mining Calculation Formula

```
Effective Rate = Base Rate × Multiplier
Total Reward = Effective Rate × Elapsed Seconds
```

Example:
- Base Rate: 0.01 tokens/sec
- Multiplier: 3×
- Duration: 4 hours (14,400 seconds)
- Effective Rate: 0.01 × 3 = 0.03 tokens/sec
- Total Reward: 0.03 × 14,400 = 432 tokens
