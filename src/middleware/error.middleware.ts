import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: any,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error(error);
  response
    .status(error.status || 500)
    .json({ message: error.message || 'Internal Server Error' });
}
