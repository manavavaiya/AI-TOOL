// /app/api/history/route.js
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  const db = await connectToDB();
  const history = await db.collection("history").find().sort({ _id: -1 }).toArray();
  return Response.json(history);
}

export async function POST(request) {
    const newrequest = request;
  const { question, answer } = await newrequest.json();
  const db = await connectToDB();
  const res = await db.collection("history").insertOne({ question, answer });
  return Response.json({ success: true, insertedId: res.insertedId });
}
