import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import User from "@/schema/user";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const instructorId = decoded.userId;

    const user = await User.findById(instructorId);
    if (!user || user.role !== "instructor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
      const courses = await Course.find({ createdBy: instructorId }).sort({ createdAt: -1 });
      return res.status(200).json({ courses });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      const course = await Course.findOne({ _id: id, createdBy: instructorId });
      if (!course) return res.status(404).json({ message: "Course not found" });
      await Course.deleteOne({ _id: id });
      return res.status(200).json({ message: "Course deleted" });
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
