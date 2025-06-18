import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers?.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    // @ts-ignore
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};