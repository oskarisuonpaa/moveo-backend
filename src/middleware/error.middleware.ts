import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  status?: number;
}

/**
 * Middleware function to handle errors in the application.
 *
 * @param {AppError} error - The error object containing details about the error.
 * @param {Request} request - The Express request object.
 * @param {Response} response - The Express response object.
 *
 * Logs the error details using the `logger` and sends an appropriate JSON response
 * with the error status and message. If the error status is 500, the stack trace
 * is also logged.
 */
export default function errorHandler(
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
