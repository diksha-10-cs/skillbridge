# SkillBridge - Complete Backend Technical Documentation

This document contains the complete backend architecture, database schemas, REST API endpoints, and configuration for the **SkillBridge (Student Internship & Placement Tracker)** project.

---

## 1. System Architecture & Tech Stack

```
USER / BROWSER (React 19 + Vite Frontend, Port 5173)
         │  HTTP / REST API (JSON + Bearer JWT)
         ▼
EXPRESS.JS SERVER (Node.js runtime, Port 5000)
   ├── Auth Middleware (JWT Token Verification & User Hydration)
   ├── REST API Routers (/api/auth, /api/internships)
   └── Controllers (Auth & Internship CRUD Logic)
         │  Mongoose ODM (v8)
         ▼
DATABASE (MongoDB Local / MongoDB Atlas Cloud, Port 27017)
   ├── users Collection (Student Credentials, Profile, Skills, Projects)
   └── internships Collection (Applications, Roles, Deadlines, Statuses)
```

---

## 2. Directory Structure

```
SkillBridgee/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & error logging
│   ├── controllers/
│   │   ├── authController.js     # Signup, Login, Profile & Starter Data Seeding
│   │   └── internshipController.js # Internship CRUD & Dashboard Analytics
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer Authentication Guard
│   ├── models/
│   │   ├── User.js               # Student Schema with bcryptjs hashing
│   │   └── Internship.js         # Internship Application Schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── internshipRoutes.js   # Application endpoints
│   ├── .env                      # Environment Variables
│   ├── .env.example              # Sample Environment Variables
│   ├── package.json              # Backend Dependencies
│   └── server.js                 # Express Application Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Hero, Features, ProtectedRoute, etc.
│   │   ├── context/              # AuthContext (stateful session management)
│   │   ├── pages/                # Dashboard, AddInternship, Profile, Login, Signup
│   │   ├── services/             # api.js client service
│   │   ├── App.jsx               # Routes & Auth Provider wrapper
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js            # Vite configuration with API proxy
├── package.json                  # Root runner package (concurrently)
├── start-app.bat                 # One-click full-stack launcher
├── setup-and-install.bat         # Automated installer script
└── BACKEND_DOCUMENTATION.md
```

---

## 3. Database Schema Models

### User Schema (`backend/models/User.js`)
| Field | Type | Description |
|---|---|---|
| `fullName` | String | Student's full name (required) |
| `email` | String | Unique email address (lowercase, indexed) |
| `password` | String | Encrypted password (hashed with bcrypt salt 10) |
| `course` | String | Course / Degree (e.g., B.Sc Computer Science) |
| `college` | String | College or University name |
| `skills` | String | Technical skills (e.g., React, Node.js, SQL) |
| `projects` | String | Notable academic or personal projects |
| `timestamps` | Date | `createdAt` and `updatedAt` |

### Internship Schema (`backend/models/Internship.js`)
| Field | Type | Description |
|---|---|---|
| `user` | ObjectId | Reference to `User` document (owner) |
| `company` | String | Company Name (required) |
| `role` | String | Internship position / job role (required) |
| `date` | String | Application date (YYYY-MM-DD) |
| `status` | Enum | `Applied`, `Interview`, `Selected`, `Rejected` |
| `location` | String | Job mode/location (e.g., Remote, Hybrid, Bangalore) |
| `stipend` | String | Stipend package (e.g., ₹45,000 / month) |
| `notes` | String | Important interview notes or follow-up details |
| `timestamps` | Date | `createdAt` and `updatedAt` |

---

## 4. REST API Endpoint Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student, auto-seed starter applications, return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate student with email & password, return JWT |
| `GET` | `/api/auth/me` | Protected | Fetch current student profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile (name, course, college, skills, projects) |

### Internship Endpoints (`/api/internships`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/internships` | Protected | Retrieve all applications belonging to logged-in user |
| `POST` | `/api/internships` | Protected | Create new internship application |
| `GET` | `/api/internships/stats` | Protected | Compute dashboard metrics (Total, Applied, Interview, Selected, Rejected) |
| `PUT` | `/api/internships/:id` | Protected | Update status, details, or notes of an application |
| `DELETE` | `/api/internships/:id` | Protected | Delete an application |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns server status, app name, and uptime timestamp |

---

## 5. Running the Application

### Method 1: One-Click Launcher (Recommended)
Double-click `start-app.bat` in the root folder. It will:
1. Start Express Backend on `http://localhost:5000`
2. Start Vite Frontend on `http://localhost:5173`
3. Automatically launch your browser

### Method 2: Command Line
```bash
# From workspace root:
npm start

# Or independently:
# Terminal 1 (Backend):
cd backend
npm start

# Terminal 2 (Frontend):
cd frontend
npm run dev
```
