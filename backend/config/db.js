import mongoose from 'mongoose'

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/utangph'

  try {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    // do not crash immediately in some environments; exit to make failure explicit
    process.exit(1)
  }
}

export default connectDB
