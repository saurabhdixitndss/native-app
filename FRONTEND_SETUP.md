# Frontend Setup & Integration Guide

## 📱 Complete Flow Implementation

Your frontend now follows this exact flow:

```
Splash Screen (3 seconds)
    ↓
Signup Screen (if new user) / Home Screen (if existing user)
    ↓
Home Screen → Click "Start Mining"
    ↓
Select Duration Popup (choose hour + multiplier)
    ↓
Mining Screen (real-time counter, timer, progress bar)
    ↓
Mining Complete → Claim Popup appears
    ↓
Click "Claim Rewards" → Tokens added to balance
    ↓
Back to Home Screen → Select Duration Popup appears
    ↓
Repeat...
```

## 🚀 Installation Steps

### 1. Install Required Dependencies

```bash
# Install axios for API calls
npm install axios

# Install lottie for splash animation
npm install lottie-react-native

# For iOS
cd ios && pod install && cd ..
```

### 2. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend will run at `http://localhost:3000`

### 3. Configure API URL

The API URL is already configured in `src/services/api.ts`:
- iOS: `http://localhost:3000/api`
- Android: `http://10.0.2.2:3000/api`

### 4. Run the App

```bash
# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

## 📁 Project Structure

```
src/
├── components/
│   ├── SplashScreen.tsx          ✅ NEW - Loading animation
│   ├── SignupScreen.tsx          ✅ UPDATED - Backend integration
│   ├── HomeScreen.tsx            ✅ UPDATED - Shows balance from backend
│   ├── SelectDurationPopup.tsx   ✅ UPDATED - Uses backend config
│   ├── MiningScreen.tsx          ✅ UPDATED - Real-time backend sync
│   ├── ClaimPopup.tsx            ✅ UPDATED - Claims via backend
│   └── rn/                       ✅ Reusable components
├── services/
│   └── api.ts                    ✅ NEW - Backend API integration
└── assets/
    └── splash-animation.json     ✅ NEW - Splash animation

App.tsx                           ✅ UPDATED - Complete flow management
```

## 🔄 Data Flow

### 1. App Launch
```typescript
Splash Screen (3s)
    ↓
Check AsyncStorage for saved wallet
    ↓
If found: Load user data from backend
If not found: Show Signup Screen
```

### 2. Signup/Login
```typescript
User enters wallet address
    ↓
POST /api/auth/signup
    ↓
Save wallet to AsyncStorage
    ↓
Check for active mining session
    ↓
If active: Go to Mining Screen
If not: Go to Home Screen
```

### 3. Start Mining
```typescript
Home Screen → Click "Start Mining"
    ↓
Show Select Duration Popup
    ↓
User selects hour + multiplier
    ↓
POST /api/mining/start
    ↓
Navigate to Mining Screen
```

### 4. Mining Process
```typescript
Mining Screen loads
    ↓
Every 1 second:
  - GET /api/mining/status/:sessionId
  - Update UI with current reward
  - Check if complete
    ↓
When complete:
  - Show Claim Popup
```

### 5. Claim Rewards
```typescript
User clicks "Claim Rewards"
    ↓
POST /api/mining/claim/:sessionId
    ↓
Backend updates user balance
    ↓
Navigate to Home Screen
    ↓
Show Select Duration Popup (start new session)
```

## 🎯 Key Features Implemented

### ✅ Splash Screen
- 3-second loading animation
- Checks for existing user
- Auto-navigates to appropriate screen

### ✅ Signup Screen
- Wallet address input
- Backend validation
- Auto-login for existing users
- Loading states

### ✅ Home Screen
- Real-time balance display
- Start mining button
- Refresh functionality
- Clean UI

### ✅ Select Duration Popup
- Dynamic durations from backend config
- Multiplier selection (1× free, 2×-6× with ads)
- Estimated reward calculation
- Loading states

### ✅ Mining Screen
- Real-time token counter
- Countdown timer
- Progress bar
- Upgrade multiplier option
- Cancel mining option
- Backend sync every second

### ✅ Claim Popup
- Shows total mined tokens
- Claim button with loading state
- Auto-opens Select Duration after claim

## 🔧 Configuration

### Backend Config
The app fetches configuration from backend:
```typescript
{
  durations: [1h, 2h, 4h, 12h, 24h],
  multiplierOptions: [1×, 2×, 3×, 4×, 5×, 6×],
  baseRate: 0.01 tokens/sec
}
```

### Mining Calculation
```typescript
Effective Rate = Base Rate × Multiplier
Current Reward = Effective Rate × Elapsed Seconds
```

Example:
- Base Rate: 0.01 tokens/sec
- Multiplier: 3×
- Elapsed: 3600 seconds (1 hour)
- Reward: 0.01 × 3 × 3600 = 108 tokens

## 🧪 Testing the Flow

### Test 1: New User Flow
1. Launch app → See splash screen
2. After 3s → See signup screen
3. Enter wallet: "test_user_123"
4. Click "Start Mining" → See home screen
5. Click "Start Mining" → See duration popup
6. Select 1 hour, 1× multiplier
7. Click "Start Mining" → See mining screen
8. Wait for timer or fast-forward time
9. See claim popup
10. Click "Claim Rewards" → Back to home with updated balance

### Test 2: Existing User Flow
1. Launch app → See splash screen
2. After 3s → Auto-login → See home screen
3. Balance shows previous total
4. Can start new mining session

### Test 3: Resume Mining
1. Start mining session
2. Close app
3. Reopen app → See splash screen
4. After 3s → Auto-resume → See mining screen
5. Mining continues from where it left off

## 🐛 Troubleshooting

### Backend Connection Issues
```typescript
// Check if backend is running
curl http://localhost:3000/api/health

// For Android emulator, use:
// http://10.0.2.2:3000/api
```

### Mining Not Starting
- Check backend logs for errors
- Verify no active session exists
- Check network connectivity

### Timer Not Updating
- Ensure backend is running
- Check API response in console
- Verify session ID is correct

## 📱 Platform-Specific Notes

### iOS
- Use `http://localhost:3000/api`
- Simulator works out of the box
- Real device needs backend on same network

### Android
- Use `http://10.0.2.2:3000/api` for emulator
- Real device needs backend IP address
- Update `src/services/api.ts` with your IP

## 🎨 Customization

### Change Mining Rates
Update backend config:
```bash
PUT http://localhost:3000/api/config
{
  "baseRate": 0.02  // Double the rate
}
```

### Add More Durations
Update backend config:
```bash
PUT http://localhost:3000/api/config
{
  "durations": [
    { "h": 0.5, "label": "30 Minutes", "seconds": 1800 }
  ]
}
```

### Change Colors
Edit component styles in respective files

## 🚀 Next Steps

1. ✅ Backend is running
2. ✅ Frontend is integrated
3. ✅ Complete flow is working
4. 🎯 Test the complete user journey
5. 🎨 Customize UI/UX as needed
6. 📱 Test on real devices
7. 🚀 Deploy to production

## 📞 Support

- Backend API: See `backend/API_DOCUMENTATION.md`
- Flow Diagrams: See `backend/FLOW_DIAGRAM.md`
- Project Overview: See `PROJECT_OVERVIEW.md`

---

**Your app is now fully integrated with the backend and ready to use!** 🎉
