# Admin Portal - Quick Implementation Plan

## 🚀 Quick Start Commands

### 1. Create Admin Backend

```bash
# Create folder and initialize
mkdir admin-backend
cd admin-backend
npm init -y

# Install dependencies
npm install express mongoose cors dotenv morgan bcryptjs jsonwebtoken
npm install -D typescript @types/express @types/node @types/cors @types/morgan @types/bcryptjs @types/jsonwebtoken ts-node nodemon

# Create tsconfig.json
npx tsc --init
```

### 2. Create Admin Frontend

```bash
# Go back to root
cd ..

# Create React app
npx create-react-app admin-portal --template typescript
cd admin-portal

# Install UI and utilities
npm install axios react-router-dom recharts
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## 📁 Admin Backend Structure

```
admin-backend/
├── src/
│   ├── server.ts              # Main server file
│   ├── config/
│   │   └── database.ts        # MongoDB connection (reuse from backend/)
│   ├── models/
│   │   └── Admin.ts           # Admin user model
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   └── errorHandler.ts   # Error handling
│   ├── controllers/
│   │   ├── authController.ts  # Admin login
│   │   ├── userController.ts  # User management
│   │   ├── miningController.ts # Mining management
│   │   └── analyticsController.ts # Analytics
│   └── routes/
│       ├── authRoutes.ts
│       ├── userRoutes.ts
│       ├── miningRoutes.ts
│       └── analyticsRoutes.ts
├── .env
├── package.json
└── tsconfig.json
```

## 📁 Admin Frontend Structure

```
admin-portal/
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── pages/
│   │   ├── Login.tsx          # Admin login
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Users.tsx          # User management
│   │   ├── MiningSessions.tsx # Mining sessions
│   │   ├── Analytics.tsx      # Charts and stats
│   │   └── Settings.tsx       # System settings
│   ├── components/
│   │   ├── Sidebar.tsx        # Navigation
│   │   ├── Header.tsx         # Top bar
│   │   ├── UserTable.tsx      # User list
│   │   ├── SessionTable.tsx   # Session list
│   │   └── StatsCard.tsx      # Dashboard cards
│   ├── services/
│   │   └── api.ts             # API client
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
├── package.json
└── tsconfig.json
```

## 🔑 Key Features to Implement

### Dashboard
- Total users count
- Active sessions count
- Total tokens mined
- Today's revenue

### Users Page
- List all users with pagination
- Search by wallet address
- View user details
- Edit user balance
- View user's mining history

### Mining Sessions Page
- List all sessions
- Filter by status (mining/claimed/cancelled)
- View session details
- Cancel active sessions

### Analytics Page
- User registration chart (last 30 days)
- Mining activity chart
- Token distribution
- Revenue from ads

### Settings Page
- Update mining rates
- Configure multipliers
- Ad settings
- System configuration

## 🔐 Security Implementation

### Admin Authentication
```typescript
// JWT token-based auth
// Admin login with username/password
// Protected routes with middleware
```

### Environment Variables
```env
# admin-backend/.env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/crypto-miner
JWT_SECRET=your-admin-jwt-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=hashed-password
```

## 🎨 UI Design

Using Material-UI for professional look:
- Dark theme
- Responsive layout
- Data tables with sorting/filtering
- Charts with Recharts
- Modal dialogs for actions

## 📊 API Endpoints

### Authentication
```
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/me
```

### Users
```
GET    /api/admin/users
GET    /api/admin/users/:wallet
PUT    /api/admin/users/:wallet
DELETE /api/admin/users/:wallet
```

### Mining Sessions
```
GET    /api/admin/sessions
GET    /api/admin/sessions/:id
POST   /api/admin/sessions/:id/cancel
```

### Analytics
```
GET /api/admin/analytics/dashboard
GET /api/admin/analytics/users
GET /api/admin/analytics/mining
GET /api/admin/analytics/revenue
```

### Configuration
```
GET /api/admin/config
PUT /api/admin/config
```

## 🚀 Running the Admin Portal

### Development

```bash
# Terminal 1 - Main Backend (port 3000)
cd backend
npm run dev

# Terminal 2 - Admin Backend (port 4000)
cd admin-backend
npm run dev

# Terminal 3 - Admin Frontend (port 3001)
cd admin-portal
npm start
```

### Access
- Admin Portal: http://localhost:3001
- Admin API: http://localhost:4000
- Main API: http://localhost:3000

## 📝 Next Steps

1. **Create admin-backend folder** with all backend files
2. **Create admin-portal folder** with React app
3. **Implement authentication** (admin login)
4. **Build dashboard** with stats
5. **Add user management** features
6. **Add mining session** management
7. **Implement analytics** with charts
8. **Add configuration** page

## 💡 Quick Tips

- **Reuse existing models**: Import User and MiningSession from main backend
- **Share database**: Use same MongoDB connection
- **Separate ports**: Admin backend on 4000, main backend on 3000
- **CORS**: Configure to allow admin frontend
- **Authentication**: Use JWT tokens
- **Security**: Hash admin passwords with bcrypt

## 🎯 Minimal Viable Product (MVP)

For quick implementation, start with:
1. ✅ Admin login page
2. ✅ Dashboard with basic stats
3. ✅ User list with search
4. ✅ Mining session list
5. ✅ Basic analytics

Then add:
6. User editing
7. Session management
8. Advanced analytics
9. Configuration management
10. Export features

---

**Ready to implement?** Let me know if you want me to create specific files or need help with any particular feature!
