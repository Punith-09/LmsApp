import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    
    const courses = await Course.find({ status: "approved" }).sort({ createdAt: -1 });


    res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
