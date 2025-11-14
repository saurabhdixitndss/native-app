# 🪙 Crypto Miner Backend API

Complete backend API for the Crypto Miner mobile application. Built with Node.js, Express, TypeScript, and MongoDB.

## 🎯 Features

- ✅ User authentication with wallet address
- ✅ Mining session management
- ✅ Real-time mining calculations
- ✅ Multiplier upgrades (1× to 6×)
- ✅ Multiple duration options (1h to 24h)
- ✅ Reward claiming system
- ✅ Mining history tracking
- ✅ Configurable mining parameters

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev
```

Server will start at `http://localhost:3000`

For detailed setup instructions, see [QUICK_START.md](QUICK_START.md)

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)** - Frontend integration guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[postman_collection.json](postman_collection.json)** - Postman collection for testing

## 🏗️ Architecture

### Database Models

**User**
- walletAddress (unique)
- totalTokens
- timestamps

**MiningSession**
- wallet
- selectedHour
- multiplier
- status (mining/claimed/cancelled)
- miningStartTime
- totalEarned
- timestamps

**Config**
- durations (1h, 2h, 4h, 12h, 24h)
- multiplierOptions (1× to 6×)
- baseRate (0.01 tokens/sec)

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Create or login user
- `GET /api/auth/balance/:walletAddress` - Get user balance

#### Mining
- `POST /api/mining/start` - Start mining session
- `GET /api/mining/active/:walletAddress` - Get active session
- `GET /api/mining/status/:sessionId` - Get detailed status
- `PUT /api/mining/progress/:sessionId` - Update mining progress
- `PUT /api/mining/upgrade/:sessionId` - Upgrade multiplier
- `POST /api/mining/claim/:sessionId` - Claim rewards
- `POST /api/mining/cancel/:sessionId` - Cancel mining
- `GET /api/mining/history/:walletAddress` - Get mining history

#### Config
- `GET /api/config` - Get mining configuration
- `PUT /api/config` - Update configuration

## 💰 Mining Economics

### Base Rate
0.01 tokens per second

### Multiplier Rewards (per hour)

| Multiplier | Rate (tokens/sec) | 1h Reward | 4h Reward | 24h Reward |
|------------|-------------------|-----------|-----------|------------|
| 1×         | 0.0100            | 36.00     | 144.00    | 864.00     |
| 2×         | 0.0200            | 72.00     | 288.00    | 1,728.00   |
| 3×         | 0.0300            | 108.00    | 432.00    | 2,592.00   |
| 4×         | 0.0400            | 144.00    | 576.00    | 3,456.00   |
| 5×         | 0.0500            | 180.00    | 720.00    | 4,320.00   |
| 6×         | 0.0600            | 216.00    | 864.00    | 5,184.00   |

### Calculation Formula
```
Effective Rate = Base Rate × Multiplier
Total Reward = Effective Rate × Elapsed Seconds
```

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Dev Tools:** Nodemon, ts-node

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Error handling
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.ts        # Entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🔧 Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crypto-miner
NODE_ENV=development
```

## 🧪 Testing

Import `postman_collection.json` into Postman for easy API testing.

Or use curl:
```bash
# Health check
curl http://localhost:3000/api/health

# Create user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test_user"}'

# Start mining
curl -X POST http://localhost:3000/api/mining/start \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test_user","selectedHour":1,"multiplier":1}'
```

## 📱 Frontend Integration

See [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) for React Native integration examples.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
Update `.env` for production:
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/crypto-miner
NODE_ENV=production
```

## 📝 License

ISC

## 🤝 Contributing

This is a complete backend implementation ready for production use.
