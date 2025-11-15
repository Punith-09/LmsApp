import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDatabase();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const creatorId = decoded.userId;

    const {title,description,category,thumbnail,introVideo,isPaid,price,sections,} = req.body;

    if (!title || !description || !category || !thumbnail || !introVideo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const status = decoded.role === "admin" ? "approved" : "pending";

    const newCourse = new Course({
      title,
      description,
      category,
      thumbnail,
      introVideo,
      isPaid,
      price,
      sections,
      createdBy: creatorId,
      status, 
    });

    await newCourse.save();

    return res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
