import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import User from "@/schema/user";
import Course from "@/schema/course";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const instructorId = req.query.user as string;
    let courses;

    if (instructorId) {
      courses = await Course.find({ createdBy: instructorId }).select("title enrolledUsers");
    } else {
      courses = await Course.find().select("title enrolledUsers");
    }
    const userMap: Record<string, { title: string; enrolledAt: Date }[]> = {};

    courses.forEach((course: any) => {
      course.enrolledUsers?.forEach((e: any) => {
       
        const userId = e.user ? e.user.toString() : e._id?.toString();
        if (!userId) return; 

        if (!userMap[userId]) userMap[userId] = [];
        userMap[userId].push({
          title: course.title,
          enrolledAt: e.enrolledAt,
        });
      });
    });

    const userIds = Object.keys(userMap);
    if (userIds.length === 0) return res.status(200).json([]);

    const users = await User.find({ _id: { $in: userIds } }).select("name email role createdAt");

    const formatted = users.map((user: any) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      registeredOn: user.createdAt,
      courses: userMap[user._id.toString()] || [],
    }));

    return res.status(200).json(formatted);
  } catch (err: any) {
    console.error("Instructor users error:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.message });
  }
}
