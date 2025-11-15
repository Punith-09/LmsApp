import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    let courses;
    if (decoded.role === "admin") {
      courses = await Course.find().sort({ createdAt: -1 });
    } else {
      
      courses = await Course.find({ createdBy: decoded.userId }).sort({ createdAt: -1 });
    }

    res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
