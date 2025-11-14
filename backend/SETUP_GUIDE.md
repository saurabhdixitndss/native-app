# Backend Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (v6 or higher)
   - Local installation OR
   - MongoDB Atlas (cloud)

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

The `.env` file is already created with default values:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/crypto-miner
NODE_ENV=development
```

**For MongoDB Atlas:**
Update `MONGODB_URI` with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto-miner
```

### 3. Start MongoDB (if using local)

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

### 5. Verify Installation

Open browser or use curl:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Crypto Miner API is running"
}
```

## Testing the API

### Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "test_wallet_123"}'
```

### Test Start Mining
```bash
curl -X POST http://localhost:3000/api/mining/start \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "test_wallet_123",
    "selectedHour": 1,
    "multiplier": 1
  }'
```

### Test Get Config
```bash
curl http://localhost:3000/api/config
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # Auth logic
│   │   ├── miningController.ts  # Mining logic
│   │   ├── miningStatusController.ts
│   │   └── configController.ts  # Config logic
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── MiningSession.ts     # Session schema
│   │   └── Config.ts            # Config schema
│   ├── routes/
│   │   ├── authRoutes.ts        # Auth endpoints
│   │   ├── miningRoutes.ts      # Mining endpoints
│   │   └── configRoutes.ts      # Config endpoints
│   ├── utils/
│   │   └── miningCalculator.ts  # Mining calculations
│   └── server.ts                # Main server file
├── .env                         # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### Port Already in Use
Change port in `.env`:
```
PORT=3001
```

### TypeScript Errors
Rebuild the project:
```bash
npm run build
```

## Next Steps

1. Connect frontend to API endpoints
2. Implement real-time updates using WebSockets (optional)
3. Add authentication middleware (JWT)
4. Set up production deployment
