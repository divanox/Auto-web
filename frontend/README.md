# API Builder - Frontend

Modern React frontend for the API Builder no-code platform.

## Features

- 🎨 Beautiful UI with TailwindCSS
- ✨ Glassmorphism design
- 🔐 JWT Authentication
- 📱 Responsive design
- ⚡ Fast with Vite
- 🎭 Smooth animations

## Setup

### Prerequisites

- Node.js 18+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL

4. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

Make sure to set `VITE_API_URL` environment variable in Vercel dashboard.

## Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── pages/          # Page components
├── services/       # API services
└── index.css       # Global styles
```
