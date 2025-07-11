// /lib/mongodb.js
import { MongoClient } from "mongodb";

let client;
let db;

export async function connectToDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  client = new MongoClient(uri);
  await client.connect();
  db = client.db("AI-TOOL");  // Auto-select DB from URI
  return db;
}
