import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    message,
  });

}