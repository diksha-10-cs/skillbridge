import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load backend/.env safely
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })

async function provisionAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ''
  const fullName = (process.env.ADMIN_NAME || 'SkillBridge Administrator').trim()

  console.log('====================================================')
  console.log('      SKILLBRIDGE - ADMIN ACCOUNT PROVISIONING      ')
  console.log('====================================================')

  // Validation: credentials must be passed via environment variables
  if (!email || !password) {
    console.error('❌ Error: Both ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.')
    console.error('ℹ️  Security Notice: Credentials must not be hardcoded in files or committed.')
    console.error('')
    console.error('PowerShell usage example:')
    console.error('  $env:ADMIN_EMAIL="admin@skillbridge.edu"')
    console.error('  $env:ADMIN_PASSWORD="YourSecurePasswordHere"')
    console.error('  npm run provision:admin')
    console.error('')
    process.exit(1)
  }

  if (password.length < 6) {
    console.error('❌ Error: ADMIN_PASSWORD must be at least 6 characters long.')
    process.exit(1)
  }

  try {
    console.log('Connecting to MongoDB...')
    const connected = await connectDB()
    if (!connected) {
      console.error('❌ Error: Could not connect to MongoDB database.')
      process.exit(1)
    }

    // Safety check: Handle existing accounts safely
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`ℹ️  Found existing administrator account for "${email}".`)
        console.log('🔄 Safely updating administrator password...')

        // Update password; User model pre('save') hook will hash it with bcryptjs
        existingUser.password = password
        if (process.env.ADMIN_NAME && process.env.ADMIN_NAME.trim()) {
          existingUser.fullName = fullName
        }
        await existingUser.save()

        console.log('✅ Admin password updated successfully!')
        console.log(`👤 Name:  ${existingUser.fullName}`)
        console.log(`📧 Email: ${existingUser.email}`)
        console.log(`🛡️  Role:  ${existingUser.role}`)
        console.log('ℹ️  You can now use this email and the new password to log in to SkillBridge.')

        await mongoose.disconnect()
        process.exit(0)
      }

      // Security Guard: Never change a student's role or password, never elevate student to admin
      console.warn(`⚠️ Notice: An account with email "${email}" exists but is NOT an administrator (role: "${existingUser.role}").`)
      console.warn('🛑 Refusing to modify student account or elevate student to admin.')
      console.log('ℹ️  No changes were made to the database.')
      await mongoose.disconnect()
      process.exit(0)
    }

    // Create the admin account using project password hashing
    const adminUser = await User.create({
      fullName,
      email,
      password, // Automatically hashed by User model pre('save') hook via bcryptjs
      role: 'admin',
      course: 'System Administration',
      college: 'SkillBridge Management',
      skills: 'Platform Management, Student Supervision, Security',
      projects: 'SkillBridge Administration Portal',
    })

    console.log('✅ Admin account provisioned successfully!')
    console.log(`👤 Name:  ${adminUser.fullName}`)
    console.log(`📧 Email: ${adminUser.email}`)
    console.log(`🛡️  Role:  ${adminUser.role}`)
    console.log('ℹ️  You can now use this email and password to log in to SkillBridge.')

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ Provisioning failed:', err.message)
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }
    process.exit(1)
  }
}

provisionAdmin()
