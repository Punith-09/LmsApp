import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your password'),
  role: z.enum(['user', 'admin', 'instructor', 'subadmin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});


export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
