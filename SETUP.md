# Quick Setup Guide

## Backend Setup

### 1. Configure MongoDB

The backend needs a MongoDB connection string. You have two options:

#### Option A: MongoDB Atlas (Recommended - Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

#### Option B: Local MongoDB
```
mongodb://localhost:27017/apibuilder
```

### 2. Update Backend .env File

Edit `backend/.env` and add your MongoDB URI:

```env
NODE_ENV=development
PORT=5000

# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apibuilder?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:5000
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

### 4. Start Backend

```bash
npm run dev
```

## Frontend Setup

Frontend is already configured! Just run:

```bash
cd frontend
npm run dev
```

## Access the Application

Open your browser to: **http://localhost:5173**

## Default Test Account

You'll need to register a new account on first use.

---

## Troubleshooting

### Backend won't start
- Check that `MONGODB_URI` is set in `backend/.env`
- Verify MongoDB connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas

### Frontend won't start
- Run `npm install` in frontend directory
- Clear node_modules and reinstall if needed

### Can't connect to API
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_URL` in frontend/.env
