import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

declare global {
  var _mongoClientPromise: Promise<typeof mongoose> | undefined;
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any)._mongooseCache || { conn: null, promise: null };

if (!cached) (global as any)._mongooseCache = cached;

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
