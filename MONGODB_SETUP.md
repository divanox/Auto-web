# Backend MongoDB Configuration

The backend requires MongoDB to be configured in the `.env` file.

## Quick Setup

1. **Create a MongoDB Atlas account (Free):**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a new M0 (Free) cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string

2. **Edit `backend/.env` file:**

Replace the MONGODB_URI line with your actual connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/apibuilder?retryWrites=true&w=majority
```

**Important:** Replace:
- `YOUR_USERNAME` with your MongoDB username
- `YOUR_PASSWORD` with your MongoDB password
- `YOUR_CLUSTER` with your cluster name

3. **Restart the backend:**
```bash
# Stop the current backend (Ctrl+C)
cd backend
npm run dev
```

4. **Seed the database:**
```bash
npm run seed
```

## Alternative: Local MongoDB

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/apibuilder
```

## Verify Connection

Once configured, you should see in the backend terminal:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

If you see this error instead:
```
❌ Error connecting to MongoDB: The `uri` parameter to `openUri()` must be a string
```

It means the MONGODB_URI is not set in your `.env` file.
