const mongoose = require('mongoose');

/**
 * connectDB — Establishes connection to MongoDB using Mongoose.
 * Reads the connection URI from the MONGO_URI environment variable.
 * Exits the process with code 1 if connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
