import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import Order from "@/schema/order";
import User from "@/schema/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId, courseIds } = req.body;

    if (!userId || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const courses = await Course.find({ _id: { $in: courseIds } }).select(
      "title price thumbnail createdBy enrolledUsers"
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: "No valid courses found" });
    }

    const totalAmount = courses.reduce((sum, c) => sum + (c.price || 0), 0);

    for (const course of courses) {
      
      if (!Array.isArray(course.enrolledUsers)) {
        course.enrolledUsers = [];
      }

      
      const alreadyEnrolled = course.enrolledUsers.some((e: any) => {
        const enrolledUserId =
          typeof e === "object" && e.user ? e.user.toString() : e.toString();
        return enrolledUserId === userId.toString();
      });

      if (!alreadyEnrolled) {
        course.enrolledUsers.push({
          user: user._id,
          enrolledAt: new Date(),
        });
        await course.save();
      }
    }

   
    const order = await Order.create({
      user: userId,
      courses: courses.map((c) => c._id),
      totalAmount,
      status: "paid",
    });

   
    user.purchasedCourses = [
      ...(user.purchasedCourses || []),
      ...courses.map((c) => c._id.toString()),
    ];
    await user.save();

    return res.status(201).json({
      message: "Order completed successfully",
      orderId: order._id,
      totalAmount,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return res
      .status(500)
      .json({ message: "Checkout failed", error: error.message });
  }
}
