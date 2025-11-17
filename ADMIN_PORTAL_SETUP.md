# Admin Portal - Quick Start Guide

## What is this?

A complete admin dashboard that connects to your existing crypto mining database and displays:
- User statistics
- Mining session data
- Analytics and insights
- Real-time monitoring

## Quick Start (3 Steps)

### Step 1: Install Backend Dependencies

```bash
cd admin-portal/backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd admin-portal
npm install
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd admin-portal/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd admin-portal
npm run dev
```

Then open: **http://localhost:5173**

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Portal Frontend                 │
│                   (React + Vite)                         │
│                   Port: 5173                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     │
┌────────────────────▼────────────────────────────────────┐
│                Admin Portal Backend                      │
│                (Node.js + Express)                       │
│                   Port: 4000                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Mongoose Queries
                     │
┌────────────────────▼────────────────────────────────────┐
│                    MongoDB                               │
│              Database: crypto-miner                      │
│                                                          │
│  Collections:                                            │
│  - users (wallet addresses, tokens)                      │
│  - miningsessions (mining activity)                      │
│  - configs (app configuration)                           │
└──────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Dashboard
- Total users count
- Active mining sessions
- Total sessions
- Total tokens mined

### 2. Users Page
- List all users with pagination
- Search by wallet address
- View token balances
- See registration dates

### 3. Mining Sessions Page
- View all mining sessions
- Filter by status (mining/claimed/cancelled)
- Filter by wallet address
- See duration, multiplier, and earnings

### 4. Analytics Page
- Status distribution charts
- Multiplier usage statistics
- Top users by tokens
- Average session duration
- Time-based analytics (7/30/90 days)

## Database Models Used

The admin portal uses the **exact same models** as your main crypto mining app:

### User Model
```javascript
{
  walletAddress: String,
  totalTokens: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### MiningSession Model
```javascript
{
  wallet: String,
  createdDate: String,
  multiplier: Number,
  status: 'mining' | 'claimed' | 'cancelled',
  miningStartTime: String,
  currentMultiplierStartTime: String,
  totalEarned: Number,
  currentMiningPoints: Number,
  lastUpdated: String,
  selectedHour: Number
}
```

### Config Model
```javascript
{
  key: String,
  durations: Array,
  multiplierOptions: Array,
  baseRate: Number
}
```

## API Endpoints

Base URL: `http://localhost:4000/api/admin`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dashboard` | GET | Dashboard statistics |
| `/users` | GET | List users (pagination, search) |
| `/users/:walletAddress` | GET | User details |
| `/sessions` | GET | Mining sessions (filters) |
| `/analytics` | GET | Analytics data |
| `/config` | GET | Mining configuration |

## Configuration Files

### Backend `.env`
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/crypto-miner
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend API Config
Located in `admin-portal/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:4000/api/admin';
```

## Technology Stack

### Backend
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging
- **Dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Vanilla CSS** - Styling (no dependencies)
- **Fetch API** - HTTP client

## Read-Only Design

The admin portal is **completely read-only**:

✅ **What it does:**
- Queries database (find, aggregate, count)
- Displays data in tables and charts
- Provides search and filtering
- Shows real-time statistics

❌ **What it doesn't do:**
- Create new records
- Update existing data
- Delete any data
- Modify user balances
- Change mining sessions

This makes it safe to use in production for monitoring without risk of data corruption.

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:**
- Ensure MongoDB is running
- Check if port 4000 is available
- Verify `.env` file exists

### Issue: Frontend shows "Failed to fetch"
**Solution:**
- Ensure backend is running on port 4000
- Check browser console for CORS errors
- Verify API_BASE_URL in `api.js`

### Issue: No data displayed
**Solution:**
- Ensure your main app has created some data
- Check MongoDB connection
- Verify database name is `crypto-miner`

### Issue: Port already in use
**Solution:**
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

## Next Steps

1. ✅ Install dependencies
2. ✅ Start both servers
3. ✅ Open http://localhost:5173
4. 🔒 Add authentication (for production)
5. 🚀 Deploy to hosting service

## Production Checklist

Before deploying to production:

- [ ] Add authentication/authorization
- [ ] Enable HTTPS
- [ ] Set up environment variables
- [ ] Configure CORS for production domain
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Consider IP whitelisting
- [ ] Update API URLs
- [ ] Build frontend (`npm run build`)
- [ ] Test all features

## Support

For issues or questions:
1. Check the console logs (browser & terminal)
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check that ports 4000 and 5173 are available

---

**Ready to start?** Run the commands in Step 3 above! 🚀
