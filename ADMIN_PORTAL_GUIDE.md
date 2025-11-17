# Admin Portal - Complete Setup Guide

## Overview

Creating a full-featured admin portal with:
- **Frontend**: React app in `admin-portal/` folder
- **Backend**: Express API in `admin-backend/` folder
- **Features**: User management, mining sessions, analytics, configuration

## Project Structure

```
project-root/
├── admin-portal/          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── admin-backend/         # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/               # Existing app backend
└── src/                   # Existing React Native app
```

## Features

### Admin Portal Features

1. **Dashboard**
   - Total users
   - Active mining sessions
   - Total tokens mined
   - Revenue from ads

2. **User Management**
   - View all users
   - Search users
   - View user details
   - Edit user balance
   - Ban/unban users

3. **Mining Sessions**
   - View all sessions
   - Filter by status
   - View session details
   - Cancel sessions

4. **Analytics**
   - User growth chart
   - Mining activity chart
   - Token distribution
   - Ad revenue

5. **Configuration**
   - Mining rates
   - Multiplier options
   - Ad settings
   - System settings

## Step-by-Step Implementation

### Step 1: Create Admin Backend

```bash
# Create folder
mkdir admin-backend
cd admin-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose cors dotenv morgan bcryptjs jsonwebtoken
npm install --save-dev typescript @types/express @types/node @types/cors @types/morgan @types/bcryptjs @types/jsonwebtoken ts-node nodemon
```

### Step 2: Create Admin Frontend

```bash
# Create React app
cd ..
npx create-react-app admin-portal --template typescript

# Install dependencies
cd admin-portal
npm install axios react-router-dom recharts @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install --save-dev @types/react-router-dom
```

### Step 3: Configure Admin Backend

Create `admin-backend/tsconfig.json`
Create `admin-backend/.env`
Create backend structure

### Step 4: Configure Admin Frontend

Create pages and components
Set up routing
Connect to backend API

### Step 5: Connect to Existing Database

Use same MongoDB database as main app
Share User and MiningSession models

## Security

- Admin authentication with JWT
- Password hashing with bcrypt
- Protected routes
- CORS configuration
- Rate limiting

## Deployment

- Frontend: Vercel/Netlify
- Backend: Heroku/Railway
- Database: MongoDB Atlas (shared with main app)

## Next Steps

I'll now create all the files for you!
