import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Skillbridge'
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    })
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`)
    return true
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Warning: ${error.message}`)
    console.warn(`ℹ️ Ensure MongoDB service is running locally on port 27017 or check MONGO_URI in .env`)
    return false
  }
}
