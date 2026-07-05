# TaskFlow - MERN Kanban Task Manager

A full stack task management app built with MongoDB, Express, React, and Node.js.

## Live Site

**Frontend:** https://taskflow-app.vercel.app
**Backend:** https://taskflow-api.vercel.app
**Database:** MongoDB Atlas

---

## Features

- Register, login, and manage your profile
- Create boards and organise tasks in a Kanban layout
- Drag and drop task cards across columns
- Assign tasks to teammates with role-based access
- Set priorities, deadlines, and labels on tasks
- Team management with Owner, Admin, and Member roles

---

## Run Locally

### Backend

cd backend
npm install
cp .env.example .env

Fill in your .env:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_random_string
CLIENT_URL=http://localhost:5173

npm run dev

### Frontend

cd frontend
npm install
cp .env.example .env
npm run dev

Fill in your .env:

VITE_API_URL=http://localhost:5000/api

App runs at http://localhost:5173

---

## Deploy to Vercel

### Backend

1. Go to https://vercel.com and sign in with GitHub
2. Click Add New Project
3. Import your GitHub repository
4. Set Root Directory to backend
5. Set Framework Preset to Other
6. Add these Environment Variables:
   - MONGO_URI = your MongoDB Atlas connection string
   - JWT_SECRET = your secret key
   - CLIENT_URL = your Vercel frontend URL
7. Click Deploy
8. Copy the live backend URL — you will need it for the frontend

### Frontend

1. Click Add New Project again on Vercel
2. Import the same GitHub repository
3. Set Root Directory to frontend
4. Set Framework Preset to Vite
5. Add this Environment Variable:
   - VITE_API_URL = your live backend URL from above + /api
6. Click Deploy
7. Your frontend is now live

### After any code change

git add .
git commit -m "your message"
git push origin main

Vercel redeploys both frontend and backend automatically.

---

## Push to GitHub

git add .
git commit -m "your message"
git push origin main

---

Built by Shahzaib Khan