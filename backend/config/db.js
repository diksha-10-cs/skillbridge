import mongoose from 'mongoose'

let cachedPromise = null

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return true
  }

  if (cachedPromise) {
    return await cachedPromise
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Skillbridge'

  cachedPromise = (async () => {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      })
      console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
      return true
    } catch (error) {
      cachedPromise = null
      console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`)
      console.warn(`ℹ️ Ensure MongoDB service is running locally on port 27017 or check MONGODB_URI in .env`)
      return false
    }
  })()

  return await cachedPromise
}

export const disconnectDB = async () => {
  if (cachedPromise) {
    try {
      await cachedPromise
    } catch (_) {}
  }
  await mongoose.disconnect()
  cachedPromise = null
}
