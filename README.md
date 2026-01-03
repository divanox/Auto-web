# API Builder

A modern no-code backend generator that allows businesses and creators to instantly create RESTful APIs by selecting from predefined modules.

## 🚀 Features

- ✅ Predefined business modules (Products, Blog, Customers, Orders)
- ✅ Auto-generated RESTful CRUD endpoints
- ✅ Secure project-based API tokens
- ✅ Beautiful modern UI with glassmorphism design
- ✅ JWT authentication
- ✅ MongoDB database
- ✅ Ready for Vercel deployment

## 📦 Project Structure

```
API_Builder/
├── backend/          # Node.js + Express + MongoDB
│   ├── config/       # Database configuration
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   ├── services/     # Business logic
│   └── scripts/      # Database seeding
│
└── frontend/         # React + TailwindCSS + Vite
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── contexts/    # React contexts
    │   ├── pages/       # Page components
    │   └── services/    # API services
    └── public/
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Vercel account (for deployment)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🚢 Deployment

### Backend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd backend
```

3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `API_BASE_URL`

### Frontend (Vercel)

1. Deploy:
```bash
cd frontend
vercel --prod
```

2. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` (your backend URL)

## 📖 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Project**: Click "New Project" and provide a name
3. **Enable Modules**: Select modules you want (Products, Blog, etc.)
4. **Get API Credentials**: Copy your API token and base URL
5. **Use Your API**: Make requests to your generated endpoints

### Example API Request

```bash
# Get all products
curl -X GET https://your-api-url/api/v1/YOUR_TOKEN/products

# Create a product
curl -X POST https://your-api-url/api/v1/YOUR_TOKEN/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Product",
    "price": 29.99,
    "sku": "PROD-001",
    "inStock": true
  }'
```

## 🧩 Available Modules

1. **Product Catalog**: Manage products with pricing, SKUs, and inventory
2. **Blog/News**: Create and publish blog posts and articles
3. **Customer Database**: Store customer information and contacts
4. **Orders/Services**: Track orders and service requests

## 🔐 Security

- JWT-based authentication
- API token validation
- Rate limiting
- CORS protection
- Helmet security headers

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ using React, Node.js, MongoDB, and TailwindCSS
