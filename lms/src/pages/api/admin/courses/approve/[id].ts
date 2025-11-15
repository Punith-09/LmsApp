import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Only admin can approve courses" });
    }

    const { id } = req.query;
    const { status } = req.body; 

    const course = await Course.findByIdAndUpdate(id, { status }, { new: true });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: `Course ${status}`, course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
