import { Response } from 'express';
import AppError from './errors';

export function successResponse<T>(
  res: Response,
  data?: T,
  statusCode = 200,
): Response {
  if (data == null) {
    return res.sendStatus(statusCode === 200 ? 204 : statusCode);
  }
  return res.status(statusCode).json({ data });
}

export function errorResponse(res: Response, err: AppError | Error): Response {
  const status = err instanceof AppError ? err.status : 500;
  const payload: {
    message: string;
    code?: string;
    details?: unknown;
    stack?: string;
  } = {
    message: err.message || 'Internal Server Error',
  };

  if (err instanceof AppError && err.code) {
    payload.code = err.code;
    if (err.details !== undefined) payload.details = err.details;
  }
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  return res.status(status).json({ error: payload });
}
