import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
// FOR DEBUGGING ONLY:
// const MONGODB_URI = "mongodb+srv://Chrishna_db_user:5Fig0vINl1638vsE@the-goal-time-capsule.cwpwavq.mongodb.net/?retryWrites=true&w=majority&appName=the-goal-time-capsule";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // The change is on this line: MONGODB_URI!
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;