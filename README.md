# TaskFlow — Kanban Task Management App

A full-stack MERN Kanban app with drag-and-drop task cards, JWT authentication, user assignment, priority tracking, deadlines, and labels.

---

## Tech Stack

| Layer     | Tech                                          |
|-----------|-----------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, @hello-pangea/dnd |
| Backend   | Node.js, Express 4, MongoDB, Mongoose         |
| Auth      | JWT (JSON Web Tokens) + bcryptjs              |
| Deploy    | Vercel (frontend) · Render (backend) · MongoDB Atlas (DB) |

---

## Project Structure

```
taskflow/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Board.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── boardRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Column.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── BoardView.jsx
    │   ├── utils/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## Features

- ✅ Register / Login with JWT authentication
- ✅ Create, rename, and delete boards
- ✅ 4-column Kanban: To Do → In Progress → In Review → Done
- ✅ Drag and drop task cards between columns and within columns
- ✅ Create, edit, and delete tasks
- ✅ Task priority levels (Low / Medium / High) with colour indicators
- ✅ Deadline tracking with overdue warnings
- ✅ Assign multiple teammates to a task (live user search)
- ✅ Custom labels (tags) per task
- ✅ Fully responsive layout — works on mobile, tablet, and desktop
- ✅ Persistent storage via MongoDB Atlas

---

## REST API Reference

### Auth
| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| POST   | /api/auth/register  | ✗    | Register new user    |
| POST   | /api/auth/login     | ✗    | Log in, get JWT      |
| GET    | /api/auth/me        | ✓    | Get current user     |
| GET    | /api/auth/search?q= | ✓    | Search users         |

### Boards
| Method | Endpoint        | Auth | Description              |
|--------|-----------------|------|--------------------------|
| GET    | /api/boards     | ✓    | Get all boards for user  |
| POST   | /api/boards     | ✓    | Create board             |
| GET    | /api/boards/:id | ✓    | Get board + its tasks    |
| PUT    | /api/boards/:id | ✓    | Update board (owner only)|
| DELETE | /api/boards/:id | ✓    | Delete board (owner only)|

### Tasks
| Method | Endpoint            | Auth | Description           |
|--------|---------------------|------|-----------------------|
| POST   | /api/tasks          | ✓    | Create task           |
| PUT    | /api/tasks/:id      | ✓    | Update task fields    |
| PATCH  | /api/tasks/:id/move | ✓    | Move/reorder task     |
| DELETE | /api/tasks/:id      | ✓    | Delete task           |

---

## Local Development Setup

### Prerequisites
- Node.js v18 or later
- npm v9 or later
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

---

### Step 2 — Set up MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in
2. Create a **free M0** cluster
3. Under **Database Access**, create a user with read/write access — save the username and password
4. Under **Network Access**, click **Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect → Drivers**, copy the connection string — it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password, and add `/taskflow` before the `?`:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```

---

### Step 3 — Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_like_64_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The API will run at `http://localhost:5000`. Test it:
```bash
curl http://localhost:5000/api/health
# → {"status":"ok","message":"TaskFlow API running"}
```

---

### Step 4 — Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

Open `frontend/.env` — it should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Register an account and start using TaskFlow!

---

## Pushing to GitHub

### First-time setup

```bash
# In the root taskflow/ folder
git init
git add .
git commit -m "Initial commit: TaskFlow MERN Kanban app"
```

Go to [https://github.com/new](https://github.com/new), create a new **empty** repository named `taskflow` (do NOT add a README or .gitignore on GitHub — you already have one).

```bash
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git branch -M main
git push -u origin main
```

Your code is now on GitHub. ✅

---

## Deploying to Production

### Backend → Render (free tier)

1. Go to [https://render.com](https://render.com) and sign in with GitHub
2. Click **New → Web Service**
3. Connect your `taskflow` repo
4. Set the following:
   - **Name**: `taskflow-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Under **Environment Variables**, add:
   ```
   PORT            = 5000
   MONGO_URI       = mongodb+srv://...your Atlas URI...
   JWT_SECRET      = your_jwt_secret
   JWT_EXPIRE      = 7d
   CLIENT_URL      = https://your-app.vercel.app
   ```
   *(You will update CLIENT_URL after deploying the frontend)*
6. Click **Create Web Service**
7. Wait for the build to complete. Copy your service URL — e.g. `https://taskflow-api.onrender.com`

---

### Frontend → Vercel (free tier)

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `taskflow` repository
4. Set **Root Directory** to `frontend`
5. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://taskflow-api.onrender.com/api
   ```
6. Click **Deploy**
7. Once deployed, copy the Vercel URL — e.g. `https://taskflow.vercel.app`

---

### Final step — update CORS on Render

Go back to your Render service → **Environment** → update `CLIENT_URL`:
```
CLIENT_URL = https://taskflow.vercel.app
```

Click **Save Changes** — Render will redeploy automatically. 🚀

---

## Updating the App

After making changes:

```bash
git add .
git commit -m "feat: describe your change"
git push
```

Both Render and Vercel auto-deploy on every push to `main`.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable    | Description                            | Example                  |
|-------------|----------------------------------------|--------------------------|
| PORT        | Server port                            | 5000                     |
| MONGO_URI   | MongoDB Atlas connection string        | mongodb+srv://...        |
| JWT_SECRET  | Long random string for signing tokens  | my_super_secret_key_123  |
| JWT_EXPIRE  | Token expiry duration                  | 7d                       |
| CLIENT_URL  | Allowed frontend origin (for CORS)     | https://taskflow.vercel.app |

### Frontend (`frontend/.env`)

| Variable      | Description              | Example                              |
|---------------|--------------------------|--------------------------------------|
| VITE_API_URL  | Backend API base URL     | https://taskflow-api.onrender.com/api |

---

## License

MIT — free to use, modify, and showcase in your portfolio.
