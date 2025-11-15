import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongoose";
import Order from "@/schema/order";
import Course from "@/schema/course";
import Progress from "@/schema/progress";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId as string);

    const orders = await Order.find({
      user: userObjectId,
      status: { $in: ["pending", "paid"] },
    })
      .populate({
        path: "courses",
        model: Course,
        select: "title description thumbnail price category isPaid sections",
      })
      .sort({ createdAt: -1 });

    const purchasedCourses = orders.flatMap((order) => order.courses);

   
    const progressDocs = await Progress.find({ user: userObjectId });

 
    const coursesWithProgress = purchasedCourses.map((course) => {
      const totalLessons = course.sections?.reduce(
        (count: number, section: any) => count + (section.lessons?.length || 0),
        0
      );

      const progressDoc = progressDocs.find(
        (p) => p.course.toString() === course._id.toString()
      );

      const completed = progressDoc?.completedLessons?.length || 0;
      const progressPercent =
        totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

      return {
        ...course.toObject(),
        progress: progressPercent,
      };
    });

    return res.status(200).json({ courses: coursesWithProgress });
  } catch (error: any) {
    console.error("Error fetching purchased courses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
