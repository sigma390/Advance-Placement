import { z } from 'zod';

export const studentRegistrationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  usn: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  age: z
    .number()
    .min(16, 'Age must be at least 16')
    .max(60, 'Age cannot exceed 60'),
  grade: z.string().min(1, 'Grade is required'),
  resumeId: z.string().optional(),
});

export const recruiterRegSchema = z.object({
  email: z.string().email(),
  name: z.string().min(5, 'Min length must be at least 5 characters'),
});

export const placementRegSchema = z.object({
  email: z.string().email(),
  name: z.string().min(10, 'Min length must be at least 10 characters'),
});
