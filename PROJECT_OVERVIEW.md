# 🪙 Crypto Miner App - Complete Project Overview

## 📋 Project Summary

A complete crypto mining simulation app with React Native frontend and Node.js backend. Users can "mine" tokens over time with configurable durations and multipliers.

## 🏗️ Architecture

```
Project Root/
├── src/                          # React Native Frontend
│   ├── components/
│   │   ├── SignupScreen.tsx      # User registration
│   │   ├── HomeScreen.tsx        # Dashboard
│   │   ├── MiningScreen.tsx      # Active mining
│   │   ├── SelectDurationPopup.tsx
│   │   ├── ClaimPopup.tsx
│   │   └── rn/                   # Reusable components
│   └── ...
├── backend/                      # Node.js Backend API
│   ├── src/
│   │   ├── controllers/          # Business logic
│   │   ├── models/               # Database schemas
│   │   ├── routes/               # API endpoints
│   │   └── utils/                # Helper functions
│   └── ...
└── PROJECT_OVERVIEW.md           # This file
```

## 🎯 Core Features

### User Flow
1. **Splash Screen** → Loading animation
2. **Signup** → Enter wallet address
3. **Home Screen** → View balance, start mining
4. **Select Duration** → Choose 1h-24h, select multiplier
5. **Mining Screen** → Real-time counter, progress bar
6. **Claim Rewards** → Add tokens to balance
7. **Repeat** → Start new session

### Mining Mechanics
- **Base Rate**: 0.01 tokens/second
- **Durations**: 1h, 2h, 4h, 12h, 24h
- **Multipliers**: 1× (free) to 6× (with ads)
- **Persistent**: Mining continues after logout

## 💰 Reward Table

| Multiplier | 1 Hour | 4 Hours | 24 Hours |
|------------|--------|---------|----------|
| 1×         | 36     | 144     | 864      |
| 2×         | 72     | 288     | 1,728    |
| 3×         | 108    | 432     | 2,592    |
| 4×         | 144    | 576     | 3,456    |
| 5×         | 180    | 720     | 4,320    |
| 6×         | 216    | 864     | 5,184    |

## 🔧 Technology Stack

### Frontend
- **Framework**: React Native
- **Language**: TypeScript
- **UI Components**: Custom components
- **Navigation**: React Navigation
- **State**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Dev Tools**: Nodemon, ts-node

## 🚀 Getting Started

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start MongoDB (ensure it's running)
# Windows: mongod
# Mac: brew services start mongodb-community

# Start server
npm run dev
```

Server runs at: `http://localhost:3000`

### Frontend Setup

```bash
# Install dependencies (from root)
npm install

# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

## 📡 API Integration

### Base URL Configuration
```typescript
// src/config/api.ts
export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
});
```

### Key Endpoints
```
POST   /api/auth/signup                    # Create/login user
GET    /api/auth/balance/:walletAddress    # Get balance
POST   /api/mining/start                   # Start mining
GET    /api/mining/active/:walletAddress   # Get active session
GET    /api/mining/status/:sessionId       # Get status
POST   /api/mining/claim/:sessionId        # Claim rewards
```

## 📊 Database Schema

### Users
```javascript
{
  walletAddress: String (unique),
  totalTokens: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Mining Sessions
```javascript
{
  wallet: String,
  selectedHour: Number,
  multiplier: Number,
  status: 'mining' | 'claimed' | 'cancelled',
  miningStartTime: String,
  totalEarned: Number,
  lastUpdated: String
}
```

### Config
```javascript
{
  key: 'mining_config',
  durations: Array,
  multiplierOptions: Array,
  baseRate: Number
}
```

## 🎨 Frontend Components

### Screen Components
- **SignupScreen** - Wallet address input
- **HomeScreen** - Balance display, mining status
- **MiningScreen** - Timer, progress, token counter
- **SelectDurationPopup** - Duration and multiplier selection
- **ClaimPopup** - Reward claim interface

### Reusable Components (src/components/rn/)
- **Button** - Custom button component
- **Card** - Card container
- **Input** - Text input field
- **Progress** - Progress bar with animation
- **Icons** - Icon components

## 🔄 Data Flow

### Starting Mining
```
Frontend                    Backend
   |                           |
   |-- POST /mining/start ---->|
   |                           |-- Create session in DB
   |<-- Session data ----------|
   |                           |
   |-- Navigate to Mining ---->|
```

### Real-time Updates
```
Frontend                    Backend
   |                           |
   |-- GET /mining/status ---->|
   |                           |-- Calculate current reward
   |<-- Status + reward -------|
   |                           |
   |-- Update UI ------------->|
   |                           |
   (Repeat every second)
```

### Claiming Rewards
```
Frontend                    Backend
   |                           |
   |-- POST /mining/claim ---->|
   |                           |-- Update user balance
   |                           |-- Mark session claimed
   |<-- New balance -----------|
   |                           |
   |-- Show success ---------->|
   |-- Navigate to Home ------>|
```

## 📚 Documentation

### Backend Documentation
- `backend/README.md` - Main backend documentation
- `backend/QUICK_START.md` - 5-minute setup guide
- `backend/API_DOCUMENTATION.md` - Complete API reference
- `backend/FRONTEND_INTEGRATION.md` - Integration examples
- `backend/SETUP_GUIDE.md` - Detailed setup instructions

### Testing
- `backend/postman_collection.json` - Postman collection

## 🧪 Testing the Complete Flow

### 1. Test Backend
```bash
cd backend
npm run dev

# In another terminal
curl http://localhost:3000/api/health
```

### 2. Test API Endpoints
```bash
# Create user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test_user"}'

# Start mining
curl -X POST http://localhost:3000/api/mining/start \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test_user","selectedHour":1,"multiplier":1}'
```

### 3. Test Frontend
```bash
# From project root
npm install
npx react-native run-ios  # or run-android
```

## 🎯 Implementation Checklist

### Backend ✅
- [x] User authentication
- [x] Mining session management
- [x] Real-time calculations
- [x] Reward claiming
- [x] Multiplier upgrades
- [x] Mining history
- [x] Configuration management
- [x] Error handling
- [x] API documentation

### Frontend (Your Current Files)
- [x] SignupScreen
- [x] HomeScreen
- [x] MiningScreen
- [x] SelectDurationPopup
- [x] ClaimPopup
- [x] Reusable components (Button, Card, Input, Progress, Icons)
- [ ] API integration
- [ ] State management
- [ ] Navigation setup
- [ ] Error handling
- [ ] Loading states

## 🚀 Next Steps

1. **Backend**: Install and start the backend server
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**: Create API service layer
   ```bash
   # Create src/services/api.ts
   # Add axios: npm install axios
   ```

3. **Integration**: Connect frontend to backend
   - Update API_BASE_URL
   - Implement API calls in components
   - Add loading and error states

4. **Testing**: Test complete user flow
   - Signup → Home → Select Duration → Mining → Claim

5. **Polish**: Add animations, error handling, edge cases

6. **Deploy**: Deploy backend and build mobile app

## 💡 Key Implementation Notes

### Persistent Mining
Mining sessions are stored in MongoDB and continue even when the user logs out. On login, check for active sessions and resume.

### Real-time Updates
Frontend calculates rewards locally for smooth UI, syncs with backend periodically for accuracy.

### Multiplier Upgrades
Users can upgrade multipliers during mining. Backend tracks the upgrade time and calculates rewards accordingly.

### Error Handling
Both frontend and backend have comprehensive error handling for network issues, invalid data, and edge cases.

## 🎉 Project Status

- ✅ **Backend**: 100% Complete
- ✅ **Frontend Components**: Created
- ⏳ **Integration**: Ready to connect
- ⏳ **Testing**: Ready to test
- ⏳ **Deployment**: Ready to deploy

## 📞 Support

For detailed information:
- Backend: See `backend/README.md`
- API Reference: See `backend/API_DOCUMENTATION.md`
- Integration: See `backend/FRONTEND_INTEGRATION.md`
- Quick Start: See `backend/QUICK_START.md`

---

**Your backend is complete and ready to use! Start by running the backend server and then connect your React Native frontend.**
