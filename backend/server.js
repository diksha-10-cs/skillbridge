import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import internshipRoutes from './routes/internshipRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env'), override: true })

if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
  console.error('FATAL: JWT_SECRET environment variable is missing or empty. Server startup aborted.')
  process.exit(1)
}

const activeMongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
console.log("MONGO_URI loaded:", Boolean(activeMongoUri?.startsWith("mongodb+srv://")))
const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'SkillBridge API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/admin', adminRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  })
})

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SkillBridge API Server running on port ${PORT} (http://localhost:${PORT})`)
})

export default app
