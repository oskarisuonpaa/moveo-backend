import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
  error: any,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  logger.error('Error occurred:', error);
  response
    .status(error.status || 500)
    .json({ message: error.message || 'Internal Server Error' });
}
