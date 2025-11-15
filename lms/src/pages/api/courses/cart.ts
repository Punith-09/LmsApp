import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(200).json({ courses: [] });
    }

    const courses = await Course.find({ _id: { $in: courseIds } })
      .populate("createdBy", "name") 
      .select("title thumbnail price description createdBy");

    return res.status(200).json({ courses });
  } catch (err: any) {
    console.error("Error fetching cart courses:", err);
    return res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
}
