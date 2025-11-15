import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose"; 
import User from "@/schema/user";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}