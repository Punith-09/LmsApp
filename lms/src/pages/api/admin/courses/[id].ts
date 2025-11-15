import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Course from "@/schema/course";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    jwt.verify(token, process.env.JWT_SECRET!);

    const { id } = req.query;

    if (req.method === "GET") {
      const course = await Course.findById(id);
      if (!course) return res.status(404).json({ message: "Not found" });
      return res.status(200).json({ course });
    }

    if (req.method === "PUT") {
      const updated = await Course.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json({ message: "Updated", course: updated });
    }

    if (req.method === "DELETE") {
      await Course.findByIdAndDelete(id);
      return res.status(200).json({ message: "Deleted" });
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
