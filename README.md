# SkillBridge - Student Internship & Placement Tracker 🎓

**SkillBridge** is a modern, full-stack web application designed for students and job seekers to manage, monitor, and organize their internship and campus placement applications in one centralized dashboard.

---

## 🚀 Features

- **JWT Student Authentication**: Secure signup and login with hashed passwords (bcryptjs) and bearer tokens.
- **Auto Data Seeding**: Automatically seeds sample applications for newly registered students so the dashboard is immediately interactive.
- **Application Tracking & Status Management**: Real-time tracking of applications across statuses (`Applied`, `Interview`, `Selected`, `Rejected`).
- **Dynamic Dashboard Metrics**: Live KPI counters for total applications, scheduled interviews, offers received, and rejected applications.
- **Instant Search & Status Filtering**: Quickly search by company name, role, or location, and filter by application stage.
- **Student Profile Management**: Manage degree, college, technical skill tags, and featured project links.
- **Full-Stack REST Architecture**: Express + Mongoose (MongoDB) backend connected to a responsive React 19 + Vite frontend.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7, Vite, Vanilla CSS
- **Backend**: Node.js, Express.js (v4), Mongoose (v8), JSON Web Tokens (JWT), bcryptjs, CORS, dotenv
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## ⚡ Quick Start

### 1. Launch with One Click (Windows)
Double-click `start-app.bat` to launch both backend and frontend servers together and open the browser.

### 2. Manual Launch
```bash
# Workspace root
npm start
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📁 Project Structure

- `backend/` - Express REST API server, Mongoose models, JWT auth middleware & controllers
- `frontend/` - React 19 frontend with client API service, routing & stateful auth context
- `BACKEND_DOCUMENTATION.md` - Complete backend architectural guide and API documentation
- `start-app.bat` - One-click full-stack launcher
- `setup-and-install.bat` - Dependency installer script
