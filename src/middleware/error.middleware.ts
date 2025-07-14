import { NextFunction, Request, Response } from 'express';
import logger from '@utils/logger';
import { errorResponse } from '@utils/responses';

export interface AppError extends Error {
  status?: number;
}

const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = error.status ?? 500;

  logger.error(
    `[${req.method} ${req.url}]`,
    statusCode,
    error.message,
    statusCode === 500 ? `\n${error.stack}` : '',
  );

  errorResponse(res, error);
};

export default errorHandler;
