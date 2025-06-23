import { MongoClient } from "mongodb";
import mongoose from "mongoose";
// import assert from 'assert'
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;
// Connect to your Atlas cluster
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  try {
    db = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database connection established successfully.");
    return db;
  } catch (err) {
    console.error("❌ Error establishing database connection:", err);

    throw err;
  }
}

export function getDb() {
  if (!db) throw new Error("First call  connect()");
  return db;
}

// Para cerrar la conexión manualmente (opcional)
export async function close() {
  await client.close();
}
