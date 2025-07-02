import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  error: AppError,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  logger.error(
    `[${request.method} ${request.url}] Error occurred:`,
    error.status || 500,
    error.message || 'Internal Server Error',
    error.status === 500 ? `\n${error.stack}` : '',
  );
  response
    .status(error.status || 500)
    .json({ message: error.message || 'Internal Server Error' });
}
