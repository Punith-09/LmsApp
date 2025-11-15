import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import Progress from "@/schema/progress";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: "Missing user ID" });
      }

      const progress = await Progress.find({ user: userId });
      return res.status(200).json({ progress });
    } catch (error: any) {
      console.error("Error fetching progress:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
