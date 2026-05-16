# ⚡ TaskFlow — Team Task Manager

A full-stack team task management app with role-based access control, built with React, Node.js, Express, and MongoDB.

## ✨ Features

- 🔐 JWT Authentication (Signup / Login / Logout)
- 👥 Role-Based Access Control (Admin & Member roles)
- 📁 Project Management — create, update, delete, add/remove members
- ✅ Task Management — create, assign, update status, set priority & due date
- 📊 Dashboard — stats cards + charts (tasks by status, overdue count)
- 🛡️ Admin Panel — manage all users, promote/demote roles
- 📱 Fully responsive dark-mode UI

## 🛠️ Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | React.js, Recharts, Lucide Icons |
| Styling    | Custom CSS (dark design system) |
| Backend    | Node.js + Express.js            |
| Database   | MongoDB (Mongoose)              |
| Auth       | JWT + bcryptjs                  |
| Deployment | Railway                         |

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
# Edit .env: REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
```

## 🔑 Environment Variables

### Server (`server/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📡 API Documentation

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/auth/me` | 🔒 | Get current user |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | 🔒 | List projects (admin=all, member=assigned) |
| POST | `/api/projects` | 🔒 Admin | Create project |
| GET | `/api/projects/:id` | 🔒 | Get project + tasks |
| PUT | `/api/projects/:id` | 🔒 Admin | Update project |
| DELETE | `/api/projects/:id` | 🔒 Admin | Delete project + tasks |
| POST | `/api/projects/:id/members` | 🔒 Admin | Add member |
| DELETE | `/api/projects/:id/members/:userId` | 🔒 Admin | Remove member |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/projects/:id/tasks` | 🔒 | Create task |
| GET | `/api/projects/:id/tasks` | 🔒 | List project tasks |
| GET | `/api/tasks/:id` | 🔒 | Get task details |
| PUT | `/api/tasks/:id` | 🔒 | Update task |
| DELETE | `/api/tasks/:id` | 🔒 | Delete task (admin or creator) |
| PATCH | `/api/tasks/:id/status` | 🔒 | Update status only |

### Dashboard & Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard` | 🔒 | Stats (role-filtered) |
| GET | `/api/admin/users` | 🔒 Admin | List all users |
| PUT | `/api/admin/users/:id/role` | 🔒 Admin | Change user role |
| DELETE | `/api/admin/users/:id` | 🔒 Admin | Delete user |

## 🚂 Railway Deployment

1. Push to GitHub (separate `/client` and `/server` folders)
2. On [Railway.app](https://railway.app):
   - Create new project
   - **Backend service**: Deploy `/server`, set env vars:
     - `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=<frontend-url>`
   - **Frontend service**: Deploy `/client`, set:
     - `REACT_APP_API_URL=<backend-railway-url>/api`
   - Add build command: `npm run build` and start: `npx serve -s build`

## 📋 Role Permissions

| Action | Admin | Member |
|--------|-------|--------|
| Create/Delete Projects | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Create Tasks | ✅ | ✅ (in assigned projects) |
| Edit Any Task | ✅ | Own tasks only |
| Delete Task | ✅ | Own tasks only |
| Update Task Status | ✅ | ✅ (assigned tasks) |
| View All Projects | ✅ | Assigned only |
| Admin Panel | ✅ | ❌ |

## 📝 License

MIT
