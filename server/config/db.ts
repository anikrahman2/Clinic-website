import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isMongoConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;
  if (mongoUri && mongoUri.startsWith('mongodb')) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB via Mongoose');
      return true;
    } catch (err: any) {
      console.warn('⚠️ MongoDB connection could not be established:', err.message);
      console.log('🔄 Utilizing file-backed persistent data store for Jharna Clinic');
    }
  } else {
    console.log('ℹ️ No MONGO_URI provided. Utilizing file-backed persistent data store for Jharna Clinic');
  }
  return false;
}

export function getIsMongoConnected() {
  return isMongoConnected;
}

export { STORE_PATH };
