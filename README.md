# Buxie CRM

A lightweight B2B leads CRM application for tracking companies, interactions, progress, reminders, and comments.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## Features

- **Company Profiles**: Basic company information management.
- **Interactions**: Log emails, calls, and location visits with customizable methods.
- **Progress Tracking**: Update and view the current lead progress state.
- **Reminders & Comments**: Schedule follow-ups and annotate cases.
- **Invite-Only Access**: Admin-managed user invitations with encrypted tokens.
- **Authentication**: JWT-based auth with 2FA support.
- **Audit Logging**: Track user actions for accountability.

## Tech Stack

### Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Caddy for HTTPS (Dockerized)

### Frontend

- React with Vite
- Tailwind CSS
- Axios for HTTP requests
- React Context API for global state

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker & Docker Compose (for local MongoDB and Caddy)

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/S6037747/buxieacquisition.git
   cd buxieacquisition
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/buxie
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### Running the App

Use Docker Compose to start the backend services:

```bash
docker-compose up --build
```

This will launch:

- Backend API at `https://localhost` (via Caddy)
- MongoDB database

In separate terminals, run the frontend and backend dev servers:

```bash
# Backend dev (nodemon)
cd backend
npm run dev

# Frontend dev
cd frontend
npm run dev
```

Open your browser at `http://localhost:3000` to access the app.

## Project Structure

```
buxieacquisition/
├── backend/         # Express API and business logic
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/        # React components and pages
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Admin invite registration
- `POST /api/auth/login` - User login
- `GET /api/company/:id` - Get company data
- `POST /api/company/interaction` - Add interaction
- `POST /api/company/progress` - Update progress
- ... (add more as needed)

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request.
