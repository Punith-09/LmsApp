import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User from "@/schema/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDatabase();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const instructorId = decoded.userId;

    const user = await User.findById(instructorId);
    if (!user || user.role !== "instructor") {
      return res.status(403).json({ message: "Unauthorized - Only instructors can create courses" });
    }

    const {title,description,category,thumbnail,introVideo,isPaid,price,sections,} = req.body;

    if (!title || !description || !category || !thumbnail || !introVideo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      thumbnail,
      introVideo,
      isPaid,
      price,
      sections,
      createdBy: instructorId,
      status: "pending", 
    });

    await newCourse.save();
    return res.status(201).json({ message: "Course submitted for approval", course: newCourse });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
