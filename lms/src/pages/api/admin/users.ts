import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongoose"; 
import User from "@/schema/user";  
import jwt from "jsonwebtoken";
import { SiHere } from "react-icons/si";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // if (decoded.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden: Admins only" });
    // }

    const users = await User.find({}, "-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}