import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Progress from "@/schema/progress";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, courseId, lessonId, lastTimestamp, markComplete } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const update: any = {
      $set: {
        lastWatchedLesson: lessonId || null,
        lastTimestamp: lastTimestamp ?? 0,
      },
    };

    if (markComplete && lessonId) {
      update.$addToSet = { completedLessons: lessonId };
    }

    const progress = await Progress.findOneAndUpdate(
      { user: userId, course: courseId },
      update,
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Progress updated", progress });
  } catch (error: any) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
