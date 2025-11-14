# 🚀 Quick Start Guide

## Installation (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system.

**Windows:**
```bash
mongod
```

**Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas (cloud):**
Update `.env` with your connection string.

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 3000
📡 API available at http://localhost:3000/api
```

### Step 4: Test the API
Open a new terminal and run:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","message":"Crypto Miner API is running"}
```

## Quick Test Flow

### 1. Create a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test_user_123"}'
```

### 2. Start Mining (1 hour session)
```bash
curl -X POST http://localhost:3000/api/mining/start \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress":"test_user_123",
    "selectedHour":1,
    "multiplier":1
  }'
```

Copy the `_id` from the response (this is your sessionId).

### 3. Check Mining Status
```bash
curl http://localhost:3000/api/mining/status/YOUR_SESSION_ID
```

### 4. Get User Balance
```bash
curl http://localhost:3000/api/auth/balance/test_user_123
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts        # Signup, balance
│   │   ├── miningController.ts      # Start, claim, upgrade
│   │   ├── miningStatusController.ts # Real-time status
│   │   └── configController.ts      # App configuration
│   ├── middleware/
│   │   └── errorHandler.ts          # Error handling
│   ├── models/
│   │   ├── User.ts                  # User schema
│   │   ├── MiningSession.ts         # Session schema
│   │   └── Config.ts                # Config schema
│   ├── routes/
│   │   ├── authRoutes.ts            # /api/auth/*
│   │   ├── miningRoutes.ts          # /api/mining/*
│   │   └── configRoutes.ts          # /api/config/*
│   ├── utils/
│   │   └── miningCalculator.ts      # Mining math
│   └── server.ts                    # Main entry point
├── .env                             # Environment variables
├── package.json
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints Summary

### Auth
- `POST /api/auth/signup` - Create/login user
- `GET /api/auth/balance/:walletAddress` - Get balance

### Mining
- `POST /api/mining/start` - Start mining
- `GET /api/mining/active/:walletAddress` - Get active session
- `GET /api/mining/status/:sessionId` - Get detailed status
- `PUT /api/mining/progress/:sessionId` - Update progress
- `PUT /api/mining/upgrade/:sessionId` - Upgrade multiplier
- `POST /api/mining/claim/:sessionId` - Claim rewards
- `POST /api/mining/cancel/:sessionId` - Cancel session
- `GET /api/mining/history/:walletAddress` - Get history

### Config
- `GET /api/config` - Get configuration
- `PUT /api/config` - Update configuration

## Next Steps

1. ✅ Backend is running
2. 📱 Connect your React Native frontend
3. 🔗 Update API_BASE_URL in frontend
4. 🧪 Test the complete flow
5. 🚀 Deploy to production

## Documentation

- `API_DOCUMENTATION.md` - Complete API reference
- `FRONTEND_INTEGRATION.md` - Frontend integration guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `postman_collection.json` - Import into Postman for testing

## Troubleshooting

**MongoDB connection failed:**
- Check if MongoDB is running
- Verify connection string in `.env`

**Port 3000 already in use:**
- Change PORT in `.env` to 3001 or another port

**TypeScript errors:**
- Run `npm run build` to check for errors
- Ensure all dependencies are installed

## Support

For issues or questions, check the documentation files or review the code comments.

Happy coding! 🎉
