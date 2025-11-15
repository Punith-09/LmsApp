import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose";
import User from "@/schema/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;
  const method = req.method;
  const jwtSecret = process.env.JWT_SECRET || "dev-secret";

  try {
    
    if (method !== "GET") {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded: any = jwt.verify(token, jwtSecret);
      if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }
    }

   
    if (method === "GET") {
      const user = await User.findById(id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    if (method === "PUT") {
      const { name, email, role, password } = req.body;
      const updateData: any = { name, email, role };

      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    }


    if (method === "DELETE") {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: "User deleted successfully" });
    }

   
    return res.status(405).json({ message: "Method not allowed" });

  } catch (err: any) {
    console.error("User API Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
