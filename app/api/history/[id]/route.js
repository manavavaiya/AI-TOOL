// /app/api/history/[id]/route.js
import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  const paramsNew = await params;  
  const db = await connectToDB();
  await db.collection("history").deleteOne({ _id: new ObjectId(paramsNew.id) });

  return Response.json({ success: true });
}   
