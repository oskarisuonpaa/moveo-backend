import { Response } from 'express';
import { AppError } from '../middleware/error.middleware';

export const successResponse = <T>(
  response: Response,
  data: T,
  statusCode: number = 200,
) => {
  response.status(statusCode).json({
    data,
  });
};

export const errorResponse = (response: Response, error: AppError) => {
  const statusCode = error.status ?? 500;
  response.status(statusCode).json({
    message: error.message || 'Internal Server Error',
  });
};
