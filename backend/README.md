# API Builder - Backend

Backend API for the API Builder no-code platform.

## Features

- 🔐 JWT Authentication
- 📦 Project Management
- 🧩 Modular System (4 predefined modules)
- 🚀 Dynamic API Generation
- 📊 MongoDB Database
- ⚡ Rate Limiting & Security

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret

4. Seed the database with predefined modules:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/regenerate-token` - Regenerate API token

### Modules
- `GET /api/modules` - List available modules
- `GET /api/modules/:id` - Get module details
- `GET /api/projects/:projectId/modules` - Get project modules
- `POST /api/projects/:projectId/modules` - Enable module
- `DELETE /api/projects/:projectId/modules/:moduleId` - Disable module

### Dynamic API (Generated per project)
- `GET /api/v1/:token/:module` - List records
- `POST /api/v1/:token/:module` - Create record
- `GET /api/v1/:token/:module/:id` - Get record
- `PUT /api/v1/:token/:module/:id` - Update record
- `DELETE /api/v1/:token/:module/:id` - Delete record

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

Make sure to set environment variables in Vercel dashboard.
