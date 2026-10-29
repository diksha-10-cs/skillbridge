import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import http from 'http'
import User from '../models/User.js'
import Internship from '../models/Internship.js'
import adminRoutes from '../routes/adminRoutes.js'
import internshipRoutes from '../routes/internshipRoutes.js'

const JWT_SECRET = process.env.JWT_SECRET || 'test_mock_secret_key_not_for_production'
process.env.JWT_SECRET = JWT_SECRET

// Create sample ObjectIds
const studentId = new mongoose.Types.ObjectId().toString()
const adminId = new mongoose.Types.ObjectId().toString()
const sampleInternshipId = new mongoose.Types.ObjectId().toString()

// Sign tokens
const studentToken = jwt.sign({ id: studentId, role: 'student' }, JWT_SECRET, { expiresIn: '1h' })
const adminToken = jwt.sign({ id: adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' })
const invalidToken = 'invalid.jwt.token'

// Setup isolated test Express server
const app = express()
app.use(express.json())
app.use('/api/admin', adminRoutes)
app.use('/api/internships', internshipRoutes)

let server
let baseUrl

// Helper to create thenable query mock that supports chaining sort, select, populate
function createMockQuery(data) {
  const p = Promise.resolve(data)
  p.sort = () => createMockQuery(data)
  p.select = () => createMockQuery(data)
  p.populate = () => createMockQuery(data)
  return p
}

// Mock User & Internship queries to test authorization safely without touching DB
const originalUserFindById = User.findById
const originalUserCountDocuments = User.countDocuments
const originalUserFind = User.find
const originalInternshipCountDocuments = Internship.countDocuments
const originalInternshipFind = Internship.find
const originalInternshipFindById = Internship.findById

function setupMocks() {
  User.findById = (id) => {
    let userData = null
    if (id && id.toString() === studentId) {
      userData = { _id: studentId, fullName: 'Test Student', role: 'student', email: 'student@test.com' }
    } else if (id && id.toString() === adminId) {
      userData = { _id: adminId, fullName: 'Test Admin', role: 'admin', email: 'admin@test.com' }
    }
    return createMockQuery(userData)
  }

  User.countDocuments = async () => 25
  User.find = () => createMockQuery([
    { _id: studentId, fullName: 'Test Student', email: 'student@test.com', role: 'student' },
  ])

  Internship.countDocuments = async () => 40
  Internship.find = () => createMockQuery([
    {
      _id: sampleInternshipId,
      company: 'Google',
      role: 'Frontend Intern',
      status: 'Applied',
      user: { fullName: 'Test Student', email: 'student@test.com', college: 'Tech University', course: 'CS' },
    },
  ])

  Internship.findById = async (id) => {
    if (id && id.toString() === sampleInternshipId) {
      return {
        _id: sampleInternshipId,
        company: 'Google',
        role: 'Frontend Intern',
        status: 'Applied',
        user: studentId,
        save: async function () { return this },
        populate: async function () { return this },
        deleteOne: async function () { return true },
      }
    }
    return null
  }
}

function restoreMocks() {
  User.findById = originalUserFindById
  User.countDocuments = originalUserCountDocuments
  User.find = originalUserFind
  Internship.countDocuments = originalInternshipCountDocuments
  Internship.find = originalInternshipFind
  Internship.findById = originalInternshipFindById
}

async function runTests() {
  setupMocks()

  server = http.createServer(app)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = server.address().port
  baseUrl = `http://127.0.0.1:${port}`

  console.log(`\n🧪 Running SkillBridge Admin API Authorization Tests on port ${port}...\n`)

  let passed = 0
  let failed = 0

  async function testCase(name, fn) {
    try {
      await fn()
      console.log(`  ✅ PASS: ${name}`)
      passed++
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} -> ${err.message}`)
      failed++
    }
  }

  // 1. Unauthenticated checks (401)
  await testCase('1.1 Unauthenticated request to /api/admin/stats returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`)
    const data = await res.json()
    if (res.status !== 401 || data.success !== false) {
      throw new Error(`Expected 401, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('1.2 Unauthenticated request to /api/admin/students returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/students`)
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  await testCase('1.3 Invalid token request to /api/admin/internships returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships`, {
      headers: { Authorization: `Bearer ${invalidToken}` },
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  // 2. Student Role Authorization Rejection (403 Forbidden)
  await testCase('2.1 Student user rejected from /api/admin/stats with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    const data = await res.json()
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('2.2 Student user rejected from /api/admin/students with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/students`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    const data = await res.json()
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('2.3 Student user rejected from /api/admin/internships with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    const data = await res.json()
    if (res.status !== 403 || data.success !== false) {
      throw new Error(`Expected 403, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('2.4 Student user rejected from /api/admin/internships/:id (PUT) with 403', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships/${sampleInternshipId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${studentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Selected' }),
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  await testCase('2.5 Student user rejected from /api/admin/internships/:id (DELETE) with 403', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships/${sampleInternshipId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  // 3. Admin Access Verification (200 OK)
  await testCase('3.1 Admin user granted access to /api/admin/stats with 200 OK', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const data = await res.json()
    if (res.status !== 200 || !data.success || data.data.totalStudents !== 25) {
      throw new Error(`Expected 200 & valid data, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('3.2 Admin user granted access to /api/admin/students with 200 OK and no password', async () => {
    const res = await fetch(`${baseUrl}/api/admin/students`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const data = await res.json()
    if (res.status !== 200 || !data.success || !Array.isArray(data.data)) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(data)}`)
    }
    if (data.data.some((s) => s.password)) {
      throw new Error('Security violation: Student record includes password!')
    }
  })

  await testCase('3.3 Admin user granted access to /api/admin/internships with 200 OK', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const data = await res.json()
    if (res.status !== 200 || !data.success || !Array.isArray(data.data)) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  // 4. Input Validation & Error Handling
  await testCase('4.1 Admin PUT with invalid ObjectId returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships/invalid-id-xyz`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Selected' }),
    })
    const data = await res.json()
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('4.2 Admin PUT with invalid status returns 400 Bad Request', async () => {
    const res = await fetch(`${baseUrl}/api/admin/internships/${sampleInternshipId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'NonExistentStatus' }),
    })
    const data = await res.json()
    if (res.status !== 400 || data.success !== false) {
      throw new Error(`Expected 400, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  await testCase('4.3 Admin DELETE with non-existent ObjectId returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString()
    const res = await fetch(`${baseUrl}/api/admin/internships/${nonExistentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    const data = await res.json()
    if (res.status !== 404 || data.success !== false) {
      throw new Error(`Expected 404, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  // 5. Existing Student Endpoints Integrity
  await testCase('5.1 Student access to /api/internships is preserved and allowed', async () => {
    const res = await fetch(`${baseUrl}/api/internships`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    })
    const data = await res.json()
    if (res.status !== 200 || !data.success) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(data)}`)
    }
  })

  // Close server and restore mocks
  await new Promise((resolve) => server.close(resolve))
  restoreMocks()

  console.log(`\n📊 Test Summary: ${passed} Passed, ${failed} Failed out of ${passed + failed} Tests.\n`)
  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err)
  process.exit(1)
})
