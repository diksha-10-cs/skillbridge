import mongoose from 'mongoose'

// Maintain a cached connection across serverless function invocations
let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

// Helper to mask MongoDB URI credentials in logs
export const maskMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return ''
  return uri.replace(/\/\/[^:]+:[^@]+@/g, '//***:***@')
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection
    return cached.conn
  }

  if (cached.promise) {
    return await cached.promise
  }

  const uri = process.env.MONGO_URI || process.env.MONGODB_URI

  if (!uri || !uri.trim()) {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      const err = new Error(
        'MongoDB connection string is missing. Please set MONGO_URI or MONGODB_URI in Vercel Environment Variables.'
      )
      console.error(`❌ ${err.message}`)
      throw err
    }
  }

  const effectiveUri = uri && uri.trim() ? uri.trim() : 'mongodb://127.0.0.1:27017/Skillbridge'

  const opts = {
    bufferCommands: false, // Prevents 10-second buffering hangs in serverless
    serverSelectionTimeoutMS: 5000,
  }

  cached.promise = mongoose
    .connect(effectiveUri, opts)
    .then((m) => {
      console.log(` MongoDB Connected: ${m.connection.host}/${m.connection.name}`)
      cached.conn = m.connection
      return cached.conn
    })
    .catch((err) => {
      cached.promise = null
      cached.conn = null
      const safeMsg = err.message ? err.message.replace(/\/\/[^:]+:[^@]+@/g, '//***:***@') : 'Unknown error'
      console.error(`❌ MongoDB Connection Error: ${safeMsg}`)
      throw err
    })

  return await cached.promise
}

export const disconnectDB = async () => {
  if (cached.promise) {
    try {
      await cached.promise
    } catch (_) {}
  }
  await mongoose.disconnect()
  cached.conn = null
  cached.promise = null
}
