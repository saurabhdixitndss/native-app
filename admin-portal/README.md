# Admin Portal - Crypto Mining App

A read-only admin dashboard to monitor and analyze your crypto mining application data.

## Features

- 📊 **Dashboard**: Real-time statistics and system overview
- 👥 **User Management**: View all registered users and their token balances
- ⛏️ **Mining Sessions**: Monitor active and completed mining sessions
- 📈 **Analytics**: Detailed insights with charts and top performers

## Tech Stack

### Frontend
- React + Vite
- Vanilla CSS (no external UI libraries)
- Fetch API for HTTP requests

### Backend
- Node.js + Express
- MongoDB (connects to existing crypto-miner database)
- ES6 Modules

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd admin-portal/backend
npm install
```

### 2. Configure Environment Variables

The backend `.env` file is already configured to connect to your existing database:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/crypto-miner
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Install Frontend Dependencies

```bash
cd admin-portal
npm install
```

### 4. Start the Backend Server

```bash
cd admin-portal/backend
npm run dev
```

The backend will start on `http://localhost:4000`

### 5. Start the Frontend Development Server

In a new terminal:

```bash
cd admin-portal
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

All endpoints are prefixed with `/api/admin`:

- `GET /dashboard` - Dashboard statistics
- `GET /users` - List all users (with pagination and search)
- `GET /users/:walletAddress` - Get user details
- `GET /sessions` - List mining sessions (with filters)
- `GET /analytics` - Analytics data
- `GET /config` - Mining configuration

## Database Connection

The admin portal connects to the same MongoDB database as your main crypto mining app (`crypto-miner`). It uses the same schema models:

- **User**: Wallet addresses and token balances
- **MiningSession**: All mining activity
- **Config**: Mining configuration settings

## Read-Only Access

This admin portal is designed for **read-only** access. It only performs:
- Database queries (find, aggregate, count)
- No create, update, or delete operations
- Safe for production monitoring

## Development

### Backend Structure
```
admin-portal/backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   └── adminController.js # Business logic
│   ├── models/
│   │   └── index.js          # Mongoose models
│   ├── routes/
│   │   └── adminRoutes.js    # API routes
│   └── server.js             # Express app
├── .env                      # Environment variables
└── package.json
```

### Frontend Structure
```
admin-portal/src/
├── components/
│   ├── Dashboard.jsx         # Dashboard page
│   ├── Users.jsx             # Users page
│   ├── MiningSessions.jsx    # Sessions page
│   ├── Analytics.jsx         # Analytics page
│   ├── Sidebar.jsx           # Navigation sidebar
│   └── Header.jsx            # Page header
├── services/
│   └── api.js                # API service layer
├── App.jsx                   # Main app component
└── App.css                   # Global styles
```

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running: `mongod`
- Check if port 4000 is available
- Verify `.env` file exists in `admin-portal/backend/`

### Frontend can't connect to backend
- Ensure backend is running on port 4000
- Check CORS settings in `backend/src/server.js`
- Verify API_BASE_URL in `src/services/api.js`

### No data showing
- Ensure your main crypto mining app has created data
- Check MongoDB connection string
- Verify database name is `crypto-miner`

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Update `MONGODB_URI` to production database
3. Deploy to your Node.js hosting (Heroku, Railway, etc.)

### Frontend
1. Update API_BASE_URL in `src/services/api.js` to production backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

## Security Notes

- Add authentication before deploying to production
- Implement rate limiting on API endpoints
- Use environment variables for sensitive data
- Enable HTTPS in production
- Consider IP whitelisting for admin access

## License

MIT
