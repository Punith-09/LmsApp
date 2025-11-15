import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongoose';
import User from "@/schema/user";
import { registerSchema } from '../../forms/resolvers/userSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    const firstIssue = parse.error.issues[0];
    return res.status(400).json({ error: firstIssue.message });
  }

  const { name, email, password, role } = parse.data;

  try {
    await connectToDatabase();

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

  
    const authHeader = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET || 'dev-secret';

    if (role !== 'user') {
      
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized — missing token' });
      }

      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        if (decoded.role !== 'admin') {
          return res.status(403).json({ error: 'Only admins can create non-user roles' });
        }
      } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    }

   
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

   
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
