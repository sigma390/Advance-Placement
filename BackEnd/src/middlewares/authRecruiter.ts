import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateRecruiter = (
  req: any,
  res: any,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.recruiterId = (decoded as any).id; // Attach recruiter ID to the request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
