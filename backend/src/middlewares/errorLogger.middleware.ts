// filepath: backend/src/middlewares/errorLogger.middleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
  next(err);
};