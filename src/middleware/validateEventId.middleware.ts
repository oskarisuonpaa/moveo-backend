import { NextFunction, Request, Response } from 'express';
import { AppError } from './error.middleware';

export const requireEventId = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const { eventId } = request.params;

  if (!eventId || typeof eventId !== 'string') {
    const error = new Error('Invalid event ID') as AppError;
    error.status = 400;
    return next(error);
  }

  next();
};
