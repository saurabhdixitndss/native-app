# 🚀 Quick Reference Card

## Start Commands

```bash
# Backend
cd backend && npm run dev

# Frontend
npx react-native run-ios
# or
npx react-native run-android
```

## Key Features

| Feature | Location | Description |
|---------|----------|-------------|
| 🎬 Splash | SplashScreen.tsx | MoneyTransfer animation, 3.5s |
| 🚪 Logout | HomeScreen (top-right) | Red button, clears session |
| ⬅️ Back | MiningScreen (top-left) | Purple button, cancels mining |
| 🎉 Claim | ClaimPopup (auto) | Confetti, rotating coin, stats |
| ⛏️ Mining | MiningScreen | Real-time counter, progress bar |
| 💰 Balance | HomeScreen | Shows total tokens |

## API Endpoints

```
POST   /api/auth/signup                    # Create/login
GET    /api/auth/balance/:wallet           # Get balance
POST   /api/mining/start                   # Start mining
GET    /api/mining/status/:sessionId       # Get status
POST   /api/mining/claim/:sessionId        # Claim rewards
POST   /api/mining/cancel/:sessionId       # Cancel mining
GET    /api/config                         # Get config
```

## File Locations

```
Splash Animation:    src/assets/MoneyTransfer.json
Confetti Animation:  src/assets/confetti.json
API Service:         src/services/api.ts
Main App:            App.tsx
Backend Server:      backend/src/server.ts
```

## Common Tasks

### Change Mining Rate
```typescript
// backend/src/models/Config.ts
baseRate: 0.02  // Default: 0.01
```

### Change Colors
```typescript
// Any component
colors={['#FBBF24', '#F97316']}  // Gold
colors={['#8B5CF6', '#3B82F6']}  // Purple
```

### Test API
```bash
curl http://localhost:3000/api/health
```

### Clear User Data
```bash
# In app, click Logout button
# Or manually:
AsyncStorage.removeItem('walletAddress')
```

## Mining Rates

| Multiplier | 1h | 4h | 24h |
|------------|----|----|-----|
| 1× | 36 | 144 | 864 |
| 2× | 72 | 288 | 1,728 |
| 3× | 108 | 432 | 2,592 |
| 6× | 216 | 864 | 5,184 |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB is running |
| Can't connect to API | Check API_BASE_URL in api.ts |
| Animation not showing | Check Lottie files exist |
| Mining not updating | Check backend is running |
| Logout not working | Check AsyncStorage permissions |

## Documentation

- `FINAL_IMPLEMENTATION.md` - Complete overview
- `GAME_UI_FEATURES.md` - UI features
- `FRONTEND_SETUP.md` - Setup guide
- `backend/API_DOCUMENTATION.md` - API docs

## Support

Check console logs for errors:
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
npx react-native log-ios
npx react-native log-android
```

---

**Quick Start:** `cd backend && npm run dev` then `npx react-native run-ios` 🚀
