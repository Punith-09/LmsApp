import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import User from "@/schema/user";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

  
    const course = await Course.findById(id).populate('createdBy', 'name');
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let isPurchased = false;

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.userId);

        isPurchased = user?.purchasedCourses?.includes(id as string) || false;
      } catch (err) {
        console.warn("Invalid token or verification failed");
    
      }
    }

    res.status(200).json({ course, isPurchased });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

