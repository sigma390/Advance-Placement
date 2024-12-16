import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateStudent = (req: any, res: any, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.body.studentId = (decoded as any).id; // Attach student ID to the request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
